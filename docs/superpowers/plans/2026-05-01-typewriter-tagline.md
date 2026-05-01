# Typewriter Tagline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static accent-red `// distributed systems · dev tools` tagline at `src/app/page.tsx:101` with a self-contained typewriter that cycles six phrases and ends on a self-aware token-limit ERROR that loops back into a fake reboot.

**Architecture:** A single client component (`TypewriterTagline`) owning a linear "program" of typed operations (TYPE / DELETE / HOLD / PAUSE / INJECT_ERROR / HARD_RESET) executed by a self-scheduling `setTimeout` chain. State lives in two `useState` (visible text, error injected) plus refs for the program counter, paused flag, and timeout id. Reduced-motion users get a static fallback. SSR text is the first phrase so the server-rendered HTML is meaningful.

**Tech Stack:** React 19, Next.js 16, TypeScript, Tailwind v4 utility classes (custom CSS in `globals.css` for caret keyframe).

**Spec:** `docs/superpowers/specs/2026-05-01-typewriter-tagline-design.md`

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `src/components/TypewriterTagline.tsx` | Create | The full component — program, scheduler, state, render. |
| `src/app/globals.css` | Modify (append) | One keyframe (`tw-blink`) for the caret. |
| `src/app/page.tsx` | Modify (`:101`) | Swap the inline `<span>` for `<TypewriterTagline />`. Add import. |

No test files — the codebase has no component test framework. Verification is manual against an explicit checklist (Task 8).

---

## Task 1: Component scaffold + reduced-motion fallback + page wiring

This task gets `<TypewriterTagline />` rendering on the page in its simplest form: just the static fallback text. No animation yet. This proves the SSR/CSR plumbing and keeps the page visually unchanged.

**Files:**
- Create: `src/components/TypewriterTagline.tsx`
- Modify: `src/app/page.tsx` (line 101 + add import near other component imports)

- [ ] **Step 1: Create the component file**

Create `src/components/TypewriterTagline.tsx` with:

```tsx
'use client';

import { useEffect, useState } from 'react';

const FALLBACK_TEXT = '// distributed systems · dev tools';

export default function TypewriterTagline() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <span className="text-[var(--color-accent)]">
      <span aria-hidden="true">{FALLBACK_TEXT}</span>
      <span className="sr-only">distributed systems · dev tools</span>
    </span>
  );
}
```

Notes:
- `reducedMotion` state is set up now so subsequent tasks plug into it. It is unused in the JSX for this task — that is intentional; we'll use it once the cycle is implemented.
- The `aria-hidden`/`sr-only` split is final — it stays correct as the visible text changes through the cycle in later tasks.

- [ ] **Step 2: Wire the component into `page.tsx`**

In `src/app/page.tsx`, add the import alongside the other component imports (after `import StampTag from '@/components/ui/StampTag';` is a good spot):

```tsx
import TypewriterTagline from '@/components/TypewriterTagline';
```

Then replace line 101:

```tsx
<span className="text-[var(--color-accent)]">{'// distributed systems · dev tools'}</span>
```

with:

```tsx
<TypewriterTagline />
```

- [ ] **Step 3: Verify in browser** *(manual)*

Start the dev server if not already running:

```bash
npm run dev
```

Hard-refresh `http://localhost:3000/`. Expected:
- Hero name zone shows "Software Engineer" then `// distributed systems · dev tools` — visually identical to before.
- No console errors, no TypeScript errors in the dev terminal.

- [ ] **Step 4: Commit**

```bash
git add src/components/TypewriterTagline.tsx src/app/page.tsx
git commit -m "$(cat <<'EOF'
feat(tagline): scaffold TypewriterTagline component

Drop-in replacement for the static span at the hero name zone.
Renders only the fallback text for now — animation lands in
subsequent commits. Reduced-motion plumbing is set up.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Caret CSS + render

Add a blinking block caret. Still no animation on the text — caret just sits at the end of the static fallback line.

**Files:**
- Modify: `src/app/globals.css` (append at end)
- Modify: `src/components/TypewriterTagline.tsx`

- [ ] **Step 1: Append caret keyframe to globals.css**

Add to the end of `src/app/globals.css`:

```css

