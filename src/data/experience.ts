export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  techStack: string[];
}

export const experience: Experience[] = [
  {
    company: 'Lextech',
    role: 'Full-Time',
    period: 'Oct 2025 — Present',
    description: 'I build cloud-native microservice platforms on Azure that processes LIXI DAS mortgage instructions at Lextech. I work across the full stack of distributed systems development — designing .NET services using Clean Architecture and CQRS, provisioning infrastructure on AKS with Terraform/Terragrunt and GitOps deployment pipelines, and developing internal platform libraries and tooling used across all services. I also build developer productivity tools, including AI-assisted development workflows and schema automation systems for managing complex financial data models.',
    techStack: ['.NET 10', 'Azure', 'Kubernetes', 'Terragrunt', 'ArgoCD', 'PostgreSQL'],
  },
  {
    company: 'Shismo Plugins',
    role: 'Full-Time',
    period: 'Dec 2022 — Oct 2025',
    description: 'I built and operated the Shismo Plugins platform, a full-stack ecosystem for developing, distributing, and managing modular game plugins used by a community of 5,000+ users. I designed the core Java plugin framework, developed secure licensing and distribution infrastructure on AWS, and built the web storefront and payment systems. The platform combines Java runtime tooling, serverless cloud architecture, and a TypeScript web stack to deliver automated plugin distribution and license management.',
    techStack: ['Java', 'React', 'AWS Lambda', 'DynamoDB', 'TypeScript', 'Spring Boot'],
  },
  {
    company: '1MILLIKELVIN',
    role: 'Contract',
    period: 'Dec 2021 — Dec 2022',
    description: 'I developed low-level embedded and computer vision software for a next-generation stress imaging camera built on custom hardware. My work included building Linux kernel drivers and real-time image-processing pipelines that streamed sensor data directly into MITE Suite, 1MILLIKELVIN\'s analysis platform used across aerospace and defence. I also contributed to the platform\'s custom Yocto-based embedded Linux distribution and license verification infrastructure for proprietary software utilities.',
    techStack: ['C', 'C++', 'OpenCV', 'Linux Kernel', 'Yocto Project'],
  },
];
