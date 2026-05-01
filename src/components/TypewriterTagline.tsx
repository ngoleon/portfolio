'use client';

import { useEffect, useRef, useState } from 'react';

type Op =
  | { kind: 'TYPE'; target: string }
  | { kind: 'DELETE'; target: string }
  | { kind: 'HOLD'; ms: number }
  | { kind: 'PAUSE'; ms: number }
  | { kind: 'INJECT_ERROR' }
  | { kind: 'HARD_RESET' };

const TYPE_MS = 60;
const DELETE_MS = 30;
const HOLD_MS = 1600;
const PAUSE_MS = 300;
const JITTER_MS = 10;
const START_DELAY_MS = 450;

const SSR_TEXT = '// loading context7...';
const FALLBACK_TEXT = '// distributed systems · dev tools';
const SR_TEXT = 'distributed systems · dev tools';

const PROGRAM: readonly Op[] = [
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
  // Error punchline
  { kind: 'DELETE', target: '// I' },        // strips trailing space too
  { kind: 'TYPE',   target: '// I-' },       // types just '-'
  { kind: 'INJECT_ERROR' },
  { kind: 'HOLD',   ms: 3000 },              // longer beat for the joke
  { kind: 'HARD_RESET' },
];

const jitter = () => (Math.random() * 2 - 1) * JITTER_MS;

export default function TypewriterTagline() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [text, setText] = useState(SSR_TEXT);
  const [caretActive, setCaretActive] = useState(false);
  const [errorInjected, setErrorInjected] = useState(false);

  const textRef = useRef(SSR_TEXT);
  const opIndexRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const pausedRef = useRef(false);
  const tickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
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
        if (cancelled || pausedRef.current) return;
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
      }
    };

    tickRef.current = tick;

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
      tickRef.current = null;
      if (timeoutRef.current !== undefined) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [reducedMotion]);

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
      style={{ minWidth: '36ch' }}
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
}