/* ================================================================
   TYPEWRITER TAGLINE — caret blink
   ================================================================ */

@keyframes tw-blink {
  0%, 49%   { opacity: 1; }
  50%, 100% { opacity: 0; }
}

.tw-caret {
  display: inline-block;
  width: 0.6ch;
  height: 1em;
  margin-left: 1px;
  background-color: currentColor;
  vertical-align: -0.12em;
  animation: tw-blink 1.06s steps(2, end) infinite;
}

/* When typing/deleting is in flight, hold the caret solid. */
.tw-caret[data-state='active'] {
  animation: none;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .tw-caret { animation: none; }
}
```

Notes:
- 1.06s with `steps(2, end)` produces a hard 530ms-per-state blink (the classic terminal cadence: solid for 530ms, off for 530ms).
- `width: 0.6ch` gives a slim block; tweak if it looks too wide once rendered.

- [ ] **Step 2: Render the caret in the component**

Replace the contents of `src/components/TypewriterTagline.tsx` with:

```tsx
'use client';

import { useEffect, useState } from 'react';

const FALLBACK_TEXT = '// distributed systems · dev tools';

export default function TypewriterTagline() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <span className="text-[var(--color-accent)]">
      <span aria-hidden="true">
        {FALLBACK_TEXT}
        <span className="tw-caret" />
      </span>
      <span className="sr-only">distributed systems · dev tools</span>
    </span>
  );
}
```

The `reducedMotion` value is still computed but unused in JSX — it'll be wired in Task 3.

- [ ] **Step 3: Verify in browser** *(manual)*

Hard-refresh. Expected:
- A small block caret blinks at the end of `// distributed systems · dev tools`.
- Caret blinks at ~530ms intervals (just-perceptibly slower than common 500ms blinks).
- No layout jump or shift around the caret.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/components/TypewriterTagline.tsx
git commit -m "$(cat <<'EOF'
feat(tagline): blinking block caret

Terminal-style block caret with 530ms-per-state hard blink. Goes
solid when data-state='active' (used by typing/deleting in the
next commit). Honors prefers-reduced-motion.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Linear program + scheduler — phrases 1 & 2 cycling

Implement the operation list (just the first two phrases for now), the tick-based scheduler, and the SSR-then-takeover pattern. After this task, the visible text will alternate between `// loading context7...` and `// rtk whoami` forever, with proper typing/deleting/holding.

**Files:**
- Modify: `src/components/TypewriterTagline.tsx`

- [ ] **Step 1: Replace component contents**

Replace `src/components/TypewriterTagline.tsx` with:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Op =
  | { kind: 'TYPE'; target: string }
  | { kind: 'DELETE'; target: string }
  | { kind: 'HOLD'; ms: number }
  | { kind: 'PAUSE'; ms: number };

const TYPE_MS = 60;
const DELETE_MS = 30;
const HOLD_MS = 1600;
const PAUSE_MS = 300;
const JITTER_MS = 10;
const START_DELAY_MS = 450;

const SSR_TEXT = '// loading context7...';
const FALLBACK_TEXT = '// distributed systems · dev tools';
const SR_TEXT = 'distributed systems · dev tools';

