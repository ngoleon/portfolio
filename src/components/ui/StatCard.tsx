import type { Stat } from '@/data/stats';

interface StatCardProps {
  name: string;             // "L. NGO"
  rank: string;             // "04"
  role: string;             // "// THE ENGINEER · CODENAME · ROOT"
  stats: Stat[];
  footer?: string;          // "★ ROOT ACCESS GRANTED ★"
}

export default function StatCard({
  name,
  rank,
  role,
  stats,
  footer = '★ ROOT ACCESS GRANTED ★',
}: StatCardProps) {
  return (
    <div className="relative">
      {/* Red offset shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-accent)]"
        style={{ transform: 'skewX(var(--skew-x)) translate(8px, 8px)' }}
      />
      {/* Skewed card */}
      <div
        className="relative bg-[var(--color-ink)] text-[var(--color-bg)] border-[3px] border-[var(--color-bg)] p-6 box-border"
        style={{ transform: 'skewX(var(--skew-x))' }}
      >
        <div style={{ transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
          {/* Top row: confidant tag + rank */}
          <div className="flex justify-between font-mono text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-accent)] mb-1.5">
            <span>★ CONFIDANT</span>
            <span>RANK · {rank}</span>
          </div>
          <h3 className="m-0 font-display italic font-black text-[1.5rem] leading-none tracking-[-0.03em]">
            {name}
          </h3>
          <p className="font-mono text-[0.7rem] text-[var(--color-bg)] opacity-75 mt-1.5 tracking-[0.05em]">
            {role}
          </p>
          <div className="h-0.5 bg-[var(--color-accent)] my-4" />
          {/* Stat rows */}
          {stats.map((s) => (
            <div
              key={s.label}
              className="grid items-center gap-2 mb-2 text-[0.7rem]"
              style={{ gridTemplateColumns: '70px 1fr 30px' }}
            >
              <span className="font-mono text-[var(--color-accent)] tracking-[0.08em]">{s.label}</span>
              <div className="bg-[var(--color-bg)]/15 h-2 relative">
                <div
                  className="bg-[var(--color-accent)] h-full"
                  style={{ width: `${s.value}%` }}
                />
              </div>
              <span className="font-mono text-[0.65rem] text-right text-[var(--color-bg)]/85">
                {s.value}
              </span>
            </div>
          ))}
          {/* Footer stamp */}
          <div className="mt-3 text-center font-mono text-[0.65rem] text-[var(--color-accent)] tracking-[0.18em] border-t border-[var(--color-bg)]/30 pt-2.5">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
