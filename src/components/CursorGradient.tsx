'use client';

import { useEffect, useRef, useState } from 'react';

export default function CursorGradient() {
  const ref = useRef<HTMLDivElement>(null);
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover)');
    setHasHover(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHasHover(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!hasHover) return;

    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      el.style.setProperty('--mouse-x', `${e.clientX}px`);
      el.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasHover]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(from #34d399 l c h / 0.07), transparent)',
      }}
    />
  );
}