const PROGRAM: Op[] = [
  { kind: 'TYPE',   target: '// loading context7...' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  { kind: 'TYPE',   target: '// rtk whoami' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
];

const jitter = () => (Math.random() * 2 - 1) * JITTER_MS;

export default function TypewriterTagline() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [text, setText] = useState(SSR_TEXT);
  const [caretActive, setCaretActive] = useState(false);

  const textRef = useRef(SSR_TEXT);
  const opIndexRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      textRef.current = FALLBACK_TEXT;
      setText(FALLBACK_TEXT);
      setCaretActive(false);
      return;
    }

    let cancelled = false;

    const schedule = (fn: () => void, delay: number) => {
      timeoutRef.current = window.setTimeout(() => {
        if (cancelled) return;
        fn();
      }, delay);
    };

    const tick = () => {
      if (cancelled) return;
      const op = PROGRAM[opIndexRef.current];
      if (!op) {
        opIndexRef.current = 0;
        tick();
        return;
      }

      switch (op.kind) {
        case 'TYPE': {
          setCaretActive(true);
          if (textRef.current === op.target) {
            opIndexRef.current++;
            tick();
            return;
          }
          const next = op.target.slice(0, textRef.current.length + 1);
          textRef.current = next;
          setText(next);
          schedule(tick, TYPE_MS + jitter());
          break;
        }
        case 'DELETE': {
          setCaretActive(true);
          if (textRef.current === op.target) {
            opIndexRef.current++;
            tick();
            return;
          }
          const next = textRef.current.slice(0, -1);
          textRef.current = next;
          setText(next);
          schedule(tick, DELETE_MS);
          break;
        }
        case 'HOLD':
        case 'PAUSE': {
          setCaretActive(false);
          opIndexRef.current++;
          schedule(tick, op.ms);
          break;
        }
      }
    };

    // SSR text is already showing. Wait for hero entrance, then
    // hard-cut to empty and start the program from the top — the
    // brief "snap to empty" reads as the system rebooting into life.
    schedule(() => {
      textRef.current = '';
      setText('');
      opIndexRef.current = 0;
      tick();
    }, START_DELAY_MS);

    return () => {
      cancelled = true;
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <span className="text-[var(--color-accent)]">
      <span aria-hidden="true">
        {text}
        <span className="tw-caret" data-state={caretActive ? 'active' : undefined} />
      </span>
      <span className="sr-only">{SR_TEXT}</span>
    </span>
  );
}
```

Notes:
- `textRef` is the source of truth during a tick (synchronous); `setText` re-renders. Both are kept in lock-step.
- `cancelled` flag prevents stale timeouts from running after unmount/effect cleanup.
- `caretActive` flips the caret to solid during typing/deleting and back to blinking during HOLD/PAUSE.
- `slice(0, length + 1)` works for TYPE because `target` is always a superstring of current `textRef`. For phrase 1 starting from empty, this types char-by-char. (Same logic will handle predicate typing in Task 4 — typing `// I build cool things` while text is `// I ` just appends the predicate one char at a time.)
- `slice(0, -1)` works for DELETE because we're always trimming from the end toward a known prefix `target`.

- [ ] **Step 2: Verify in browser** *(manual)*

Hard-refresh. Expected:
- Page loads showing `// loading context7...` (SSR).
- After ~450ms (hero entrance), text snaps to empty and types `// loading context7...` again, character by character at ~60ms/char.
- Holds for ~1.6s, deletes char-by-char at ~30ms/char (visibly faster than typing).
- Brief pause, then types `// rtk whoami`, holds, deletes, loops.
- Caret is solid during typing/deleting, blinking during holds and pauses.

If layout jitters horizontally as text grows/shrinks, that's expected at this stage — Task 6 reserves the width.

- [ ] **Step 3: Commit**

```bash
git add src/components/TypewriterTagline.tsx
git commit -m "$(cat <<'EOF'
feat(tagline): linear program + scheduler for first two phrases

Op list (TYPE/DELETE/HOLD/PAUSE) executed by self-scheduling
setTimeout chain. SSR-then-takeover pattern: server renders
'// loading context7...', client hard-cuts to empty after the hero
entrance and retypes from scratch. Caret goes solid during typing.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: "I"-prefix lines with predicate-only delete

Extend the program to include phrases 3, 4, 5. Lines 4 and 5 only delete back to the persistent `// I ` prefix between transitions, so the "I" stays on screen as the constant subject.

