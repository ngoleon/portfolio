interface StampTagProps {
  text: string;
  rotate?: number; // degrees, default -7
  className?: string;
}

export default function StampTag({ text, rotate = -7, className = '' }: StampTagProps) {
  return (
    <span
      className={`inline-block border-[3px] border-[var(--color-accent)] bg-[var(--color-ink)] text-[var(--color-accent)] px-3 py-2 font-display italic font-black text-[0.85rem] tracking-[0.12em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span aria-hidden="true">★</span> {text} <span aria-hidden="true">★</span>
    </span>
  );
}
