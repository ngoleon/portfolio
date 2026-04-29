# P5 Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Leon Ngo's Next.js 16 portfolio with a Persona 5–homage visual identity (red/black/cream + halftone + skewed cutout panels + italic kinetic display), shipping both light and dark modes, lenis smooth scroll, and a unified component kit, while preserving the existing single-page editorial structure and content.

**Architecture:** Next.js 16 App Router site with Tailwind v4 CSS-first theme tokens. A small kit of reusable React components (`AngledPanel`, `StampTag`, `InfoCard`, `TarotCard`, `StatCard`, etc.) composes each section. Theme tokens are CSS variables driven by a `[data-theme]` attribute on `<html>`; theme state persists via `localStorage`. Lenis wraps the layout for smooth scroll, Motion (already in stack) drives entrance + scroll-reveal + hover animations. No particle background, no Syne, no DM Sans — replaced by Inter (display + body) + JetBrains Mono (labels).

**Tech Stack:** Next.js 16.1, React 19.2, TypeScript 5, Tailwind CSS 4, Motion 12 (`motion/react`), Lenis (`lenis/react`), Inter + JetBrains Mono via `next/font/google`.

**Spec:** [`docs/superpowers/specs/2026-04-29-p5-portfolio-redesign-design.md`](../specs/2026-04-29-p5-portfolio-redesign-design.md)

---

## Testing approach for this project

This is a visual frontend redesign. **Don't write unit tests for purely visual components** — they're noise and create maintenance burden without catching real bugs. Instead, every task ends with this verification loop:

1. **Type check:** `npm run build` (Next.js runs `tsc` as part of build) — must succeed
2. **Lint:** `npm run lint` — must pass with zero errors
3. **Visual verify:** Run `npm run dev` and check the dev server in a browser at `http://localhost:3000` — the change must render correctly at desktop (≥1280px), tablet (~900px), and mobile (~375px) widths

For **interactive behavior** (theme toggle, Cmd+K palette, smooth scroll, hover states), verify manually in the browser:
- Theme toggle: click → palette flips immediately, persists across page reload
- Cmd+K / Ctrl+K: opens palette, ESC closes, arrow keys navigate, Enter triggers
- Smooth scroll: scroll feels eased, no jitter
- Hover: cards scale/skew/grow shadow per spec §8

Commit at the end of each task. Frequent commits make rollback cheap if a step misfires.

---

## File structure

### Files created

```
src/
  components/
    providers/
      LenisProvider.tsx           — smooth scroll wrapper
      ThemeProvider.tsx           — theme state + persistence
    chrome/
      TopBar.tsx                  — system status bar (top of every page)
      BottomNav.tsx               — numbered section nav (bottom of every page)
      ThemeToggle.tsx             — light/dark switcher (icon button)
    ui/
      AngledPanel.tsx             — skewed cream panel with hard red shadow
      StampTag.tsx                — rotated red-bordered stamp with stars
      InfoCard.tsx                — skewed mission card with mono content
      HalftoneField.tsx           — halftone dot pattern wrapper
      SectionLabel.tsx            — mono uppercase label (replaces existing)
      Watermark.tsx               — background numeral
      HeroName.tsx                — italic skewed display name with offset shadow
      DiagonalSlash.tsx           — full-width skewed banner with text
      TarotCard.tsx               — "X · THE ENGINEER" arcana brand mark
      StatCard.tsx                — P5 character profile (skill bars)
      ProjectCardP5.tsx           — restyled project card
      ExperienceCardP5.tsx        — restyled experience card
  hooks/
    useReducedMotion.ts           — wrapper around Motion's hook
  data/
    stats.ts                      — stat card skill data
    sections.ts                   — section metadata (numbers, labels) for nav
docs/
  superpowers/
    plans/
      2026-04-29-p5-portfolio-redesign.md  — this file
```

### Files modified

```
package.json                      — add lenis, drop @tsparticles/*, swap fonts
src/app/globals.css               — full theme rewrite (tokens, halftone, utilities)
src/app/layout.tsx                — fonts + providers + chrome
src/app/page.tsx                  — full hero + sections rebuild
src/app/template.tsx              — verify still works with new layout
src/app/not-found.tsx             — restyle to match
src/components/ScrollReveal.tsx   — refresh easing/timing per spec §8
src/components/Footer.tsx         — restyle to match
src/components/CommandPalette.tsx — restyle (keep behavior, swap visuals)
src/components/ClientProviders.tsx — wire new providers
.gitignore                        — already updated for .superpowers/
```

### Files deleted

```
src/components/Navigation.tsx           — replaced by TopBar + BottomNav
src/components/CursorGradient.tsx       — wrong vocabulary for this aesthetic
src/components/ParticleBackground.tsx   — particles dropped
src/components/ProfilePhoto.tsx         — not used in P5 layout (TarotCard takes its role)
src/components/TextDecrypt.tsx          — replaced by Motion-driven char reveals on display text
src/components/ProjectCard.tsx          — replaced by ProjectCardP5
src/components/ExperienceCard.tsx       — replaced by ExperienceCardP5
src/components/SectionLabel.tsx         — replaced by ui/SectionLabel.tsx (new design)
```

---

# Phase 0: Setup & cleanup

