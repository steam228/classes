#!/usr/bin/env python3
"""
Fetch student gallery repos from GitHub Classroom and rebuild gallery index pages.

Modes:
  default        Clone every assignment repo for each course, then regenerate the
                 per-course Galeria/index.md card grids.
  --no-fetch     Skip cloning. Just regenerate index pages from whatever group
                 folders already exist locally (useful for dev / fixtures).
  --course NAME  Limit to a single course (DesignDeProdutoIV | PrototipagemDigital).

Required env vars (when fetching):
  GH_TOKEN          GitHub token with read access to assignment repos
  CLASSROOM_ORG     GitHub org (or user) hosting the assignment repos

The frontmatter contract on each group's root index.md:
  course:        DesignDeProdutoIV | PrototipagemDigital
  group_name:    "Nome do Grupo"
  group_number:  "G01"
  published:     true | false
  hero_image:    attachments/hero.jpg
  members:
    - number: "20231234"
      name: "Aluno A"
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

# ----------------------------------------------------------------------------
# Config — edit prefixes to match your GitHub Classroom assignment naming.

GALLERY_CONFIG = {
    "DesignDeProdutoIV": {
        "prefix": "dpiv-galeria-",
        "label": "Design de Produto IV",
    },
    "PrototipagemDigital": {
        "prefix": "pd-galeria-",
        "label": "Prototipagem Digital",
    },
}

REPO_ROOT = Path(__file__).resolve().parents[2]
DOCS = REPO_ROOT / "docs"

# ----------------------------------------------------------------------------
# Frontmatter parser (no third-party deps; handles the shape used by the
# template — flat scalars + a `members:` list of dicts).

_SCALAR_TRUE = {"true", "True", "TRUE"}
_SCALAR_FALSE = {"false", "False", "FALSE"}
_SCALAR_NULL = {"null", "Null", "NULL", "~", ""}


def _scalar(v: str):
    v = v.strip()
    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
        return v[1:-1]
    if v in _SCALAR_TRUE:
        return True
    if v in _SCALAR_FALSE:
        return False
    if v in _SCALAR_NULL:
        return None
    return v


def parse_frontmatter(md_path: Path) -> dict:
    if not md_path.exists():
        return {}
    text = md_path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return {}
    body = m.group(1)
    fm: dict = {}
    cur_list = None
    cur_item = None
    for line in body.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        # New list item
        m_li = re.match(r"^(\s*)-\s+(.*)$", line)
        if m_li and cur_list is not None:
            cur_item = {}
            rest = m_li.group(2)
            if ":" in rest:
                k, v = rest.split(":", 1)
                cur_item[k.strip()] = _scalar(v)
            cur_list.append(cur_item)
            continue
        # Continuation of a list-item dict (indented "key: value")
        m_cont = re.match(r"^(\s+)([^\s:]+):\s*(.*)$", line)
        if m_cont and cur_item is not None and not line.startswith(("- ",)):
            cur_item[m_cont.group(2).strip()] = _scalar(m_cont.group(3))
            continue
        # Top-level key
        m_kv = re.match(r"^([^\s:]+):\s*(.*)$", line)
        if m_kv:
            k, v = m_kv.group(1), m_kv.group(2)
            if v.strip() == "":
                fm[k] = []
                cur_list = fm[k]
                cur_item = None
            else:
                fm[k] = _scalar(v)
                cur_list = None
                cur_item = None
    return fm


# ----------------------------------------------------------------------------
# GitHub API

def gh_get(url: str, token: str) -> list[dict]:
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:1000]
        print(
            f"::error::GitHub API returned HTTP {e.code} for {url}\n"
            f"Response body: {body}",
            file=sys.stderr,
        )
        if e.code in (401, 403):
            print(
                "::error::Likely causes:\n"
                "  - GALLERY_FETCH_TOKEN is invalid or expired\n"
                "  - Token's Resource Owner is not the classroom org\n"
                "  - Org has fine-grained PATs disabled\n"
                "    (fix: Org Settings → Third-party Access → Personal access tokens →\n"
                "     enable 'Allow access via fine-grained personal access tokens')\n"
                "  - Token is awaiting org-admin approval\n"
                "  - CLASSROOM_ORG variable is wrong (use the slug from the URL,\n"
                "    not the display name)",
                file=sys.stderr,
            )
        raise


def list_assignment_repos(org: str, prefix: str, token: str) -> list[dict]:
    """List repos in `org` (org or user account) whose name starts with `prefix`."""
    repos: list[dict] = []
    for endpoint in (f"orgs/{org}/repos", f"users/{org}/repos"):
        try:
            page = 1
            while True:
                batch = gh_get(
                    f"https://api.github.com/{endpoint}?per_page=100&page={page}",
                    token,
                )
                if not batch:
                    break
                repos.extend(r for r in batch if r["name"].startswith(prefix))
                if len(batch) < 100:
                    break
                page += 1
            return repos
        except urllib.error.HTTPError as e:
            if e.code == 404:
                continue
            raise
    return repos


def clone_shallow(clone_url: str, dest: Path, token: str) -> None:
    if dest.exists():
        shutil.rmtree(dest)
    auth_url = clone_url.replace("https://", f"https://x-access-token:{token}@", 1)
    subprocess.run(
        ["git", "clone", "--depth", "1", "--quiet", auth_url, str(dest)],
        check=True,
        capture_output=True,
    )
    shutil.rmtree(dest / ".git", ignore_errors=True)
    prune_for_site(dest)


# Files/dirs that exist in student repos but should not be served by the site:
# - README.md collides with index.md for directory URLs (README wins, masking
#   the real group page).
# - .obsidian/, .github/, .gitignore, .DS_Store are repo-internal noise.
_PRUNE_NAMES = ("README.md", ".obsidian", ".github", ".gitignore", ".DS_Store")


def prune_for_site(group_dir: Path) -> None:
    for name in _PRUNE_NAMES:
        target = group_dir / name
        if not target.exists():
            continue
        if target.is_dir():
            shutil.rmtree(target, ignore_errors=True)
        else:
            target.unlink()


# ----------------------------------------------------------------------------
# Per-course pipeline

def fetch_course(course: str, cfg: dict, org: str, token: str) -> None:
    galeria = DOCS / course / "Galeria"
    galeria.mkdir(parents=True, exist_ok=True)
    # Wipe previously fetched groups (preserve files like index.md / archives).
    for child in galeria.iterdir():
        if child.is_dir() and not child.name.startswith("_"):
            shutil.rmtree(child)
    repos = list_assignment_repos(org, cfg["prefix"], token)
    print(f"[{course}] {len(repos)} repos matching prefix '{cfg['prefix']}'")
    for r in repos:
        slug = r["name"][len(cfg["prefix"]):] or r["name"]
        dest = galeria / slug
        print(f"  fetch {r['name']} → {dest.relative_to(REPO_ROOT)}")
        clone_shallow(r["clone_url"], dest, token)


def generate_index(course: str, cfg: dict) -> None:
    galeria = DOCS / course / "Galeria"
    if not galeria.exists():
        return
    cards = []
    for entry in sorted(galeria.iterdir()):
        if not entry.is_dir():
            continue
        idx = entry / "index.md"
        fm = parse_frontmatter(idx)
        if not fm or fm.get("published") is False:
            continue
        # Skip groups whose `group_name` is empty — that signals the
        # student hasn't customized their template yet. Treat naming
        # the group as the implicit "ready to publish" trigger so the
        # gallery doesn't surface half-empty placeholders.
        raw_group_name = (fm.get("group_name") or "").strip()
        if not raw_group_name:
            continue
        title = raw_group_name
        members = fm.get("members") or []
        names = []
        if isinstance(members, list):
            names = [m.get("name") for m in members if isinstance(m, dict) and m.get("name")]
        subtitle_parts = []
        if fm.get("group_number"):
            subtitle_parts.append(str(fm["group_number"]))
        if names:
            subtitle_parts.append(" · ".join(names))
        subtitle = " — ".join(subtitle_parts) if subtitle_parts else (fm.get("hero_subtitle") or "")
        # Use whatever hero_image the group declared; tolerate any leading
        # `../` that crept in (a frequent mistake for index.md, which
        # shouldn't have one).
        hero = fm.get("hero_image") or "attachments/hero.jpg"
        while hero.startswith("../"):
            hero = hero[3:]
        cards.append({
            "href": f"{entry.name}/",
            "img": f"{entry.name}/{hero}",
            "title": title,
            "subtitle": subtitle,
        })
    out_path = galeria / "index.md"
    out_path.write_text(render_index(cfg, cards), encoding="utf-8")
    print(f"[{course}] wrote {len(cards)} cards → {out_path.relative_to(REPO_ROOT)}")


def render_index(cfg: dict, cards: list[dict]) -> str:
    if cards:
        grid = "\n".join(
            f'  <a class="gallery-card" href="{c["href"]}">\n'
            f'    <img src="{c["img"]}" alt="" />\n'
            f'    <h3>{c["title"]}</h3>\n'
            f'    <p>{c["subtitle"]}</p>\n'
            f"  </a>"
            for c in cards
        )
    else:
        grid = "  <!-- nenhum grupo publicado ainda -->"
    return f"""---
