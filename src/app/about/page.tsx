import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal';
import SectionLabel from '@/components/SectionLabel';
import ProfilePhoto from '@/components/ProfilePhoto';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Leon Ngo, software engineer.',
};

const skills = {
  languages: ['TypeScript', 'Python', 'Go', 'SQL'],
  frameworks: ['React', 'Next.js', 'Node.js', 'FastAPI'],
  tools: ['Git', 'Docker', 'Terraform', 'PostgreSQL'],
  platforms: ['AWS', 'Vercel', 'Linux'],
};

export default function AboutPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <SectionLabel>{'> whoami'}</SectionLabel>
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
          {/* Bio + Skills */}
          <div>
            <ScrollReveal>
              <p className="mb-10 max-w-[65ch] text-base leading-[1.7] text-text-muted">
                Software engineer focused on building clean, performant web applications.
                I enjoy working across the stack — from designing component systems to
                optimizing database queries. Currently interested in developer tooling
                and infrastructure.
              </p>
            </ScrollReveal>

            {/* Skills — package.json style */}
            <ScrollReveal delay={0.1}>
              <SectionLabel>{'// dependencies'}</SectionLabel>
              <div className="rounded-lg border border-border bg-surface p-5">
                <pre className="text-sm leading-[1.8]">
                  <span className="text-text-dim">{'{'}</span>
                  {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="ml-4">
                      <span className="text-accent-secondary">{`"${category}"`}</span>
                      <span className="text-text-dim">: [</span>
                      {items.map((item, i) => (
                        <span key={item}>
                          <span className="text-accent">{`"${item}"`}</span>
                          {i < items.length - 1 && (
                            <span className="text-text-dim">, </span>
                          )}
                        </span>
                      ))}
                      <span className="text-text-dim">],</span>
                    </div>
                  ))}
                  <span className="text-text-dim">{'}'}</span>
                </pre>
              </div>
            </ScrollReveal>
          </div>

          {/* Profile photo */}
          <ScrollReveal delay={0.2} className="flex justify-center lg:justify-end">
            <ProfilePhoto />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
