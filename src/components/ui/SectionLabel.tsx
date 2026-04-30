interface SectionLabelProps {
  number: string;   // "01"
  label: string;    // "Index"
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <span className="inline-flex items-center font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-accent)] font-bold opacity-60 before:content-['▸_']">
      {number} / {label}
    </span>
  );
}
