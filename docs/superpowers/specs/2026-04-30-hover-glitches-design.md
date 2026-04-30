# Hover Glitches on Display Headlines — Design

**Date:** 2026-04-30
**Status:** Spec for review
**Wave:** 1 — quick wins
**Estimated scope:** ~1–2 hours implementation

## Goal

Add a signature hover effect to the five display-italic headlines on the portfolio site. The first hover on each headline triggers a chromatic / RGB-split flash; subsequent hovers trigger a hard 1–2px positional jitter. Effect is purely decorative and respects `prefers-reduced-motion`.

The intent is to add a small "alive" beat to each section that aligns with the brutalist/punk-zine vocabulary already in use (skew, halftone, stamps, accent red), without becoming noise.

## Targets

Five elements, one per section:

1. Hero name — `<HeroName>` ("LEON NGO" — combined first/last span)
2. About headline — `<h2>The engineer.</h2>` (`src/app/page.tsx`)
3. Experience headline — `<h2>Field log.</h2>` (`src/app/page.tsx`)
4. Projects headline — `<h2>Selected work.</h2>` (`src/app/page.tsx`)
5. Contact headline — `<h2>Interested in working together?</h2>` (`src/app/page.tsx`)

Out of scope: company names in experience cards, project titles, section labels (01/02/etc.), the diagonal slash banner, the InfoCard mission. Adding the effect there would make it feel like noise.

## Effect specifications

### Chromatic split (first hover per element)

- Implementation: animated `text-shadow` with two layers — one accent-red, one cyan.
- Timing: ~220ms total, `steps(4, end)` — discontinuous snap rather than smooth ease. Keyframe percentages (0/25/50/75/100%) are aligned with the step count; mismatching them produces no visible animation.
- Keyframe shape (4 visible chromatic states): clean → (-2px cyan, +2px red) → (+3px cyan, -3px red) → (-1px cyan, +1px red) → clean. Asymmetric so it reads as "broken," not "vibrating."
- Cyan = `#00f0ff` (chosen as complement to the existing accent red).
- Red = `var(--color-accent)`.
- Composes with the existing `skewX(var(--skew-x))` on h2s without conflict because `text-shadow` inherits the skewed coordinate space automatically.

### Jitter (subsequent hovers)

- Implementation: animated `translate` (CSS longhand, **not** `transform: translate(...)`).
- Why the longhand: target elements already have `transform: skewX(var(--skew-x))`. The `transform` shorthand and `translate` longhand are independent in the CSS Transforms 2 spec — animating `translate` does not clobber the skew. No wrapper element required.
- Timing: ~90ms total, `steps(3, end)`, repeated 2x. Hard punk-zine "tick." Keyframe percentages (0/33/66/100%) are aligned with the step count.
- Keyframe shape (3 visible jitter positions): (0.5px, 0.5px) → (1px, -1px) → (-2px, 1px) → 0. The 0% keyframe is intentionally a small offset rather than rest, so the first sampled step shows visible motion (with `steps(3, end)` the 0% position is held for the first ~30ms).
- Debounce: re-fire only if >800ms since last trigger on that element. Prevents jitter fatigue from a user moving the mouse repeatedly across the same headline.

### Reduced motion

- `@media (prefers-reduced-motion: reduce)` disables both animations entirely. No fallback animation; plain hover only.
- Hook also bails early in `onMouseEnter` to avoid mutating `data-glitch` when reduced motion is active.

## Architecture

### Hook: `useGlitch()`

Returns a small props object spread onto each target element. **No new DOM is added** — the hook only attaches event handlers and ref-driven `data-glitch` attribute mutations to existing elements.

```ts
// src/hooks/useGlitch.ts
import { useRef } from 'react';

export function useGlitch() {
  const seen = useRef(false);
  const lastTrigger = useRef(0);

  const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const now = performance.now();
    if (!seen.current) {
      e.currentTarget.dataset.glitch = 'split';
      seen.current = true;
    } else if (now - lastTrigger.current > 800) {
      e.currentTarget.dataset.glitch = 'jitter';
    } else {
      return;
    }
    lastTrigger.current = now;
  };

  const onAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
    delete e.currentTarget.dataset.glitch;
  };

  return { onMouseEnter, onAnimationEnd };
}
```

### Why `useRef` + `data-*` (not `useState`)

The visual change is CSS-driven via attribute selectors — React doesn't need to re-render. Using `useRef` keeps it zero-cost and avoids unnecessary reconciliation on every first hover.