**Files:**
- Modify: `src/components/TypewriterTagline.tsx`

- [ ] **Step 1: Extend the PROGRAM constant**

In `src/components/TypewriterTagline.tsx`, replace the `PROGRAM` array with:

```tsx
const PROGRAM: Op[] = [
  // Boot phrases — full type, full delete
  { kind: 'TYPE',   target: '// loading context7...' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  { kind: 'TYPE',   target: '// rtk whoami' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  // First "I" line — typed from empty, then deletes back to the prefix
  { kind: 'TYPE',   target: '// I solve problems' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '// I ' },
  // Subsequent "I" lines — typed by appending to the persistent prefix
  { kind: 'TYPE',   target: '// I build cool things' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '// I ' },
  { kind: 'TYPE',   target: '// I make lives easier' },
  { kind: 'HOLD',   ms: HOLD_MS },
];
```

Note: this stops short of phrase 6 (the ERROR). Task 5 adds it.

- [ ] **Step 2: Verify in browser** *(manual)*

Hard-refresh. Expected sequence:

1. `// loading context7...` (type → hold → delete → pause)
2. `// rtk whoami` (type → hold → delete → pause)
3. `// I solve problems` (type → hold)
4. Deletes only `solve problems`, leaving `// I ` with the cursor blinking after it.
5. Types `build cool things` to produce `// I build cool things` — the prefix didn't blink-out.
6. Hold → delete only `build cool things` → type `make lives easier` → hold.
7. Cycle restarts (jumps back to `// loading context7...`).

The fact that `// I ` stays on screen during the predicate transitions is the whole point of this task — visually confirm it. The cursor should sit at the trailing-space position during the brief delete-to-prefix beat.

- [ ] **Step 3: Commit**

```bash
git add src/components/TypewriterTagline.tsx
git commit -m "$(cat <<'EOF'
feat(tagline): persistent '// I' prefix across the I-lines

Lines 3-5 share '// I ' so the program deletes only back to that
prefix, then types each new predicate. Reads as 'I' being the
constant subject while the verbs cycle.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: ERROR injection + hard reset (loop)

Add the punchline: after `// I make lives easier`, the program deletes back to `// I` (no trailing space), types `-` to land on `// I-`, then injects the styled ERROR text in one frame, holds 3s, and hard-cuts back to empty to restart the loop.

**Files:**
- Modify: `src/components/TypewriterTagline.tsx`

- [ ] **Step 1: Extend the Op type and add error state**

In `src/components/TypewriterTagline.tsx`, replace the `Op` type with:

```tsx
type Op =
  | { kind: 'TYPE'; target: string }
  | { kind: 'DELETE'; target: string }
  | { kind: 'HOLD'; ms: number }
  | { kind: 'PAUSE'; ms: number }
  | { kind: 'INJECT_ERROR' }
  | { kind: 'HARD_RESET' };
```

Add this state hook alongside `text` / `caretActive` (inside the component):

```tsx
const [errorInjected, setErrorInjected] = useState(false);
```

- [ ] **Step 2: Extend the PROGRAM constant**

Append the error-and-reset ops to `PROGRAM` (after the existing `// I make lives easier` HOLD):

```tsx
const PROGRAM: Op[] = [
  // ... unchanged ops above ...
  { kind: 'TYPE',   target: '// I make lives easier' },
  { kind: 'HOLD',   ms: HOLD_MS },
  // Error punchline
  { kind: 'DELETE', target: '// I' },        // strips trailing space too
  { kind: 'TYPE',   target: '// I-' },       // types just '-'
  { kind: 'INJECT_ERROR' },
  { kind: 'HOLD',   ms: 3000 },              // longer beat for the joke
  { kind: 'HARD_RESET' },
];
```

- [ ] **Step 3: Handle the new ops in `tick()`**

In the `switch (op.kind)` block of `tick()`, add these two cases (alongside the existing TYPE/DELETE/HOLD/PAUSE):

