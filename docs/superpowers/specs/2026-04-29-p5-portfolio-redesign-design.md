# Portfolio Redesign — P5 Homage

**Date:** 2026-04-29
**Author:** Leon Ngo
**Status:** Design

---

## 1. Direction

Full Persona 5 visual homage adapted to a software engineering portfolio. The aesthetic captures Atlus's signature design vocabulary — high-contrast red/black/cream, dense halftone fields, skewed cutout panels, italic kinetic display typography, rotated stamp tags, and big italic numerals — applied to honest, real content (no flavor-text LARP).

**Replaces:** the current dark zinc + green accent + particle-background editorial layout. The current site reads as "generic modern dev portfolio." The new direction is opinionated and immediately recognizable.

**Audience:** Recruiters and engineering peers reviewing personal site / link from CV. The design is bold and polarizing by intent — it should make recruiters who skim 50 portfolios stop scrolling, while still presenting real, scannable technical information.

**Out of scope for this design doc:**
- Full P5 menu transition animations (All-Out Attack, etc.) — too expensive to build, returns are marginal
- Custom tarot card art per project — every project gets the same arcana visual; project differentiation comes from project content, not custom illustration
- Dropping content sections — keeping current site's structure (Hero, About, Experience, Projects, Contact)

---

## 2. Visual language

### 2.1 Color system

Two themes (`light` and `dark`), both shipped. Theme toggle persists per-user via `localStorage`. Default to system preference (`prefers-color-scheme`).

```
LIGHT (cream paper)
  --bg:           #f4eedc   /* warm cream, off-white */
  --ink:          #0a0606   /* warm near-black */
  --accent:       #e8202a   /* vermillion red */
  --accent-deep:  #b9151e   /* shadow red for offsets */
  --halftone:     #0a0606   /* halftone dot color = ink */

DARK (ink paper)
  --bg:           #0a0606
  --ink:          #f4eedc
  --accent:       #e8202a
  --accent-deep:  #ff3a44
  --halftone:     #f4eedc

SHARED
  --shadow-x:     5px       /* hard offset for solid-color shadows */
  --shadow-y:     5px
```

**Color discipline (matches Atlus):** the accent red is the ONLY accent. No secondary blues/greens/yellows. If a UI state needs to communicate something, use red intensity (filled vs outlined) or mono labels with red prefix/suffix.

### 2.2 Halftone

Implemented as a CSS background layer using `radial-gradient`:

```css
background-image: radial-gradient(circle, var(--halftone) 1.2px, transparent 1.2px);
background-size: 7px 7px;
opacity: 0.07-0.18;     /* density depends on context */
```

Used as:
- Full-page background overlay (subtle, opacity ~0.08)
- Filler inside cutout panels (medium, ~0.18)
- Dense field inside the Tarot card and Stat card (heavy, ~0.55)

Plus a subtle SVG noise/grain layer over light backgrounds (`feTurbulence` filter) for paper texture.

### 2.3 Typography

```
DISPLAY      Inter (Black 900, italic)
              Skewed via CSS transform: skewX(-7deg)
              Used for: hero name, slash banner text, info-card labels (rotated)
              Reasoning: Inter is already a free Google font in the stack-friendly weight; skewing italic gives the kinetic P5 angle without needing a paid foundry font.

BODY         Inter (Regular 400, Medium 500)
              For prose, descriptions, project copy.

MONO         JetBrains Mono (Regular, Bold)
              For: mono labels, system status bars, code snippets, "// MISSION" prefixes,
              section numbers in nav, metadata, terminal-style accents.
              (Already in the current site's stack — keeps font loading lean.)
```

**Drop:** Syne (currently used for headings). It's an editorial sans, not a P5-flavored display font. Inter italic-skewed at black weight does the kinetic display job better.

**Optional upgrade (future):** Migra Italic from Pangram Pangram for display if budget allows. Free for personal use. Sharper italic than Inter Black skewed. Not required for v1.

### 2.4 Type scale (fluid)

