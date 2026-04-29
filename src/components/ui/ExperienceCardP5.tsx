import type { Experience } from '@/data/experience';

interface ExperienceCardP5Props {
  experience: Experience;
}

export default function ExperienceCardP5({ experience }: ExperienceCardP5Props) {
  return (
    <article className="relative">
      {/* Red shadow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[var(--color-accent)]"
        style={{ transform: 'skewX(var(--skew-x)) translate(5px, 5px)' }}
      />
      <div
        className="relative bg-[var(--color-bg)] border-[3px] border-[var(--color-ink)] px-5 sm:px-7 py-5 sm:py-6 transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-[1.02]"
        style={{ transform: 'skewX(var(--skew-x))' }}
      >
        <div style={{ transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display italic font-black text-xl sm:text-2xl tracking-[-0.02em]">
              {experience.company}
            </h3>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-accent)]">
              {experience.period}
            </span>
          </div>
          <p className="mt-1 font-mono text-sm">{experience.role}</p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed">
            {experience.description}
          </p>
          {experience.techStack && experience.techStack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {experience.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--color-accent)] border border-[var(--color-accent)] px-2 py-0.5"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
