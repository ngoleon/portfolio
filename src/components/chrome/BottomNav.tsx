'use client';

import Link from 'next/link';
import { sections } from '@/data/sections';
import { useActiveSection } from '@/hooks/useActiveSection';

export default function BottomNav() {
  const ids = sections.map((s) => s.href.replace('#', ''));
  const activeId = useActiveSection(ids);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 sm:gap-7 border-t-[3px] border-[var(--color-accent)] bg-[var(--color-stamp-bg)] text-[var(--color-stamp-fg)] px-4 sm:px-8 py-2.5 sm:py-3 font-mono text-[0.65rem] sm:text-[0.75rem] tracking-[0.12em] uppercase"
    >
      {sections.map((s) => {
        const isActive = s.href === `#${activeId}`;
        return (
          <Link
            key={s.href}
            href={s.href}
            className={`transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-110 hover:text-[var(--color-accent)] ${
              isActive ? 'text-[var(--color-accent)] font-bold before:content-["▸_"]' : ''
            }`}
          >
            {s.number} {s.label}
          </Link>
        );
      })}
      <span className="ml-auto hidden sm:inline opacity-50 text-[0.65rem]">↗ ngoleon.com</span>
    </nav>
  );
}