```tsx
case 'INJECT_ERROR': {
  setErrorInjected(true);
  setCaretActive(false);
  opIndexRef.current++;
  tick();
  break;
}
case 'HARD_RESET': {
  textRef.current = '';
  setText('');
  setErrorInjected(false);
  setCaretActive(false);
  opIndexRef.current = 0;
  tick();
  break;
}
```

`HARD_RESET` resets `opIndexRef` to 0 directly so the loop restarts from the boot phrase.

- [ ] **Step 4: Render the injected error span**

Replace the JSX `return` block in the component with:

```tsx
return (
  <span className="text-[var(--color-accent)]">
    <span aria-hidden="true">
      {text}
      {errorInjected && (
        <span
          className="italic"
          style={{ color: 'var(--color-accent-deep)' }}
        >
          {' ERROR *token limit reached*'}
        </span>
      )}
      <span className="tw-caret" data-state={caretActive ? 'active' : undefined} />
    </span>
    <span className="sr-only">{SR_TEXT}</span>
  </span>
);
```

Notes:
- The error text starts with a literal space — when injected next to `// I-` it reads as `// I- ERROR ...` with the gap between the dash and ERROR. (Spec defers final color to implementation review; `var(--color-accent-deep)` is a sensible first pick — it's a darker shadow-red already in the palette and reads as "system breaking through" without introducing a new token. If it doesn't read as distinct enough, swap to `var(--color-ink)` italic, which uses the page foreground.)
- The caret is hidden during the error hold (`setCaretActive(false)` keeps it blink-mode but the error text ends with the asterisk, not the caret position — the caret still renders inline. If it looks weird poking out after the asterisk, gate it on `!errorInjected` in the JSX. Default: leave it visible; visual review during Step 5 decides.)

- [ ] **Step 5: Verify in browser** *(manual)*

Hard-refresh. Expected full cycle:

1. `// loading context7...` → hold → delete → pause
2. `// rtk whoami` → hold → delete → pause
3. `// I solve problems` → hold → delete back to `// I `
4. `// I build cool things` → hold → delete to `// I `
5. `// I make lives easier` → hold → delete to `// I` (no trailing space)
6. `// I-` (just the dash typed) → ` ERROR *token limit reached*` appears in one frame, italic + dark-red → holds 3s
7. **Hard cut to empty** (no animated delete), loops to step 1

Critical check: the transition from "ERROR holding" to "loading context7... typing" should feel like a system reboot — instant snap, no animated deletion. If you see a delete animation between them, the HARD_RESET op didn't do its job.

If the error color doesn't read as distinct from the regular text, try the alternative noted in Step 4 and re-verify.

- [ ] **Step 6: Commit**

