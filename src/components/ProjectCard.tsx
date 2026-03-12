import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-150 hover:border-accent/30 hover:shadow-glow-sm">
      <h3 className="mb-2 font-heading text-lg font-semibold text-text transition-colors group-hover:text-accent">
        {project.name}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-muted lg:text-base">
        {project.description}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface-bright px-3 py-0.5 text-sm text-text-dim transition-colors group-hover:text-text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} GitHub repository`}
            className="py-2 text-sm text-text-dim transition-colors hover:text-accent"
          >
            GitHub →
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} live site`}
            className="py-2 text-sm text-text-dim transition-colors hover:text-accent"
          >
            Live →
          </a>
        )}
      </div>
    </article>
  );
}
