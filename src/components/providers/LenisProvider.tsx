'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { useReducedMotion } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

interface LenisProviderProps {
  children: ReactNode;
}

/**
 * Routes hash anchor clicks through Lenis.scrollTo so navigation between
 * sections animates with the same easing as the wheel scroll, instead of
 * the browser's instant hash jump. Renders nothing.
 */
function AnchorScrollLinks() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const onClick = (e: MouseEvent) => {
      // Let the browser handle modifier-clicks (open in new tab, etc.).
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

      const target = e.target as HTMLElement | null;
      const link = target?.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      // Skip if the target id is missing — fall back to browser default.
      const id = href.slice(1);
      if (!document.getElementById(id)) return;

      e.preventDefault();
      // Short duration + no lock so rapid-fire clicks cancel and replace the
      // in-flight animation instead of feeling held until it finishes.
      lenis.scrollTo(href, { duration: 0.65 });
      // Update history so back/forward + URL stay in sync without jumping.
      if (window.location.hash !== href) {
        history.pushState(null, '', href);
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  return null;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const reduce = useReducedMotion();

  // When the user prefers reduced motion, render children without Lenis
  if (reduce) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard "expo out" curve
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <AnchorScrollLinks />
      {children}
    </ReactLenis>
  );
}