### Why a hook (not a wrapper component)

A wrapper would either (a) add an extra `<span>`, which interferes with the carefully tuned skew + counter-skew structure, or (b) require `cloneElement` shenanigans to inject props. The hook spreads onto the existing element with no DOM changes:

```tsx
const glitch = useGlitch();
<h2 {...glitch} className="...">The engineer.</h2>
```

## CSS additions

Added to `src/app/globals.css`:

```css
@keyframes rgb-split {
  0%   { text-shadow: 0 0 0 transparent, 0 0 0 transparent; }
  40%  { text-shadow: -2px 0 0 #00f0ff, 2px 0 0 var(--color-accent); }
  70%  { text-shadow:  3px 0 0 #00f0ff, -3px 0 0 var(--color-accent); }
  100% { text-shadow: 0 0 0 transparent, 0 0 0 transparent; }
}

@keyframes glitch-tick {
  0%   { translate: 0 0; }
  33%  { translate: 1px -1px; }
  66%  { translate: -2px 1px; }
  100% { translate: 0 0; }
}

[data-glitch="split"]  { animation: rgb-split 220ms steps(3, end); }
[data-glitch="jitter"] { animation: glitch-tick 90ms steps(1, end) 2; }

@media (prefers-reduced-motion: reduce) {
  [data-glitch] { animation: none !important; }
}
```

## Files touched

- **New** — `src/hooks/useGlitch.ts` (~25 lines)
- **Modified** — `src/app/globals.css` (keyframes + selectors, ~20 lines added)
- **Modified** — `src/components/ui/HeroName.tsx` (apply hook to the outer span)
- **Modified** — `src/app/page.tsx` (apply hook to 4 section `h2` elements)

No deletions, no breaking changes to component APIs.

## Decisions made (and rejected alternatives)

| Decision | Chosen | Rejected | Reason |
|---|---|---|---|
| Glitch flavor | Combo (chromatic first + jitter subsequent) | Single flavor only | "Wow then tick" gives more interesting rhythm than either alone. |
| Element scope | 5 display headlines only | All italic display text including cards | Cards would push it into "noise" territory; 5 well-spaced moments preserve impact. |
| First-hover scope | Per-element | Per-page-load / per-session | Headlines are screens apart; each first hover lands fresh. |
| Chromatic implementation | `text-shadow` | Pseudo-elements + `attr(data-text)` | Pseudo-element duplicates can be read by some screen readers; `text-shadow` is purely visual. |
| Jitter on skewed element | `translate` longhand | Wrapper div / CSS variables + `@property` | Longhand composes with existing `transform: skewX(...)` natively. Zero wrappers needed. |
| State tracking | `useRef` + `data-*` attribute | `useState` | No React re-render needed; CSS handles the visual change. |
| Animation library | Plain CSS keyframes | `motion/react` | 200ms one-shot animations don't justify the library overhead. motion/react is still used for entrance animations elsewhere. |

## Accessibility

- `text-shadow` is purely visual; no impact on screen readers, focus order, or semantics.
- `prefers-reduced-motion: reduce` honored via media query (CSS layer) and via early-return in the hook (JS layer) — belt and braces.
- Headlines are not interactive elements (no focus, no click target), so no need to mirror to `:focus-visible`. They remain plain headings to assistive tech.
- The cyan `#00f0ff` ghost layer is brief enough (220ms) that it should not affect users with mild visual processing differences. If feedback indicates otherwise, the cyan can be dialed to a translucent variant.

## Performance

- `text-shadow` animation triggers paint, not layout — cheap.
- `translate` longhand is GPU-composited on Chrome 115+, Safari 17+ (matches our target baseline).
- Five elements × short one-shot animations = no measurable overhead.
- No `will-change` hints needed; effects are too brief to warrant.

## Testing

Manual verification only (no test framework currently in use for components):

- [ ] Hover hero name → chromatic split fires, snap-back is clean
- [ ] Hover hero name again → jitter fires, no chromatic
- [ ] Hover all 4 section headlines → chromatic on first hover each
- [ ] Hover the same headline 5x rapidly → second-onward hovers within 800ms ignored, then jitter resumes
- [ ] OS-level reduced-motion enabled → no animations fire on any headline
- [ ] All effects work with theme toggle (dark / light) — chromatic colors should read against both backgrounds
- [ ] Mobile (touch) → no hover triggers; headlines render normally with no glitch state

## Open questions for review

None. Ready to write implementation plan.
