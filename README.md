# H2I - Learning Materials by André Rocha

Open-source educational materials for design courses: Design de Produto IV, Fabricação Digital, and Código Criativo.

## Overview

This repository contains comprehensive learning materials for university courses taught at ESELx/IPL and ESES/IPS:

- **Design de Produto IV** - Product design with focus on digital fabrication (woodworking & CNC)
- **Unidade Curricular** - Template structure for additional courses
- **Recursos** - Support materials and references

## Structure

```
docs/
├── DesignDeProdutoIV/        # Main course module
│   ├── Sumarios/             # 6 lesson summaries with content modules
│   ├── Avaliacao.md          # Assessment criteria
│   ├── Calendario.md         # Project timeline & deliverables
│   ├── Enunciado.md          # Project brief (Toys)
│   └── Enunciado2.md         # Project brief (Branding & Packaging)
├── UnidadeCurricular/        # Template for new courses
├── Recursos/                 # Support materials
└── images/                   # Hero images and assets
```

## Building & Deploying

### Requirements
- Python ≥ 3.12
- Zensical ≥ 0.0.21

### Install

```bash
pip install -r requirements.txt
# or
pip install zensical
```

### Local Development

```bash
zensical serve
```

Visit `http://localhost:8000` in your browser.

### Build for Deployment

```bash
zensical build
```

Output goes to `site/` folder. Deploy the `site/` folder to your web host.

## Configuration

Edit `zensical.toml` to customize:

- **Site URL** (uncomment for production): Set your deployment URL
- **Navigation** (lines 45+): Manage sidebar structure by commenting/uncommenting items
- **Features** (lines 141+): Toggle features like tabs, TOC integration, code features
- **Theme** (lines 300+): Customize colors and typography

## Content Guidelines

### Adding a New Lesson

1. Create `docs/DesignDeProdutoIV/Sumarios/aula{n}.md` with frontmatter:

```yaml
---
title: "Lesson Title"
icon: lucide/book-open
tags: aula
status: not-started
hero_image: ../attachments/image.png
hero_title: "Lesson Title"
hero_subtitle: "Date Range"
hero_height: 60vh
hero_overlay: 0.2
hero_align: center
---
```

2. Create corresponding `aula{n}_conteudos.md` for detailed content
3. Add entry to `Sumarios/index.md` table
4. Update `zensical.toml` navigation array

### Image Paths

Use relative paths for portability:
- Hero images: `../attachments/image.png` or `../../images/hero.png`
- Content images: `./attachments/image.png` (from lesson location)

**Note:** Large video files (>50MB) don't work reliably. Use external links (YouTube, Vimeo) instead.

## License

Content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) - You are free to share and adapt, with attribution.

## Author

**André Rocha**  
Associate Professor, Design & Digital Fabrication  
ESELx/IPL & ESES/IPS  
Co-founder, [Fablab Benfica](https://fablabbenfica.pt)
