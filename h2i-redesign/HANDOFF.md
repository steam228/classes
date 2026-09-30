# H2I — Redesign handoff (for Claude Code)

**Goal:** re-skin hacktoimprove.com/classes with new colours, type and a robust header-over-hero system — **without leaving Zensical**. Same content, same frontmatter API, same features. Always responsive, both schemes (default + slate).

**Owner:** André Rocha. UI strings stay in European Portuguese (pt-PT).

---

## 0. How to use this folder

```
design/h2i-redesign/          ← keep OUTSIDE docs/ so Zensical doesn't publish it
├── HANDOFF.md                ← this file (the spec)
├── tokens/h2i-tokens.css     ← final colour/type/shape tokens — copy verbatim
└── reference/
    ├── 01-fundamentos.html … 12-mobile-ze.html   ← visual targets, open in a browser
    ├── img/                  ← images used by the reference pages
    └── source/*.dc.html      ← raw canvas files (same markup, template syntax)
```

- The **reference pages are the visual target**. Every px value, colour and font in them is intentional — read the inline styles for exact numbers rather than guessing from screenshots.
- They are mockups, not theme code: map each element to the real Zensical/Material DOM (§5 has the map). Don't copy the markup into templates.
- Fonts load from Google Fonts; images are local in `reference/img/`.
- Reference pages are fixed-size artboards (1440 / 834 / 390 wide). The live site must be fluid between them.

| File | Shows |
|---|---|
| 01-fundamentos | Colour roles, neutrals (light + slate), type scale, radii, elevation, breakpoints |
| 02-tipografia | Type options A/B/C — **A is chosen** |
| 03-cabecalho-sobre-hero | Header + hero legend over 6 hero types, plus scrolled state |
| 04-desktop-home | Home, 100vh hero, grid cards |
| 05-desktop-aula-p5 | Lesson page with dark p5.js sketch hero, sidebar, TOC, footer |
| 06-desktop-uc-slate | Course index in **slate**: table, warning admonition |
| 07-componentes | Buttons, admonitions, code, tabs, tables, attachments, tooltips, gallery, embeds, Gantt |
| 08-ze-chat | Zé widget: FAB states + 3 panel states |
| 09-tablet-galeria | 834px: header without tabs, gallery at 3 columns |
| 10-mobile-aula | 390px lesson page |
| 11-mobile-gaveta | 390px navigation drawer |
| 12-mobile-ze | 390px Zé fullscreen |

---

## 1. Hard constraints

1. **Stay on Zensical.** Touch only: `zensical.toml`, `overrides/main.html` (+ partial overrides if Zensical supports them), `docs/stylesheets/extra.css`, `docs/javascripts/extra.js`. Do not edit course Markdown except where §7 says "optional content change" — and ask first.
2. **Frontmatter stays backwards compatible.** `hero_image`, `hero_sketch`, `hero_title`, `hero_subtitle`, `hero_height`, `hero_align`, `hero_buttons` keep working. One new optional key: `hero_tone: dark`. See §3.3 for what happens to `hero_overlay`.
3. **Keep behaviours:** parallax (off with `prefers-reduced-motion`), scroll arrow on 100vh heroes, embeds, attachment cards, Gantt lightbox, Mermaid scroll, archived-course marking, Zé onboarding flow, print styles.
4. **Accessibility is part of the spec:** text ≥ 4.5:1 (≥ 3:1 from 24px), visible `:focus-visible` everywhere (2px `--md-accent-fg-color`, offset 3px), hit targets ≥ 44px on touch, no information by colour alone.
5. Work on a branch (`redesign-2026`). Commit per phase.

---

## 2. Fixed design decisions

**Colour roles** (tokens in `tokens/h2i-tokens.css`):

| Colour | Light (default) | Dark (slate) |
|---|---|---|
| `#2C5EAD` | links, buttons, active tab, Zé FAB, H2 numbers | — |
| `#1591DC` | indicators only: focus ring, TOC active bar, active icons, list markers. **Never small text on white** | same |
| `#4BB8FA` | graphic only (diagrams, Gantt) | links, buttons, active tab, FAB |
| `#C4E2F5` | link-hover highlight, selected items, chips, highlighted code line | as 20% alpha |

