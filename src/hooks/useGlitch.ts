import { useRef } from 'react';

/**
 * Drives a hover-triggered glitch effect. Returns props to spread onto
 * the target element. First mouseenter sets data-glitch="split" (chromatic
 * flash); subsequent mouseenters set data-glitch="jitter". Re-fires on
 * a single element are debounced to >800ms apart. Honors
 * prefers-reduced-motion (no-op when reduce is set).
 *
 * The corresponding CSS lives in globals.css under the
 * "HOVER GLITCHES" section.
 */
export function useGlitch() {
  const seen = useRef(false);
  const lastTrigger = useRef(0);

  const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const now = performance.now();
    const target = e.currentTarget;

    if (!seen.current) {
      target.dataset.glitch = 'split';
      seen.current = true;
      lastTrigger.current = now;
    } else if (now - lastTrigger.current > 800) {
      target.dataset.glitch = 'jitter';
      lastTrigger.current = now;
    }
  };

  const onAnimationEnd = (e: React.AnimationEvent<HTMLElement>) => {
    delete e.currentTarget.dataset.glitch;
  };

  return { onMouseEnter, onAnimationEnd };
}
