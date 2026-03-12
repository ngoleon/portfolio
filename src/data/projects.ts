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
    id: 'lixi-das-platform',
    name: 'Lextech - LIXI DAS Microservice Platform',
    description: 'Cloud-native microservice platform processing mortgage instructions on Azure. Includes payload ingestion, schema validation across 286 definitions, domain event publishing, and GitOps deployment with ArgoCD blue-green rollouts.',
    techStack: ['.NET 10', 'Azure', 'AKS', 'Service Bus', 'Terragrunt', 'ArgoCD'],
    featured: true,
  },
    {
    id: 'ai-legacy-refactor',
    name: 'Lextech - Legacy Platform Refactor',
    description: 'I engineered an AI-assisted development workflow to refactor the legacy Lextech platform, delivering 2.08\u00d7 faster average response times and a 1.69\u00d7 improvement in P99 latency, significantly improving system responsiveness and eliminating major production latency spikes.',
    techStack: ['AI Agents', '.NET', 'Azure', 'Performance Engineering'],
    featured: true,
  },
  {
    id: 'mcp-dev-tooling',
    name: 'Lextech - AI Developer Tooling (MCP)',
    description: 'Model Context Protocol server with 10 schema navigation tools, 4 autonomous code review agents, and 13 domain-specific development guides to enforce architecture standards and accelerate feature delivery.',
    techStack: ['MCP', 'TypeScript', 'AI Agents', 'Code Review'],
    featured: true,
  },
  {
    id: 'shismo-platform',
    name: 'Shismo Plugin Platform',
    description: 'Full-stack product ecosystem — scalable Java library, serverless AWS backend for licensing, React storefront with Stripe payments, and Discord OAuth. Serving a 5,000+ member community.',
    techStack: ['Java', 'React', 'AWS Lambda', 'DynamoDB', 'Stripe', 'Spring Boot'],
    githubUrl: 'https://github.com/ngoleon',
    featured: false,
  },
  {
    id: 'portfolio',
    name: 'Portfolio Website',
    description: 'This site — built with Next.js 16, Tailwind CSS v4, and Motion. Static export with perfect Lighthouse scores and sub-second load times.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Motion'],
    githubUrl: 'https://github.com/ngoleon/portfolio',
    featured: false,
  },
];
