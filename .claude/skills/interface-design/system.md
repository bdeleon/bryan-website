# Bryan DeLeon Portfolio — Design System

## Intent

**Who**: Engineering leaders, CTOs, other senior engineers evaluating a systems engineer.

**What they must accomplish**: Assess whether this person can architect systems, ship reliably, and think clearly under pressure.

**Feel**: Technical precision + earned judgment. Cold clarity (systems thinking) + warmth (rare trading floor background). Reliable, intentional, no fluff.

---

## Domain & Metaphor

This portfolio lives in the world of **systems engineering**: precision, interconnection, reliability, and the judgment earned from high-stakes environments.

- **Systems thinking** — Everything is connected; careful about dependencies
- **Precision under pressure** — Trading floors taught this; engineering proves it
- **Integration** — Threading together complex systems across companies
- **Reliability** — Things that *have* to work
- **Evolution** — Trading → Engineering is THE story, not hidden

---

## Color World

**Blueprint/workshop aesthetic** — Dark background with precise accent colors, like an engineer's workspace or a blueprint with highlighted details.

| Token | Value | Purpose | Metaphor |
|-------|-------|---------|----------|
| `--ink` | #eeeef3 | Primary text | Precise marks on paper |
| `--ink-secondary` | #7878a0 | Supporting text | Lighter annotation |
| `--ink-dim` | #44444e | Disabled/metadata | Faded reference |
| `--steel` | #111114 | Primary surface | Technical, solid |
| `--steel-raised` | #18181c | Elevated surface | Layered structure |
| `--grid-line` | #232328 | Borders | Grid lines on blueprint |
| `--signal` | #4f46e5 | Accent/highlight | Focused attention |
| `--signal-mid` | #6366f1 | Accent hover | Interactive emphasis |
| `--signal-bright` | #818cf8 | Labels/bright | Marker color |

**Trading era accent**: `rgba(217, 119, 6, 0.XX)` — warm orange/brown, distinct from the signal blue. Used only for the trading floor timeline items (2006-2014) to visually separate that chapter.

---

## Signature Elements

### 1. System Architecture Hero
The hero section uses an SVG system diagram instead of decorative orbs:
- Grid lines and nodes arranged in a technical pattern
- Animated nodes that float subtly and pulse at center
- Conveys "builder of systems" before reading any text
- **Only exists for this portfolio** — reflects his specific story

### 2. Trading Era Timeline
Timeline items for the trading floor years (Gelber Group, Hard 8/SIG) have:
- Subtle warm brown background (`rgba(120, 53, 15, 0.08)`)
- Orange-tinted borders on hover (`rgba(217, 119, 6, 0.XX)`)
- Creates visual thread: fast-paced trading floor → systematic engineering
- **Unique to his arc** — the journey is the story

### 3. Intentional Token Names
CSS variables use domain-specific names:
- `--ink` → writing with precision
- `--steel` → technical, reliable
- `--signal` → highlighting what matters
- `--grid-line` → blueprint reference
- Someone reading only the tokens understands the product's world

---

## Typography

- **Display (Headlines)**: Unbounded 800 — Bold, geometric, distinctive. Heavy presence.
- **Sans (Body)**: Inter 400/500 — Clean, technical, readable.
- **Mono (Labels/Code)**: JetBrains Mono — Precise, technical, section markers.

Hierarchy is enforced through weight and size, not just size alone.

---

## Depth Strategy

**Subtle elevation + borders** — No dramatic shadows. Structure emerges through:
- Low-opacity `rgba` borders for separation
- Minimal color shift between elevation levels
- Borders define edges without demanding attention
- Hover states lift slightly (+2-3px translateY)

---

## Spacing

**Base unit**: 8px
- Micro spacing (gaps inside components): 6-8px
- Component spacing: 14-28px
- Section spacing: 48-72px
- Major separation: 100px

Spacing is consistent; no random values.

---

## Component Patterns

### Buttons
- **Primary**: Solid signal color, white text, lifts on hover
- **Outline**: Transparent background, signal border, text color changes on hover
- Both have subtle lift animation (translateY -1px)

### Cards
- Border: `1px solid var(--grid-line)`
- Background: Steel surfaces
- Hover: Border lightens to signal color, lift effect, subtle shadow
- No heavy shadows; structure through border color change

### Timeline
- Vertical line with gradient (signal → border)
- Dots with box-shadow glow (not just filled circles)
- Content boxes have borders, not filled backgrounds
- Trading era items: warm background tint, orange accents

### Tags/Pills
- `--ink-secondary` text on `--steel-raised` background
- Monospace, small, uppercase — metadata styling
- Change color on hover/focus

---

## Interaction Patterns

### Hover States
- Color shift (border/text brighten to signal)
- Lift effect (translateY -1px to -3px depending on component)
- Never: bold color changes, dramatic shadows, sudden jumps

### Focus States
- Signal-colored focus ring (2-4px)
- Visible on interactive elements
- Consistent thickness throughout

### Animations
- Fade-in on scroll: 0.6s ease
- Staggered children: 0.08s increments
- Hover transitions: 0.25s
- Counter animation: 1.2s ease-out
- Never jarring; prefer smooth, predictable easing

---

## What This System Avoids

❌ Generic white/gray cards
❌ Multiple accent colors
❌ Decorative elements that don't mean something
❌ Harsh borders or dramatic shadows
❌ Inconsistent spacing or alignment
❌ Missing hover/focus/disabled states
❌ Purely-decorative animations

---

## When to Update This System

Update this file when:
- Adding new component patterns used 2+ times
- Changing color palette or token meanings
- Shifting the visual intent (feel/metaphor)
- Adding new layout patterns or spacing rules

Do NOT update for:
- One-off page layouts
- Temporary experiments
- Component variants (those go in code)