title: "Galeria"
icon: lucide/layout-grid
tags: galeria
hero_image: ../../images/hero.png
hero_title: "Galeria de Projetos"
hero_subtitle: "{cfg['label']} · 2025-26"
hero_height: 60vh
hero_overlay: 0.3
hero_align: center
---

# Galeria de Projetos

Trabalhos finais dos grupos de **{cfg['label']}**.

<!-- markdownlint-disable MD033 -->
<div class="gallery-grid">
{grid}
</div>
<!-- markdownlint-enable MD033 -->
"""


# ----------------------------------------------------------------------------
# Entry

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--no-fetch", action="store_true",
                    help="Skip cloning; only regenerate indexes from local content")
    ap.add_argument("--course", choices=list(GALLERY_CONFIG))
    args = ap.parse_args()

    courses = [args.course] if args.course else list(GALLERY_CONFIG)
    token = os.environ.get("GH_TOKEN", "")
    org = os.environ.get("CLASSROOM_ORG", "")

    if not args.no_fetch and (not token or not org):
        print("ERROR: set GH_TOKEN and CLASSROOM_ORG, or pass --no-fetch", file=sys.stderr)
        return 2

    for course in courses:
        cfg = GALLERY_CONFIG[course]
        if not args.no_fetch:
            fetch_course(course, cfg, org, token)
        generate_index(course, cfg)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
