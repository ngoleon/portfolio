'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const routes = [
  { href: '#', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevQuery, setPrevQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset selection when query changes (React 19 "reset state during render" pattern)
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSelectedIndex(0);
  }

  const filtered = routes.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery('');
      setSelectedIndex(0);
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    },
    []
  );

  // Open/close with Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const clampedIndex = Math.min(selectedIndex, Math.max(filtered.length - 1, 0));

  // Keyboard navigation within palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[clampedIndex]) {
      navigate(filtered[clampedIndex].href);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-[var(--color-ink)]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setOpen(false);
              setQuery('');
            }}
          />
          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="fixed inset-x-4 top-[20vh] z-[61] mx-auto max-w-md overflow-hidden border-[3px] border-[var(--color-ink)] bg-[var(--color-bg)] shadow-[var(--shadow-card)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={true}
              aria-controls="command-palette-listbox"
              aria-activedescendant={filtered[clampedIndex] ? `cp-item-${clampedIndex}` : undefined}
              placeholder="Navigate to..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="w-full border-b-[3px] border-[var(--color-accent)] bg-transparent px-4 py-3 font-mono text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 outline-hidden uppercase tracking-[0.05em]"
            />
            <ul id="command-palette-listbox" role="listbox" className="py-2">
              {filtered.map((route, i) => (
                <li key={route.href} id={`cp-item-${i}`} role="option" aria-selected={i === clampedIndex}>
                  <button
                    onClick={() => navigate(route.href)}
                    className={`w-full px-4 py-2 text-left font-mono text-[0.85rem] tracking-[0.02em] transition-colors ${
                      i === clampedIndex
                        ? 'bg-[var(--color-accent)] text-[var(--color-bg)]'
                        : 'text-[var(--color-ink)]/85 hover:text-[var(--color-accent)]'
                    }`}
                  >
                    {i === clampedIndex && <span aria-hidden="true">▸ </span>}{route.label}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-sm text-[var(--color-ink)]/60">
                  No matches
                </li>
              )}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
