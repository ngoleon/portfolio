# Hover Glitches Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a chromatic-split-on-first-hover + jitter-on-subsequent-hovers effect to the five display-italic headlines on the portfolio site.

**Architecture:** Tiny `useGlitch()` React hook that flips a `data-glitch` attribute on `mouseenter` (no re-render, ref-driven). Two CSS keyframe animations (`rgb-split`, `glitch-tick`) keyed off the data attribute. `translate` longhand for jitter so it composes with the existing `transform: skewX(...)` on h2s. A `--baseline-shadow` custom property keeps the hero name's resting text-shadow visible during animation.

**Tech Stack:** React 19, Next.js 16, Tailwind v4 (custom CSS in `globals.css`), TypeScript.

**Spec:** `docs/superpowers/specs/2026-04-30-hover-glitches-design.md`

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `src/app/globals.css` | Modify (append) | Two keyframes, attribute selectors, reduced-motion guard, `--baseline-shadow` default. |
| `src/hooks/useGlitch.ts` | Create | The hook returning `{ onMouseEnter, onAnimationEnd }`. ~25 lines. |
| `src/components/ui/HeroName.tsx` | Modify | Apply hook to `h1`. Set `--baseline-shadow` to `var(--shadow-text)`. |
| `src/app/page.tsx` | Modify | Apply hook to 4 section `h2` headlines (About / Experience / Projects / Contact). |

No test files — the codebase has no component test framework. Verification is manual against an explicit checklist (Task 5).

---

## Task 1: CSS keyframes + reduced-motion guard

**Files:**
- Modify: `src/app/globals.css` (append at end of file)

- [x] **Step 1: Append keyframes and selectors to globals.css**

Add to the end of `src/app/globals.css`:

```css

/* ================================================================
   HOVER GLITCHES — chromatic split on first hover, jitter after
   ================================================================ */

/* Default baseline; elements with their own resting text-shadow
   override this on the element itself via inline style. */
:where([data-glitch]) {
  --baseline-shadow: 0 0 0 transparent;
}

/* Each keyframe position aligns with a step boundary — `steps(N, end)`
   samples keyframe percentages 0, 1/N, 2/N, ..., (N-1)/N, then ends.
   Mismatched step counts produce no visible animation, so changes here
   must keep keyframe % aligned with the steps() value below. */

@keyframes rgb-split {
  0% {
    text-shadow:
      var(--baseline-shadow),
      0 0 0 transparent,
      0 0 0 transparent;
  }
  25% {
    text-shadow:
      var(--baseline-shadow),
      -2px 0 0 #00f0ff,
      2px 0 0 var(--color-accent);
  }
  50% {
    text-shadow:
      var(--baseline-shadow),
      3px 0 0 #00f0ff,
      -3px 0 0 var(--color-accent);
  }
  75% {
    text-shadow:
      var(--baseline-shadow),
      -1px 0 0 #00f0ff,
      1px 0 0 var(--color-accent);
  }
  100% {
    text-shadow:
      var(--baseline-shadow),
      0 0 0 transparent,
      0 0 0 transparent;
  }
}

@keyframes glitch-tick {
  0%   { translate: 0.5px 0.5px; }
  33%  { translate: 1px -1px; }
  66%  { translate: -2px 1px; }
  100% { translate: 0 0; }
}

[data-glitch="split"]  { animation: rgb-split   220ms steps(4, end); }
[data-glitch="jitter"] { animation: glitch-tick  90ms steps(3, end) 2; }

@media (prefers-reduced-motion: reduce) {
  [data-glitch] { animation: none !important; }
}
```

- [x] **Step 2: Verify the dev server still serves the page**

