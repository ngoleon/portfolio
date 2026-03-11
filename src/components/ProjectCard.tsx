'use client';

import { motion } from 'motion/react';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="group rounded-lg border border-border bg-surface p-5 transition-[border-color,box-shadow] duration-200 hover:border-accent/40 hover:shadow-glow-sm"
    >
      <h3 className="mb-2 text-base font-medium text-text transition-colors group-hover:text-accent">
        {project.name}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        {project.description}
      </p>

      {/* Tech tags */}
      <div className="mb-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded bg-surface-bright px-2 py-0.5 text-xs text-text-dim transition-colors group-hover:text-text-muted"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} GitHub repository`}
            className="text-xs text-accent-secondary transition-colors hover:text-accent"
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
            className="text-xs text-accent-secondary transition-colors hover:text-accent"
          >
            Live →
          </a>
        )}
      </div>
    </motion.article>
  );
}
