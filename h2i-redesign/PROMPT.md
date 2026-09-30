# Paste into Claude Code (from the repo root)

## First message

```
We're implementing a visual redesign of this Zensical site. The full spec is in
design/h2i-redesign/HANDOFF.md; exact colour/type values are in
design/h2i-redesign/tokens/h2i-tokens.css, and the visual targets are the HTML
files in design/h2i-redesign/reference/ (open them in a browser — they are
mockups, not theme code).

Start with Phase 0 of HANDOFF.md only: read zensical.toml, overrides/main.html,
docs/stylesheets/extra.css and docs/javascripts/extra.js, run `zensical serve`,
inspect the real DOM, answer the Phase 0 questions, take baseline screenshots
of the QA pages, then give me a phase-by-phase plan. Don't edit anything yet.
Work on a new branch `redesign-2026`.
```

## Each following phase

```
Do Phase N of HANDOFF.md. When done, screenshot the QA pages at 1440, 834 and
390 in both schemes, put them next to the matching reference pages, list any
deviations and why, then stop for my review.
```

## Add to the project's CLAUDE.md (so future sessions keep the system)

```
## Design system
The site follows the H2I redesign in design/h2i-redesign/ (HANDOFF.md +
tokens/h2i-tokens.css). Use the tokens (--md-* and --h2i-*) — never hard-code
colours or fonts. Accent #1591DC is for indicators only, never small text on
white. Header over heroes is always the frosted-glass version unless the page
sets `hero_tone: dark`. Keep UI strings in pt-PT.
```
