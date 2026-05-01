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