Neutrals: paper `#FAFBFC`, body text dark grey `#272C33`, headings black `#101318`. Warning/danger are the only non-blue hues.

Derived shades, not in the brand four: `#234C8E` (light primary hover) and `#7ACBFB` (slate primary hover). Flag them to André if you think they're wrong.

**Type — option A:**
- Display: **Bricolage Grotesque** 700 (hero "H2I" 800), tracking −0.025em. Used for h1, h2, hero title, header wordmark, card titles, prev/next titles.
- Text: **Atkinson Hyperlegible Next** — body, h3, nav.
- Mono: **Atkinson Hyperlegible Mono** — code, labels ("ÍNDICE", "ANTERIOR", path row), badges.
- Replaces Inter + JetBrains Mono entirely.

**Motifs:**
- Hero title in a solid **legend card** (like a technical-drawing title block) that carries the breadcrumb path.
- **Frosted-glass header.**
- **Dot-grid paper** (`.h2i-dots`, 16px) for empty/loading states and the footer bar.
- Optional **numbered H2s** ("01", "02"… in mono blue).

---

## 3. The header-over-hero system (highest priority — this is what fails today)

**Problem today:** a transparent header with dark text plus a white gradient overlay. On the dark p5 sketch (e.g. `DesignDeInovacao/Sumarios/aula1/`) the header and title become illegible.

### 3.1 Header — frosted glass by default (reference 03, 05)
- `.md-header`:
  - `background: var(--h2i-glass)`
  - `backdrop-filter: blur(16px) saturate(1.6)` (+ `-webkit-` prefix)
  - `border-bottom: 1px solid var(--h2i-glass-line)`
  - text `var(--md-default-fg-color)`, no text-shadow
- Worst case (pure black behind it): effective background ≈ `#B9BABB`, so ink text still passes 9:1. This works on any image or video, so there's nothing to tune per page.
- **Remove** the old hacks: text-shadow, logo `brightness(0) invert(1)`, and the transparent → solid colour flip.
- Scrolled (`.md-header--scrolled`, existing JS):
  - `background: var(--h2i-glass-solid)` plus `box-shadow: 0 4px 16px rgba(16,19,24,.06)`
  - the site title swaps to the page title (`.md-header__topic`, native behaviour)
  - transition 0.3s
- `@supports not (backdrop-filter: blur(1px))` → use `--h2i-glass-solid`.
- Same treatment on pages without a hero.
- **Heights:** desktop 64px row + 48px tabs row; tablet 60px, no tabs (Material hides them below 1220px); mobile 56px.
- **Title:** wordmark "H2I" (display 800, 22px) + tagline "Learning Materials · André Rocha" (14px, `--light`).
  - Hide the tagline ≤ 719px.
  - The current `site_name` is the single string "H2I - Learning Materials by André Rocha". Preferred: a header partial override that renders two spans.
  - If partials can't be overridden in Zensical: split the string in `extra.js` on " - ".
  - Keep the full `site_name` for `<title>` and SEO.
- **Search:** pill 300×40, radius 10, `background: var(--h2i-field)`, `⌘K` hint in mono. Icon-only on tablet and mobile.
- **Palette toggle:** 44×44 icon button.

### 3.2 Tabs (`.md-tabs`, inside the header)
- Transparent background.
- Links 14.5px, colour `--md-default-fg-color`, padding 0 12px.
- Active: `font-weight: 600` plus a 2px bottom bar in `--md-primary-fg-color`.
- **Archived courses:**
  - Replace `opacity: .45` (fails contrast) with colour `--md-default-fg-color--light`.
  - Group them: a 1px × 20px divider plus a mono label "ARQUIVO" before the first archived tab, and a divider after the last one.
  - CSS: `:not(.archived-course) + .archived-course::before` and `.archived-course + :not(.archived-course)::before`.
  - This needs `.archived-course` on the `li.md-tabs__item`. If the JS currently puts it on the `<a>`, move it (update the sidebar selector too).