Goal: clean dependency state, no broken imports, build passes. After this phase, `npm run build` succeeds with the existing pages intact (they'll still look like the old site — the visual rebuild starts in Phase 1).

### Task 0.1: Snapshot current state with a tag

**Files:**
- No file changes — git operation only

- [ ] **Step 1: Create a tag for the current `master` so we can compare later**

```bash
git tag -a pre-p5-redesign -m "Snapshot before P5 redesign" master
```

- [ ] **Step 2: Verify tag**

Run: `git tag -l pre-p5-redesign`
Expected: prints `pre-p5-redesign`

### Task 0.2: Update package.json — add lenis, drop tsparticles

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace dependencies**

Open `package.json`. Replace the `dependencies` block with:

```json
"dependencies": {
  "lenis": "^1.1.20",
  "motion": "^12.35.2",
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3"
}
```

(Removes `@tsparticles/engine`, `@tsparticles/react`, `@tsparticles/slim`. Adds `lenis`. Keeps everything else.)

- [ ] **Step 2: Reinstall**

Run: `npm install`
Expected: success, lockfile updated, `node_modules/lenis/` present, no `node_modules/@tsparticles/`

- [ ] **Step 3: Verify lenis is installed**

Run: `ls node_modules/lenis/dist`
Expected: contains `.js` files (CJS + ESM) and `.d.ts` types

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add lenis, drop @tsparticles/*"
```

### Task 0.3: Delete unused components

**Files:**
- Delete: `src/components/CursorGradient.tsx`
- Delete: `src/components/ParticleBackground.tsx`

- [ ] **Step 1: Find any imports of these files**

Run: `grep -rn 'CursorGradient\|ParticleBackground' src/`

Expected: matches in `src/components/ClientProviders.tsx` (and possibly others). Note them.

- [ ] **Step 2: Delete the files**

```bash
rm src/components/CursorGradient.tsx
rm src/components/ParticleBackground.tsx
```

- [ ] **Step 3: Update `src/components/ClientProviders.tsx`**

Read the existing file first, then replace with this minimal version (we'll add Lenis + Theme providers in Phase 2):

```tsx
'use client';

import CommandPalette from './CommandPalette';

export default function ClientProviders() {
  return (
    <>
      <CommandPalette />
    </>
  );
}
```

- [ ] **Step 4: Verify no broken imports**

Run: `grep -rn 'CursorGradient\|ParticleBackground' src/`
Expected: zero matches

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: success

- [ ] **Step 6: Commit**

```bash
git add src/components/ClientProviders.tsx
git rm src/components/CursorGradient.tsx src/components/ParticleBackground.tsx
git commit -m "chore: remove cursor-gradient and particle-background components"
```

### Task 0.4: Verify dev server runs cleanly

**Files:**
- No file changes

- [ ] **Step 1: Start dev server**

Run: `npm run dev` (in a separate terminal, or as a background process)

- [ ] **Step 2: Open browser to http://localhost:3000**

Verify:
- Page loads without console errors
- All sections render (Hero, About, Experience, Projects, Contact)
- No broken imports
- Cmd+K still opens the palette

- [ ] **Step 3: Stop dev server**

Press Ctrl+C in the dev terminal.

---

# Phase 1: Theme system (globals.css)

Goal: replace zinc + green tokens with red/black/cream tokens. Add halftone CSS utility. Add skew/shadow CSS variables. Site still uses old fonts but new colors are wired up.

### Task 1.1: Rewrite globals.css with new theme tokens

**Files:**
- Modify: `src/app/globals.css` (full rewrite)

- [ ] **Step 1: Read current globals.css**

Use Read tool on `src/app/globals.css` to confirm current content (already shown in spec context).

- [ ] **Step 2: Replace globals.css contents entirely**

```css
@import "tailwindcss";

/* ================================================================
   THEME TOKENS — light + dark via [data-theme] on <html>
   ================================================================ */

@theme {
  /* Default (light) — overridden by [data-theme="dark"] below */
  --color-bg:           #f4eedc;     /* warm cream paper */
  --color-ink:          #0a0606;     /* warm near-black */
  --color-accent:       #e8202a;     /* vermillion red */
  --color-accent-deep:  #b9151e;     /* shadow red */
  --color-halftone:     #0a0606;     /* halftone dot color = ink */

  /* Typography */
  --font-display: var(--font-inter), system-ui, sans-serif;   /* italic black weight, used skewed */
  --font-body:    var(--font-inter), system-ui, sans-serif;
  --font-mono:    var(--font-jetbrains-mono), ui-monospace, monospace;

  /* Skew system — used everywhere */
  --skew-x:        -7deg;
  --skew-y:        -3deg;
  --rotate-stamp:  -7deg;
  --rotate-tarot:  -3deg;

  /* Shadow system — hard solid offsets, never blur */
  --shadow-card:    8px 8px 0 var(--color-accent);
  --shadow-card-md: 6px 6px 0 var(--color-accent);
  --shadow-card-sm: 4px 4px 0 var(--color-accent);
  --shadow-text:    4px 4px 0 var(--color-accent);
  --shadow-text-sm: 3px 3px 0 var(--color-accent);

  /* Easing — the P5 snap-forward overshoot */
  --ease-snap: cubic-bezier(0.2, 0.8, 0.2, 1.05);

  /* Breakpoints (default Tailwind ones are fine; customize if needed) */
}

/* Dark theme overrides — flip bg/ink, brighten accent slightly */
[data-theme="dark"] {
  --color-bg:           #0a0606;
  --color-ink:          #f4eedc;
  --color-accent:       #e8202a;
  --color-accent-deep:  #ff3a44;
  --color-halftone:     #f4eedc;
}

/* ================================================================
   BASE
   ================================================================ */

html {
  background: var(--color-bg);
  color: var(--color-ink);
  /* Prevent layout shift when theme switches */
  color-scheme: light dark;
}

body {
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

/* Focus ring — matches red palette */
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(232, 32, 42, 0.18);
}

/* Reduced motion — disable transforms but keep color/opacity */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

/* ================================================================
   HALFTONE — dot pattern utility
   ================================================================ */

@utility halftone-bg {
  background-image: radial-gradient(circle, var(--color-halftone) 1.2px, transparent 1.2px);
  background-size: 7px 7px;
}

@utility halftone-bg-subtle {
  background-image: radial-gradient(circle, var(--color-halftone) 1px, transparent 1px);
  background-size: 6px 6px;
  opacity: 0.08;
}

@utility halftone-bg-medium {
  background-image: radial-gradient(circle, var(--color-halftone) 1.2px, transparent 1.2px);
  background-size: 6px 6px;
  opacity: 0.18;
}

@utility halftone-bg-heavy {
  background-image: radial-gradient(circle, var(--color-halftone) 1.5px, transparent 1.5px);
  background-size: 5px 5px;
  opacity: 0.55;
}

/* ================================================================
   PAPER GRAIN — SVG turbulence overlay for warmth on light theme
   ================================================================ */

@utility paper-grain {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0.5 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.6'/></svg>");
  mix-blend-mode: multiply;
  opacity: 0.5;
}

[data-theme="dark"] .paper-grain {
  /* Hide grain on dark theme — it muddies the palette */
  display: none;
}

/* ================================================================
   SKEW UTILITIES — shorthand for the P5 skew system
   ================================================================ */

@utility skew-italic {
  transform: skewX(var(--skew-x));
}

@utility skew-banner {
  transform: skewY(var(--skew-y)) skewX(var(--skew-x));
}

@utility skew-banner-counter {
  /* Counter-skew for content inside a skewed container */
  transform: skewX(calc(-1 * var(--skew-x))) skewY(calc(-1 * var(--skew-y)));
}

@utility skew-italic-counter {
  transform: skewX(calc(-1 * var(--skew-x)));
}
```

- [ ] **Step 3: Build to verify Tailwind picks up the tokens**

Run: `npm run build`
Expected: success. (Build will work even though pages still reference old token names — Tailwind's JIT just won't generate classes for missing tokens; we update consumers next.)

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "theme: rewrite globals.css with P5 red/black/cream tokens, halftone utilities, skew system"
```

---

# Phase 2: Fonts + providers (Lenis, Theme)

Goal: replace Syne + DM Sans with Inter, wire up Lenis for smooth scroll, add ThemeProvider with localStorage persistence and SSR-safe defaults.

### Task 2.1: Swap fonts in layout.tsx

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace font imports + body layout**

Replace `src/app/layout.tsx` entirely with:

```tsx
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import ClientProviders from '@/components/ClientProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ngoleon.com'),
  title: {
    default: 'Leon Ngo — Software Engineer',
    template: '%s — Leon Ngo',
  },
  description: 'Software engineer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Leon Ngo — Software Engineer',
    description: 'Software engineer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
    url: 'https://ngoleon.com',
    siteName: 'Leon Ngo',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leon Ngo — Software Engineer',
    description: 'Software engineer building cloud-native microservices, platform infrastructure, and AI-assisted developer tooling.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      // suppressHydrationWarning is required because the ThemeProvider sets data-theme on <html> client-side
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <ClientProviders />
        <main className="min-h-dvh">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success. Type errors about classes like `bg-bg`, `text-ink` mean Tailwind hasn't picked up tokens — re-check `globals.css` syntax.

- [ ] **Step 3: Visual verify**

Run: `npm run dev`. Open `http://localhost:3000`.
Expected: page loads with cream background and dark text. Old layout still rendering but with new colors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "fonts: swap Syne+DM Sans for Inter, wire P5 base body styles"
```

### Task 2.2: Build LenisProvider

**Files:**
- Create: `src/components/providers/LenisProvider.tsx`

- [ ] **Step 1: Create directory**

```bash
mkdir -p src/components/providers
```

- [ ] **Step 2: Write LenisProvider**

Write `src/components/providers/LenisProvider.tsx`:

```tsx
'use client';

import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const reduce = useReducedMotion();

  // When the user prefers reduced motion, render children without Lenis
  if (reduce) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard "expo out" curve
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success. If `lenis/react` import fails, check `node_modules/lenis/package.json` for the actual export path.

- [ ] **Step 4: Commit**

```bash
git add src/components/providers/LenisProvider.tsx
git commit -m "feat(provider): add LenisProvider with reduced-motion guard"
```

### Task 2.3: Build ThemeProvider

**Files:**
- Create: `src/components/providers/ThemeProvider.tsx`

- [ ] **Step 1: Write ThemeProvider**

Create `src/components/providers/ThemeProvider.tsx`:

```tsx
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'ln-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // Default to 'dark' on the server; client effect corrects on mount
  const [theme, setThemeState] = useState<Theme>('dark');

  // Sync with stored/preferred on mount
  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  // Sync data-theme attribute whenever theme changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

- [ ] **Step 2: Add a no-flash inline script for SSR**

Update `src/app/layout.tsx` to inject a small script in `<head>` that sets `data-theme` BEFORE React hydrates, eliminating the flash of wrong theme.

In the existing layout.tsx, replace the `<html>` opening element with:

```tsx
<html
  lang="en"
  className={`${inter.variable} ${jetbrainsMono.variable}`}
  suppressHydrationWarning
>
  <head>
    {/* No-flash theme script: runs before React hydrates */}
    <script
      dangerouslySetInnerHTML={{
        __html: `
          try {
            const stored = localStorage.getItem('ln-theme');
            const t = stored === 'light' || stored === 'dark'
              ? stored
              : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            document.documentElement.dataset.theme = t;
          } catch (e) {}
        `,
      }}
    />
  </head>
  <body className="min-h-dvh bg-bg text-ink antialiased">
    {/* ... */}
  </body>
</html>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/components/providers/ThemeProvider.tsx src/app/layout.tsx
git commit -m "feat(provider): add ThemeProvider with localStorage persistence and no-flash script"
```

### Task 2.4: Wire LenisProvider + ThemeProvider into layout

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/ClientProviders.tsx`

- [ ] **Step 1: Update layout.tsx to wrap with providers**

In `src/app/layout.tsx`, change the body to wrap children with the providers. Replace the body block with:

```tsx
<body className="min-h-dvh bg-bg text-ink antialiased">
  <ThemeProvider>
    <LenisProvider>
      <ClientProviders />
      <main className="min-h-dvh">{children}</main>
    </LenisProvider>
  </ThemeProvider>
</body>
```

Add the imports at the top:

```tsx
import ThemeProvider from '@/components/providers/ThemeProvider';
import LenisProvider from '@/components/providers/LenisProvider';
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Visual verify smooth scroll**

Run: `npm run dev`. Open `http://localhost:3000`. Scroll the page with mouse wheel.
Expected: scroll feels smoothed/eased, not native-jumpy. (If reduced-motion is on, scroll should remain native.)

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "layout: wire ThemeProvider + LenisProvider into root layout"
```

### Task 2.5: Build ThemeToggle component

**Files:**
- Create: `src/components/chrome/ThemeToggle.tsx`

- [ ] **Step 1: Create chrome directory**

```bash
mkdir -p src/components/chrome
```

- [ ] **Step 2: Write ThemeToggle**

Create `src/components/chrome/ThemeToggle.tsx`:

```tsx
'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="grid h-8 w-8 place-items-center text-[var(--color-accent)] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-110"
    >
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {theme === 'dark' ? (
          /* Moon */
          <path d="M11 8.5A4.5 4.5 0 0 1 5.5 3 4.5 4.5 0 1 0 11 8.5Z" fill="currentColor" />
        ) : (
          /* Sun */
          <>
            <circle cx="7" cy="7" r="2.5" fill="currentColor" />
            <line x1="7" y1="1" x2="7" y2="2.5" />
            <line x1="7" y1="11.5" x2="7" y2="13" />
            <line x1="1" y1="7" x2="2.5" y2="7" />
            <line x1="11.5" y1="7" x2="13" y2="7" />
            <line x1="2.6" y1="2.6" x2="3.7" y2="3.7" />
            <line x1="10.3" y1="10.3" x2="11.4" y2="11.4" />
            <line x1="2.6" y1="11.4" x2="3.7" y2="10.3" />
            <line x1="10.3" y1="3.7" x2="11.4" y2="2.6" />
          </>
        )}
      </motion.svg>
    </button>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/ThemeToggle.tsx
git commit -m "feat(chrome): add ThemeToggle icon button"
```

---

# Phase 3: Layout chrome — TopBar + BottomNav

Goal: replace the existing Navigation component with TopBar (top status row) and BottomNav (P5 numbered menu). These are persistent across all pages.

### Task 3.1: Create section metadata

**Files:**
- Create: `src/data/sections.ts`

- [ ] **Step 1: Write sections.ts**

Create `src/data/sections.ts`:

```tsx
export interface Section {
  number: string;     // "01"
  label: string;      // "Index"
  href: string;       // "#" or "#about"
}

export const sections: Section[] = [
  { number: '01', label: 'Index',   href: '#'         },
  { number: '02', label: 'Work',    href: '#projects' },
  { number: '03', label: 'About',   href: '#about'    },
  { number: '04', label: 'Contact', href: '#contact'  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/sections.ts
git commit -m "data: add sections metadata for nav"
```

### Task 3.2: Build TopBar component

**Files:**
- Create: `src/components/chrome/TopBar.tsx`

- [ ] **Step 1: Write TopBar**

Create `src/components/chrome/TopBar.tsx`:

```tsx
'use client';

import ThemeToggle from './ThemeToggle';

interface TopBarProps {
  /** Section number/total to display, e.g. "01 / 04" */
  indicator?: string;
  /** Status text on the left, e.g. "★ SYSTEM · ACTIVE" */
  status?: string;
  /** Center text, e.g. "SYDNEY · 2026" */
  center?: string;
}

export default function TopBar({
  indicator = '01 / 04',
  status = '★ SYSTEM · ACTIVE',
  center = 'SYDNEY · 2026',
}: TopBarProps) {
  // Split status into label + accent so the "★" star and "ACTIVE" word render in red
  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-[3px] border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-ink)] px-4 sm:px-8 py-2 font-mono text-[0.65rem] sm:text-[0.7rem] tracking-[0.18em] uppercase"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="text-[var(--color-accent)]">★</span>
        <span><span className="text-[var(--color-accent)]">SYSTEM</span> · ACTIVE</span>
      </span>
      <span className="hidden sm:inline">{center}</span>
      <span className="flex items-center gap-3">
        <span className="text-[var(--color-accent)]">[ INDEX {indicator} ]</span>
        <ThemeToggle />
      </span>
    </header>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/TopBar.tsx
git commit -m "feat(chrome): add TopBar with system status and theme toggle"
```

### Task 3.3: Build BottomNav component

**Files:**
- Create: `src/components/chrome/BottomNav.tsx`

- [ ] **Step 1: Write BottomNav**

Create `src/components/chrome/BottomNav.tsx`:

```tsx
'use client';

import Link from 'next/link';
import { sections } from '@/data/sections';

export default function BottomNav() {
  // Note: active-section indicator is added in Phase 6 once we're using Lenis to track scroll progress.
  // For now, the first item is statically marked active.
  return (
    <nav
      aria-label="Section navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 sm:gap-7 border-t-[3px] border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-ink)] px-4 sm:px-8 py-2.5 sm:py-3 font-mono text-[0.65rem] sm:text-[0.75rem] tracking-[0.12em] uppercase"
    >
      {sections.map((s, i) => (
        <Link
          key={s.href}
          href={s.href}
          className={`transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-110 hover:text-[var(--color-accent)] ${
            i === 0 ? 'text-[var(--color-accent)] font-bold before:content-["▸_"]' : ''
          }`}
        >
          {s.number} {s.label}
        </Link>
      ))}
      <span className="ml-auto hidden sm:inline opacity-50 text-[0.65rem]">↗ ngoleon.com</span>
    </nav>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/chrome/BottomNav.tsx
git commit -m "feat(chrome): add BottomNav with numbered P5 sections"
```

### Task 3.4: Replace Navigation with TopBar + BottomNav in layout

**Files:**
- Modify: `src/app/layout.tsx`
- Delete: `src/components/Navigation.tsx`

- [ ] **Step 1: Update layout.tsx imports**

In `src/app/layout.tsx`, replace the `Navigation` import with the chrome components:

```tsx
import TopBar from '@/components/chrome/TopBar';
import BottomNav from '@/components/chrome/BottomNav';
```

(Remove the `import Navigation from '@/components/Navigation';` if present.)

- [ ] **Step 2: Update body markup**

Inside `<LenisProvider>`, replace `<Navigation />` (and the existing `<main>`) with:

```tsx
<TopBar />
<main className="min-h-dvh pt-12 pb-14">{children}</main>
<BottomNav />
```

(`pt-12` clears the TopBar height; `pb-14` clears the BottomNav.)

- [ ] **Step 3: Delete Navigation.tsx and Footer.tsx**

```bash
rm src/components/Navigation.tsx
rm src/components/Footer.tsx
```

(Footer is replaced by BottomNav. If you want a separate copyright/social row, add it later.)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Visual verify**

Run: `npm run dev`. Visit `http://localhost:3000`.
Expected:
- TopBar at top with system status + theme toggle (theme toggle works — click it, palette flips)
- BottomNav at bottom with `01 INDEX  02 WORK  03 ABOUT  04 CONTACT`
- Old hero content still renders between (will rebuild in Phase 6)

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx
git rm src/components/Navigation.tsx src/components/Footer.tsx
git commit -m "layout: replace Navigation with TopBar + BottomNav chrome"
```

---

# Phase 4: Reusable UI primitives

Goal: build the small kit of components that compose every section. Each is a focused, well-bounded unit. Tasks share the same workflow: write component, add a quick visual check (no separate test file), commit.

### Task 4.1: Build HalftoneField component

**Files:**
- Create: `src/components/ui/HalftoneField.tsx`

- [ ] **Step 1: Create ui directory**

```bash
mkdir -p src/components/ui
```

- [ ] **Step 2: Write HalftoneField**

Create `src/components/ui/HalftoneField.tsx`:

```tsx
import type { ReactNode } from 'react';

interface HalftoneFieldProps {
  density?: 'subtle' | 'medium' | 'heavy';
  className?: string;
  children?: ReactNode;
}

export default function HalftoneField({
  density = 'subtle',
  className = '',
  children,
}: HalftoneFieldProps) {
  // Each density maps to one of the @utility classes in globals.css
  const densityClass =
    density === 'heavy'
      ? 'halftone-bg-heavy'
      : density === 'medium'
      ? 'halftone-bg-medium'
      : 'halftone-bg-subtle';

  return (
    <div className={`pointer-events-none absolute inset-0 ${densityClass} ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/HalftoneField.tsx
git commit -m "feat(ui): add HalftoneField primitive"
```

### Task 4.2: Build SectionLabel component

**Files:**
- Create: `src/components/ui/SectionLabel.tsx`
- Delete: `src/components/SectionLabel.tsx` (old version, was zinc-themed)

- [ ] **Step 1: Write new SectionLabel**

Create `src/components/ui/SectionLabel.tsx`:

```tsx
interface SectionLabelProps {
  number: string;   // "01"
  label: string;    // "Index"
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <span className="inline-flex items-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold before:content-['▸_']">
      {number} / {label}
    </span>
  );
}
```

- [ ] **Step 2: Find existing imports of old SectionLabel**

Run: `grep -rn "from '@/components/SectionLabel'" src/`
Expected: matches in `src/app/page.tsx`. Note paths.

- [ ] **Step 3: Delete the old file**

```bash
rm src/components/SectionLabel.tsx
```

- [ ] **Step 4: Update imports — temporary fix to keep build passing**

In `src/app/page.tsx`, update the SectionLabel import path to:

```tsx
import SectionLabel from '@/components/ui/SectionLabel';
```

The old usage was `<SectionLabel>About</SectionLabel>` (children-based). The new component takes `number` + `label` props. **Keep the old usages broken for now** — the page rebuild in Phase 6 will replace all usages. Add a temporary adapter so the build passes:

Actually, simpler: rename the new component's prop interface for now to also accept `children` as a fallback. **Skip this** — instead, comment out the SectionLabel usages in `src/app/page.tsx` to keep build passing:

In `src/app/page.tsx`, replace each `<ScrollReveal><SectionLabel>...</SectionLabel></ScrollReveal>` with a placeholder `{/* SectionLabel placeholder — rebuilt in Phase 6 */}`.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SectionLabel.tsx src/app/page.tsx
git rm src/components/SectionLabel.tsx
git commit -m "feat(ui): add new SectionLabel primitive, comment out old usages until page rebuild"
```

### Task 4.3: Build AngledPanel component

**Files:**
- Create: `src/components/ui/AngledPanel.tsx`

- [ ] **Step 1: Write AngledPanel**

Create `src/components/ui/AngledPanel.tsx`:

```tsx
import type { ReactNode } from 'react';

interface AngledPanelProps {
  /** Skew direction. 'h' = full diagonal (slash banner). 'v' = italic-only (info-card). */
  direction?: 'h' | 'v';
  /** Shadow size. */
  shadow?: 'sm' | 'md' | 'lg';
  /** Inverts colors — bg becomes ink, ink becomes bg. Used for stamp-style dark cards on light theme. */
  inverted?: boolean;
  className?: string;
  children: ReactNode;
}

const shadowClass: Record<NonNullable<AngledPanelProps['shadow']>, string> = {
  sm: 'shadow-[var(--shadow-card-sm)]',
  md: 'shadow-[var(--shadow-card-md)]',
  lg: 'shadow-[var(--shadow-card)]',
};

export default function AngledPanel({
  direction = 'v',
  shadow = 'md',
  inverted = false,
  className = '',
  children,
}: AngledPanelProps) {
  // direction='h' applies skew-banner (skewY + skewX). 'v' applies skew-italic (skewX only).
  const skewClass = direction === 'h' ? 'skew-banner' : 'skew-italic';

  // The counter-skew on the inner wrapper keeps text/content upright while the panel is skewed.
  const counterSkewClass = direction === 'h' ? 'skew-banner-counter' : 'skew-italic-counter';

  const colors = inverted
    ? 'bg-[var(--color-ink)] text-[var(--color-bg)]'
    : 'bg-[var(--color-bg)] text-[var(--color-ink)]';

  return (
    <div className={`${skewClass} ${shadowClass[shadow]} ${colors} ${className}`}>
      <div className={counterSkewClass}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/AngledPanel.tsx
git commit -m "feat(ui): add AngledPanel primitive (skewed panel with red shadow)"
```

### Task 4.4: Build StampTag component

**Files:**
- Create: `src/components/ui/StampTag.tsx`

- [ ] **Step 1: Write StampTag**

Create `src/components/ui/StampTag.tsx`:

```tsx
interface StampTagProps {
  text: string;
  rotate?: number; // degrees, default -7
  className?: string;
}

export default function StampTag({ text, rotate = -7, className = '' }: StampTagProps) {
  return (
    <span
      className={`inline-block border-[3px] border-[var(--color-accent)] bg-[var(--color-ink)] text-[var(--color-accent)] px-3 py-2 font-display italic font-black text-[0.85rem] tracking-[0.12em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span aria-hidden="true">★</span> {text} <span aria-hidden="true">★</span>
    </span>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/StampTag.tsx
git commit -m "feat(ui): add StampTag primitive"
```

### Task 4.5: Build InfoCard component

**Files:**
- Create: `src/components/ui/InfoCard.tsx`

- [ ] **Step 1: Write InfoCard**

Create `src/components/ui/InfoCard.tsx`:

```tsx
import type { ReactNode } from 'react';
import AngledPanel from './AngledPanel';

interface InfoCardProps {
  /** Optional small uppercase mono label above the body. */
  label?: string;
  className?: string;
  children: ReactNode;
}

export default function InfoCard({ label, className = '', children }: InfoCardProps) {
  return (
    <AngledPanel direction="v" shadow="md" className={`max-w-[320px] ${className}`}>
      <div className="px-5 py-4 font-mono text-[0.78rem] leading-[1.6] tracking-[0.02em]">
        {label && (
          <div className="mb-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            {label}
          </div>
        )}
        {children}
      </div>
    </AngledPanel>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/InfoCard.tsx
git commit -m "feat(ui): add InfoCard primitive"
```

### Task 4.6: Build HeroName component

**Files:**
- Create: `src/components/ui/HeroName.tsx`

- [ ] **Step 1: Write HeroName**

Create `src/components/ui/HeroName.tsx`:

```tsx
interface HeroNameProps {
  first: string;
  last: string;
  /** Whether the trailing punctuation is "!" (energetic) or "." (calm). */
  punct?: '!' | '.';
}

export default function HeroName({ first, last, punct = '!' }: HeroNameProps) {
  return (
    <h1
      className="m-0 font-display italic font-black leading-[0.85] tracking-[-0.05em] origin-left text-[var(--color-ink)]"
      style={{
        fontSize: 'clamp(3rem, 8vw, 7.5rem)',
        transform: 'skewX(var(--skew-x))',
        textShadow: 'var(--shadow-text)',
      }}
    >
      {first}
      <br />
      {last}
      <span
        className="text-[var(--color-accent)]"
        style={{ textShadow: '4px 4px 0 var(--color-ink)' }}
      >
        {punct}
      </span>
    </h1>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/HeroName.tsx
git commit -m "feat(ui): add HeroName display component"
```

### Task 4.7: Build Watermark component

**Files:**
- Create: `src/components/ui/Watermark.tsx`

- [ ] **Step 1: Write Watermark**

Create `src/components/ui/Watermark.tsx`:

```tsx
interface WatermarkProps {
  number: string;
  /** Position within parent. */
  position?: 'bl' | 'br' | 'tl' | 'tr';
  /** Font size override (CSS value). Default uses clamp() for fluid sizing. */
  size?: string;
}

export default function Watermark({
  number,
  position = 'bl',
  size = 'clamp(10rem, 22vw, 22rem)',
}: WatermarkProps) {
  const placement: Record<NonNullable<WatermarkProps['position']>, string> = {
    bl: 'bottom-[-3rem] left-[-1rem]',
    br: 'bottom-[-3rem] right-[-1rem]',
    tl: 'top-[-3rem] left-[-1rem]',
    tr: 'top-[-3rem] right-[-1rem]',
  };

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 select-none font-display italic font-black leading-[0.85] tracking-[-0.07em] text-[var(--color-accent)] ${placement[position]}`}
      style={{
        fontSize: size,
        transform: 'skewX(var(--skew-x))',
        opacity: 0.08,
      }}
    >
      {number}
    </span>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Watermark.tsx
git commit -m "feat(ui): add Watermark numeral component"
```

### Task 4.8: Build DiagonalSlash component

**Files:**
- Create: `src/components/ui/DiagonalSlash.tsx`

- [ ] **Step 1: Write DiagonalSlash**

Create `src/components/ui/DiagonalSlash.tsx`:

```tsx
import type { ReactNode } from 'react';

interface DiagonalSlashProps {
  /** Vertical position from top of parent. CSS value. */
  top?: string;
  /** Banner height. CSS value. */
  height?: string;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Z-index — defaults below the rest of hero content (3) so tarot/cluster sit on top. */
  zIndex?: number;
  className?: string;
  children: ReactNode;
}

export default function DiagonalSlash({
  top = '22rem',
  height = '75px',
  align = 'center',
  zIndex = 3,
  className = '',
  children,
}: DiagonalSlashProps) {
  const justify =
    align === 'left' ? 'justify-start pl-20' :
    align === 'right' ? 'justify-end pr-20' :
    'justify-center';

  return (
    <div
      className={`absolute -left-[5%] -right-[5%] flex items-center bg-[var(--color-bg)] text-[var(--color-ink)] font-display italic font-black tracking-[0.04em] whitespace-nowrap overflow-hidden shadow-[var(--shadow-card)] ${justify} ${className}`}
      style={{
        top,
        height,
        transform: 'skewY(var(--skew-y)) skewX(var(--skew-x))',
        zIndex,
        fontSize: 'clamp(0.95rem, 1.6vw, 1.4rem)',
      }}
    >
      <span>{children}</span>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/DiagonalSlash.tsx
git commit -m "feat(ui): add DiagonalSlash banner component"
```

---

# Phase 5: Identity components — TarotCard + StatCard

These two components carry the brand. They're more involved than the primitives because of the SVG content.

### Task 5.1: Build TarotCard component

**Files:**
- Create: `src/components/ui/TarotCard.tsx`

- [ ] **Step 1: Write TarotCard**

Create `src/components/ui/TarotCard.tsx`:

```tsx
interface TarotCardProps {
  /** Roman numeral / arcana number, default "X" (THE ENGINEER) */
  numeral?: string;
  /** Title underneath, default "THE ENGINEER" */
  title?: string;
  /** Sub-label, default "// ARCANA · X" */
  subtitle?: string;
  /** Owner name at the bottom, default "L. NGO" */
  owner?: string;
  /** Width — controls card size; height auto via aspect ratio. */
  width?: string;
}

export default function TarotCard({
  numeral = 'X',
  title = 'THE ENGINEER',
  subtitle = '// ARCANA · X',
  owner = 'L. NGO',
  width = 'clamp(160px, 18vw, 240px)',
}: TarotCardProps) {
  return (
    <div
      className="relative transition-transform duration-200 ease-[var(--ease-snap)] hover:rotate-[-1.5deg] hover:scale-[1.04]"
      style={{
        width,
        aspectRatio: '200 / 300',
        transform: 'rotate(var(--rotate-tarot))',
        filter: 'drop-shadow(7px 7px 0 var(--color-accent))',
      }}
    >
      <svg
        viewBox="0 0 200 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Leon Ngo — ${title}`}
        className="h-full w-full"
      >
        <title>Leon Ngo — {title}</title>
        <defs>
          <pattern id="tarot-halftone" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill="var(--color-ink)" />
          </pattern>
        </defs>
        {/* Card body */}
        <rect x="6" y="6" width="188" height="288" fill="var(--color-bg)" stroke="var(--color-ink)" strokeWidth="3" />
        <rect x="14" y="14" width="172" height="272" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        {/* Top numeral */}
        <text x="100" y="38" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-ink)" letterSpacing="3" fontWeight="700">
          — {numeral} —
        </text>
        <line x1="40" y1="46" x2="160" y2="46" stroke="var(--color-ink)" strokeWidth="1" />
        {/* Halftone field */}
        <rect x="32" y="60" width="136" height="150" fill="url(#tarot-halftone)" opacity="0.55" />
        {/* Arcana symbol — circle + diamond */}
        <circle cx="100" cy="135" r="46" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <path d="M100 89 L146 135 L100 181 L54 135 Z" fill="var(--color-accent)" />
        <g transform="translate(100 148) skewX(-7) translate(-100 -148)">
          <text x="100" y="148" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="36" fill="var(--color-ink)">
            {numeral}
          </text>
        </g>
        {/* Bottom labels */}
        <line x1="40" y1="225" x2="160" y2="225" stroke="var(--color-ink)" strokeWidth="1" />
        <text x="100" y="248" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="15" fill="var(--color-ink)">
          {title}
        </text>
        <text x="100" y="265" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-accent)" letterSpacing="2.5">
          {subtitle}
        </text>
        <text x="100" y="278" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink)" opacity="0.6" letterSpacing="2">
          {owner}
        </text>
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success. (If SVG attributes throw lint errors about kebab vs camelCase, this format should be camelCase already.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/TarotCard.tsx
git commit -m "feat(ui): add TarotCard brand mark"
```

### Task 5.2: Add stats data

**Files:**
- Create: `src/data/stats.ts`

- [ ] **Step 1: Write stats.ts**

Create `src/data/stats.ts`:

```tsx
export interface Stat {
  label: string;
  value: number; // 0-100
}

export const stats: Stat[] = [
  { label: 'CLOUD', value: 85 },
  { label: '.NET',  value: 90 },
  { label: 'K8S',   value: 78 },
  { label: 'JAVA',  value: 75 },
  { label: 'TYPE',  value: 88 },
  { label: 'EMBED.', value: 65 },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/stats.ts
git commit -m "data: add stats for StatCard"
```

### Task 5.3: Build StatCard component

**Files:**
- Create: `src/components/ui/StatCard.tsx`

- [ ] **Step 1: Write StatCard**

Create `src/components/ui/StatCard.tsx`:

```tsx
import type { Stat } from '@/data/stats';

interface StatCardProps {
  name: string;             // "L. NGO"
  rank: string;             // "04"
  role: string;             // "// THE ENGINEER · CODENAME · ROOT"
  stats: Stat[];
  footer?: string;          // "★ ROOT ACCESS GRANTED ★"
}

export default function StatCard({
  name,
  rank,
  role,
  stats,
  footer = '★ ROOT ACCESS GRANTED ★',
}: StatCardProps) {
  return (
    <div className="relative">
      {/* Red offset shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-accent)]"
        style={{ transform: 'skewX(var(--skew-x)) translate(8px, 8px)' }}
      />
      {/* Skewed card */}
      <div
        className="relative bg-[var(--color-ink)] text-[var(--color-bg)] border-[3px] border-[var(--color-bg)] p-6 box-border"
        style={{ transform: 'skewX(var(--skew-x))' }}
      >
        <div style={{ transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
          {/* Top row: confidant tag + rank */}
          <div className="flex justify-between font-mono text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-accent)] mb-1.5">
            <span>★ CONFIDANT</span>
            <span>RANK · {rank}</span>
          </div>
          <h3 className="m-0 font-display italic font-black text-[1.5rem] leading-none tracking-[-0.03em]">
            {name}
          </h3>
          <p className="font-mono text-[0.7rem] text-[var(--color-bg)] opacity-75 mt-1.5 tracking-[0.05em]">
            {role}
          </p>
          <div className="h-0.5 bg-[var(--color-accent)] my-4" />
          {/* Stat rows */}
          {stats.map((s) => (
            <div
              key={s.label}
              className="grid items-center gap-2 mb-2 text-[0.7rem]"
              style={{ gridTemplateColumns: '70px 1fr 30px' }}
            >
              <span className="font-mono text-[var(--color-accent)] tracking-[0.08em]">{s.label}</span>
              <div className="bg-[var(--color-bg)]/15 h-2 relative">
                <div
                  className="bg-[var(--color-accent)] h-full"
                  style={{ width: `${s.value}%` }}
                />
              </div>
              <span className="font-mono text-[0.65rem] text-right text-[var(--color-bg)]/85">
                {s.value}
              </span>
            </div>
          ))}
          {/* Footer stamp */}
          <div className="mt-3 text-center font-mono text-[0.65rem] text-[var(--color-accent)] tracking-[0.18em] border-t border-[var(--color-bg)]/30 pt-2.5">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/StatCard.tsx
git commit -m "feat(ui): add StatCard P5 character profile"
```

---

# Phase 6: Hero (Index)

Goal: rebuild the home page hero using the component kit. Match the approved mockup.

### Task 6.1: Build the hero composition

**Files:**
- Modify: `src/app/page.tsx` (hero section only)

- [ ] **Step 1: Read current page.tsx**

Use Read tool on `src/app/page.tsx` to see current hero structure.

- [ ] **Step 2: Replace the hero section**

In `src/app/page.tsx`, replace the existing `{/* Hero */}` section with:

```tsx
{/* === HERO / INDEX === */}
<section
  id="index"
  className="relative overflow-hidden"
  style={{ minHeight: '100dvh', maxHeight: '900px' }}
>
  {/* Background watermark numeral */}
  <Watermark number="04" position="bl" />

  {/* Subtle halftone field over whole hero */}
  <HalftoneField density="subtle" />

  {/* Bottom red glow gradient */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2"
    style={{ background: 'linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent)' }}
  />

  {/* === Name zone === */}
  <div
    className="absolute z-[5] max-w-[50%]"
    style={{ top: 'clamp(4rem, 8vh, 6rem)', left: 'clamp(1rem, 4vw, 2.5rem)' }}
  >
    <SectionLabel number="01" label="Index" />
    <div className="mt-2.5">
      <HeroName first="Leon" last="Ngo" punct="!" />
    </div>
    <p
      className="mt-4 font-mono tracking-[0.04em] opacity-85"
      style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)' }}
    >
      Software Engineer{' '}
      <span className="text-[var(--color-accent)]">// distributed systems · dev tools</span>
    </p>
  </div>

  {/* === Tarot card right side === */}
  <div
    className="absolute z-[6]"
    style={{
      top: 'clamp(4rem, 6vh, 5.5rem)',
      right: 'clamp(1rem, 4vw, 2.5rem)',
    }}
  >
    <TarotCard />
  </div>

  {/* === Diagonal slash === */}
  <DiagonalSlash top="clamp(18rem, 36vh, 22rem)" height="clamp(60px, 10vw, 75px)" align="center">
    DISTRIBUTED SYSTEMS{' '}
    <span className="text-[var(--color-accent)]">·</span> CLOUD{' '}
    <span className="text-[var(--color-accent)]">·</span> DEV TOOLS
  </DiagonalSlash>

  {/* === Bottom cluster: mission card + stamp === */}
  <div
    className="absolute z-[6] flex items-end gap-4 sm:gap-6"
    style={{ left: 'clamp(1rem, 4vw, 2.5rem)', bottom: 'clamp(6rem, 12vh, 9.5rem)' }}
  >
    <InfoCard label="// CURRENT MISSION">
      .NET 10 microservices on Azure · K8s · IaC with Terragrunt · AI-assisted dev tooling
    </InfoCard>
    <div style={{ transform: 'translateY(-2rem)' }}>
      <StampTag text="ROOT ACCESS GRANTED" />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add the new imports at the top of page.tsx**

```tsx
import SectionLabel from '@/components/ui/SectionLabel';
import HeroName from '@/components/ui/HeroName';
import TarotCard from '@/components/ui/TarotCard';
import DiagonalSlash from '@/components/ui/DiagonalSlash';
import InfoCard from '@/components/ui/InfoCard';
import StampTag from '@/components/ui/StampTag';
import Watermark from '@/components/ui/Watermark';
import HalftoneField from '@/components/ui/HalftoneField';
```

(Remove old imports of `TextDecrypt`, `ScrollReveal` for the hero section, `ProfilePhoto`. Other sections still need ScrollReveal for now.)

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Visual verify**

Run: `npm run dev`. Open `http://localhost:3000`.
Expected:
- Hero matches the mockup at desktop width (≥1280px)
- TopBar at top, BottomNav at bottom
- LEON NGO! display, tarot card right, slash through middle, mission card + ROOT ACCESS GRANTED stamp bottom-left
- Watermark "04" faint in background
- Theme toggle works (click → flips palette)

- [ ] **Step 6: Visual verify mobile**

In dev tools, switch to mobile viewport (375×667).
Expected: same elements but scale down — name smaller, tarot card narrower, slash text shorter implied by clamp().

NOTE: precise mobile stacking layout is handled in Task 6.2.

- [ ] **Step 7: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(hero): rebuild Hero/Index with P5 component kit"
```

### Task 6.2: Mobile hero — vertical stack layout

**Files:**
- Modify: `src/app/page.tsx`

The desktop hero from 6.1 uses absolute positioning with `clamp()`. On mobile (<768px), elements collide because the viewport is too narrow. Add a media-query-driven mobile variant.

- [ ] **Step 1: Wrap each absolute-positioned hero element with a `hidden md:block` toggle**

In `src/app/page.tsx`, the hero section, change wrapper classes:

- Name zone: keep absolute, but adjust `top` and `max-width` via clamp so it doesn't go off-screen on mobile. Replace its outer `<div>` className with:

  ```tsx
  className="absolute z-[5] max-w-[80%] md:max-w-[50%]"
  ```

- Tarot card: hide on mobile, show stacked variant below
- Slash: keep but adjust height via clamp (already done)
- Cluster (mission + stamp): re-stack vertically on mobile

- [ ] **Step 2: Add a mobile-only stacked layout**

Below the existing absolute-positioned hero elements (still inside the same `<section>`), add a mobile-only layout that overrides positions:

```tsx
{/* Mobile-only adjustments — desktop absolute layout still fires above clamp values, but at <768px we re-stack the tarot and cluster vertically */}
<style jsx>{`
  @media (max-width: 767px) {
    section[id='index'] > div[data-tarot] {
      position: relative;
      top: auto;
      right: auto;
      margin: 1rem auto 0;
      display: block;
    }
    section[id='index'] > div[data-cluster] {
      position: static;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 1rem;
      padding: 0 1rem;
    }
  }
`}</style>
```

Tag the absolute-positioned tarot div and cluster div with `data-tarot` and `data-cluster` attributes so the media query targets them.

- Tarot div add: `data-tarot`
- Cluster div add: `data-cluster`

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Visual verify mobile**

Run: `npm run dev`. Open `http://localhost:3000`. Set viewport to 375×667.
Expected: name on top, tarot card below name (centered), slash banner full-width, mission card + stamp below slash, bottom nav at the bottom.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(hero): add mobile vertical-stack layout"
```

### Task 6.3: Hero entrance animations

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wrap each hero element in motion.div with staggered entrance**

Convert the hero into a Motion-driven entrance sequence. Replace the hero internals as follows.

Add `'use client'` at the top of `page.tsx` (since we're using Motion in a Server Component context this is required).

Replace the static positioned divs with motion variants:

```tsx
import { motion } from 'motion/react';

// ... inside the hero section JSX:

<motion.div
  className="absolute z-[5] max-w-[80%] md:max-w-[50%]"
  style={{ top: 'clamp(4rem, 8vh, 6rem)', left: 'clamp(1rem, 4vw, 2.5rem)' }}
  initial={{ opacity: 0, y: -16 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.2 }}
>
  {/* SectionLabel + HeroName + role */}
</motion.div>

<motion.div
  data-tarot
  className="absolute z-[6]"
  style={{ top: 'clamp(4rem, 6vh, 5.5rem)', right: 'clamp(1rem, 4vw, 2.5rem)' }}
  initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
  animate={{ opacity: 1, scale: 1, rotate: -3 }}
  transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
>
  <TarotCard />
</motion.div>

{/* Wrap DiagonalSlash similarly with x: -100% → 0, delay: 0.4 */}
{/* Wrap cluster with opacity: 0 → 1, delay: 0.6 */}
```

(Wrap each element analogously per spec §8 timings: 0ms topbar — already chrome — 100ms tarot, 200ms name, 400ms slash, 600ms cluster.)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Visual verify**

Refresh `http://localhost:3000`.
Expected: hero elements cascade in over ~800ms with the staggered timing.

Toggle `prefers-reduced-motion` in DevTools (Rendering tab → Emulate CSS media feature).
Expected: animations skip; everything appears instantly.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(hero): add staggered entrance animations"
```

---

# Phase 7: About section

### Task 7.1: Rebuild About with StatCard

**Files:**
- Modify: `src/app/page.tsx` (About section)

- [ ] **Step 1: Replace About section**

Find the existing `{/* About */}` section in `src/app/page.tsx` and replace with:

```tsx
{/* === ABOUT === */}
<section id="about" className="relative overflow-hidden px-6 py-24 sm:py-32">
  <HalftoneField density="subtle" />
  <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_320px] z-[2]">
    {/* Left: prose */}
    <div>
      <SectionLabel number="02" label="About" />
      <h2
        className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
        style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
      >
        Phantom <span className="text-[var(--color-accent)]">engineer.</span>
      </h2>
      <p className="mt-6 max-w-[55ch] text-base leading-[1.75] sm:text-lg">
        Software engineer specialising in distributed systems, cloud-native platforms, and developer tooling. Currently building .NET 10 microservice systems on Azure with Kubernetes, designing infrastructure-as-code with Terragrunt, and developing AI-assisted tools to improve developer productivity. Background spans embedded Linux, serverless backend architecture, and full-stack platforms used by active online communities.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        {['C# · JAVA · TYPESCRIPT', 'AZURE · AWS · K8S', '.NET 10 · SPRING · NODE', 'TERRAGRUNT · DOCKER'].map((tag) => (
          <span
            key={tag}
            className="bg-[var(--color-ink)] text-[var(--color-bg)] px-3 py-1.5 font-mono text-[0.7rem]"
            style={{ transform: 'skewX(var(--skew-x))' }}
          >
            <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>{tag}</span>
          </span>
        ))}
      </div>
    </div>

    {/* Right: stat card */}
    <StatCard
      name="L. NGO"
      rank="04"
      role="// THE ENGINEER · CODENAME · ROOT"
      stats={stats}
    />
  </div>
</section>
```

Add the imports at the top:

```tsx
import StatCard from '@/components/ui/StatCard';
import { stats } from '@/data/stats';
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Visual verify**

Open `http://localhost:3000`. Scroll to About.
Expected: two-column layout (prose + StatCard) on desktop, single column on mobile. Stat bars render with red fills. Skill tags as skewed mono pills.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(about): rebuild About section with StatCard"
```

---

# Phase 8: Work / Projects section

### Task 8.1: Build ProjectCardP5 component

**Files:**
- Create: `src/components/ui/ProjectCardP5.tsx`

The existing `Project` type (verified) is:

```ts
export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}
```

- [ ] **Step 1: Write ProjectCardP5**

Create `src/components/ui/ProjectCardP5.tsx`:

```tsx
import type { Project } from '@/data/projects';
import HalftoneField from './HalftoneField';

interface ProjectCardP5Props {
  project: Project;
  index: number;  // 0-based, used for the big background numeral
}

export default function ProjectCardP5({ project, index }: ProjectCardP5Props) {
  const numeral = String(index + 1).padStart(2, '0');
  const primaryUrl = project.liveUrl ?? project.githubUrl;

  return (
    <article className="group relative overflow-hidden">
      {/* Red shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-accent)]"
        style={{ transform: 'skewX(var(--skew-x)) translate(8px, 8px)' }}
      />
      {/* Card body */}
      <div
        className="relative bg-[var(--color-bg)] text-[var(--color-ink)] border-[3px] border-[var(--color-ink)] p-6 sm:p-8 transition-transform duration-200 ease-[var(--ease-snap)] group-hover:scale-[1.02]"
        style={{ transform: 'skewX(var(--skew-x))' }}
      >
        <div style={{ transform: 'skewX(calc(-1 * var(--skew-x)))' }} className="relative z-[2]">
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-4 select-none font-display italic font-black text-[var(--color-accent)] opacity-20 leading-none"
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
          >
            {numeral}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            ▸ Project {numeral}
          </span>
          <h3
            className="mt-2 font-display italic font-black leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            {project.name}
          </h3>
          <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base">
            {project.description}
          </p>
          {project.techStack && project.techStack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-accent)] border border-[var(--color-accent)] px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-display italic font-black text-[var(--color-accent)] hover:underline"
              >
                LIVE <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[0.75rem] uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                GITHUB <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        <HalftoneField density="subtle" />
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ProjectCardP5.tsx
git commit -m "feat(ui): add ProjectCardP5 with skewed panel and big numeral"
```

### Task 8.2: Replace Projects section with new cards

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Replace the Projects section**

In `src/app/page.tsx`, find `{/* Projects */}` and replace with:

```tsx
{/* === PROJECTS / WORK === */}
<section id="projects" className="relative overflow-hidden px-6 py-24 sm:py-32">
  <HalftoneField density="subtle" />
  <div className="relative mx-auto max-w-6xl z-[2]">
    <SectionLabel number="03" label="Work" />
    <h2
      className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
      style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
    >
      Selected <span className="text-[var(--color-accent)]">work.</span>
    </h2>
    <div className="mt-12 grid gap-6 md:gap-8 md:grid-cols-2">
      {projects.map((project, i) => (
        <div
          key={project.id}
          className={project.featured ? 'md:col-span-2' : ''}
        >
          <ProjectCardP5 project={project} index={i} />
        </div>
      ))}
    </div>
  </div>
</section>
```

Update imports — replace any existing `ProjectCard` import with:

```tsx
import ProjectCardP5 from '@/components/ui/ProjectCardP5';
```

- [ ] **Step 2: Delete the old ProjectCard.tsx**

```bash
rm src/components/ProjectCard.tsx
```

Confirm no other files import it: `grep -rn "from '@/components/ProjectCard'" src/` — expected zero matches.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Visual verify**

Open `http://localhost:3000` → Projects section.
Expected: Project cards rendered as skewed panels with red shadows, big numerals in the background, halftone overlay, mono tags. Featured project takes full width; others in 2-col grid.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git rm src/components/ProjectCard.tsx
git commit -m "feat(work): rebuild Work section with ProjectCardP5"
```

---

# Phase 9: Experience section

### Task 9.1: Build ExperienceCardP5 component

**Files:**
- Create: `src/components/ui/ExperienceCardP5.tsx`

The existing `Experience` type (verified) is:

```ts
export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;       // long prose paragraph
  techStack: string[];
}
```

- [ ] **Step 1: Write ExperienceCardP5**

Create `src/components/ui/ExperienceCardP5.tsx`:

```tsx
import type { Experience } from '@/data/experience';

interface ExperienceCardP5Props {
  experience: Experience;
}

export default function ExperienceCardP5({ experience }: ExperienceCardP5Props) {
  return (
    <article className="relative">
      {/* Red shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-accent)]"
        style={{ transform: 'skewX(var(--skew-x)) translate(5px, 5px)' }}
      />
      <div
        className="relative bg-[var(--color-bg)] border-[3px] border-[var(--color-ink)] px-5 sm:px-7 py-5 sm:py-6 transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-[1.02]"
        style={{ transform: 'skewX(var(--skew-x))' }}
      >
        <div style={{ transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display italic font-black text-xl sm:text-2xl tracking-[-0.02em]">
              {experience.company}
            </h3>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-accent)]">
              {experience.period}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm">{experience.role}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed">
            {experience.description}
          </p>
          {experience.techStack && experience.techStack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {experience.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-accent)] border border-[var(--color-accent)] px-2 py-0.5"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ExperienceCardP5.tsx
git commit -m "feat(ui): add ExperienceCardP5"
```

### Task 9.2: Replace Experience section with new cards

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/ExperienceCard.tsx`

- [ ] **Step 1: Replace Experience section**

In `src/app/page.tsx`, find `{/* Experience */}` and replace with:

```tsx
{/* === EXPERIENCE === */}
<section id="experience" className="relative overflow-hidden px-6 py-24 sm:py-32">
  <HalftoneField density="subtle" />
  <div className="relative mx-auto max-w-6xl z-[2]">
    <SectionLabel number="04" label="Experience" />
    <h2
      className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
      style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
    >
      Field <span className="text-[var(--color-accent)]">log.</span>
    </h2>
    <div className="mt-10 space-y-6">
      {experience.map((exp) => (
        <ExperienceCardP5 key={exp.company} experience={exp} />
      ))}
    </div>
  </div>
</section>
```

Update imports — add:

```tsx
import ExperienceCardP5 from '@/components/ui/ExperienceCardP5';
```

(Remove the old `import ExperienceCard from '@/components/ExperienceCard'`.)

- [ ] **Step 2: Delete the old ExperienceCard.tsx**

```bash
rm src/components/ExperienceCard.tsx
```

Confirm no imports: `grep -rn "from '@/components/ExperienceCard'" src/` — expected zero matches.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Visual verify**

Open `http://localhost:3000` → Experience section.
Expected: skewed cards with red shadows, italic display company names, red accent period labels, bulleted impact items.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git rm src/components/ExperienceCard.tsx
git commit -m "feat(experience): rebuild Experience section with ExperienceCardP5"
```

---

# Phase 10: Contact section

### Task 10.1: Rebuild Contact section

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the Contact section**

In `src/app/page.tsx`, find `{/* Contact */}` and replace with:

```tsx
{/* === CONTACT === */}
<section id="contact" className="relative overflow-hidden px-6 py-24 sm:py-32">
  <HalftoneField density="medium" />
  <div className="relative mx-auto max-w-5xl z-[2]">
    <SectionLabel number="05" label="Contact" />
    <h2
      className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
      style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', transform: 'skewX(var(--skew-x))' }}
    >
      Interested in <span className="text-[var(--color-accent)]">working</span><br/> together<span className="text-[var(--color-accent)]">?</span>
    </h2>

    <div className="mt-10">
      <a
        href="mailto:ngo.leon@gmail.com"
        className="inline-block font-display italic font-black text-[var(--color-accent)] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-[1.04]"
        style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', textShadow: 'var(--shadow-text-sm)' }}
      >
        ngo.leon@gmail.com ↗
      </a>
    </div>

    <div className="mt-10 flex flex-wrap items-center gap-4">
      {socialLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--color-ink)] text-[var(--color-bg)] px-4 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.15em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105"
          style={{ transform: 'skewX(var(--skew-x))' }}
        >
          <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
            {link.name} ↗
          </span>
        </a>
      ))}
      <a
        href="/resume.pdf"
        className="border-[3px] border-[var(--color-ink)] bg-[var(--color-bg)] px-5 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.15em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105"
        style={{
          transform: 'skewX(var(--skew-x))',
          boxShadow: 'var(--shadow-card-sm)',
        }}
      >
        <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
          ↓ Download Resume
        </span>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Visual verify**

Open `http://localhost:3000` → Contact section.
Expected: large italic skewed headline, big email link with red text-shadow, social pills + Resume button as skewed cards.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(contact): rebuild Contact section with P5 styled CTAs"
```

### Task 10.2: Cleanup deprecated components from page.tsx

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/TextDecrypt.tsx`
- Delete: `src/components/ProfilePhoto.tsx`

- [ ] **Step 1: Remove unused imports**

Open `src/app/page.tsx`. Remove imports for `TextDecrypt`, `ProfilePhoto` if present (they were used by old hero/about). Confirm via build that no usages remain.

- [ ] **Step 2: Delete the unused component files**

```bash
rm src/components/TextDecrypt.tsx
rm src/components/ProfilePhoto.tsx
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git rm src/components/TextDecrypt.tsx src/components/ProfilePhoto.tsx
git commit -m "chore: remove TextDecrypt and ProfilePhoto components"
```

---

# Phase 11: Polish

### Task 11.1: Restyle CommandPalette to match P5

**Files:**
- Modify: `src/components/CommandPalette.tsx`

- [ ] **Step 1: Replace the panel + input + listbox styles**

In `src/components/CommandPalette.tsx`, replace the panel `motion.div` styles. Find:

```tsx
className="fixed inset-x-4 top-[20vh] z-[61] mx-auto max-w-md overflow-hidden rounded-lg border border-border bg-surface shadow-glow-md"
```

Replace with:

```tsx
className="fixed inset-x-4 top-[20vh] z-[61] mx-auto max-w-md overflow-hidden border-[3px] border-[var(--color-ink)] bg-[var(--color-bg)] shadow-[var(--shadow-card)]"
```

Replace the backdrop class:

```tsx
className="fixed inset-0 z-[60] bg-[var(--color-ink)]/70 backdrop-blur-sm"
```

Replace the input class:

```tsx
className="w-full border-b-[3px] border-[var(--color-accent)] bg-transparent px-4 py-3 font-mono text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 outline-hidden uppercase tracking-[0.05em]"
```

Replace the option button classes:

```tsx
className={`w-full px-4 py-2 text-left font-mono text-[0.85rem] tracking-[0.02em] transition-colors ${
  i === clampedIndex
    ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
    : 'text-[var(--color-ink)]/85 hover:text-[var(--color-accent)]'
}`}
```

Add a `▸ ` prefix to the active item:

```tsx
{i === clampedIndex && <span aria-hidden="true">▸ </span>}{route.label}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Visual verify**

Run: `npm run dev`. Press Cmd+K.
Expected: cream panel with red border, mono input with red underline, items with red highlight on active. Styled to match P5 palette.

- [ ] **Step 4: Commit**

```bash
git add src/components/CommandPalette.tsx
git commit -m "feat(palette): restyle Cmd+K palette to P5 cream/red theme"
```

### Task 11.2: Restyle 404 page

**Files:**
- Modify: `src/app/not-found.tsx`

- [ ] **Step 1: Read existing 404**

Read `src/app/not-found.tsx`.

- [ ] **Step 2: Replace with P5-styled 404**

Replace `src/app/not-found.tsx` with:

```tsx
import Link from 'next/link';
import HalftoneField from '@/components/ui/HalftoneField';
import Watermark from '@/components/ui/Watermark';

export default function NotFound() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden px-6">
      <Watermark number="404" position="bl" size="clamp(8rem, 30vw, 28rem)" />
      <HalftoneField density="subtle" />
      <div className="relative z-[2] text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          ▸ FILE NOT FOUND
        </p>
        <h1
          className="mt-4 font-display italic font-black tracking-[-0.04em] origin-center"
          style={{
            fontSize: 'clamp(3rem, 12vw, 9rem)',
            transform: 'skewX(var(--skew-x))',
            textShadow: 'var(--shadow-text)',
          }}
        >
          404<span className="text-[var(--color-accent)]">.</span>
        </h1>
        <p className="mt-4 font-mono text-sm">This page doesn&apos;t exist (or was infiltrated).</p>
        <Link
          href="/"
          className="mt-8 inline-block border-[3px] border-[var(--color-ink)] bg-[var(--color-bg)] px-5 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.15em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105"
          style={{ transform: 'skewX(var(--skew-x))', boxShadow: 'var(--shadow-card-sm)' }}
        >
          <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
            ← Return to Index
          </span>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Visual verify**

Open `http://localhost:3000/some-broken-path`.
Expected: 404 page with big skewed "404." and Return to Index button.

- [ ] **Step 5: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat(404): restyle 404 page to P5"
```

### Task 11.3: Update ScrollReveal easing to P5 snap

**Files:**
- Modify: `src/components/ScrollReveal.tsx`

- [ ] **Step 1: Update the transition easing**

Replace `src/components/ScrollReveal.tsx` with:

```tsx
'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1.05], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Apply ScrollReveal to each section heading**

In `src/app/page.tsx`, wrap each `<SectionLabel>` and section `<h2>` in a `<ScrollReveal>` so they snap-in as the user scrolls.

(Already happens for some — make sure all 4 sections About/Work/Experience/Contact have at least one ScrollReveal at the top of their content.)

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 4: Visual verify**

Run: `npm run dev`. Scroll the page.
Expected: section headings fade-and-snap-in with the P5 overshoot easing as they enter the viewport. With reduced motion enabled in DevTools, they appear instantly.

- [ ] **Step 5: Commit**

```bash
git add src/components/ScrollReveal.tsx src/app/page.tsx
git commit -m "feat(motion): apply P5 snap easing to ScrollReveal"
```

### Task 11.4: Verify accessibility

**Files:**
- No file changes — verification only

- [ ] **Step 1: Keyboard navigation**

Run: `npm run dev`. Tab through the page.
Expected:
- Theme toggle is reachable
- Bottom nav links are reachable
- Email link, social links, Resume button are reachable
- Cmd+K opens the palette; arrow keys navigate; Enter triggers; Escape closes
- All focused elements have a visible red focus ring

- [ ] **Step 2: Screen reader smoke test (macOS VoiceOver / NVDA on Win)**

Verify:
- TopBar reads as a banner
- BottomNav reads as a navigation
- SectionLabel reads as text (e.g., "01 / Index")
- Tarot card reads as "Leon Ngo — The Engineer" (image with title)
- Theme toggle button reads as "Switch to light theme" (or "dark")

- [ ] **Step 3: Reduced motion**

In DevTools → Rendering → Emulate CSS media feature, set `prefers-reduced-motion: reduce`.
Expected:
- Lenis smooth scroll is disabled (native instant scroll)
- ScrollReveal components appear immediately
- Theme toggle still works (color changes but no rotation)
- Hover scales disabled

If anything moves, find the offending animation and gate it on `useReducedMotion()`.

- [ ] **Step 4: Color contrast check**

In DevTools → Accessibility, run a contrast audit on:
- Body text on cream background — must pass WCAG AA (≥ 4.5:1)
- Body text on dark background — must pass WCAG AA
- Red on cream — only large text passes; verify small red text is mono labels (large enough) or repositioned

If any fails, darken the red (try `#b9151e`, the `--color-accent-deep`) for body-text-sized labels.

- [ ] **Step 5: Commit**

If you made any a11y fixes, commit them:

```bash
git add -A
git commit -m "a11y: keyboard, screen reader, reduced-motion, contrast fixes"
```

### Task 11.5: Regenerate OG image

**Files:**
- Replace: `public/og-image.png`

- [ ] **Step 1: Take a screenshot of the hero in dark mode**

Run: `npm run dev`. Resize browser to 1200×630. Switch theme to dark. Use a screenshot tool to capture the hero exactly (or use Playwright/Puppeteer).

For a quick CLI approach using Playwright (if installed):

```bash
npx playwright install chromium
# Then write a quick script: (skip this if you're capturing manually)
```

Or just use the system screenshot tool, crop to 1200×630, save as `public/og-image.png`.

- [ ] **Step 2: Verify the image**

Open `public/og-image.png` in an image viewer. Confirm:
- 1200×630 dimensions
- Hero clearly visible
- Text readable at thumbnail size

- [ ] **Step 3: Commit**

```bash
git add public/og-image.png
git commit -m "feat(seo): regenerate OG image for P5 redesign"
```

### Task 11.6: Final build + lint + visual sweep

**Files:**
- No file changes — final verification

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: success, no TypeScript errors, no warnings.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: zero errors, zero warnings.

- [ ] **Step 3: Visual sweep across breakpoints**

Run: `npm run dev`. Test at:
- 1920×1080 (wide)
- 1280×720 (desktop)
- 900×600 (tablet)
- 414×896 (mobile)
- 375×667 (iPhone SE)

For each: scroll through all sections, verify nothing breaks, hover interactions work, theme toggle works on every breakpoint.

- [ ] **Step 4: Toggle theme on every section**

For each section (Index, About, Work, Experience, Contact), toggle theme. Verify:
- All text remains readable in both themes
- Skewed panels invert correctly (cream ↔ ink)
- Halftone color flips
- Red accent stays roughly the same in both themes

- [ ] **Step 5: Test on a real mobile device (optional but recommended)**

Open the dev server URL on a real phone (or iOS Simulator / Android Emulator).
Verify: smooth scroll feels right (not janky), tap targets are usable, no horizontal overflow.

- [ ] **Step 6: Final commit if any tweaks**

```bash
git add -A
git commit -m "polish: final sweep — fixes from cross-breakpoint and theme verification"
```

### Task 11.7: Tag and push

**Files:**
- No file changes — git operations only

- [ ] **Step 1: Tag the release**

```bash
git tag -a p5-redesign -m "P5 portfolio redesign complete"
```

- [ ] **Step 2: Verify the diff vs the snapshot tag**

```bash
git diff --stat pre-p5-redesign..p5-redesign
```

Expected: shows the ~30 files touched across the redesign.

- [ ] **Step 3: (Optional) Push to remote**

Don't push without confirming with the user first. When ready:

```bash
git push origin master
git push origin pre-p5-redesign p5-redesign
```

---

## Plan self-review notes

**Spec coverage check:**
- §1 Direction → covered by full-page rebuild (Phases 6–10)
- §2.1 Color system → Phase 1, Task 1.1 (globals.css)
- §2.2 Halftone → Task 1.1 + HalftoneField (Task 4.1)
- §2.3 Typography → Task 2.1 (font swap)
- §2.4 Type scale → covered via clamp() inline in components
- §2.5 Shadow system → Task 1.1 (CSS vars)
- §2.6 Skew system → Task 1.1
- §3 Page structure → Phases 6–10 (one section per phase)
- §4 Hero detailed → Phase 6 (3 tasks)
- §5 Other sections → Phases 7–10
- §6 Reusable components → Phases 4–5 (one task per component)
- §7 Tech stack → Task 0.2 (deps), Tasks 2.1–2.4 (providers/fonts)
- §8 Animations → Task 6.3 (entrance) + Task 11.3 (scroll snap easing) + hover via component-level transition classes
- §9 Responsive → Task 6.2 (mobile hero) + clamp() throughout
- §10 Accessibility → Task 11.4 (verification + fixes)
- §11 SEO → Task 11.5 (OG image) + Task 2.1 (metadata preserved)
- §12 Phases → matches the 0–11 phases here
- §13 Decisions → all locked-in values appear in code (e.g., "ROOT ACCESS GRANTED", "X · THE ENGINEER", "DISTRIBUTED SYSTEMS · CLOUD · DEV TOOLS")
- §14 Open questions — addressed in scope:
  - Theme toggle UI: small icon button in TopBar ✓ (Task 2.5)
  - Resume PDF: kept as `/resume.pdf` link in Task 10.1; v2 redesign of PDF deferred
  - Project thumbnails: kept as-is, halftone overlay via HalftoneField inside ProjectCardP5 ✓
  - Cmd+K palette: restyled, behavior preserved ✓ (Task 11.1)

**Type consistency check:**
- `Theme` type: defined in ThemeProvider, used in ThemeToggle ✓
- `Section` type: defined in `src/data/sections.ts`, used in BottomNav ✓
- `Stat` type: defined in `src/data/stats.ts`, used in StatCard ✓
- `Project` type: imported from existing `src/data/projects.ts` (assumed has `title`, `description`, `tags`, `url`, `featured`, `id` — verify in Task 8.1 Step 3)
- `Experience` type: imported from existing `src/data/experience.ts` (verify in Task 9.1 Step 2)

**Placeholder scan:**
- No "TBD", "TODO", "implement later"
- Every component step has actual code
- Every command step has expected output
- Every file path is exact

**Out of scope (deferred):**
- Custom cursor
- Page transitions with skewed wipe
- All-Out Attack overlay
- Per-project custom illustrations
- Resume PDF redesign

These can be follow-on plans if Leon wants to push further.
