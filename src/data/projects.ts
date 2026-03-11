export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    description: 'Personal portfolio built with Next.js 16, Tailwind CSS v4, and a terminal-inspired design aesthetic.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'],
    githubUrl: 'https://github.com/ngoleon/portfolio',
    liveUrl: 'https://leon.dev',
    featured: true,
  },
  {
    id: 'project-two',
    name: 'Project Two',
    description: 'A placeholder project demonstrating the card layout and bento grid system.',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    githubUrl: 'https://github.com/ngoleon/project-two',
    featured: true,
  },
  {
    id: 'project-three',
    name: 'Project Three',
    description: 'Another placeholder to show how multiple cards arrange in the grid.',
    techStack: ['Python', 'FastAPI', 'Docker'],
    githubUrl: 'https://github.com/ngoleon/project-three',
    featured: false,
  },
  {
    id: 'project-four',
    name: 'Project Four',
    description: 'Demonstrates a non-featured project that takes a single column in the bento grid.',
    techStack: ['Go', 'gRPC', 'Kubernetes'],
    featured: false,
  },
];
