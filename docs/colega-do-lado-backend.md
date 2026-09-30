# Colega do Lado — Backend Setup Guide

This document covers everything needed to run the chat backend on a Raspberry Pi behind a Cloudflare Tunnel.

---

## 1. Architecture

```
Browser widget (extra.js)
    │  POST /chat (JSON → SSE stream)
    ▼
Cloudflare Tunnel (chat.hacktoimprove.com)
    │
    ▼
Raspberry Pi — FastAPI (uvicorn, port 8090)
    │
    ▼
Claude API (Anthropic)
```

---

## 2. API Specification

### `POST /chat`

Accepts a student message, returns a streaming SSE response.

**Request body:**

```json
{
  "name": "Ana",
  "gender": "f",
  "message": "O que é prototipagem rápida?",
  "course_context": "pd",
  "page_slug": "Sumarios/aula3",
  "conversation_id": ""
}
```

| Field             | Type   | Required | Description                                              |
|-------------------|--------|----------|----------------------------------------------------------|
| `name`            | string | yes      | Student's first name                                     |
| `gender`          | string | yes      | `"m"`, `"f"`, or `"neutral"` (for gendered Portuguese)   |
| `message`         | string | yes      | The student's question (max 1000 chars)                  |
| `course_context`  | string | yes      | Course key: `dpi`, `di`, `dpiv`, `pd`, `recursos`, `geral` |
| `page_slug`       | string | no       | Current page path, e.g. `"Sumarios/aula3"`               |
| `conversation_id` | string | no       | Empty on first message; returned by server on subsequent |

**Response:**

- Content-Type: `text/event-stream`
- Header: `X-Conversation-Id: <uuid>`
- Body: SSE-formatted chunks

```
data: Prototipagem rápida é
data:  um processo iterativo
data:  de construção de modelos
data: [DONE]
```

Each `data:` line contains a text fragment. `data: [DONE]` signals end of stream.

**Error responses:**

| Status | Meaning                    |
|--------|----------------------------|
| 400    | Invalid/missing fields     |
| 429    | Rate limited               |
| 500    | Internal / Claude API error|

### `GET /health`

Returns `{"status": "ok"}` — used by monitoring.

---

## 3. Agent System Prompt

This is the full system prompt for the Claude API call. The backend injects `{name}`, `{gender}`, `{course}`, and `{page}` before sending.

```text
Tu és o "Colega do Lado" — um colega de turma informal e simpático que ajuda estudantes de design a perceber as matérias das aulas no site H2I (hacktoimprove.com).

## Identidade
- Falas português de Portugal (PT-PT), nunca brasileiro.
- Tratas o/a estudante por tu, de forma descontraída mas respeitosa.
- O/A estudante chama-se {name} (género: {gender}).
- Usa linguagem simples e direta — como um colega explicaria no intervalo.
- Podes usar emojis com moderação (1-2 por resposta, no máximo).

## Contexto atual
- Cadeira: {course}
- Página: {page}

## Regra de ouro
Só podes responder com base no conteúdo que está nos materiais das aulas (knowledge base). NUNCA inventes informação, datas, ou conteúdo que não esteja explicitamente nos materiais. Se não sabes ou não tens informação suficiente, diz honestamente:
"Hmm, isso não encontro nos materiais. Pergunta ao professor para ter a certeza!"

## Regras de resposta
1. Respostas curtas — máximo ~200 palavras. Se o tema for extenso, resume e indica onde encontrar mais ("Vê a aula 3 para os detalhes").
2. Aponta sempre para os recursos: "Isso está explicado na aula X" ou "Vê o enunciado do projeto".
3. Quando relevante, sugere perguntar ao professor: "Para esta dúvida específica, fala com o professor."
4. Se a pergunta não é sobre as matérias do curso, redireciona educadamente: "Eu só consigo ajudar com as matérias das aulas, mas boa pergunta!"

## Restrições absolutas
- NUNCA resolvas exercícios ou trabalhos — podes explicar conceitos, mas não dar a resposta.
- NUNCA inventes prazos, datas de entrega, ou percentagens de avaliação que não estejam nos materiais.
- NUNCA mudes de língua — responde sempre em PT-PT.
- NUNCA te apresentes como IA, assistente, ou chatbot. És simplesmente "o colega do lado".
- NUNCA uses linguagem técnica desnecessária — simplifica sempre.

## Género na linguagem
Adapta a concordância de género conforme {gender}:
- "m" → masculino ("Estás preparado", "Bem-vindo")
- "f" → feminino ("Estás preparada", "Bem-vinda")
- "neutral" → formas neutras ou infinitivo ("Tudo pronto?", "Boas!")

## Cadeiras disponíveis
Ativas (ano corrente):
- DPI — Design de Interação (DesignDeInteracao)
- DI — Design de Informação (DesignDeInformacao)

Arquivo (anos anteriores):
- DPIV — Design de Produto IV (DesignDeProdutoIV)
- PD — Prototipagem Digital (PrototipagemDigital)

Transversal:
- Recursos — materiais e ferramentas partilhadas
```

---

## 4. Content Export Script (`export_content.py`)

