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
      "name": "...",
      "slug": "DesignDeInteracao",
      "is_active": true,
      "pages": [
        {"slug": "Sumarios/aula1", "title": "...", "content": "..."}
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
    "dpi":      {"name": "Design de Interação",  "slug": "DesignDeInteracao",   "is_active": True},
    "di":       {"name": "Design de Informação",  "slug": "DesignDeInformacao",  "is_active": True},
    "dpiv":     {"name": "Design de Produto IV",  "slug": "DesignDeProdutoIV",   "is_active": False},
    "pd":       {"name": "Prototipagem Digital",  "slug": "PrototipagemDigital", "is_active": False},
    "recursos": {"name": "Recursos",              "slug": "Recursos",            "is_active": True},
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
    output_path = OUTPUT
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
