'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

type Op =
  | { kind: 'TYPE'; target: string }
  | { kind: 'DELETE'; target: string }
  | { kind: 'HOLD'; ms: number }
  | { kind: 'PAUSE'; ms: number }
  | { kind: 'HARD_RESET' };

const TYPE_MS = 60;
const DELETE_MS = 30;
const HOLD_MS = 1600;
const PAUSE_MS = 300;
const JITTER_MS = 10;
const START_DELAY_MS = 450;

const SSR_TEXT = 'loading context7...';
const FALLBACK_TEXT = '> tighten the loop';
const SR_TEXT = 'software engineer · dev tooling';

const PROGRAM: readonly Op[] = [
  // Identity + context
  { kind: 'TYPE',   target: 'rtk whoami' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  { kind: 'TYPE',   target: 'loading context7...' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  // The engineering loop — last line is meta-self-referential to the
  // cycle on this page; HARD_RESET after it tightens the loop literally.
  { kind: 'TYPE',   target: '> spec the system' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  { kind: 'TYPE',   target: '> automate the path' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  { kind: 'TYPE',   target: '> observe the behaviour' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'DELETE', target: '' },
  { kind: 'PAUSE',  ms: PAUSE_MS },
  { kind: 'TYPE',   target: '> tighten the loop' },
  { kind: 'HOLD',   ms: HOLD_MS },
  { kind: 'HARD_RESET' },
];

const jitter = () => (Math.random() * 2 - 1) * JITTER_MS;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (callback: () => void) => {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = () =>
  window.matchMedia(REDUCED_MOTION_QUERY).matches;

const getReducedMotionServerSnapshot = () => false;

export default function TypewriterTagline() {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [text, setText] = useState(SSR_TEXT);
  const [caretActive, setCaretActive] = useState(false);

  const textRef = useRef(SSR_TEXT);
  const opIndexRef = useRef(0);
  const timeoutRef = useRef<number | undefined>(undefined);
  const pausedRef = useRef(false);
  const tickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

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
        case 'HARD_RESET': {
          textRef.current = '';
          setText('');
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
      style={{ minWidth: '26ch' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span aria-hidden="true">
        {reducedMotion ? FALLBACK_TEXT : text}
        <span className="tw-caret" data-state={caretActive ? 'active' : undefined} />
      </span>
      <span className="sr-only">{SR_TEXT}</span>
    </span>
  );
}
