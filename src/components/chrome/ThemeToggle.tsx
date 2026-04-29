'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { motion } from 'motion/react';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="grid h-8 w-8 place-items-center text-[var(--color-accent)] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-110"
    >
      <motion.svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {theme === 'dark' ? (
          /* Moon */
          <path d="M11 8.5A4.5 4.5 0 0 1 5.5 3 4.5 4.5 0 1 0 11 8.5Z" fill="currentColor" />
        ) : (
          /* Sun */
          <>
            <circle cx="7" cy="7" r="2.5" fill="currentColor" />
            <line x1="7" y1="1" x2="7" y2="2.5" />
            <line x1="7" y1="11.5" x2="7" y2="13" />
            <line x1="1" y1="7" x2="2.5" y2="7" />
            <line x1="11.5" y1="7" x2="13" y2="7" />
            <line x1="2.6" y1="2.6" x2="3.7" y2="3.7" />
            <line x1="10.3" y1="10.3" x2="11.4" y2="11.4" />
            <line x1="2.6" y1="11.4" x2="3.7" y2="10.3" />
            <line x1="10.3" y1="3.7" x2="11.4" y2="2.6" />
          </>
        )}
      </motion.svg>
    </button>
  );
}