```css
--font-display:   clamp(3rem, 8vw, 7.5rem);    /* hero name */
--font-h2:        clamp(2rem, 5vw, 4.5rem);    /* section heads */
--font-h3:        clamp(1.5rem, 3.5vw, 2.5rem);
--font-slash:     clamp(0.95rem, 1.6vw, 1.4rem); /* slash banner text */
--font-body:      clamp(0.95rem, 1.1vw, 1.05rem);
--font-label:     clamp(0.6rem, 0.8vw, 0.75rem); /* mono labels */
```

### 2.5 Shadow system

P5's signature is **hard solid offsets, never blur**.

```css
--shadow-card:    8px 8px 0 var(--accent);
--shadow-card-sm: 5px 5px 0 var(--accent);
--shadow-text:    4px 4px 0 var(--accent);
--shadow-text-sm: 3px 3px 0 var(--accent);
```

Used on: tarot card, info card, stamp, slash panel, hero name (text-shadow).

### 2.6 Skew system

```css
--skew-x:    -7deg;        /* "italic" skew on panels */
--skew-y:    -3deg;         /* diagonal banner skew (slash) */
--rotate-stamp: -7deg;      /* stamp tilt */
--rotate-tarot: -3deg;      /* tarot card tilt */
```

Anything that should feel kinetic (panel, stamp, banner) uses these.

---

## 3. Page structure

Same single-page editorial structure as current site, with sections:

| # | Section | Notes |
|---|---------|-------|
| 01 | Index (Hero) | Full-fidelity P5 hero — designed in mockup |
| 02 | Work / Projects | P5-styled project cards (skewed panels with halftone, project metadata in mono) |
| 03 | About | Stat Card on the right + prose on the left + skill tags |
| 04 | Experience | Skewed cards listing roles, time-coded mono labels |
| 05 | Contact | Big slash CTA + contact links + resume button |

Plus persistent **TopBar** (system status: location, available-for-work, section indicator) and **BottomNav** (numbered section nav: 01 Index, 02 Work, 03 About, 04 Contact).

---

## 4. Hero (Index) — detailed spec

The reference mockup is the final desktop layout. Implementation must be **responsive**, not hardcoded to 640px height.

### 4.1 Layout (desktop ≥1024px)

```
┌──────────────────────────────────────────────────────┐
│ TOPBAR: ★ SYSTEM·ACTIVE   SYDNEY·2026   [INDEX 01/04]│
├──────────────────────────────────────────────────────┤
│  ▸ 01 / Index                                         │
│  LEON                                  ┌──TAROT─┐     │
│  NGO!                                  │ — X —  │     │
│  Software Engineer //                  │ ◇  X   │     │
│   distributed systems · dev tools      │THE     │     │
│                                        │ENGINEER│     │
│  ╲╲ DISTRIBUTED SYSTEMS · CLOUD ╲╲     │L. NGO  │     │
│        ╲╲ ·DEV TOOLS  ╲╲                └────────┘     │
│  ┌──MISSION──┐ ┌─★ROOT─★                              │
│  │  CURRENT  │  ACCESS                                │
│  │  MISSION  │  GRANTED                               │
│  │  .NET 10..│                                        │
│  └───────────┘                                        │
│                                                       │
│ "04" watermark numeral fading bottom-left bg          │
├──────────────────────────────────────────────────────┤
│ MENU: ▸01 INDEX · 02 WORK · 03 ABOUT · 04 CONTACT     │
└──────────────────────────────────────────────────────┘
```

**Z-index layering (final from mockup):**
| Layer | Element | z |
|---|---|---|
| chrome | TopBar / BottomNav | 10 |
| cluster | Mission card + ROOT ACCESS stamp | 6 |
| tarot | Tarot card | 6 |
| name | LEON NGO display + role | 5 |
| slash | Diagonal cream banner | 3 |
| watermark | "04" background numeral | 1 |

The slash sits **behind** the tarot and the mission cluster — both visually rest on top of it, creating the layered look.

### 4.2 Hero responsive behavior

