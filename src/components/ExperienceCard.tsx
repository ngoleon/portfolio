import type { Experience } from '@/data/experience';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-5 transition-[border-color,box-shadow] duration-150 hover:border-accent/30 hover:shadow-glow-sm">
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <h3 className="font-heading text-base font-semibold text-text">
          {experience.company}
        </h3>
        <span className="shrink-0 text-xs text-text-dim">
          {experience.period}
        </span>
      </div>
      <p className="mb-3 text-sm font-medium text-accent">
        {experience.role}
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        {experience.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {experience.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface-bright px-2.5 py-0.5 text-xs text-text-dim transition-colors group-hover:text-text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
