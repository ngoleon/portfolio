'use client';

import ThemeToggle from './ThemeToggle';

interface TopBarProps {
  /** Section number/total to display, e.g. "01 / 04" */
  indicator?: string;
  /** Status text on the left, e.g. "★ SYSTEM · ACTIVE" */
  status?: string;
  /** Center text, e.g. "SYDNEY · 2026" */
  center?: string;
}

export default function TopBar({
  indicator = '01 / 04',
  status = '★ SYSTEM · ACTIVE',
  center = 'SYDNEY · 2026',
}: TopBarProps) {
  // Split status into label + accent so the "★" star and "ACTIVE" word render in red
  return (
    <header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b-[3px] border-[var(--color-accent)] bg-[var(--color-bg)] text-[var(--color-ink)] px-4 sm:px-8 py-2 font-mono text-[0.65rem] sm:text-[0.7rem] tracking-[0.18em] uppercase"
    >
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className="text-[var(--color-accent)]">★</span>
        <span><span className="text-[var(--color-accent)]">SYSTEM</span> · ACTIVE</span>
      </span>
      <span className="hidden sm:inline">{center}</span>
      <span className="flex items-center gap-3">
        <span className="text-[var(--color-accent)]">[ INDEX {indicator} ]</span>
        <ThemeToggle />
      </span>
    </header>
  );
}
