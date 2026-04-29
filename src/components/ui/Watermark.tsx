interface WatermarkProps {
  number: string;
  /** Position within parent. */
  position?: 'bl' | 'br' | 'tl' | 'tr';
  /** Font size override (CSS value). Default uses clamp() for fluid sizing. */
  size?: string;
}

export default function Watermark({
  number,
  position = 'bl',
  size = 'clamp(10rem, 22vw, 22rem)',
}: WatermarkProps) {
  const placement: Record<NonNullable<WatermarkProps['position']>, string> = {
    bl: 'bottom-[-3rem] left-[-1rem]',
    br: 'bottom-[-3rem] right-[-1rem]',
    tl: 'top-[-3rem] left-[-1rem]',
    tr: 'top-[-3rem] right-[-1rem]',
  };

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-0 select-none font-display italic font-black leading-[0.85] tracking-[-0.07em] text-[var(--color-accent)] ${placement[position]}`}
      style={{
        fontSize: size,
        transform: 'skewX(var(--skew-x))',
        opacity: 0.18,
      }}
    >
      {number}
    </span>
  );
}