```bash
git add src/components/TypewriterTagline.tsx
git commit -m "$(cat <<'EOF'
feat(tagline): ERROR punchline + reboot loop

Final phrase deletes to '// I' (no space), types '-', and injects
'ERROR *token limit reached*' in italic accent-deep. Holds 3s for
the joke to land, then hard-cuts to empty so the loop back to
'loading context7...' reads as a system reboot.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Hover pause/resume + layout-shift mitigation

Two small additions: pause the cycle while the visitor's cursor is over the tagline, and reserve a horizontal slot wide enough for the longest phrase so the rest of the hero doesn't reflow as the text grows/shrinks.

**Files:**
- Modify: `src/components/TypewriterTagline.tsx`

The pause-resume design: when the user hovers, set a `paused` flag and cancel the inflight timeout. When they leave, clear the flag and call `tick()` again — `tick()` re-evaluates the current op (read from `opIndexRef`/`textRef`) and continues from there. No need to remember "where we paused mid-operation" because the refs already hold that state.

Bridging from event handler (in render body) to `tick` (defined inside the effect): use a `tickRef` that the effect populates and the handlers read.

- [ ] **Step 1: Add `pausedRef` and `tickRef` at the component level**

Inside the component body, alongside the other `useRef` declarations (`textRef`, `opIndexRef`, `timeoutRef`), add:

```tsx
const pausedRef = useRef(false);
const tickRef = useRef<(() => void) | null>(null);
```

- [ ] **Step 2: Populate `tickRef` inside the effect**

Inside the main `useEffect` (the one that defines `tick`), after `tick` is declared and just before the `schedule(...)` call that kicks the program off, add:

```tsx
tickRef.current = tick;
```

In the same effect's cleanup function, null it out alongside the existing cleanup:

```tsx
return () => {
  cancelled = true;
  tickRef.current = null;
  if (timeoutRef.current !== undefined) {
    window.clearTimeout(timeoutRef.current);
  }
};
```

(Replace the existing cleanup return with this version — it just adds the `tickRef.current = null` line.)

- [ ] **Step 3: Gate the scheduled tick on `pausedRef`**

Find the `schedule` helper inside the effect and update it to skip firing when paused (paused state was set just before the timer fired):

```tsx
const schedule = (fn: () => void, delay: number) => {
  timeoutRef.current = window.setTimeout(() => {
    if (cancelled || pausedRef.current) return;
    fn();
  }, delay);
};
```

Why both checks: `onMouseEnter` clears the inflight timeout, but if the timer fires in the same microtask before the clear lands, the paused-flag guard catches it.

- [ ] **Step 4: Wire hover handlers and the JSX**

Replace the component's `return` block (and add the handler consts immediately above it) with:

```tsx
const onMouseEnter = () => {
  pausedRef.current = true;
  if (timeoutRef.current !== undefined) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = undefined;
  }
};

const onMouseLeave = () => {
  pausedRef.current = false;
  tickRef.current?.();
};

