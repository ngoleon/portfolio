import TextDecrypt from '@/components/TextDecrypt';
import ScrollReveal from '@/components/ScrollReveal';
import SectionLabel from '@/components/SectionLabel';
import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

const featuredProjects = projects.filter((p) => p.featured);

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="mb-4 text-[clamp(2rem,8vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
            Leon Ngo
          </h1>
          <div className="flex items-center gap-2 text-[clamp(1rem,3vw,1.5rem)]">
            <span className="text-text-dim">$ </span>
            <TextDecrypt
              text="Software Engineer"
              className="font-medium text-accent"
              duration={1500}
            />
          </div>
        </div>

        {/* Scroll indicator */}
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

      {/* Featured projects */}
      {featuredProjects.length > 0 && (
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionLabel>{'// featured'}</SectionLabel>
            </ScrollReveal>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.slice(0, 3).map((project, i) => (
                <ScrollReveal key={project.id} delay={i * 0.06}>
                  <ProjectCard project={project} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
