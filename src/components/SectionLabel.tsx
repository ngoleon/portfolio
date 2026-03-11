interface SectionLabelProps {
  children: string;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-6 text-xs tracking-[0.02em] text-text-dim">
      {children}
    </p>
  );
}
