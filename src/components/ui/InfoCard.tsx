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
      className={`skew-italic shadow-[var(--shadow-card-md)] bg-[var(--color-stamp-bg)] text-[var(--color-stamp-fg)] max-w-[280px] xl:max-w-[320px] ${className}`}
    >
      <div className="skew-italic-counter">
        <div className="px-4 py-3 font-mono text-[0.7rem] leading-[1.55] tracking-[0.02em] xl:px-5 xl:py-4 xl:text-[0.78rem] xl:leading-[1.6]">
          {label && (
            <div className="mb-1.5 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--color-accent)] xl:text-[0.6rem]">
              {label}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
