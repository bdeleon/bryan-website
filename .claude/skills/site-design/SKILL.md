---
name: site-design
description: >-
  The visual design system of bryandeleon.com (a software engineer's
  portfolio + resume) and the rules for changing it. Use this skill whenever
  the task touches how the site looks: style.css, colors, fonts, spacing,
  layout, sections of index.html or resume.html, buttons, the timeline,
  animations, responsive/mobile fixes, accessibility or contrast. Read it
  before "make the site look better" requests — the goal is refinement within
  the current editorial system, not another redesign.
---

# Site design system

**Audience:** engineering leaders and hiring managers deciding whether to
talk to Bryan. **Feel:** warm, editorial, considered — a well-set printed
page rather than a tech template. The design was rebuilt in this direction
in commit `b92cfca` ("editorial sophistication"); an earlier dark
"blueprint" theme (`--ink`, `--steel`, `--signal`, Unbounded) is gone, and
any notes describing it are obsolete.

Hand-written files, no build step, no framework:

- `index.html` + `style.css` + `script.js` — the homepage.
- `resume.html` + `resume.css` — **separate from the homepage styles**:
  `resume.css` has its own copy of the palette under different names
  (`--text`, `--muted`, `--light`, `--accent`, plus `--sidebar-*` for the
  dark sidebar) and its own `@media print` rules. It does not load
  `style.css`. A palette or font change has to be made in both stylesheets,
  mapped by value. Never move these styles back inline — the CSP blocks
  inline styles in production (see the `deploy-and-pages` skill).

## Tokens (`:root` in `style.css`)

| Token | Value | Use |
|---|---|---|
| `--bg` | #faf8f3 | Page background (warm cream) |
| `--bg-offset` | #f3ede5 | Alternate section background |
| `--surface` | #fff | Cards |
| `--text-primary` | #2c2c28 | Headings, body (13.2:1) |
| `--text-secondary` | #6b6b64 | Supporting text (5.1:1 on bg, 4.6:1 on bg-offset) |
| `--text-muted` | #a8a8a0 | **Decorative only** — 2.3:1, fails AA as text |
| `--accent-warm` | #a0523d | Primary accent: labels, primary button, links (5.3:1) |
| `--accent-gold` | #b8956a | Trading-era timeline tint, rules — **not for text** (2.6:1) |
| `--accent-deep` | #2d5016 | Deep green secondary accent (8.7:1) |
| `--border-light` / `--border-medium` | #e8e4dc / #ddd8d0 | Separation |
| `--radius` | 8px | All corners |
| `--transition` | 0.3s ease | All transitions |

Use tokens; don't add raw hex values or a new accent.

**Known issue:** `--text-muted` is currently used as a text color in ~10
places (`grep -n "color: var(--text-muted)" style.css`). Don't add more; when
touching those rules, move them to `--text-secondary`.

## Typography

- `--font-serif` **Crimson Text** — `h1`–`h3` (base rule) and `.section-title`.
- `--font-sans` **Source Sans 3** — body, buttons.
- `--font-mono` **JetBrains Mono** — `.section-label` eyebrows (tiny, tracked,
  uppercase, `--accent-warm`).
- Loaded from Google Fonts in each HTML file's `<head>`. `resume.html` loads
  only Crimson Text and Source Sans 3; `index.html` adds JetBrains Mono.

## Components to reuse

- Section header: `.section-label` (mono eyebrow) → `.section-title` (serif).
- Buttons: `.btn` + `.btn-primary` (solid `--accent-warm`, inverts on hover)
  or `.btn-outline`. Hover lifts `translateY(-2px)`.
- Timeline (`#experience`): `.timeline-content` cards; `.timeline-condensed`
  (dashed border, transparent) for older roles; **`.timeline-era-trading`**
  tints the 2006–2014 trading-floor years with `--accent-gold` at low alpha —
  this trading → engineering arc is the site's signature; keep it distinct.
- Hero: inline SVG "system diagram" (nodes + gradient + glow filter) in
  `#hero` — the other signature element.
- Motion: `.fade-in` elements revealed by an IntersectionObserver in
  `script.js`; `.stat-number[data-target]` count up.

## Rules

- **Reduced motion is not handled yet** (no `prefers-reduced-motion` in
  `style.css` or `script.js`). Anything new that moves must respect it; ideally
  add a global rule that disables `.fade-in` transitions and the counters.
- Breakpoints in use: 1024px, 768px, 480px (max-width, desktop-first). Check
  at 1440, 768 and 390 wide; no horizontal scroll.
- `resume.html` is also a print document — check print preview after
  changing it.
- Keep the hand-written structure: section banners in `style.css`
  (`/* ── NAME ── */`), new rules go in the matching section.

## Verify

No build, so open the files directly (`open index.html`) or serve the
folder (`python3 -m http.server`) and check desktop and mobile widths.
Contrast-check any new color pairing numerically, not by eye.