### 3.3 Hero legend (edit `overrides/main.html`, `{% block hero %}`)
Keep `section.md-hero > .md-hero__image` (image / video / sketch iframe) as is. Replace the inside of `.md-hero__content` with a legend card:

```
div.md-hero__legend                 (radius 4px, bg --md-default-bg-color, --h2i-shadow)
  nav.md-hero__path[aria-label=Caminho]   mono 11.5px uppercase +0.08em, --light;
      one <a> per breadcrumb item, cells separated by 1px --lightest,
      LAST item in --md-primary-fg-color. Reuse the theme's path/breadcrumb
      logic (page.ancestors + home). Home (no ancestors): single cell
      "Hack to Improve".
  div (padding 24px 28px 28px, gap 10px)
    h1.md-hero__title        display 700, 60px, lh 1  (home "H2I": 800, 128px, lh .86)
    p.md-hero__subtitle      text 19px, --light, NOT italic
    div.md-hero__buttons     existing buttons, restyled (§5 buttons)
```

**Placement** (reference 05 at 1440):
- Aligned to the content column: left edge = sidebar width + column gap, inside `.md-grid`.
- Width 600px; up to 680px for long subtitles.
- `bottom: -48px`: the legend overlaps the hero's bottom edge.
- `hero_align: center | right` moves it across the content column.
- `.md-main` gets extra top padding (overhang + 56px) on hero pages.
- **100vh heroes** (reference 04, 03-04): the legend sits inside the hero (bottom 124px, no overhang). The scroll arrow is a 48px round glass button, centred, bottom 40px, arrow-down icon.
- **Tablet:** left 32px, width 560px, overhang 40px, title 46px.
- **Mobile:** left/right 16px, overhang 40px, title 40px, subtitle 16px. The path row drops "Página Inicial" and shows only the last two items; it must not wrap (overflow hidden).

**On hero pages, hide `.md-path`** (the breadcrumbs above the H1), because the legend now carries them. Pages without a hero keep the normal breadcrumbs (reference 07 §06).

**Overlay:**
- Default: none. Delete the four-stop white/black gradient.
- Slate only: dim the image with a 20% layer, `--h2i-hero-dim`.

**`hero_overlay`:** grep the docs for current values and **report them before changing anything**. Proposed:
- ignore it in the default glass mode (the legend makes it unnecessary);
- in immersive mode, use it as the scrim strength (default 0.55).

**Sketch loading state:** before the iframe paints, show `.h2i-dots` on `--md-code-bg-color` instead of the currently empty background.

### 3.4 Opt-in immersive mode — `hero_tone: dark` (reference 03-06)
For pages whose author knows the image is dark:
- Add `md-hero--immersive` to the section, and a body/header class (e.g. `h2i-hero-dark`) so CSS can reach the header.
- **While not scrolled:**
  - header fully transparent, text white;
  - wordmark squiggle `#4BB8FA`, archived tabs at 78% white;
  - active tab bar `#4BB8FA`;
  - search field `rgba(255,255,255,.14)`;
  - top scrim: `linear-gradient(rgba(0,0,0,.55), transparent)`, 180px.
- **No legend card:** path, title and subtitle sit directly on the image, in white, over a bottom scrim (`linear-gradient(to top, rgba(0,0,0,.62), transparent)`, 240px).
- **Once scrolled:** back to the normal glass header.

---

## 4. Layout, sidebar, TOC, footer

**Grid ≥ 1220px:**
- Max width 1440px, gutters 40px.
- Sidebar 248px | content 760px | TOC 224px, with 64px column gaps.
- ≥ 1600px: grid stays centred; hero stays full-bleed.

**Breakpoints** (Material's own — don't invent new ones): ≤719 / 720–959 / 960–1219 / ≥1220 / ≥1600.

**Sidebar — `.md-sidebar--primary` (reference 05):**
- Section title: display 700, 18px, `--md-default-fg-color`.
- Items:
  - 38px tall, padding 0 12px, radius 8, 15px text in `--md-typeset-color`;
  - 18px lucide icons in `--lighter`, 12px gap.
