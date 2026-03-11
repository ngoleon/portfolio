'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

interface TextDecryptProps {
  text: string;
  className?: string;
  /** Total animation duration in ms */
  duration?: number;
}

export default function TextDecrypt({
  text,
  className,
  duration = 600,
}: TextDecryptProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(text);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(text);
      return;
    }

    setDisplayed('');

    const totalChars = text.length;
    const cyclesPerChar = 2;
    const totalFrames = totalChars * cyclesPerChar;
    const frameInterval = duration / totalFrames;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const resolvedCount = Math.floor(frame / cyclesPerChar);

      const result = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < resolvedCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayed(result);

      if (resolvedCount >= totalChars) {
        clearInterval(interval);
        setDisplayed(text);
      }
    }, frameInterval);

    return () => clearInterval(interval);
  }, [text, duration, prefersReducedMotion]);

  return <span className={className}>{displayed}</span>;
}
