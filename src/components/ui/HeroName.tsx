interface HeroNameProps {
  first: string;
  last: string;
  /** Whether the trailing punctuation is "!" (energetic) or "." (calm). */
  punct?: '!' | '.';
}

export default function HeroName({ first, last, punct = '!' }: HeroNameProps) {
  return (
    <h1
      className="m-0 font-display italic font-black leading-[0.82] tracking-[-0.06em] origin-left text-[var(--color-ink)]"
      style={{
        fontSize: 'clamp(3.5rem, 10vw, 9rem)',
        transform: 'skewX(var(--skew-x))',
        textShadow: '6px 6px 0 var(--color-accent)',
      }}
    >
      {first}
      <br />
      {last}
      <span
        className="text-[var(--color-accent)]"
        style={{ textShadow: '6px 6px 0 var(--color-ink)' }}
      >
        {punct}
      </span>
    </h1>
  );
}