- Active page: `background: var(--h2i-tint)`, colour `--h2i-tint-fg`, weight 600.
- Open group: parent label weight 600, icon in primary, chevron-down.
- Nested list:
  - margin-left 21px, padding-left 12px, `border-left: 1px solid --lightest`;
  - items 14.5px / 1.35, padding 8px 10px, radius 6, colour `--light`.
- Archived courses: colour `--light`, not opacity.

**TOC — `.md-sidebar--secondary`:**
- Keep it forced visible ≥ 1220px.
- Label "Índice": mono 500, 11.5px, uppercase, +0.1em, `--light`.
- List:
  - 1px `--lightest` rail on the left;
  - items 14px / 1.4, padding 6px 0 6px 14px, `--light`;
  - nested items indent to 28px.
- Active item: 2px left bar in `--md-accent-fg-color`, colour `--md-default-fg-color`, weight 600.

**Footer — `.md-footer`:**
- **Prev/next:**
  - Two cards aligned to the content column (not full width): 1px `--lightest` border, radius 8, padding 20px 22px.
  - Direction label ("Anterior" / "Próximo") in mono 11.5px uppercase with an arrow icon.
  - Page title in display, 21px.
  - On mobile, stack them.
- **Meta bar (`.md-footer-meta`):**
  - 88px tall, `--md-code-bg-color` plus `.h2i-dots`, top border `--lightest`.
  - Contents: squiggle logo + "H2I" wordmark, CC BY icons + "CC BY 4.0 · 2026 André Rocha", "Made with Zensical".
  - Left-aligned, so the Zé FAB never covers text.

**Back to top (`.md-top`):** glass pill, 40px, arrow-up plus "Voltar ao topo".

---

## 5. Content components (reference 07) — DOM map

