# Typewriter Tagline — Design

**Date:** 2026-05-01
**Status:** Spec for review
**Estimated scope:** ~2–3 hours implementation

## Goal

Replace the static accent-red tagline in the hero name zone (`src/app/page.tsx:101`) with a typewriter effect that cycles through six phrases. The cycle ends on a self-aware "token limit reached" error that loops back into a fake reboot — leaning into the AI-native / terminal vocabulary already running through the site (Claude Code mark, ROOT ACCESS GRANTED stamp, RTK token-killer references).

The effect should feel deliberate (not anxious), terminal-precise (not novelist-organic), and end on a punchline that rewards visitors who watch a full cycle.

## Target

Single `<span>` at `src/app/page.tsx:101`:

```tsx
<span className="text-[var(--color-accent)]">{'// distributed systems · dev tools'}</span>
```

Replaced by `<TypewriterTagline />`. Surrounding markup (the parent `<p>`, the "Software Engineer" prefix, the `<br className="xl:hidden" />`) stays unchanged.

## Content — phrase rotation

Six phrases in this exact order:

1. `// loading context7...` — boot beat, doubles as the page-just-rebooted gag after line 6
2. `// rtk whoami` — terminal reference to user's own tooling (Rust Token Killer)
3. `// I solve problems`
4. `// I build cool things`
5. `// I make lives easier`
6. `// I- ERROR *token limit reached*` — punchline; types `// I-` then injects ERROR text and hard-cuts back to phrase 1

Lines 3–5 share the prefix `// I `. The typewriter exploits this: between phrases 3→4 and 4→5, it deletes only the predicate and keeps the prefix on screen. Reads as *"I"* being the constant subject while the verbs cycle. Between phrases 5→6, it deletes the trailing space too, then types `-` to produce `// I-` before the error injects.

## State machine

A linear sequence of operations — no branching, no input. Implementation is a `useEffect` that walks the list with chained `setTimeout`s.

```
op  1: TYPE_FROM_EMPTY  '// loading context7...'
op  2: HOLD             1600ms
op  3: DELETE_TO_EMPTY
op  4: PAUSE            300ms
op  5: TYPE_FROM_EMPTY  '// rtk whoami'
op  6: HOLD             1600ms
op  7: DELETE_TO_EMPTY
op  8: PAUSE            300ms
op  9: TYPE_FROM_EMPTY  '// I solve problems'
op 10: HOLD             1600ms
op 11: DELETE_TO        '// I '          (keep prefix incl. trailing space)
op 12: TYPE_PREDICATE   'build cool things'
op 13: HOLD             1600ms
op 14: DELETE_TO        '// I '
op 15: TYPE_PREDICATE   'make lives easier'
op 16: HOLD             1600ms
op 17: DELETE_TO        '// I'           (also kills trailing space)
op 18: TYPE_PREDICATE   '-'              → on-screen reads '// I-'
op 19: INJECT_ERROR     'ERROR *token limit reached*'
op 20: HOLD             3000ms           (longer hold — punchline beat)
op 21: HARD_RESET       (instant cut to empty, no animated delete)
loop back to op 1
```

Total cycle ≈ 20 seconds.

## Timings

Evidence-backed values (research synthesis: Brysbaert 2019 reading-rate meta-analysis; defaults from Typed.js, react-simple-typewriter, Motion.dev):

| Param | Value | Reasoning |
|---|---|---|
| Type speed | **60 ms/char** | Slightly slower than ~50ms adult silent-reading rate (238 wpm), so cursor leads but eye catches up mid-phrase |
| Delete speed | **30 ms/char** | Half of type. Delete is plumbing, not content; symmetric speed feels sluggish |
| Hold (lines 1–5) | **1600 ms** | Reader had ~70% exposure during typing, so hold covers re-parse + settle, not cold first-read |
| Hold (line 6 ERROR) | **3000 ms** | Punchline beat |
| Pause between phrases | **300 ms** | Prevents jarring "delete-last-then-type-first" snap |
| Per-char jitter | **±10 ms** | Light. Terminal aesthetic should lean machine-precise, not organic |
| Hard-reset duration | **0 ms** | The loop-back from ERROR is instant — sells the "OOM crash, system reboot" gag |

## ERROR injection rendering

Line 6's `ERROR *token limit reached*` is **not** typed character-by-character. It appears in one frame, like stderr output crashing into the line.

Render shape:

```tsx
<span className="text-[var(--color-accent)]">
  {visibleText}                                {/* '// I-' */}
  {errorInjected && (
    <span className="italic text-[--error-color]">
      {' '}ERROR *token limit reached*
    </span>
  )}
  <Caret />
</span>
```

**Error styling:** italic + a distinct color from the accent red. Options:
- Reuse `var(--color-accent)` flicker — simplest, but reads as same voice as the rest
- Use a stderr-style yellow/amber — clearer "this is system output, not the user"
- Use white/foreground color but italic — minimal but legible

**Recommendation:** stderr-amber or off-white italic. The visual distinction is what makes the joke readable as *system output overriding the user's voice* rather than just more typing. Final color pick during implementation review.

## Caret

Single block-style block caret (`▍` or a CSS `::after` block) blinking at ~530ms intervals (the classic terminal blink rate). Positioned at the end of `visibleText`, *before* the injected error span. Caret stops blinking and goes solid during active typing/deleting; resumes blink during HOLD/PAUSE.

