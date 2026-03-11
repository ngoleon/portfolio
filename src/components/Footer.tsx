import Link from 'next/link';

const socialLinks = [
  { href: 'https://github.com/ngoleon', label: 'GitHub', icon: 'GH' },
  { href: 'https://linkedin.com/in/ngoleon', label: 'LinkedIn', icon: 'LI' },
  { href: 'mailto:leon@example.com', label: 'Email', icon: '@' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-xs text-text-dim">© 2026 leon ngo</p>
        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={link.label}
              className="text-xs text-text-dim transition-colors hover:text-accent"
            >
              {link.icon}
            </Link>
          ))}
        </div>
        <p className="text-xs text-text-dim">built with next.js + tailwind</p>
      </div>
    </footer>
  );
}