return (
  <span
    className="text-[var(--color-accent)] inline-block"
    style={{ minWidth: '34ch' }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <span aria-hidden="true">
      {text}
      {errorInjected && (
        <span
          className="italic"
          style={{ color: 'var(--color-accent-deep)' }}
        >
          {' ERROR *token limit reached*'}
        </span>
      )}
      <span className="tw-caret" data-state={caretActive ? 'active' : undefined} />
    </span>
    <span className="sr-only">{SR_TEXT}</span>
  </span>
);
```

Notes:
- `inline-block` + `minWidth: '34ch'` reserves horizontal space. The longest visible string is `// I- ERROR *token limit reached*` at 33 characters; 34ch gives a 1ch buffer. If the page layout reflows visibly when phrase 6 lands, bump to 36ch.
- `onMouseLeave` calls `tickRef.current?.()` — `tick()` reads `opIndexRef`/`textRef` to determine current op state and resumes from there. No special bookkeeping for mid-character pauses; the next character (or HOLD, or whatever was next) just fires.

Notes:
- `inline-block` + `minWidth: '34ch'` reserves horizontal space. The longest visible string is `// I- ERROR *token limit reached*` at 33 characters; 34ch gives a 1ch buffer. If the page layout reflows visibly when phrase 6 lands, bump to 36ch.
- Adding `onMouseEnter`/`onMouseLeave` to the outer span captures hover over the whole tagline area (including caret and any error text).
- When paused mid-typing (e.g., halfway through `make lives easier`), the next tick is queued via `resumeRef`. On mouse-leave, that queued tick fires immediately — picking up exactly where we left off rather than restarting the phrase or skipping ahead.

- [ ] **Step 5: Verify in browser** *(manual)*

Hard-refresh.

- [ ] Hover over the tagline mid-typing. Animation pauses immediately; caret keeps blinking but text doesn't change.
- [ ] Move cursor away. Animation resumes from the next character. No restart, no skip.
- [ ] Hover during a HOLD (when text is fully typed). Hold pauses; cycle continues normally on mouse-leave.
- [ ] Hover during the ERROR phase. Error text stays visible until you leave; then the hard-reset fires.
- [ ] As phrases cycle, the hero's tarot card and slash banner do **not** shift horizontally. The space is reserved.
- [ ] Touch device sanity: on a phone or DevTools touch emulation, the cycle plays normally without pause (no hover state).

- [ ] **Step 6: Commit**

```bash
git add src/components/TypewriterTagline.tsx
git commit -m "$(cat <<'EOF'
feat(tagline): hover pause/resume + reserved width

Hover sets pausedRef and clears the inflight timeout; mouse-leave
resumes by re-invoking tick via tickRef. tick() re-derives current
op from refs, so resume picks up at the next character with no
mid-op bookkeeping. Outer span gets minWidth:34ch (sized to the
longest phrase + 1ch buffer) so neighboring hero elements don't
reflow.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Spec-coverage cleanup pass

Quick sanity sweep against the spec to catch anything the per-task verifications missed. No code changes expected — this task either finds gaps (fix inline + commit) or confirms completeness.

**Files:**
- Read-only: `src/components/TypewriterTagline.tsx`, `docs/superpowers/specs/2026-05-01-typewriter-tagline-design.md`

- [ ] **Step 1: Cross-check each spec section**

Open the spec side-by-side with the component file. Verify each section:

- [ ] **Goal / Target** — single span swap at `page.tsx:101`. Confirm parent `<p>`, "Software Engineer" prefix, and `<br className="xl:hidden" />` are unchanged.
- [ ] **Content — phrase rotation** — all 6 phrases in the right order in `PROGRAM`.
- [ ] **State machine** — 21 ops, in the spec-listed order. (Count them.)
- [ ] **Timings** — TYPE 60ms, DELETE 30ms, HOLD 1600ms, ERROR HOLD 3000ms, PAUSE 300ms, jitter ±10ms.
- [ ] **ERROR injection** — italic + distinct color, appears in one frame (no per-char typing).
- [ ] **Caret** — blinks during HOLD/PAUSE, solid during TYPE/DELETE.
- [ ] **Hero entrance** — START_DELAY_MS = 450ms before first op.
- [ ] **First paint / SSR** — initial state is `// loading context7...`; client retypes after delay.
- [ ] **Layout-shift mitigation** — `minWidth` set on the outer span.
- [ ] **Reduced motion** — early effect path sets text to `FALLBACK_TEXT` and bails before scheduling.
- [ ] **Screen readers** — `aria-hidden="true"` on the visible cycle, `sr-only` companion span.
- [ ] **Hover behavior** — pause/resume implemented.
- [ ] **No new dependencies** — `package.json` unchanged since Task 1.

- [ ] **Step 2: Reduced-motion smoke test**

In Chrome DevTools: Command Palette → "Show Rendering" → set "Emulate CSS media feature prefers-reduced-motion" to `reduce`. Hard-refresh.

Expected: tagline shows static `// distributed systems · dev tools` with a steady (non-blinking, per CSS rule in Task 2) caret. No typing, no error gag.

Toggle back to "no preference" and hard-refresh — full cycle should resume.

- [ ] **Step 3: Cross-browser sanity**

If available, open the page in:
- [ ] Chrome — primary dev target.
- [ ] Firefox — verify `ch` units, caret animation, and `matchMedia` listener all work.
- [ ] Safari (or Webkit via Playwright/Epiphany if no Mac) — same.

If any browser shows different behavior, root-cause and fix. Likely culprits: `addEventListener` on `MediaQueryList` (older Safari needed `addListener`; with React 19 + modern Safari, the modern API is fine), or `ch` unit width differing under non-monospace fallback fonts.

- [ ] **Step 4: Mobile / narrow-viewport check**

Resize the viewport below 1280px (the breakpoint where the `<br className="xl:hidden" />` activates). Expected: the tagline wraps to its own line below "Software Engineer" and the cycle plays without horizontal overflow. The `minWidth: 34ch` should not cause horizontal scroll because the parent `<p>` has its own width constraints from `max-w-[80%] md:max-w-[50%]` on the wrapping `motion.div`.

If the typewriter overflows or wraps mid-phrase, reduce `minWidth` to `30ch` or remove it on small viewports via a media query. Document the change in the commit message.

- [ ] **Step 5: Commit any fixes**

If Steps 1–4 surfaced fixes, commit them now (one logical commit per fix).

```bash
git add <fixed-files>
git commit -m "$(cat <<'EOF'
fix(tagline): <short description of the fix>

<one-line why>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

If no fixes were needed, skip this step.

---

## Task 8: Final verification checklist

End-to-end manual run-through, plus dev-log sanity. This is the gate before declaring done.

**Files:**
- Read-only

- [ ] **Step 1: Lint + typecheck**

```bash
npm run lint
```

Expected: no errors. Warnings about pre-existing files are fine.

```bash
npx tsc --noEmit
```

Expected: zero TypeScript errors. If the component has any, fix before continuing.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: build succeeds. Watch for any runtime warnings about `useEffect` dependencies, hydration mismatches, or `window` access during SSR. The component uses `'use client'` at the top, so SSR access to `window` is gated, but verify the build log is clean.

- [ ] **Step 3: Full cycle observation**

With `npm run dev`, hard-refresh and watch one full cycle without interaction. Run a stopwatch or count the cycle length. Expected: ~20 seconds end-to-end, then loops.

- [ ] **Step 4: Hover behavior check**

- [ ] Mid-type pause: cursor over tagline during typing. Pauses cleanly.
- [ ] Mid-delete pause: hover during deletion. Pauses cleanly.
- [ ] Hold pause: hover during a HOLD. Hold extends.
- [ ] Error pause: hover during the ERROR display. Error stays.
- [ ] Resume from each: leaves cursor → resumes from where it was, no restart.

- [ ] **Step 5: Reduced-motion check**

DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → hard-refresh.

- [ ] Static `// distributed systems · dev tools` shown.
- [ ] No typing, no caret blink, no error gag.

- [ ] **Step 6: Mobile check**

Resize viewport to ~768px (mobile). Expected: tagline wraps below "Software Engineer", cycle plays cleanly, no horizontal scroll.

- [ ] **Step 7: Screen reader spot-check**

If you have VoiceOver (macOS) or NVDA (Windows) handy: the tagline should announce as "distributed systems dev tools" once, not as "slash slash space loading space context seven dot dot dot..." over and over.

If no SR available, verify in DevTools that:
- The outer cycle `<span>` has `aria-hidden="true"`.
- The companion `sr-only` span exists with the static text.

- [ ] **Step 8: Final commit if any cleanup happened**

Same shape as Task 7 Step 5. If there's nothing left to commit, skip.

- [ ] **Step 9: Push (optional, ask the user first)**

If verification passed and the user has confirmed they want to publish:

```bash
git log --oneline -10  # show what will be pushed
git push
```

Otherwise, leave commits local for the user to push at their discretion.

---

## Self-review notes

- **Spec coverage:** every section of the spec maps to a task — Task 1 (scaffold + reduced-motion plumbing + page wiring), Task 2 (caret), Task 3 (program/scheduler/SSR), Task 4 ("I" prefix), Task 5 (ERROR + reset), Task 6 (hover + min-width), Task 7 (cross-check), Task 8 (final verify).
- **Type consistency:** `Op` extended once in Task 5 to add `INJECT_ERROR` and `HARD_RESET`. `PROGRAM` is appended-only across Tasks 3→4→5; no rename or signature drift.
- **Open questions from spec:** Task 5 picks `var(--color-accent-deep)` for the ERROR color with a stated fallback. Task 6 picks `34ch` for `minWidth` with a stated bump-up fallback. Caret implementation lands in Task 2 as inline `<span>` with CSS class — consistent thereafter.