- **Min height:** `100dvh` (full viewport, accounting for mobile browser chrome)
- **Max height:** `min(100dvh, 800px)` so it doesn't get absurd on ultrawide
- All absolute positions use `clamp()` or `vw`/`vh` units, not fixed `rem`
- The tarot card scales: `width: clamp(160px, 18vw, 240px)`, height auto via aspect-ratio
- Mockup-style precise positioning is fine on `≥1280px`; tablets use a stacked-but-still-P5 variant; phones use the dedicated mobile layout (next section)

### 4.3 Hero (mobile, <768px)

Already designed in mockup. Structure:

```
TOPBAR (≡  SYDNEY·2026  [01/04])
NAME ZONE
  ▸ 01 / Index
  LEON
  NGO!
  Software Engineer · dist. systems
SLASH (full-width centered text)
TAROT (centered, 165×240)
ROOT ACCESS stamp (rotated, top-right of info card)
INFO CARD (full-width)
BOTTOM NAV (4 evenly-spaced items, no ESC)
```

Min hero height: `100dvh` (or `100svh` to avoid bouncing with mobile browser chrome).

---

## 5. Other sections

### 5.1 Work / Projects

Each project is a **skewed cream card** with:
- Project number (01, 02, 03 in big italic display, top-left as background watermark)
- Halftone-treated thumbnail or pattern
- Project title in italic skewed display
- Mono-typed tech stack tags
- Brief description in body
- "READ MORE ↗" or external link with red arrow

Cards use the same shadow system (`8px 8px 0 var(--accent)`). Featured project gets a full-width card; secondary projects in 2-column grid (collapsing to 1 column on mobile).

### 5.2 About

Two-column layout (collapses to one on mobile):
- **Left column:** Section label `▸ 02 / About`, italic display heading, prose paragraph, skill tags as skewed mono pills
- **Right column:** Stat Card showing skill bars (CLOUD, .NET, K8s, JAVA, TYPE, EMBED.) with `RANK · 04`, "★ CONFIDANT", "// THE ENGINEER · CODENAME · ROOT" subtitle, "★ ROOT ACCESS GRANTED ★" footer

The Stat Card is a P5 character profile metaphor — but the content is real (actual proficiency-rated skills, not invented stats).

### 5.3 Experience

List of roles as skewed cards. Each shows:
- Time range as mono label (e.g., `2024 — PRESENT`)
- Company in italic skewed display
- Role title
- Bullet points of impact

### 5.4 Contact

Full-width slash banner with `INTERESTED IN WORKING TOGETHER?` as the headline, then:
- Email link (large, red on hover with shadow glow)
- Social links (GitHub, LinkedIn) as skewed mono pills
- Download Resume button as skewed cream card with red shadow

---

## 6. Reusable components

The site is built from a small kit of reusable React/TSX components:

| Component | Purpose | Props |
|---|---|---|
| `<TopBar />` | System status bar | `section: string, location: string, year: number, status: string` |
| `<BottomNav />` | Numbered section nav | `sections: {n, label}[], current: number` |
| `<AngledPanel />` | Skewed cream panel with hard red shadow | `direction?: 'h' \| 'v', children, size?` |
| `<StampTag />` | Rotated stamp with red border + stars | `text: string, rotate?: number` |
| `<InfoCard />` | Skewed mission card with mono content | `label?: string, children` |
| `<TarotCard />` | The Engineer arcana card | (no props — uses static branding) |
| `<StatCard />` | P5 character profile | `name, role, codename, stats: {label, value}[]` |
| `<HeroName />` | Big italic skewed display name | `first, last, exclamation?: boolean` |
| `<SectionLabel />` | Mono uppercase section label with `▸` | `number: string, label: string` |
| `<DiagonalSlash />` | Full-width skewed banner | `children, align?: 'left' \| 'center' \| 'right'` |
| `<Watermark />` | Background numeral | `number: string, position?: 'bl' \| 'br' \| ...` |
| `<HalftoneField />` | Halftone dot pattern wrapper | `density?: 'subtle' \| 'medium' \| 'heavy'` |

Most components are pure CSS-in-Tailwind with no JS. Animations (text reveals, scroll triggers) are layered on top via Motion (already installed).

---

## 7. Tech stack changes

### Add
- **`lenis`** — smooth scroll. Non-negotiable for editorial-bold sites. Wired in once at the layout level.

