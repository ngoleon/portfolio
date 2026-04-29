import type { ReactNode } from 'react';

interface DiagonalSlashProps {
  /** Vertical position from top of parent. CSS value. */
  top?: string;
  /** Banner height. CSS value. */
  height?: string;
  /** Text alignment. */
  align?: 'left' | 'center' | 'right';
  /** Z-index — defaults below the rest of hero content (3) so tarot/cluster sit on top. */
  zIndex?: number;
  className?: string;
  children: ReactNode;
}

export default function DiagonalSlash({
  top = '22rem',
  height = '75px',
  align = 'center',
  zIndex = 3,
  className = '',
  children,
}: DiagonalSlashProps) {
  const justify =
    align === 'left' ? 'justify-start pl-20' :
    align === 'right' ? 'justify-end pr-20' :
    'justify-center';

  return (
    <div
      className={`absolute -left-[5%] -right-[5%] flex items-center bg-[var(--color-bg)] text-[var(--color-ink)] font-display italic font-black tracking-[0.04em] whitespace-nowrap overflow-hidden shadow-[var(--shadow-card)] ${justify} ${className}`}
      style={{
        top,
        height,
        transform: 'skewY(var(--skew-y)) skewX(var(--skew-x))',
        zIndex,
        fontSize: 'clamp(0.95rem, 1.6vw, 1.4rem)',
      }}
    >
      <span>{children}</span>
    </div>
  );
}
