'use client';

import { sections } from '@/data/sections';
import { useActiveSection } from '@/hooks/useActiveSection';
import ThemeToggle from './ThemeToggle';

interface TopBarProps {
  /** Center text, e.g. "MELBOURNE · 2026" */
  center?: string;
}

export default function TopBar({ center = 'MELBOURNE · 2026' }: TopBarProps) {
  const ids = sections.map((s) => s.href.replace('#', ''));
  const activeId = useActiveSection(ids);
  const total = String(sections.length).padStart(2, '0');
  const activeIdx = sections.findIndex((s) => s.href === `#${activeId}`);
  const current = String((activeIdx >= 0 ? activeIdx : 0) + 1).padStart(2, '0');
  const activeSection = sections[activeIdx >= 0 ? activeIdx : 0];
  const activeLabel = (activeSection?.short ?? activeSection?.label ?? 'Index').toUpperCase();

  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-[3px] border-[var(--color-accent)] bg-[var(--color-stamp-bg)] text-[var(--color-stamp-fg)] px-4 sm:px-8 py-2 font-mono text-[0.65rem] sm:text-[0.7rem] tracking-[0.18em] uppercase"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="text-[var(--color-accent)]">★</span>
        <span><span className="text-[var(--color-accent)]">SYSTEM</span> · ACTIVE</span>
      </span>
      {/* Center text is absolutely positioned so it stays viewport-centered
          regardless of how wide the side spans grow. Pointer-events:none keeps
          it from blocking interactions on the chrome behind it. */}
      <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 hidden sm:inline">
        {center}
      </span>
      <span className="flex items-center gap-3">
        <span className="text-[var(--color-accent)]">[ {activeLabel} {current} / {total} ]</span>
        <ThemeToggle />
      </span>
    </header>
  );
}