### Keep
- `next` (16.1.6) and `react` (19.2.3) — current
- `motion` (12.35.2) — for char-by-char reveals, scroll triggers, theme transition
- `tailwindcss` v4 — keep, just rewrite `globals.css` theme tokens
- `@tsparticles/*` — REMOVE. Particle background is the wrong vocabulary for this aesthetic

### Drop
- `@tsparticles/engine`, `@tsparticles/react`, `@tsparticles/slim` — particle background goes
- Syne font (replace with Inter for display)

### Fonts
- `Inter` (Google Fonts, weights 400, 500, 900 + 900 italic)
- `JetBrains Mono` (already in current site, keep)
- Drop `Syne`, `DM Sans`

---

## 8. Animations

Light, deliberate. P5 itself uses fast cuts and skewed reveals.

### Hero entrance (page load)
- Top bar slides down from `-100%` to `0` (200ms)
- Tarot card scales in from `0.9` + rotate from `-8deg` to `-3deg` (300ms ease-out)
- LEON NGO display slides in from `-30px` X with skew exaggeration (400ms)
- Slash panel **slides in from left** (`translateX(-100%)` to `0`), text reveals after panel lands (500ms)
- Mission card + stamp fade in (300ms)
- Bottom menu slides up from `100%` (200ms)

Stagger sequence: 0ms topbar → 100ms tarot → 200ms name → 400ms slash → 600ms cluster → 800ms menu.

### Scroll behavior
- `lenis` smooth scroll across the whole site
- Section enter animations: fade + slight up-translate as they enter viewport (Motion `whileInView`)
- Per-character text reveals on display headings using Motion's `staggerChildren`

### Hover (the P5 "zoom" feel)

P5's signature interactive feedback: elements **scale up slightly** + skew softens + shadow grows. Combined, it gives that distinctive "snap forward" feel you get when navigating P5 menus. Used everywhere interactive.

```css
/* Universal hover transition */
transition:
  transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1.05),
  box-shadow 180ms ease-out;
```

The slight overshoot in the easing curve is what makes it feel snappy / P5 instead of soft.

Per-component hover spec:

| Element | Default | Hover / Focus |
|---|---|---|
| **Tarot card** | `rotate(-3deg)` + `8px 8px 0` shadow | `rotate(-1.5deg) scale(1.04)` + `12px 12px 0` shadow |
| **Project cards** | `skewX(-7deg)` + `6px 6px 0` shadow | `skewX(-5deg) scale(1.03)` + `10px 10px 0` shadow |
| **Stamp tags** | `rotate(-7deg)` | `rotate(-3deg) scale(1.08)` |
| **Info card** | `skewX(-7deg)` + `6px 6px 0` shadow | `skewX(-7deg) scale(1.02)` + `10px 10px 0` shadow |
| **Buttons / CTA** | flat | `scale(1.05)` + red glow shadow `0 0 24px rgba(232,32,42,0.5)` |
| **Bottom nav items** | flat | `scale(1.06) translateY(-2px)` + red underline slides in left-to-right |
| **Cmd+K palette items** | flat | `scale(1.02) translateX(4px)` + red bullet `▸` appears on left |
| **Anchor links** | underline | `scale(1.04)` + red underline + `↗` arrow translates `2px 2px` |
| **Theme toggle** | flat | `rotate(180deg) scale(1.1)` (the icon spins on toggle) |

**Active / selected** state (e.g., current section in nav, selected command in palette):
- Same scale as hover, plus persistent red color/border
- Pulsing shadow animation (subtle, 2s loop) to indicate "live"

**`prefers-reduced-motion`**: scale/translate disabled, only color and shadow changes apply.

This pattern is also used by Lenis-driven scroll reveals — sections "snap forward" with a small scale animation as they enter the viewport (`opacity: 0 → 1`, `scale: 0.97 → 1`, `translateY: 16px → 0`) on the same easing curve.

### Out of scope (for v1)
- All-Out Attack overlay
- Custom cursor
- Page transition with skewed wipe

These can be added later but cost > value for v1.

---

## 9. Responsive strategy

