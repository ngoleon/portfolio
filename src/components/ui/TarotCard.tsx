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

/* Claude Code icon path, viewBox 0 0 24 24.
   Source: LobeHub icons — claudecode.svg */
const CLAUDE_CODE_PATH =
  'M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z';

export default function TarotCard({
  numeral = 'X',
  title = 'THE ENGINEER',
  subtitle = '// ARCANA · X',
  owner = 'L. NGO',
  width = 'clamp(160px, 18vw, 240px)',
}: TarotCardProps) {
  return (
    <div
      className="group relative"
      style={{
        width,
        aspectRatio: '200 / 300',
        perspective: '1200px',
        transform: 'rotate(var(--rotate-tarot))',
        // Drop shadow lives on the OUTER wrapper, not the preserve-3d element.
        // CSS filter on a preserve-3d ancestor flattens the 3D context, which
        // would defeat backface-visibility:hidden and show the mirrored front
        // when flipped.
        filter: 'drop-shadow(7px 7px 0 var(--color-accent))',
      }}
    >
      <div
        className="relative h-full w-full transition-transform duration-[500ms] ease-[var(--ease-snap)] group-hover:[transform:rotateY(180deg)]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* === FRONT === */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(1px)',
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
                <circle cx="2" cy="2" r="0.9" fill="var(--color-stamp-fg)" />
              </pattern>
            </defs>
            {/* Card body */}
            <rect x="6" y="6" width="188" height="288" fill="var(--color-stamp-bg)" stroke="var(--color-stamp-fg)" strokeWidth="3" />
            <rect x="14" y="14" width="172" height="272" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
            {/* Top numeral */}
            <text x="100" y="38" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-stamp-fg)" letterSpacing="3" fontWeight="700">
              — {numeral} —
            </text>
            <line x1="40" y1="46" x2="160" y2="46" stroke="var(--color-stamp-fg)" strokeWidth="1" />
            {/* Halftone field */}
            <rect x="32" y="60" width="136" height="150" fill="url(#tarot-halftone)" opacity="0.55" />
            {/* Arcana symbol — circle + diamond */}
            <circle cx="100" cy="135" r="46" fill="none" stroke="var(--color-accent)" strokeWidth="3" />
            <path d="M100 89 L146 135 L100 181 L54 135 Z" fill="var(--color-accent)" />
            <g transform="translate(100 135) skewX(-7) translate(-100 -135)">
              <text x="100" y="135" textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="36" fill="var(--color-stamp-fg)">
                {numeral}
              </text>
            </g>
            {/* Bottom labels */}
            <line x1="40" y1="225" x2="160" y2="225" stroke="var(--color-stamp-fg)" strokeWidth="1" />
            <text x="100" y="248" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="15" fill="var(--color-stamp-fg)">
              {title}
            </text>
            <text x="100" y="265" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-accent)" letterSpacing="2.5">
              {subtitle}
            </text>
            <text x="100" y="278" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-stamp-fg)" opacity="0.6" letterSpacing="2">
              {owner}
            </text>
          </svg>
        </div>

        {/* === BACK === */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
          }}
        >
          <svg
            viewBox="0 0 200 300"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Built with Claude"
            className="h-full w-full"
          >
            <title>Built with Claude</title>
            <defs>
              <pattern id="tarot-halftone-back" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.9" fill="var(--color-stamp-fg)" />
              </pattern>
            </defs>
            {/* Card body — mirrors front */}
            <rect x="6" y="6" width="188" height="288" fill="var(--color-stamp-bg)" stroke="var(--color-stamp-fg)" strokeWidth="3" />
            <rect x="14" y="14" width="172" height="272" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
            {/* Top label */}
            <text x="100" y="38" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--color-stamp-fg)" letterSpacing="3" fontWeight="700">
              — REVERSE —
            </text>
            <line x1="40" y1="46" x2="160" y2="46" stroke="var(--color-stamp-fg)" strokeWidth="1" />
            {/* Halftone field */}
            <rect x="32" y="60" width="136" height="150" fill="url(#tarot-halftone-back)" opacity="0.55" />
            {/* Claude Code icon — nested SVG so its 24x24 viewBox is mapped explicitly */}
            <svg x="52" y="87" width="96" height="96" viewBox="0 0 24 24" overflow="visible">
              <path d={CLAUDE_CODE_PATH} fill="var(--color-accent)" fillRule="evenodd" clipRule="evenodd" />
            </svg>
            {/* Bottom labels */}
            <line x1="40" y1="225" x2="160" y2="225" stroke="var(--color-stamp-fg)" strokeWidth="1" />
            <text x="100" y="248" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontWeight="900" fontSize="15" fill="var(--color-stamp-fg)">
              THE FAMILIAR
            </text>
            <text x="100" y="265" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7" fill="var(--color-accent)" letterSpacing="2.5">
              // BUILT WITH CLAUDE
            </text>
            <text x="100" y="278" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-stamp-fg)" opacity="0.6" letterSpacing="2">
              {owner}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
