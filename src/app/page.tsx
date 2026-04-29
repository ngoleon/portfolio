import ScrollReveal from '@/components/ScrollReveal';
import ProjectCard from '@/components/ProjectCard';
import ExperienceCard from '@/components/ExperienceCard';
import { projects } from '@/data/projects';
import { experience } from '@/data/experience';
import SectionLabel from '@/components/ui/SectionLabel';
import HeroName from '@/components/ui/HeroName';
import TarotCard from '@/components/ui/TarotCard';
import DiagonalSlash from '@/components/ui/DiagonalSlash';
import InfoCard from '@/components/ui/InfoCard';
import StampTag from '@/components/ui/StampTag';
import Watermark from '@/components/ui/Watermark';
import HalftoneField from '@/components/ui/HalftoneField';

const skills = {
  Languages: ['C#', 'Java', 'TypeScript', 'Python', 'C/C++', 'SQL', 'HCL'],
  Backend: ['.NET 10', 'Spring Boot', 'Node.js', 'React', 'Wolverine CQRS'],
  Cloud: ['Azure', 'AWS', 'Kubernetes', 'Terragrunt', 'Docker'],
  DevOps: ['ArgoCD', 'GitHub Actions', 'Helm', 'Grafana', 'OpenTelemetry'],
};

const socialLinks = [
  { href: 'https://github.com/ngoleon', name: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ngo-leon/', name: 'LinkedIn' },
];

export default function Home() {
  return (
    <>
      {/* === HERO / INDEX === */}
      <section
        id="index"
        className="relative overflow-hidden"
        style={{ minHeight: '100dvh', maxHeight: '900px' }}
      >
        {/* Background watermark numeral */}
        <Watermark number="04" position="bl" />

        {/* Subtle halftone field over whole hero */}
        <HalftoneField density="subtle" />

        {/* Bottom red glow gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2"
          style={{ background: 'linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent)' }}
        />

        {/* === Name zone === */}
        <div
          className="absolute z-[5] max-w-[50%]"
          style={{ top: 'clamp(4rem, 8vh, 6rem)', left: 'clamp(1rem, 4vw, 2.5rem)' }}
        >
          <SectionLabel number="01" label="Index" />
          <div className="mt-2.5">
            <HeroName first="Leon" last="Ngo" punct="!" />
          </div>
          <p
            className="mt-4 font-mono tracking-[0.04em] opacity-85"
            style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)' }}
          >
            Software Engineer{' '}
            <span className="text-[var(--color-accent)]">// distributed systems · dev tools</span>
          </p>
        </div>

        {/* === Tarot card right side === */}
        <div
          className="absolute z-[6]"
          style={{
            top: 'clamp(4rem, 6vh, 5.5rem)',
            right: 'clamp(1rem, 4vw, 2.5rem)',
          }}
        >
          <TarotCard />
        </div>

        {/* === Diagonal slash === */}
        <DiagonalSlash top="clamp(18rem, 36vh, 22rem)" height="clamp(60px, 10vw, 75px)" align="center">
          DISTRIBUTED SYSTEMS{' '}
          <span className="text-[var(--color-accent)]">·</span> CLOUD{' '}
          <span className="text-[var(--color-accent)]">·</span> DEV TOOLS
        </DiagonalSlash>

        {/* === Bottom cluster: mission card + stamp === */}
        <div
          className="absolute z-[6] flex items-end gap-4 sm:gap-6"
          style={{ left: 'clamp(1rem, 4vw, 2.5rem)', bottom: 'clamp(6rem, 12vh, 9.5rem)' }}
        >
          <InfoCard label="// CURRENT MISSION">
            .NET 10 microservices on Azure · K8s · IaC with Terragrunt · AI-assisted dev tooling
          </InfoCard>
          <div style={{ transform: 'translateY(-2rem)' }}>
            <StampTag text="ROOT ACCESS GRANTED" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          {/* SectionLabel placeholder — rebuilt in Phase 6 */}
          <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <ScrollReveal>
                <p className="mb-10 text-base leading-[1.75] text-text-muted lg:text-lg">
                  Software engineer specialising in distributed systems, cloud-native platforms, and developer tooling. I currently build .NET 10 microservice systems on Azure with Kubernetes, design infrastructure-as-code using Terragrunt, and develop AI-assisted tools to improve developer productivity. My background spans embedded Linux development, serverless backend architecture, and building full-stack platforms used by active online communities. I enjoy building reliable systems, exploring low-level runtime tooling, and designing platforms that help other developers move faster.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <div className="space-y-4">
                  {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                      <span className="shrink-0 font-mono text-sm uppercase tracking-wider text-text-dim sm:w-24">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-surface-bright px-3 py-1 text-sm text-text-muted"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          {/* SectionLabel placeholder — rebuilt in Phase 6 */}
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <ScrollReveal key={exp.company} delay={i * 0.05}>
                <ExperienceCard experience={exp} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          {/* SectionLabel placeholder — rebuilt in Phase 6 */}
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project, i) => (
              <ScrollReveal
                key={project.id}
                delay={i * 0.05}
                className={project.featured ? 'md:col-span-2' : ''}
              >
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          {/* SectionLabel placeholder — rebuilt in Phase 6 */}
          <ScrollReveal delay={0.05}>
            <p className="mb-6 text-xl text-text">
              Interested in working together?
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <a
              href="mailto:ngo.leon@gmail.com"
              className="mb-8 inline-block text-xl text-accent transition-shadow hover:shadow-glow-sm"
            >
              ngo.leon@gmail.com
            </a>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 text-base text-text-muted transition-colors hover:text-accent"
                >
                  {link.name} →
                </a>
              ))}
              <a
                href="#"
                className="rounded-lg border border-border bg-surface px-6 py-3 text-base text-text-muted transition-[border-color,box-shadow,color] hover:border-accent/40 hover:text-accent hover:shadow-glow-sm"
              >
                Download Resume
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
