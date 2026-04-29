import TextDecrypt from '@/components/TextDecrypt';
import ScrollReveal from '@/components/ScrollReveal';
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
  { href: 'https://www.linkedin.com/in/ngo-leon/', name: 'LinkedIn' },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-dvh flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-5xl">
          <ScrollReveal>
            <h1 className="mb-4 font-heading text-[clamp(2.5rem,8vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-text">
              Leon Ngo
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.05}>
            <div className="mb-6 text-[clamp(1rem,3vw,1.5rem)]">
              <TextDecrypt
                text="Software Engineer"
                className="font-medium text-accent"
                duration={600}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="max-w-[55ch] text-base leading-relaxed text-text-muted lg:text-lg">
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
      <section id="about" className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="mb-8 flex justify-center lg:hidden">
            <ProfilePhoto />
          </ScrollReveal>
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
            <ScrollReveal delay={0.1} className="hidden lg:flex lg:justify-end">
              <ProfilePhoto />
            </ScrollReveal>
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