| Component | Selector(s) | Spec |
|---|---|---|
| Body text | `.md-typeset` | 17px / 1.65, `--md-typeset-color`, measure ≤ 72ch |
| H1 | `.md-typeset h1` | display, 44/48, `--md-default-fg-color`, no bottom margin beyond 8px |
| H2 | `.md-typeset h2` | display, 30/36, margin-top 48px. **Numbering:** `::before` = `counter(h2, decimal-leading-zero)`, mono 400 14px, `--md-primary-fg-color`, 14px gap. Make it opt-out per page (e.g. `numbered: false` via a wrapper class in `main.html`) |
| H3 | `.md-typeset h3` | text 700, 21/28, margin-top 32px |
| Lists | `li::marker` | `--md-accent-fg-color` |
| Links | `.md-typeset a` | `--md-typeset-a-color`, underline 1px at 45% of that colour, offset 3px. Hover: `background: var(--h2i-hl)`, underline full colour, radius 2px |
| Inline code | `.md-typeset code` (not in `pre`) | mono .86em, padding .12em .42em, radius 4, `--md-code-bg-color` |
| Buttons | `.md-button`, `.md-button--primary`, hero buttons | 44px, padding 0 20px, radius 8, weight 600, 15.5px. Primary: bg primary, text `--md-primary-bg-color`; hover `--md-primary-fg-color--dark`, `translateY(-1px)`, `--h2i-shadow-sm`. Secondary: 1.5px border in `--md-default-fg-color` |
| Admonitions | `.admonition`, `details` | **Remove the thick left border** — 1px full border, radius 8, no shadow, padding 14px 18px 16px. Title (`.admonition-title` / `summary`): transparent bg, 700, 15.5px, 18px icon, body indented 28px. Colours: note/info/abstract → `--h2i-tint` bg, `--h2i-tint-strong` border, `--h2i-tint-fg` title · tip/example/success/quote → `--md-code-bg-color` bg, `--lightest` border, icon `--md-accent-fg-color` · warning/question → `--h2i-warn-*` · danger/failure/bug → `--h2i-danger-*`. Collapsed `details`: neutral border, chevron at right |
| Code blocks | `.highlight`, `pre > code`, `.filename`, `.md-clipboard`, `.linenos`, `.hll`, `.md-annotation__index` | Container: `--md-code-bg-color`, 1px `--lightest` border, radius 8. Title bar 42px, mono 12.5px, `--light`, bottom border. Copy button 36px, `--light`. Code 14.5px / 23px. Line numbers `--lighter`. Highlighted line `--md-code-hl-color`. Function names 600. Annotation marker: 18px circle, primary bg, 11px number. Annotation tooltip: paper, 1px border, `--h2i-shadow`, radius 8 |
| Content tabs | `.tabbed-labels`, `.tabbed-set` | 1px `--lightest` frame, radius 8. Labels 44px, 15px; active 600, indicator 2px primary |
| Tables | `.md-typeset table:not([class])` | Full width inside the wrapper, 1px border, radius 8, overflow hidden. `th`: mono 500, 11.5px, uppercase, +0.1em, `--light`, bg `--md-code-bg-color`, padding 12px 18px. `td`: padding 14px 18px, row divider `--lightest`, `font-variant-numeric: tabular-nums`, no zebra |
| Tooltips | `.md-tooltip`, `[data-md-tooltip]` | bg `--h2i-tip-bg`, text `--h2i-tip-fg`, 13.5px, radius 6 |
| Footnote refs | `.footnote-ref` | mono 12px, `--h2i-tint` pill |
| Attachment card | `a.attachment-download` + children | 68px row, 1px `--lightest`, radius 8, padding 0 16px 0 14px, gap 14. Icon: 40px box, radius 8, `--h2i-tint` bg, `--h2i-tint-fg` download icon. Name: 15.5px 600, ellipsis. Ext badge: mono 11px 600, +0.06em, bg primary, text `--md-primary-bg-color`, radius 4. Hover: border primary, `--h2i-shadow-sm`, icon box turns primary |
| Gallery | `.gallery-grid`, `a.gallery-card` | `repeat(auto-fill, minmax(220px, 1fr))`, gap 24px (20px at tablet). Image 4:3, radius 8, 1px `--lightest` border. `h3` → display, 18px / 1.25 (was .85rem). `p` → 14px / 1.45, `--light`. Hover: `translateY(-4px)`, image `--h2i-shadow` + 2px primary outline offset 3px, title in primary |
| Empty gallery | `.gallery-grid:empty` (or a JS-added state) | 140px dashed `--lightest` box, `.h2i-dots`, grid icon + short label. Copy TBD by André |
| Embeds | `.youtube-embed`, `.autodesk-embed`, `.model-viewer-3d` | radius 8, 1px `--lightest`, overflow hidden. Optional (extra.js): a 52px caption bar with a mono type label ("YOUTUBE", "3D · STL"), the file/title, and an external link |
| Gantt | `.gantt-zoom`, `.gantt-lightbox*` | Figure: 1px border, radius 8, padding 20px. Add an "Ampliar" button (36px, maximize icon) top-right via JS. Backdrop `rgba(8,10,14,.72)`; panel radius 10; close button 36px circle `--h2i-surface-2`; Esc closes. Mermaid bars use the 4 blues in order #2C5EAD → #1591DC → #4BB8FA → #C4E2F5 (last one with a 1px #2C5EAD border) |
| Mermaid | existing | Keep the scroll behaviour; theme via `themeVariables` using the tokens |

---

## 6. Zé widget (reference 08, 12) — `div.h2i-chat`
Move from a block of accent colour to "paper like the rest".

- **FAB (`.h2i-chat__toggle`):**
  - ≥ 720px: extended pill, 52px, padding 0 22px 0 18px, 20px icon plus the label "Pergunta ao Zé" (via `::after` or a real span — keep the `aria-label`).
  - ≤ 719px: 52px round.
  - bg primary, icon/text `--md-primary-bg-color`, `--h2i-shadow`, focus ring.
  - Bottom/right 24px desktop, 16px mobile.
- **Panel (`.h2i-chat__panel`):**
  - 380×580, radius 14, 1px `--lightest`, `--h2i-shadow-lg`, bg `--md-default-bg-color`.
  - ≤ 719px: fullscreen, as today.
