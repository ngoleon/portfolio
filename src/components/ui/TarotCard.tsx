interface TarotCardProps {
  /** Roman numeral / arcana number, default "X" (THE ENGINEER) */
  numeral?: string;
  /** Title underneath, default "THE ENGINEER" */
  title?: string;
  /** Sub-label, default "// ARCANA · X" */
  subtitle?: string;
  /** Owner name at the bottom, default "L. NGO" */
  owner?: string;
  /** Width — controls card size; height auto via aspect ratio. */
  width?: string;
}

export default function TarotCard({
  numeral = 'X',
  title = 'THE ENGINEER',
  subtitle = '// ARCANA · X',
  owner = 'L. NGO',
  width = 'clamp(160px, 18vw, 240px)',
}: TarotCardProps) {
  return (
    <div
      className="relative transition-transform duration-200 ease-[var(--ease-snap)] hover:rotate-[-1.5deg] hover:scale-[1.04]"
      style={{
        width,
        aspectRatio: '200 / 300',
        transform: 'rotate(var(--rotate-tarot))',
        filter: 'drop-shadow(7px 7px 0 var(--color-accent))',
      }}
    >
      <svg
        viewBox="0 0 200 300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Leon Ngo — ${title}`}
        className="h-full w-full"
      >
        <title>Leon Ngo — {title}</title>
        <defs>
          <pattern id="tarot-halftone" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill="var(--color-ink)" />
          </pattern>
        </defs>
        {/* Card body */}
        <rect x="6" y="6" width="188" height="288" fill="var(--color-bg)" stroke="var(--color-ink)" strokeWidth="3" />
        <rect x="14" y="14" width="172" height="272" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
        {/* Top numeral */}
        <text x="100" y="38" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-ink)" letterSpacing="3" fontWeight="700">
          — {numeral} —
        </text>
        <line x1="40" y1="46" x2="160" y2="46" stroke="var(--color-ink)" strokeWidth="1" />
        {/* Halftone field */}
        <rect x="32" y="60" width="136" height="150" fill="url(#tarot-halftone)" opacity="0.55" />
        {/* Arcana symbol — circle + diamond */}
        <circle cx="100" cy="135" r="46" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
        <path d="M100 89 L146 135 L100 181 L54 135 Z" fill="var(--color-accent)" />
        <g transform="translate(100 148) skewX(-7) translate(-100 -148)">
          <text x="100" y="148" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="36" fill="var(--color-ink)">
            {numeral}
          </text>
        </g>
        {/* Bottom labels */}
        <line x1="40" y1="225" x2="160" y2="225" stroke="var(--color-ink)" strokeWidth="1" />
        <text x="100" y="248" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="15" fill="var(--color-ink)">
          {title}
        </text>
        <text x="100" y="265" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-accent)" letterSpacing="2.5">
          {subtitle}
        </text>
        <text x="100" y="278" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink)" opacity="0.6" letterSpacing="2">
          {owner}
        </text>
      </svg>
    </div>
  );
}
