import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';
import SectionLabel from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Software projects by Leon Ngo.',
};

export default function ProjectsPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <SectionLabel>{'ls -la ~/projects'}</SectionLabel>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollReveal
              key={project.id}
              delay={i * 0.06}
              className={project.featured ? 'lg:col-span-2' : ''}
            >
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