Run (server should already be up via `npm run dev`):

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/
```

Expected: `HTTP 200`. If the server is not running, start it:

```bash
PATH="$HOME/.nvm/versions/node/v24.14.0/bin:$PATH" npm run dev
```

- [ ] **Step 3: Smoke-test the keyframes by hand in DevTools** *(manual — controller verifies in Task 5)*

Open `http://localhost:3000/` in a browser. Open DevTools → Elements. Inspect any headline `<h1>` or `<h2>`. In the Styles panel, manually add `data-glitch="split"` to its DOM attributes (or use the Console: `document.querySelector('h1').dataset.glitch = 'split'`).

Expected: the headline briefly flashes a red/cyan chromatic split for ~220ms.

Repeat with `'jitter'`.

Expected: the headline shudders 1–2px for ~180ms total.

Remove the attribute when done. (Hook will manage this in later tasks.)

- [x] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(glitch): keyframes + selectors for hover chromatic-split and jitter

Adds rgb-split and glitch-tick keyframes keyed off [data-glitch] attribute.
Honors prefers-reduced-motion. Uses --baseline-shadow var so existing
text-shadow on hero name remains visible during animation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `useGlitch` hook

**Files:**
- Create: `src/hooks/useGlitch.ts`

- [x] **Step 1: Create the hook file**

Create `src/hooks/useGlitch.ts`:

```ts
import { useRef } from 'react';

/**
 * Drives a hover-triggered glitch effect. Returns props to spread onto
 * the target element. First mouseenter sets data-glitch="split" (chromatic
 * flash); subsequent mouseenters set data-glitch="jitter". Re-fires on
 * a single element are debounced to >800ms apart. Honors
 * prefers-reduced-motion (no-op when reduce is set).
 *
 * The corresponding CSS lives in globals.css under the
 * "HOVER GLITCHES" section.
 */
export function useGlitch() {
  const seen = useRef(false);
  const lastTrigger = useRef(0);

  const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const now = performance.now();
    const target = e.currentTarget;

    if (!seen.current) {
      target.dataset.glitch = 'split';
      seen.current = true;
      lastTrigger.current = now;
    } else if (now - lastTrigger.current > 800) {
      target.dataset.glitch = 'jitter';
      lastTrigger.current = now;
    }
  };

  const onAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
    delete e.currentTarget.dataset.glitch;
  };

  return { onMouseEnter, onAnimationEnd };
}
```

- [x] **Step 2: Verify the file compiles**

The dev server has hot reload — saving the file will trigger a re-compile. Verify there's no TypeScript error in the dev server log:

```bash
tail -20 /tmp/portfolio-dev.log 2>/dev/null || echo "log unavailable; check the dev server terminal"
```

Expected: no compilation errors mentioning `useGlitch.ts`.

- [x] **Step 3: Commit**

```bash
git add src/hooks/useGlitch.ts
git commit -m "$(cat <<'EOF'
feat(glitch): useGlitch hook — first-hover split, repeat-hover jitter

Ref-driven (no React re-renders). Debounces re-fires to >800ms.
Bails early on prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Apply hook to `HeroName`

**Files:**
- Modify: `src/components/ui/HeroName.tsx`

- [x] **Step 1: Replace the file contents**

Replace the entire file `src/components/ui/HeroName.tsx` with:

```tsx
'use client';

import { useGlitch } from '@/hooks/useGlitch';

interface HeroNameProps {
  first: string;
  last: string;
  /** Whether the trailing punctuation is "!" (energetic) or "." (calm). */
  punct?: '!' | '.';
}