### Breakpoints
- `mobile` (default): <768px
- `tablet`: 768–1023px
- `desktop`: 1024–1535px
- `wide`: ≥1536px

### Hero behavior
- **mobile**: stacked layout designed in mockup (name → slash → tarot → mission/stamp → menu)
- **tablet**: simplified version of desktop — same elements, tarot smaller, mission card and slash horizontal but shorter text
- **desktop**: full mockup layout, exact composition
- **wide**: same as desktop but with larger max-width container so things don't sprawl on ultrawide

### Key responsive patterns
- All type sizes use `clamp()` for fluid scaling
- Card sizes use `clamp(min, vw, max)` so they stay proportional
- Skew angles stay constant (don't reduce on mobile — that's the aesthetic)
- Halftone density stays constant — but background-size scales slightly with vw for visual consistency on retina

---

## 10. Accessibility

- Color contrast checked: cream/ink combos pass WCAG AA. Red on cream passes AA for large text but NOT body — body text uses ink, not red, on cream backgrounds.
- Skewed text via `transform` is fine — screen readers read the underlying text. `<h1>` etc. semantics preserved.
- `prefers-reduced-motion`: disable lenis smooth scroll, disable entrance animations, keep static layout.
- Focus rings on all interactive elements — red glow with cream/ink fallback.
- Tarot card SVG includes `<title>` for screen readers ("Leon Ngo — The Engineer").
- Theme toggle is keyboard-accessible (existing Cmd+K palette can include "toggle theme" command).

---

## 11. SEO / metadata

- Update OG image (`/og-image.png`) to match new aesthetic — render the hero (or a stylized version) at 1200×630.
- Site title and meta description stay (already accurate).
- Add `theme-color` meta for both light and dark modes.

---

## 12. Implementation phases

The plan (next step) will detail these. Outline:

1. **Theme & utilities** — globals.css token rewrite, halftone CSS utility, skew/shadow CSS variables, font swap (Inter + JetBrains Mono)
2. **Layout chrome** — TopBar, BottomNav, theme toggle, lenis integration, layout.tsx skeleton
3. **Reusable components** — AngledPanel, StampTag, InfoCard, HalftoneField, SectionLabel, Watermark
4. **Hero / Index** — full assembly using component kit, responsive at all breakpoints
5. **About + Stat Card** — TarotCard component + StatCard component
6. **Work / Projects** — P5 project cards
7. **Experience + Contact** — final sections
8. **Animations** — entrance choreography, scroll reveals, hover states
9. **Polish** — accessibility audit, OG image, theme toggle persistence, lighthouse run

---

## 13. Decisions locked in

| Decision | Value |
|---|---|
| Direction | Full P5 homage |
| Themes | Both light + dark, theme toggle |
| Stamp catchphrase | `ROOT ACCESS GRANTED` |
| Silhouette / brand mark | Tarot Card (`X · THE ENGINEER`) primary + Stat Card on About |
| Watermark numeral | `04` (years coded) |
| Tarot Roman numeral | `X` (major arcana) |
| Display font | Inter Black Italic (skewed) — drop Syne |
| Body font | Inter |
| Mono font | JetBrains Mono (keep) |
| Smooth scroll | Add `lenis` |
| Particle background | Remove (`@tsparticles/*` packages) |
| Sections | Same as current: Index, Work, About, Experience, Contact |
| Stamp text in hero | `ROOT ACCESS GRANTED` |
| Slash text in hero | `DISTRIBUTED SYSTEMS · CLOUD · DEV TOOLS` (centered) |

---

## 14. Open questions (resolve during plan, not now)

- Theme toggle UI: small button in TopBar vs Cmd+K command vs auto-only? **Recommend:** small icon button in TopBar, with Cmd+K command also.
- Resume PDF: link to existing or regenerate styled to match? **Recommend:** keep current PDF for now, regenerate for v2.
- Project thumbnails: keep as-is or restyle with halftone treatment? **Recommend:** keep as-is for v1, halftone overlay added via CSS, no asset rework needed.
- Cmd+K command palette: keep existing, just restyle? **Recommend:** keep existing, restyle with cream/red P5 panel look.
