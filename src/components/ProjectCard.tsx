import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:border-accent/30 hover:shadow-glow-sm">
      <h3 className="mb-2 font-heading text-base font-semibold text-text transition-colors group-hover:text-accent">
        {project.name}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        {project.description}
      </p>
      <div className="mb-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface-bright px-2.5 py-0.5 text-xs text-text-dim transition-colors group-hover:text-text-muted"
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
            className="text-xs text-text-dim transition-colors hover:text-accent"
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
            className="text-xs text-text-dim transition-colors hover:text-accent"
          >
            Live →
          </a>
        )}
      </div>
    </article>
  );
}
