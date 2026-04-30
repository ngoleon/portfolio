import Link from 'next/link';
import HalftoneField from '@/components/ui/HalftoneField';
import Watermark from '@/components/ui/Watermark';
import StampTag from '@/components/ui/StampTag';

export default function NotFound() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden px-6">
      <Watermark number="404" position="bl" size="clamp(8rem, 30vw, 28rem)" />
      <HalftoneField density="subtle" />

      {/* STATUS stamp tilted top-right (desktop only — too noisy on mobile) */}
      <div className="absolute top-8 right-8 z-[3] hidden sm:block">
        <StampTag text="STATUS: NOT FOUND" rotate={-5} />
      </div>

      <div className="relative z-[2] text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          ▸ FILE NOT FOUND
        </p>
        <h1
          className="mt-4 font-display italic font-black tracking-[-0.04em] origin-center"
          style={{
            fontSize: 'clamp(3rem, 12vw, 9rem)',
            transform: 'skewX(var(--skew-x))',
            // Persistent chromatic split: drop-shadow + cyan/red ghost layers.
            textShadow:
              '4px 4px 0 var(--color-accent), -3px 0 0 #00f0ff, 3px 0 0 var(--color-accent)',
          }}
        >
          404<span className="text-[var(--color-accent)]">.</span>
        </h1>

        {/* Fake terminal trace */}
        <div className="mx-auto mt-6 max-w-md text-left font-mono text-[0.75rem] leading-relaxed sm:text-sm">
          <p>
            <span className="text-[var(--color-accent)]">&gt;</span> Error: ROUTE_NOT_FOUND_IN_TREE
          </p>
          <p>
            <span className="text-[var(--color-accent)]">&gt;</span> at <span className="text-[var(--color-accent)]">router.resolve</span>(<span className="opacity-70">{'<unknown>'}</span>)
          </p>
          <p>
            <span className="text-[var(--color-accent)]">&gt;</span> did you mean <code className="text-[var(--color-accent)]">/index</code>?
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block border-[3px] border-[var(--color-ink)] bg-[var(--color-bg)] px-5 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.15em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105"
          style={{ transform: 'skewX(var(--skew-x))', boxShadow: 'var(--shadow-card-sm)' }}
        >
          <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
            ← Return to Index
          </span>
        </Link>
      </div>
    </section>
  );
}