Place this at the project root. Run with `python export_content.py` to generate `knowledge_base.json`.

```python
#!/usr/bin/env python3
"""
Export all docs/ markdown content into a single JSON knowledge base
for the Colega do Lado chatbot.

Usage:
    python export_content.py
    python export_content.py --output /path/to/output.json

Output format:
{
  "exported_at": "2026-09-30T12:00:00",
  "courses": {
    "dpi": {
      "name": "Design de Interação",
      "slug": "DesignDeInteracao",
      "is_active": true,
      "pages": [
        {"slug": "Sumarios/aula1", "title": "Aula 1", "content": "..."}
      ]
    }
  }
}
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

DOCS_DIR = Path(__file__).parent / "docs"
OUTPUT = Path(__file__).parent / "knowledge_base.json"

# Course definitions
COURSES = {
    "dpi":      {"name": "Design de Interação",  "slug": "DesignDeInteracao",    "is_active": True},
    "di":       {"name": "Design de Informação",  "slug": "DesignDeInformacao",   "is_active": True},
    "dpiv":     {"name": "Design de Produto IV",  "slug": "DesignDeProdutoIV",    "is_active": False},
    "pd":       {"name": "Prototipagem Digital",  "slug": "PrototipagemDigital",  "is_active": False},
    "recursos": {"name": "Recursos",              "slug": "Recursos",             "is_active": True},
}

# Directories to skip
SKIP_DIRS = {".obsidian", "Templates", "UnidadeCurricular", "attachments",
             "images", "javascripts", "stylesheets", "resources", "P5JS"}

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def strip_frontmatter(text: str) -> str:
    """Remove YAML frontmatter from markdown."""
    return FRONTMATTER_RE.sub("", text)


def extract_title(text: str) -> str:
    """Extract title from frontmatter or first heading."""
    fm = FRONTMATTER_RE.match(text)
    if fm:
        for line in fm.group(1).splitlines():
            if line.strip().startswith("title:"):
                title = line.split(":", 1)[1].strip().strip("\"'")
                if title:
                    return title
    # Fallback: first # heading
    for line in text.splitlines():
        if line.startswith("# "):
            return line.lstrip("# ").strip()
    return ""


def collect_pages(course_dir: Path) -> list[dict]:
    """Collect all .md files under a course directory."""
    pages = []
    for md_file in sorted(course_dir.rglob("*.md")):
        # Skip attachment/media directories
        rel = md_file.relative_to(course_dir)
        if any(part in SKIP_DIRS for part in rel.parts):
            continue

        text = md_file.read_text(encoding="utf-8", errors="replace")
        title = extract_title(text)
        content = strip_frontmatter(text).strip()

        if not content:
            continue

        slug = str(rel.with_suffix(""))
        if slug == "index":
            slug = ""

        pages.append({
            "slug": slug,
            "title": title or md_file.stem,
            "content": content,
        })
    return pages


def main():
    output_path = Path(sys.argv[1]) if len(sys.argv) > 1 and sys.argv[1] != "--output" else OUTPUT
    if "--output" in sys.argv:
        idx = sys.argv.index("--output")
        if idx + 1 < len(sys.argv):
            output_path = Path(sys.argv[idx + 1])

    result = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "courses": {},
    }

    for key, info in COURSES.items():
        course_dir = DOCS_DIR / info["slug"]
        if not course_dir.is_dir():
            print(f"  ⚠ Skipping {key}: {course_dir} not found")
            continue

        pages = collect_pages(course_dir)
        result["courses"][key] = {
            "name": info["name"],
            "slug": info["slug"],
            "is_active": info["is_active"],
            "pages": pages,
        }
        print(f"  ✓ {key}: {len(pages)} pages")

    output_path.write_text(
        json.dumps(result, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nExported to {output_path} ({output_path.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
```

---

## 5. FastAPI Server Skeleton

File: `server.py` (on the Raspberry Pi)

