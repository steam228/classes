# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

H2I Learning Materials — an educational documentation site for university design courses (product design, digital fabrication, creative coding). Built by André Rocha. Content is in Portuguese; technical references may be in English. Licensed CC BY 4.0.

## Build & Dev Commands

```bash
# Install dependencies (everything is managed through UV)
uv sync

# Local development server (auto-reloads on changes)
uv run zensical serve

# Production build (outputs to site/)
uv run zensical build --clean
```

Deployment is automatic via GitHub Actions on push to main — no manual deploy needed.

## Architecture

- **Static site generator**: [Zensical](https://zensical.org) (Python-based, Material Design theme)
- **Package manager**: UV (`uv.lock` for dependencies)
- **Python**: 3.12+
- **Single dependency**: `zensical >= 0.0.21` (in `pyproject.toml`)

### Key Files

| File | Purpose |
|------|---------|
| `zensical.toml` | Site config, navigation structure, theme settings, features |
| `overrides/main.html` | Theme template override (hero header system) |
| `docs/stylesheets/extra.css` | Custom CSS (hero headers, dark/light themes, 3D viewer, Gantt lightbox) |
| `docs/javascripts/extra.js` | Custom JS (hero parallax, 3D model embeds, A360 viewer, video auto-conversion) |
| `docs/ESTRUTURA.md` | Content structure guide and conventions |

### Content Structure

All content lives under `docs/`. Each course follows this pattern:

```
CourseName/
├── index.md                 # Course landing page
├── Avaliacao.md             # Assessment criteria
├── Calendario.md            # Timeline & deliverables
├── Enunciado.md             # Project brief
├── attachments/             # Media assets
└── Sumarios/
    ├── index.md             # Lesson index table
    ├── aula1.md             # Lesson summary (date, objectives, refs)
    ├── aula1_conteudos.md   # Detailed content & exercises
    └── ...
```

Active courses: **DesignDeProdutoIV** (6 lessons), **PrototipagemDigital** (11 lessons, git submodule from `steam228/PrototipagemDigitalAVT`).

### Navigation

Defined explicitly in `zensical.toml` `nav` array. Adding/removing pages requires updating this array.

### Frontmatter

Every markdown file requires YAML frontmatter with hero header config:

```yaml
---
title: "Aula N"
icon: lucide/book-open
tags: aula
status: not-started        # not-started | in-progress | completed
hero_image: ../../images/hero.png
hero_title: "Aula N"
hero_subtitle: "Description"
hero_height: 60vh          # 40vh-100vh
hero_overlay: 0.2          # 0-1 darkness
hero_align: center
---
```

### Custom JS Features (extra.js)

- **3D model embedding**: Image tags with `.stl`, `.step`, `.obj`, `.gltf`, `.glb` extensions auto-convert to 3dviewer.net iframes
- **A360 embedding**: `a360.co` links become responsive Autodesk viewer iframes
- **Video conversion**: Image tags with `.mp4`, `.webm`, `.ogg`, `.mov` auto-convert to `<video>` elements (autoplay, loop, muted)
- **Hero parallax**: Scroll-based parallax and transparency transitions on hero headers

## Common Workflows

### Adding a new lesson

1. Create `docs/CourseName/Sumarios/aulaN.md` and `aulaN_conteudos.md` (copy from existing or template in `UnidadeCurricular/`)
2. Update frontmatter (title, hero, status)
3. Update `docs/CourseName/Sumarios/index.md` with link
4. Add entry to `zensical.toml` nav array
5. Place media in `CourseName/attachments/`

### Creating a new course

1. Duplicate `docs/UnidadeCurricular/` template folder
2. Rename and customize all files
3. Add nav section in `zensical.toml`

## Important Notes

- `docs/PrototipagemDigital/` is a **git submodule** — handle with submodule commands
- Hero images use relative paths — keep paths portable
- Large videos (>50MB) should use external hosting (YouTube/Vimeo)
- The `docs/` folder doubles as an **Obsidian vault** (`.obsidian/` config present)
