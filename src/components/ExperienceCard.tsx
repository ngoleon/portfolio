import type { Experience } from '@/data/experience';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-150 hover:border-accent/30 hover:shadow-glow-sm">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="font-heading text-lg font-semibold text-text">
          {experience.company}
        </h3>
        <span className="shrink-0 text-sm text-text-dim">
          {experience.period}
        </span>
      </div>
      <p className="mb-3 text-sm font-medium text-accent lg:text-base">
        {experience.role}
      </p>
      <p className="mb-4 text-sm leading-relaxed text-text-muted lg:text-base">
        {experience.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {experience.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-surface-bright px-3 py-0.5 text-sm text-text-dim transition-colors group-hover:text-text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
