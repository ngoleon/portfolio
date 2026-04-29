import type { Project } from '@/data/projects';
import HalftoneField from './HalftoneField';

interface ProjectCardP5Props {
  project: Project;
  index: number;  // 0-based, used for the big background numeral
}

export default function ProjectCardP5({ project, index }: ProjectCardP5Props) {
  const numeral = String(index + 1).padStart(2, '0');

  return (
    <article className="group relative">
      {/* Red shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-accent)]"
        style={{ transform: 'skewX(var(--skew-x)) translate(8px, 8px)' }}
      />
      {/* Card body */}
      <div
        className="relative bg-[var(--color-bg)] text-[var(--color-ink)] border-[3px] border-[var(--color-ink)] p-6 sm:p-8 transition-transform duration-200 ease-[var(--ease-snap)] group-hover:scale-[1.02]"
        style={{ transform: 'skewX(var(--skew-x))' }}
      >
        <div style={{ transform: 'skewX(calc(-1 * var(--skew-x)))' }} className="relative z-[2]">
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-4 select-none font-display italic font-black text-[var(--color-accent)] opacity-20 leading-none"
            style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
          >
            {numeral}
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            ▸ Project {numeral}
          </span>
          <h3
            className="mt-2 font-display italic font-black leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            {project.name}
          </h3>
          <p className="mt-3 max-w-prose text-sm leading-relaxed sm:text-base">
            {project.description}
          </p>
          {project.techStack && project.techStack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-accent)] border border-[var(--color-accent)] px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-display italic font-black text-[var(--color-accent)] hover:underline"
              >
                LIVE <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[0.75rem] uppercase tracking-wider text-[var(--color-ink)] hover:text-[var(--color-accent)]"
              >
                GITHUB <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        <HalftoneField density="subtle" />
      </div>
    </article>
  );
}
