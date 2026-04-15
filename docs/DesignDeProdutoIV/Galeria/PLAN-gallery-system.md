# Plan: Student Gallery System via GitHub Classroom

## Context

Design de Produto IV needs a gallery to showcase 15-30 student project deliverables. Students will work in individual GitHub repos (created via GitHub Classroom), and the main site needs to automatically pull their content and render a visual gallery. The empty `docs/DesignDeProdutoIV/Galeria/` folder is ready to be populated.

---

## Overview: 4-Phase Pipeline

```
Template Repo → GitHub Classroom → GitHub Actions Fetch → Zensical Gallery
```

---

## Phase 1: Student Deliverable Template Repo

Create a standalone GitHub repo (e.g., `steam228/dpiv-portfolio-template`) that serves as the GitHub Classroom assignment template.

**Structure:**
```
/
├── index.md              # Main project page (hero image + summary)
├── processo.md           # Process documentation (iterations, decisions)
├── attachments/
│   ├── hero.jpg          # Placeholder hero image (used by gallery)
│   └── placeholder.png   # Example inline image
└── README.md             # Instructions for students (how to fill in)
```

**`index.md` frontmatter** (pre-populated with placeholders):
```yaml
---
title: "Nome do Projeto"
icon: lucide/box
tags: galeria
status: not-started
hero_image: attachments/hero.jpg
hero_title: "Nome do Projeto"
hero_subtitle: "Nome do Aluno · 2025-26"
hero_height: 60vh
hero_overlay: 0.3
hero_align: center
---
```

Body includes placeholder sections aligned with the Esquema-Ferramenta: Conceito, Enquadramento, Tecnologia, Função, plus a gallery of process images.

**`README.md`**: Instructions in Portuguese explaining what to fill in, how to add images, and the expected deliverables.

**Key decisions:**
- Template follows the existing Zensical frontmatter conventions exactly
- `hero.jpg` is the image the gallery index will pull as thumbnail
- Students can add as many extra `.md` files as they want (processo, pesquisa, etc.)
- Minimal structure — only `index.md` and one attachment are required

---

## Phase 2: GitHub Classroom Setup (manual, one-time)

1. Create a GitHub Classroom organization (or use existing)
2. Create an assignment linked to the template repo
3. Set assignment as **individual**, with repo naming pattern: `dpiv-portfolio-{username}`
4. Students accept → each gets a private/public repo pre-populated with the template

No code needed here — this is GitHub Classroom UI configuration.

---

## Phase 3: GitHub Actions Build Pipeline

Modify the existing `.github/workflows/main.yml` to fetch student repos before building.

**New step — `fetch-gallery.sh` script:**

1. Use GitHub API to list repos matching the assignment prefix (`dpiv-portfolio-*`) in the classroom org
2. For each accepted repo:
   - Shallow clone (`--depth 1`) into a temp directory
   - Copy `index.md`, any extra `.md` files, and `attachments/` into `docs/DesignDeProdutoIV/Galeria/{student-slug}/`
3. Auto-generate `docs/DesignDeProdutoIV/Galeria/index.md` — the gallery index page

**Gallery index generation:**
- Read each student's `index.md` frontmatter (hero_image, hero_title, hero_subtitle)
- Generate a grid/card layout in Markdown using Zensical's grid system or custom HTML
- Each card: thumbnail (from hero_image) + title + link to student page

**Nav update:**
- Either dynamically append gallery entries to the nav, or use a wildcard/glob pattern if Zensical supports it
- Fallback: generate a nav snippet and inject it into a copy of `zensical.toml` at build time

**Authentication:**
- The workflow needs a GitHub token with read access to student repos
- Use a GitHub App or PAT stored as a repository secret (`CLASSROOM_TOKEN`)

**Key files:**
- `.github/workflows/main.yml` — add fetch step before `zensical build`
- `.github/scripts/fetch-gallery.sh` — the fetch + generate script
- `docs/DesignDeProdutoIV/Galeria/index.md` — generated at build time (gitignored)

---

## Phase 4: Gallery Rendering in Zensical

**Gallery index page (`Galeria/index.md`)** — auto-generated, with:
```yaml
---
title: "Galeria de Projetos"
icon: lucide/layout-grid
tags: galeria
hero_image: ../../images/heroProj.jpeg
hero_title: "Galeria de Projetos"
hero_subtitle: "Design de Produto IV · 2025-26"
hero_height: 60vh
hero_overlay: 0.3
---
```

Body: a responsive grid of cards, each with:
- Student's hero image as thumbnail
- Project title
- Student name (from subtitle)
- Link to `Galeria/{student-slug}/index.md`

**Two implementation options for the grid:**

### Option A: Pure Markdown + Custom CSS
Generate Markdown with inline HTML grid:
```html
<div class="gallery-grid">
  <a class="gallery-card" href="student-slug/">
    <img src="student-slug/attachments/hero.jpg" />
    <h3>Project Title</h3>
    <p>Student Name</p>
  </a>
  ...
</div>
```
Add `.gallery-grid` styles to `extra.css` (CSS Grid, responsive, hover effects).

### Option B: Zensical grid extension
If Zensical supports Material for MkDocs-style grids (`<div class="grid cards">`), use that native pattern.

**Recommendation:** Option A — gives full control over card appearance and matches the existing custom CSS approach.

**Student sub-pages:** Each student's content renders as normal Zensical pages under `Galeria/{slug}/`. Their `index.md` gets the hero header, their extra `.md` files are accessible as sub-pages. No special rendering needed — Zensical handles it.

---

## Navigation Update

Add to `zensical.toml`:
```toml
{ "Galeria de Projetos" = "DesignDeProdutoIV/Galeria/index.md" },
```

Individual student pages don't need explicit nav entries — they're linked from the gallery index. Alternatively, auto-generate nav entries in the build script if you want sidebar navigation per student.

---

## .gitignore Addition

```
# Generated gallery content (fetched at build time)
docs/DesignDeProdutoIV/Galeria/*/
```

Only `Galeria/index.md` (if hand-crafted) stays in git. Student content is ephemeral, fetched fresh each build.

---

## Implementation Order

1. **Template repo** — create the repo with placeholder content
2. **Gallery CSS** — add `.gallery-grid` styles to `extra.css`
3. **Fetch script** — `.github/scripts/fetch-gallery.sh`
4. **Workflow update** — add fetch step to `main.yml`
5. **Test** — accept assignment as a test student, push content, verify build
6. **Nav update** — add Galeria section to `zensical.toml`

---

## Verification

1. Create a test student repo from template, populate with sample content
2. Run fetch script locally to verify gallery generation
3. Run `uv run zensical serve` to verify gallery renders correctly
4. Push to main, verify GitHub Actions builds and deploys with gallery
5. Check: hero images display as thumbnails, links work, responsive grid on mobile
