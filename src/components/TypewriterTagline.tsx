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
