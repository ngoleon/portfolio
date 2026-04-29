'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which `<section id="...">` is currently in view.
 * Returns the section id (without `#`).
 *
 * Pass the list of section ids in document order. The hook returns
 * whichever id has the most viewport overlap right now.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = active;
        let bestRatio = -1;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActive(bestId);
      },
      {
        // Observe each section's overlap with a band around the middle
        // of the viewport. Threshold list = many checkpoints so the
        // callback fires smoothly as a section enters/leaves.
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // ids is a prop array; consumers should pass a stable reference
    // (e.g. memoized) — we intentionally re-init when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(',')]);

  return active;
}
