import TextDecrypt from '@/components/TextDecrypt';
import ScrollReveal from '@/components/ScrollReveal';
import SectionLabel from '@/components/SectionLabel';
import ProjectCard from '@/components/ProjectCard';
import ExperienceCard from '@/components/ExperienceCard';
import ProfilePhoto from '@/components/ProfilePhoto';
import { projects } from '@/data/projects';
import { experience } from '@/data/experience';

const skills = {
  Languages: ['C#', 'Java', 'TypeScript', 'Python', 'C/C++', 'SQL', 'HCL'],
  Backend: ['.NET 10', 'Spring Boot', 'Node.js', 'React', 'Wolverine CQRS'],
  Cloud: ['Azure', 'AWS', 'Kubernetes', 'Terragrunt', 'Docker'],
  DevOps: ['ArgoCD', 'GitHub Actions', 'Helm', 'Grafana', 'OpenTelemetry'],
};

const socialLinks = [
  { href: 'https://github.com/ngoleon', name: 'GitHub' },
  { href: 'https://linkedin.com/in/ngoleon', name: 'LinkedIn' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-5xl">
          <ScrollReveal>
            <h1 className="mb-4 font-heading text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-text">
              Leon Ngo
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="mb-6 text-[clamp(1rem,3vw,1.5rem)]">
              <TextDecrypt
                text="Software Developer"
                className="font-medium text-accent"
                duration={600}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="max-w-[55ch] text-base leading-relaxed text-text-muted">
              Cloud-native microservices, platform engineering, and AI-assisted developer tooling — from .NET backends on Azure to embedded Linux systems.
            </p>
          </ScrollReveal>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="animate-pulse text-text-dim"
          >
            <polyline points="4,7 10,13 16,7" />
          </svg>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <SectionLabel>About</SectionLabel>
          </ScrollReveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <ScrollReveal>
                <p className="mb-10 max-w-[55ch] text-base leading-[1.75] text-text-muted">
                  Software developer with experience across enterprise cloud-native microservices,
                  platform engineering, and full-stack development. Currently building .NET 10
                  microservice platforms on Azure with Kubernetes, designing infrastructure-as-code
                  with Terragrunt, and developing AI-assisted developer tooling. Background spans
                  embedded systems, serverless backends, and community-facing product development.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <div className="space-y-4">
                  {Object.entries(skills).map(([category, items]) => (
                    <div key={category} className="flex flex-wrap items-center gap-2">
                      <span className="w-20 shrink-0 font-mono text-xs uppercase tracking-wider text-text-dim">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-surface-bright px-3 py-1 text-xs text-text-muted"
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
            <ScrollReveal delay={0.1} className="flex justify-center lg:justify-end">
              <ProfilePhoto />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <SectionLabel>Experience</SectionLabel>
          </ScrollReveal>
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
      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <SectionLabel>Projects</SectionLabel>
          </ScrollReveal>
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
      <section id="contact" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <SectionLabel>Contact</SectionLabel>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <p className="mb-6 text-lg text-text">
              Interested in working together?
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <a
              href="mailto:ngo.leon@gmail.com"
              className="mb-8 inline-block text-lg text-accent transition-shadow hover:shadow-glow-sm"
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
                  className="text-sm text-text-muted transition-colors hover:text-accent"
                >
                  {link.name} →
                </a>
              ))}
              <a
                href="#"
                className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm text-text-muted transition-[border-color,box-shadow,color] hover:border-accent/40 hover:text-accent hover:shadow-glow-sm"
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
