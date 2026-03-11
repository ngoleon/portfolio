import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Leon Ngo.',
};

const socialLinks = [
  {
    href: 'https://github.com/ngoleon',
    label: 'GitHub profile',
    name: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/ngoleon',
    label: 'LinkedIn profile',
    name: 'LinkedIn',
  },
];

export default function ContactPage() {
  return (
    <section className="flex min-h-[70vh] items-center px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <SectionLabel>{'> ping leon'}</SectionLabel>
        </ScrollReveal>

        {/* Email CTA */}
        <ScrollReveal delay={0.06}>
          <a
            href="mailto:leon@example.com"
            className="mb-10 inline-block text-lg text-accent transition-shadow hover:shadow-glow-sm"
          >
            leon@example.com
          </a>
        </ScrollReveal>

        {/* Social links */}
        <ScrollReveal delay={0.12}>
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="rounded-lg border border-border bg-surface px-5 py-3 text-sm text-text-muted transition-[border-color,box-shadow,color] hover:border-accent/40 hover:text-accent hover:shadow-glow-sm"
              >
                {link.name}
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
