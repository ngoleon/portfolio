import type { ReactNode } from 'react';

interface InfoCardProps {
  /** Optional small uppercase mono label above the body. */
  label?: string;
  className?: string;
  children: ReactNode;
}

export default function InfoCard({ label, className = '', children }: InfoCardProps) {
  return (
    <div
      className={`skew-italic shadow-[var(--shadow-card-md)] bg-[var(--color-stamp-bg)] text-[var(--color-stamp-fg)] max-w-[320px] ${className}`}
    >
      <div className="skew-italic-counter">
        <div className="px-5 py-4 font-mono text-[0.78rem] leading-[1.6] tracking-[0.02em]">
          {label && (
            <div className="mb-1.5 text-[0.6rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {label}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
