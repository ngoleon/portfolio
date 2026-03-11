'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

const routes = [
  { href: '/', label: '~/' },
  { href: '/projects', label: './projects' },
  { href: '/about', label: './about' },
  { href: '/contact', label: './contact' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = routes.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery('');
      setSelectedIndex(0);
      router.push(href);
    },
    [router]
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

  // Keyboard navigation within palette
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      navigate(filtered[selectedIndex].href);
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
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
            className="fixed inset-x-4 top-[20vh] z-[61] mx-auto max-w-md overflow-hidden rounded-lg border border-border bg-surface shadow-glow-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Navigate to..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-text placeholder:text-text-dim outline-hidden"
            />
            <ul className="py-2">
              {filtered.map((route, i) => (
                <li key={route.href}>
                  <button
                    onClick={() => navigate(route.href)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      i === selectedIndex
                        ? 'bg-surface-bright text-accent'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    {route.label}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-4 py-2 text-sm text-text-dim">
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
