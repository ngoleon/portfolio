interface HeroNameProps {
  first: string;
  last: string;
  /** Whether the trailing punctuation is "!" (energetic) or "." (calm). */
  punct?: '!' | '.';
}

export default function HeroName({ first, last, punct = '!' }: HeroNameProps) {
  return (
    <h1
      className="m-0 font-display italic font-medium leading-[0.85] tracking-[-0.04em] origin-left text-[var(--color-ink)]"
      style={{
        fontSize: 'clamp(3rem, 8vw, 7.5rem)',
        transform: 'skewX(var(--skew-x))',
        textShadow: 'var(--shadow-text)',
      }}
    >
      {first}
      <br />
      {last}
      <span
        className="text-[var(--color-accent)]"
        style={{ textShadow: '4px 4px 0 var(--color-ink)' }}
      >
        {punct}
      </span>
    </h1>
  );
}
