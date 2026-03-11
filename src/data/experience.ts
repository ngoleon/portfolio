export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  techStack: string[];
}

export const experience: Experience[] = [
  {
    company: 'Acme Corp',
    role: 'Software Engineer',
    period: '2024 — Present',
    description: 'Building internal developer tools and platform infrastructure. Reduced CI build times by 45% and led migration from monolith to microservices architecture.',
    techStack: ['TypeScript', 'React', 'Go', 'Kubernetes'],
  },
  {
    company: 'StartupXYZ',
    role: 'Full Stack Developer',
    period: '2022 — 2024',
    description: 'Core contributor to the product team, shipping features from design to production. Built the real-time notification system and optimized database queries reducing API latency by 40%.',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    company: 'Freelance',
    role: 'Web Developer',
    period: '2020 — 2022',
    description: 'Delivered 15+ client projects ranging from marketing sites to full-stack web applications. Specialized in performance optimization and responsive design.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase'],
  },
];