```python
#!/usr/bin/env python3
"""
Colega do Lado — FastAPI backend.

Run:
    pip install fastapi uvicorn anthropic
    uvicorn server:app --host 0.0.0.0 --port 8090
"""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

import anthropic
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# ---- Config ----
ANTHROPIC_MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 512
LOG_FILE = Path("chat_log.jsonl")

# Load knowledge base
KB_PATH = Path("knowledge_base.json")
KNOWLEDGE_BASE = json.loads(KB_PATH.read_text()) if KB_PATH.exists() else {}

# Load system prompt template
SYSTEM_PROMPT_TEMPLATE = Path("system_prompt.txt").read_text()

# ---- App ----
app = FastAPI(title="Colega do Lado", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://hacktoimprove.com", "https://www.hacktoimprove.com"],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type"],
    expose_headers=["X-Conversation-Id"],
)

client = anthropic.Anthropic()  # uses ANTHROPIC_API_KEY env var

# ---- In-memory conversation store (simple; replace with Redis if needed) ----
conversations: dict[str, list[dict]] = {}


class ChatRequest(BaseModel):
    name: str = Field(..., max_length=100)
    gender: str = Field(..., pattern="^(m|f|neutral)$")
    message: str = Field(..., max_length=1000)
    course_context: str = Field(..., pattern="^(dpi|di|dpiv|pd|recursos|geral)$")
    page_slug: str = ""
    conversation_id: str = ""


def build_system_prompt(req: ChatRequest) -> str:
    """Fill template variables in the system prompt."""
    course_info = KNOWLEDGE_BASE.get("courses", {}).get(req.course_context, {})
    course_name = course_info.get("name", req.course_context)

    # Find relevant page content
    page_content = ""
    if req.page_slug and "pages" in course_info:
        for page in course_info["pages"]:
            if page["slug"] == req.page_slug:
                page_content = page["content"][:4000]
                break

    prompt = SYSTEM_PROMPT_TEMPLATE.replace("{name}", req.name)
    prompt = prompt.replace("{gender}", req.gender)
    prompt = prompt.replace("{course}", course_name)
    prompt = prompt.replace("{page}", req.page_slug or "(nenhuma)")

    if page_content:
        prompt += "\n\n## Conteúdo da página atual\n" + page_content

    return prompt


def log_message(conv_id: str, course: str, page: str, role: str, text: str):
    """Append anonymous log entry (no name, no IP)."""
    entry = {
        "ts": datetime.now(timezone.utc).isoformat(),
        "conv_id": conv_id,
        "course": course,
        "page": page,
        "role": role,
        "text": text,
    }
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


@app.post("/chat")
async def chat(req: ChatRequest):
    conv_id = req.conversation_id or str(uuid.uuid4())

    # Build or retrieve conversation history
    if conv_id not in conversations:
        conversations[conv_id] = []
    history = conversations[conv_id]

    # Add user message
    history.append({"role": "user", "content": req.message})
    log_message(conv_id, req.course_context, req.page_slug, "user", req.message)

    # Keep history manageable (last 20 turns)
    if len(history) > 40:
        history = history[-40:]
        conversations[conv_id] = history

    system_prompt = build_system_prompt(req)

    async def generate():
        full_text = ""
        try:
            with client.messages.stream(
                model=ANTHROPIC_MODEL,
                max_tokens=MAX_TOKENS,
                system=system_prompt,
                messages=history,
            ) as stream:
                for text in stream.text_stream:
                    full_text += text
                    yield f"data: {text}\n\n"
        except Exception as e:
            yield f"data: [Erro interno — tenta outra vez.]\n\n"
            print(f"[ERROR] {e}")

        yield "data: [DONE]\n\n"

        # Store assistant reply
        history.append({"role": "assistant", "content": full_text})
        log_message(conv_id, req.course_context, req.page_slug, "bot", full_text)

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"X-Conversation-Id": conv_id},
    )


@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## 6. Anonymous Logging

Log format: JSONL (one JSON object per line) in `chat_log.jsonl`.

```json
{"ts":"2026-09-30T14:32:01+00:00","conv_id":"abc-123","course":"dpi","page":"Sumarios/aula2","role":"user","text":"O que é design centrado no utilizador?"}
{"ts":"2026-09-30T14:32:03+00:00","conv_id":"abc-123","course":"dpi","page":"Sumarios/aula2","role":"bot","text":"Design centrado no utilizador é..."}
```

**Privacy guarantees:**
- No student name logged
- No IP address
- No cookies or tracking
- `conv_id` is a random UUID per session (not linkable to identity)

---

## 7. Cloudflare Tunnel Setup

### Install cloudflared on Raspberry Pi

```bash
# ARM64 (Pi 4/5)
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# Authenticate
cloudflared tunnel login
```

### Create tunnel

```bash
# Create named tunnel
cloudflared tunnel create h2i-chat

# Configure DNS route
cloudflared tunnel route dns h2i-chat chat.hacktoimprove.com
```

### Tunnel config

Create `~/.cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /home/pi/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: chat.hacktoimprove.com
    service: http://localhost:8090
  - service: http_status:404
```

### Test

```bash
cloudflared tunnel run h2i-chat
```

### Systemd service (auto-start on boot)

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
```

### FastAPI systemd service

Create `/etc/systemd/system/h2i-chat.service`:

```ini
[Unit]
Description=H2I Colega do Lado Chat Backend
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/h2i-chat
Environment=ANTHROPIC_API_KEY=sk-ant-...
ExecStart=/home/pi/h2i-chat/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8090
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable h2i-chat
sudo systemctl start h2i-chat
```

---

## 8. Deployment Checklist

1. [ ] Copy `server.py`, `system_prompt.txt`, and `knowledge_base.json` to Pi
2. [ ] Create venv: `python3 -m venv .venv && .venv/bin/pip install fastapi uvicorn anthropic`
3. [ ] Set `ANTHROPIC_API_KEY` in systemd unit or `.env`
4. [ ] Start FastAPI: `systemctl start h2i-chat`
5. [ ] Configure and start cloudflared tunnel
6. [ ] Test: `curl https://chat.hacktoimprove.com/health` → `{"status":"ok"}`
7. [ ] Push frontend changes (extra.js + extra.css) to main → auto-deploys
8. [ ] Verify widget loads on site, onboarding works, backend responds
