'use client';

import { useEffect, useRef } from 'react';

export default function CursorGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      el.style.setProperty('--mouse-x', `${e.clientX}px`);
      el.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(from #00ffa3 l c h / 0.03), transparent)',
      }}
    />
  );
}
