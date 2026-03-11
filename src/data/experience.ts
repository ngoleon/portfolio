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
    role: 'Software Developer',
    period: '2024 — Present',
    description: 'Designing and building a cloud-native microservice platform for LIXI DAS mortgage instruction processing on Azure. Architected .NET 10 services with Clean Architecture and CQRS, built shared NuGet package libraries, and designed full Azure infrastructure with Terragrunt across dev, staging, and production environments.',
    techStack: ['.NET 10', 'Azure', 'Kubernetes', 'Terragrunt', 'ArgoCD', 'PostgreSQL'],
  },
  {
    company: 'Shismo Plugins',
    role: 'Software Developer',
    period: 'Dec 2022 — Present',
    description: 'Built a full-stack product from scratch — scalable Java library, serverless AWS backend for licensing and delivery, React storefront with Stripe payments, and CI/CD pipelines. Grew to a 5,000+ member community.',
    techStack: ['Java', 'React', 'AWS Lambda', 'DynamoDB', 'TypeScript', 'Spring Boot'],
  },
  {
    company: '1MILLIKELVIN',
    role: 'Graduate Software Developer',
    period: 'Dec 2021 — Dec 2022',
    description: 'Co-developed a Linux kernel driver in C for real-time sensor data capture, built image processing pipelines with OpenCV and V4L2, and contributed to a custom embedded Linux distribution via the Yocto Project.',
    techStack: ['C', 'C++', 'OpenCV', 'Linux Kernel', 'Yocto Project'],
  },
];