export default function HeroName({ first, last, punct = '!' }: HeroNameProps) {
  const glitch = useGlitch();
  return (
    <h1
      {...glitch}
      className="m-0 font-display italic font-bold leading-[0.85] tracking-[-0.04em] origin-left text-[var(--color-ink)]"
      style={{
        fontSize: 'clamp(3rem, 8vw, 7.5rem)',
        transform: 'skewX(var(--skew-x))',
        textShadow: 'var(--shadow-text)',
        // Keep the resting drop-shadow visible during the chromatic
        // animation by feeding it into the keyframe baseline.
        ['--baseline-shadow' as string]: 'var(--shadow-text)',
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

Notes:
- `'use client'` at the top — `useRef` and `useGlitch` need to run in a client component. The component renders inside `page.tsx` which already has `'use client'`, but adding it here too is safer for any future reuse.
- The `['--baseline-shadow' as string]` cast is the standard TypeScript pattern for setting CSS custom properties via the inline `style` prop.

- [ ] **Step 2: Verify in the browser** *(manual — controller verifies in Task 5)*

Hard-refresh `http://localhost:3000/`.

- [ ] Hover the hero name "LEON NGO" once → red/cyan chromatic flash for ~220ms, then snaps back. The existing red drop shadow remains visible during the animation.
- [ ] Hover again immediately (within 800ms) → no animation.
- [ ] Wait ~1s, hover again → 1–2px jitter for ~180ms.
- [ ] Hover repeatedly with >800ms gaps → jitter every time.

If any step fails, do NOT proceed — root-cause first. Likely culprits: hook not imported, `--baseline-shadow` not picked up (check DevTools computed styles), or the keyframes from Task 1 not present in the served CSS (hard refresh / DevTools "Disable cache").

- [x] **Step 3: Commit**

```bash
git add src/components/ui/HeroName.tsx
git commit -m "$(cat <<'EOF'
feat(glitch): hover effect on hero name

Wires HeroName up to useGlitch. --baseline-shadow on the inline style
preserves the resting drop-shadow during the chromatic animation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Apply hook to 4 section headlines in `page.tsx`

**Files:**
- Modify: `src/app/page.tsx` (4 separate `h2` elements)

The four section headlines all follow the same pattern: an `h2` inside a `ScrollReveal` wrapper, with the same className and inline-style structure. We need to add the hook to each.

- [x] **Step 1: Add the import**

At the top of `src/app/page.tsx`, after the other component imports, add:

```tsx
import { useGlitch } from '@/hooks/useGlitch';
```

- [x] **Step 2: Instantiate four hook instances inside `Home()`**

Each headline needs its own hook instance (per-element first-hover tracking). Inside the `Home()` function body, *before* the returned JSX, add:

```tsx
  const aboutGlitch = useGlitch();
  const experienceGlitch = useGlitch();
  const projectsGlitch = useGlitch();
  const contactGlitch = useGlitch();
```

- [x] **Step 3: Spread into the About headline**

Find this block (around line 183):

```tsx
            <SectionLabel number="02" label="About" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              The <span className="text-[var(--color-accent)]">engineer.</span>
            </h2>
```

Replace with:

```tsx
            <SectionLabel number="02" label="About" />
            <h2
              {...aboutGlitch}
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              The <span className="text-[var(--color-accent)]">engineer.</span>
            </h2>
```

- [x] **Step 4: Spread into the Experience headline**

Find this block (around line 228):

```tsx
            <SectionLabel number="03" label="Experience" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Field <span className="text-[var(--color-accent)]">log.</span>
            </h2>
```

Replace with:

```tsx
            <SectionLabel number="03" label="Experience" />
            <h2
              {...experienceGlitch}
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Field <span className="text-[var(--color-accent)]">log.</span>
            </h2>
```

- [x] **Step 5: Spread into the Projects headline**

Find this block (around line 253):

```tsx
            <SectionLabel number="04" label="Projects" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Selected <span className="text-[var(--color-accent)]">work.</span>
            </h2>
```

Replace with:

```tsx
            <SectionLabel number="04" label="Projects" />
            <h2
              {...projectsGlitch}
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Selected <span className="text-[var(--color-accent)]">work.</span>
            </h2>
```

- [x] **Step 6: Spread into the Contact headline**

Find this block (around line 283):

```tsx
            <SectionLabel number="05" label="Contact" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Interested in <span className="text-[var(--color-accent)]">working</span><br/> together<span className="text-[var(--color-accent)]">?</span>
            </h2>
```

Replace with:

```tsx
            <SectionLabel number="05" label="Contact" />
            <h2
              {...contactGlitch}
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Interested in <span className="text-[var(--color-accent)]">working</span><br/> together<span className="text-[var(--color-accent)]">?</span>
            </h2>
```

- [ ] **Step 7: Verify in the browser** *(manual — controller verifies in Task 5)*

Hard-refresh `http://localhost:3000/`. Scroll through every section.

- [ ] About → first hover on "The engineer." triggers chromatic; second hover (>800ms later) triggers jitter.
- [ ] Experience → first hover on "Field log." triggers chromatic; subsequent triggers jitter.
- [ ] Projects → first hover on "Selected work." triggers chromatic; subsequent triggers jitter.
- [ ] Contact → first hover on "Interested in working together?" triggers chromatic; subsequent triggers jitter.

Each headline tracks its own first-hover state independently — chromatic should fire once per headline, then only jitter on that headline.

- [x] **Step 8: Commit**

```bash
git add src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(glitch): hover effect on 4 section headlines

About / Experience / Projects / Contact h2s each get their own
useGlitch instance for per-element first-hover tracking.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Cross-cutting verification

No file changes in this task. Manual checks against the full surface area before push.

- [ ] **Step 1: Reduced-motion check**

In your OS, enable "Reduce motion" (macOS: System Settings → Accessibility → Display → Reduce motion. Linux GNOME: Settings → Accessibility → Reduce animation. Or via DevTools: Rendering tab → "Emulate CSS media feature prefers-reduced-motion: reduce").

Hard-refresh `http://localhost:3000/`. Hover every headline.

Expected: NO chromatic flash, NO jitter. Hover does nothing visually.

Disable the OS setting / DevTools emulation when done.

- [ ] **Step 2: Theme check**

Toggle to dark mode (theme toggle button in TopBar). Hover every headline.

Expected: chromatic and jitter still work. The cyan `#00f0ff` ghost should be visible against the dark background. The accent-red ghost too. If cyan looks washed-out or invisible, note it but do NOT block — capture as a follow-up to tune the cyan value.

Toggle back to light mode. Repeat.

Expected: same — cyan visible against cream, accent visible.

- [ ] **Step 3: Mobile / touch check**

In DevTools → Toggle device toolbar → pick an iPhone or Pixel preset. Reload.

Expected: hovering with the simulated touch input does NOT trigger glitches (`mouseenter` doesn't fire on touch-only devices; `:hover` styles don't stick). Headlines render normally with no `data-glitch` ever set.

If mouseenter DOES fire (some browsers simulate it for the first touch), confirm the glitch fires once then nothing — that's acceptable behavior.

- [ ] **Step 4: Rapid-hover debounce check**

On any single headline (e.g., the hero name), hover-out and hover-in 5 times in rapid succession (<800ms gaps).

Expected: chromatic fires the first time. Subsequent hovers within 800ms are ignored — no jitter, no animation. After waiting >800ms and hovering again, jitter fires.

- [ ] **Step 5: Commit any tuning changes (if any)**

If during verification any value (cyan color, jitter offsets, debounce timing) needed tweaking, those changes should already be committed against Task 1 or whichever file changed. If everything verified clean, no extra commit needed.

- [ ] **Step 6: Push**

```bash
git push
```

---

## Self-review notes

- Spec coverage: all 5 spec sections (Targets, Effect specs, Architecture, Files touched, Decisions) map to plan tasks. Reduced-motion handling covered in Task 1 (CSS) AND Task 2 (JS) per spec.
- No placeholders. All code blocks contain literal code, all paths are real.
- Type consistency: hook returns `{ onMouseEnter, onAnimationEnd }`; spread as `{...x}` everywhere; never destructured.
- Single-feature scope, single plan.
