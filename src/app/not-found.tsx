import Link from 'next/link';
import HalftoneField from '@/components/ui/HalftoneField';
import Watermark from '@/components/ui/Watermark';

export default function NotFound() {
  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden px-6">
      <Watermark number="404" position="bl" size="clamp(8rem, 30vw, 28rem)" />
      <HalftoneField density="subtle" />
      <div className="relative z-[2] text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
          ▸ FILE NOT FOUND
        </p>
        <h1
          className="mt-4 font-display italic font-black tracking-[-0.04em] origin-center"
          style={{
            fontSize: 'clamp(3rem, 12vw, 9rem)',
            transform: 'skewX(var(--skew-x))',
            textShadow: 'var(--shadow-text)',
          }}
        >
          404<span className="text-[var(--color-accent)]">.</span>
        </h1>
        <p className="mt-4 font-mono text-sm">This page doesn&apos;t exist (or was infiltrated).</p>
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
