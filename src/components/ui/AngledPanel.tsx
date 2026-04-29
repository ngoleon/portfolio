import type { ReactNode } from 'react';

interface AngledPanelProps {
  /** Skew direction. 'h' = full diagonal (slash banner). 'v' = italic-only (info-card). */
  direction?: 'h' | 'v';
  /** Shadow size. */
  shadow?: 'sm' | 'md' | 'lg';
  /** Inverts colors — bg becomes ink, ink becomes bg. Used for stamp-style dark cards on light theme. */
  inverted?: boolean;
  className?: string;
  children: ReactNode;
}

const shadowClass: Record<NonNullable<AngledPanelProps['shadow']>, string> = {
  sm: 'shadow-[var(--shadow-card-sm)]',
  md: 'shadow-[var(--shadow-card-md)]',
  lg: 'shadow-[var(--shadow-card)]',
};

export default function AngledPanel({
  direction = 'v',
  shadow = 'md',
  inverted = false,
  className = '',
  children,
}: AngledPanelProps) {
  // direction='h' applies skew-banner (skewY + skewX). 'v' applies skew-italic (skewX only).
  const skewClass = direction === 'h' ? 'skew-banner' : 'skew-italic';

  // The counter-skew on the inner wrapper keeps text/content upright while the panel is skewed.
  const counterSkewClass = direction === 'h' ? 'skew-banner-counter' : 'skew-italic-counter';

  const colors = inverted
    ? 'bg-[var(--color-ink)] text-[var(--color-bg)]'
    : 'bg-[var(--color-bg)] text-[var(--color-ink)]';

  return (
    <div className={`${skewClass} ${shadowClass[shadow]} ${colors} ${className}`}>
      <div className={counterSkewClass}>{children}</div>
    </div>
  );
}
