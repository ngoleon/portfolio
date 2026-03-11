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
    description: 'Designed and built a performant personal portfolio using Next.js 16 with static export, achieving perfect Lighthouse scores and sub-second load times.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'],
    githubUrl: 'https://github.com/ngoleon/portfolio',
    liveUrl: 'https://leon.dev',
    featured: true,
  },
  {
    id: 'taskflow',
    name: 'Task Flow',
    description: 'Full-stack project management tool with real-time collaboration, handling 500+ concurrent users with optimistic UI updates and conflict resolution.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    githubUrl: 'https://github.com/ngoleon/taskflow',
    liveUrl: 'https://taskflow.leon.dev',
    featured: true,
  },
  {
    id: 'deploy-pipeline',
    name: 'Deploy Pipeline',
    description: 'CI/CD automation service that reduced deployment time by 60% across 12 microservices, with zero-downtime blue-green deployments.',
    techStack: ['Python', 'FastAPI', 'Docker', 'Redis'],
    githubUrl: 'https://github.com/ngoleon/deploy-pipeline',
    featured: false,
  },
  {
    id: 'metrics-collector',
    name: 'Metrics Collector',
    description: 'High-throughput metrics ingestion service processing 50k events/sec with sub-10ms P99 latency, built on gRPC streaming.',
    techStack: ['Go', 'gRPC', 'Kubernetes', 'ClickHouse'],
    githubUrl: 'https://github.com/ngoleon/metrics-collector',
    featured: false,
  },
];
