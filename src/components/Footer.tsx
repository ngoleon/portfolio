const socialLinks = [
  { href: 'https://github.com/ngoleon', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ngo-leon/', label: 'LinkedIn' },
  { href: 'mailto:ngo.leon@gmail.com', label: 'Email' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-text-dim">© 2026 Leon Ngo</p>
        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="text-sm text-text-dim transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