- **Header (`.h2i-chat__header`):**
  - 64px paper (not accent), bottom border.
  - 36px avatar circle with "Z" (display 800, primary bg).
  - Title "Zé" in display 19px.
  - Subtitle 12.5px `--light`: "Colega virtual · IA" until a cadeira is chosen, then the cadeira name (JS sets `data-subtitle`).
  - Close button 44px.
- **Bubbles:**
  - Bot: `--md-code-bg-color`, radius 4 14 14 14.
  - User: primary bg, `--md-primary-bg-color` text, radius 14 4 14 14.
  - 15px / 1.5 (16px on mobile), max-width 300px, gap 10px.
  - Code inside answers: mono 13px / 20px in a paper box with 1px border.
- **Chips (`.h2i-chat__topic-btn`):**
  - Turma: pill 36px.
  - Cadeira: 40px, radius 10, with an 8px colour square (the 4 blues, in course order).
  - Selected: `--h2i-tint` bg, primary border, 600.
- **Typing:** three 7px dots in `--lighter`, 1.2s bounce; static under reduced motion.
- **Input:**
  - Textarea 44px (48px mobile), radius 12, bg `--md-code-bg-color`, 1px `--lightest`.
  - Focus: accent border plus a 3px `--h2i-hl` ring.
  - Send: 44px round primary; disabled `--h2i-surface-2` with a `--lighter` icon.
  - Mobile font-size 16px (prevents iOS zoom).
- **Disclaimer:** 12px `--light` with an inline info SVG. **Replace the ⚠️ emoji** in the JS string. Keep the text.

---

## 7. Optional content changes (ask André before doing these)
- **Home "O que vais encontrar aqui":** render the four paragraphs as Zensical grid cards (`<div class="grid cards" markdown>`). Each card: 40px tint icon box, display 20px title, 16px text (reference 04).
- **Home closing line** "Vamos fazer, aprender e inovar juntos." styled as a display 26px line.
- **Contactos** on course index pages: one item per line (reference 06).

---

## 8. Phases (stop for review after each)

0. **Recon — no edits.** Read the four theme files. List:
   - Zensical's real DOM for header, tabs, hero, nav, footer and search, from `zensical serve` HTML;
   - whether partial overrides work;
   - where the TOML `font` setting loads fonts from;
   - current `hero_overlay` values across docs;
   - where `.archived-course` is applied.

   Take baseline screenshots of the QA pages (below). Then propose the plan.
1. **Tokens + fonts.** Add `h2i-tokens.css` (as a separate stylesheet in `extra_css`, or at the top of `extra.css`). Set the palette to custom primary/accent for both schemes. Remove Inter/JetBrains. Check computed styles in both schemes.
2. **Header + tabs** (§3.1–3.2), including tablet and mobile.
3. **Hero legend + immersive mode** (§3.3–3.4): template, CSS, small JS for the header class.
4. **Sidebar, TOC, grid, footer, back-to-top** (§4).
5. **Typeset + components** (§5).
6. **Zé** (§6).
7. **QA pass:** every QA page at 1440 / 834 / 390, both schemes, keyboard-only, `prefers-reduced-motion`, print. Measure contrast on real renders — especially header text over the p5 sketch and the video hero.

**QA pages:**
- `/classes/` — home, 100vh sketchbook hero
- `/classes/DesignDeInovacao/` — light photo
- `/classes/DesignDeInovacao/Sumarios/aula1/` — dark p5 sketch
- `/classes/Recursos/` — video, 100vh, centred
- `/classes/DesignDeProdutoIV/Galeria/` — gallery, archived course
- `/classes/DesignDeProdutoEInteracao/Sumarios/aula2/` — attachment
- one Calendário page — Gantt
- any page without a hero

---

## 9. Open items for André (don't invent these)
- Zé onboarding prompt texts: the mockups show `[Pergunta da turma]` and `[Pergunta da cadeira]`. Keep the current strings.
- Copy for the empty-gallery state.
- Whether H2 numbering is on by default.
- The two derived hover shades (§2).
- The 👋 in Zé's greeting: keep or drop.
