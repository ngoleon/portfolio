interface SectionLabelProps {
  children: string;
}

export default function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="mb-8 font-mono text-sm tracking-widest text-text-dim uppercase">
      {children}
    </p>
  );
}
