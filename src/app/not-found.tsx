import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <h1 className="mb-4 text-[clamp(2rem,8vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
        Error 404
      </h1>
      <p className="mb-8 text-text-muted">path not found</p>
      <Link
        href="/"
        className="text-sm text-accent transition-colors hover:text-accent-secondary"
      >
        cd ~/leon
      </Link>
    </section>
  );
}