## Hero entrance coordination

The parent `motion.div` animates in over ~450ms (`duration: 0.4` + `delay: 0.05`). The typewriter waits for that entrance to complete before typing the first character. Implementation: a `startDelay` constant (`450 ms`) before `op 1` begins.

During the entrance, the span renders the SSR text — see "First paint" below.

## First paint / SSR

Next.js will SSR the component. The component renders one of:

- **Empty string** — clean but causes a brief blank line before hydration completes and typing begins
- **`// loading context7...`** — first phrase visible immediately; typewriter takes over after hydration. Looks intentional (the page is "loading") and avoids layout shift.

**Recommendation:** SSR `// loading context7...`. On hydration, the component checks `prefers-reduced-motion`; if not reduced, it clears the text and starts the cycle from op 1 (which retypes `// loading context7...`). The brief moment before retype reads as the page coming to life.

Note: this is distinct from the **reduced-motion fallback** (`// distributed systems · dev tools`) covered in the Accessibility section. SSR text is what *every* visitor sees on first paint before hydration; reduced-motion fallback is what *reduced-motion users* see permanently.

## Layout-shift mitigation

Phrase widths vary (`// rtk whoami` is 13 chars; `// I- ERROR *token limit reached*` is 33 chars). Without protection, the surrounding `<p>` reflows the line break and the slash banner below.

Mitigation: reserve a fixed **min-width** (or fixed-`ch` width) on the typewriter span equal to the longest phrase. Compute it from the phrase list at build time, or hard-code a `min-width` in `ch` units sized to the longest line + 2ch buffer.

Vertical: the `<p>` already wraps to a second line below the "Software Engineer" prefix on smaller screens (via `<br className="xl:hidden" />`). The typewriter span sits on its own line in that wrap, so vertical reflow risk is low.

## Accessibility

### `prefers-reduced-motion: reduce`

Skip the cycle entirely. Render the static line `// distributed systems · dev tools` (the current shipped value) — no typing, no deletion, no error gag. Implementation: read the media query once on mount; if `reduce`, return the static span and bail before scheduling any timeouts.

Why this fallback rather than a phrase from the rotation: the new phrases are all first-person and lean on the joke arc. The currently-shipped descriptor is the most neutral, complete-sentence-equivalent, and therefore the safest static representation of the section.

### Screen readers

The typewriter is decorative. Wrap the entire span in `aria-hidden="true"` and place a visually-hidden `<span className="sr-only">distributed systems · dev tools</span>` adjacent to it for screen readers. Otherwise, screen readers announce every keystroke / phrase deletion as it happens, which is hostile.

### Hover behavior

Pause the typewriter on hover so visitors can read whichever line they catch. Resume on mouse-leave from where it paused — do not restart or skip. Touch devices: no equivalent (no hover state); cycle continues normally.

## Implementation shape

**One component:** `src/components/TypewriterTagline.tsx`

- Owns the state machine (no abstraction into a generic `useTypewriter` hook — the ERROR injection logic is too phrase-specific to generalize, and YAGNI applies)
- Owns the accent color so the parent doesn't change
- Drop-in replacement for the existing span at `page.tsx:101`
- No props for the MVP — phrases and timings are constants in the component file. If a second consumer ever appears, refactor then.

**No new dependencies.** Vanilla `useState` + `useEffect` + `setTimeout` chains. The state machine is small enough that introducing `xstate` or similar would be overkill.

**File-level structure:**

```tsx
// src/components/TypewriterTagline.tsx
'use client';

const PHRASES = [...];           // the 6 strings
const TIMINGS = { ... };         // the table above
const FALLBACK = '// distributed systems · dev tools';

export function TypewriterTagline() {
  // 1. read prefers-reduced-motion (early return with FALLBACK if reduce)
  // 2. useState for visibleText, errorInjected
  // 3. useEffect that walks the op list with chained setTimeouts
  // 4. hover handlers to pause/resume the scheduler
  // 5. cleanup on unmount
}
```

## Out of scope

- Configurable phrases via props
- Pause-on-tab-blur (visibilitychange)
- Pause-when-offscreen via IntersectionObserver
- Sound effects
- Cursor variant options
- Animation speed user preference toggle

These are all reasonable future additions but unnecessary for shipping the effect. YAGNI.

## Open questions

1. **ERROR text color** — stderr-amber, off-white italic, or accent-red flicker? Decide during implementation when the colors can be eyeballed in context.
2. **Caret implementation** — CSS `::after` block vs. inline `<span>` element. CSS keeps the JSX cleaner; inline span is easier to position relative to error injection. Decide during implementation.
3. **Min-width unit** — fixed `ch` value vs. computed from longest phrase via JS. Static `ch` is simpler; computed handles font edge cases. Default: hardcode in `ch` and adjust if the longest phrase visibly clips.

## Risks

- **`setTimeout` drift** — long-running chains accumulate small timing inaccuracies. Acceptable for this use case (cosmetic, not synchronized to anything external).
- **Hot reload during dev** — `useEffect` cleanup must clear *all* pending timeouts or stale schedulers stack. Mitigation: keep a single `timeoutRef` and clear on cleanup.
- **Test coverage** — there is no test harness in the repo for animation timing. The component is a one-off; manual visual verification in browser is acceptable.
