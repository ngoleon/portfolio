'use client';

import ProjectCardP5 from '@/components/ui/ProjectCardP5';
import ExperienceCardP5 from '@/components/ui/ExperienceCardP5';
import { projects } from '@/data/projects';
import { experience } from '@/data/experience';
import SectionLabel from '@/components/ui/SectionLabel';
import StatCard from '@/components/ui/StatCard';
import { stats } from '@/data/stats';
import HeroName from '@/components/ui/HeroName';
import TarotCard from '@/components/ui/TarotCard';
import DiagonalSlash from '@/components/ui/DiagonalSlash';
import InfoCard from '@/components/ui/InfoCard';
import StampTag from '@/components/ui/StampTag';
import Watermark from '@/components/ui/Watermark';
import HalftoneField from '@/components/ui/HalftoneField';
import ScrollReveal from '@/components/ScrollReveal';
import { motion } from 'motion/react';

const socialLinks = [
  { href: 'https://github.com/ngoleon', name: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ngo-leon/', name: 'LinkedIn' },
];

export default function Home() {
  return (
    <>
      {/* === HERO / INDEX === */}
      <section
        id="index"
        className="relative overflow-hidden"
        style={{ minHeight: '100dvh', maxHeight: '900px' }}
      >
        {/* Background watermark numeral */}
        <Watermark number="04" position="bl" />

        {/* Subtle halftone field over whole hero */}
        <HalftoneField density="subtle" />

        {/* Bottom red glow gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2"
          style={{ background: 'linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent)' }}
        />

        {/* === Name zone === */}
        <motion.div
          className="absolute z-[5] max-w-[80%] md:max-w-[50%]"
          style={{ top: 'clamp(4rem, 8vh, 6rem)', left: 'clamp(1rem, 4vw, 2.5rem)' }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.2 }}
        >
          <SectionLabel number="01" label="Index" />
          <div className="mt-2.5">
            <HeroName first="Leon" last="Ngo" punct="!" />
          </div>
          <p
            className="mt-8 font-mono tracking-[0.04em] opacity-85"
            style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)' }}
          >
            Software Engineer{' '}
            <span className="text-[var(--color-accent)]">{'// distributed systems · dev tools'}</span>
          </p>
        </motion.div>

        {/* === Tarot card right side === */}
        <motion.div
          data-tarot
          className="absolute z-[6]"
          style={{
            top: 'clamp(7rem, 12vh, 9.5rem)',
            right: 'clamp(1rem, 4vw, 2.5rem)',
          }}
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          transition={{ duration: 0.3, ease: 'easeOut', delay: 0.1 }}
        >
          <TarotCard />
        </motion.div>

        {/* === Diagonal slash === */}
        <DiagonalSlash top="clamp(22rem, 44vh, 27rem)" height="clamp(60px, 10vw, 75px)" align="center">
          DISTRIBUTED SYSTEMS{' '}
          <span className="text-[var(--color-accent)]">·</span> CLOUD{' '}
          <span className="text-[var(--color-accent)]">·</span> DEV TOOLS
        </DiagonalSlash>

        {/* === Bottom cluster: mission card + stamp === */}
        <motion.div
          data-cluster
          className="absolute z-[6] flex items-end gap-4 sm:gap-6"
          style={{ left: 'clamp(1rem, 4vw, 2.5rem)', top: 'clamp(28rem, 56vh, 34rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.6 }}
        >
          <InfoCard label="// CURRENT MISSION">
            .NET 10 microservices on Azure · K8s · IaC with Terragrunt · AI-assisted dev tooling
          </InfoCard>
          <div style={{ transform: 'translateY(-2rem)' }}>
            <StampTag text="ROOT ACCESS GRANTED" />
          </div>
        </motion.div>
        {/* Mobile-only adjustments — desktop absolute layout still fires above clamp values, but at <768px we re-stack the tarot and cluster vertically */}
        <style>{`
  @media (max-width: 767px) {
    section[id='index'] > div[data-tarot] {
      position: relative;
      top: auto;
      right: auto;
      margin: 1rem auto 0;
      display: block;
    }
    section[id='index'] > div[data-cluster] {
      position: static;
      flex-direction: column;
      align-items: flex-start;
      margin-top: 1rem;
      padding: 0 1rem;
    }
  }
`}</style>
      </section>

      {/* === ABOUT === */}
      <section id="about" className="relative overflow-hidden px-6 py-24 sm:py-32">
        <HalftoneField density="subtle" />
        <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_320px] z-[2]">
          {/* Left: prose */}
          <div>
            <ScrollReveal>
              <SectionLabel number="02" label="About" />
              <h2
                className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
              >
                Phantom <span className="text-[var(--color-accent)]">engineer.</span>
              </h2>
            </ScrollReveal>
            <p className="mt-6 max-w-[55ch] text-base leading-[1.75] sm:text-lg">
              Software engineer specialising in distributed systems, cloud-native platforms, and developer tooling. Currently building .NET 10 microservice systems on Azure with Kubernetes, designing infrastructure-as-code with Terragrunt, and developing AI-assisted tools to improve developer productivity. Background spans embedded Linux, serverless backend architecture, and full-stack platforms used by active online communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {['C# · JAVA · TYPESCRIPT', 'AZURE · AWS · K8S', '.NET 10 · SPRING · NODE', 'TERRAGRUNT · DOCKER'].map((tag) => (
                <span
                  key={tag}
                  className="bg-[var(--color-ink)] text-[var(--color-bg)] px-3 py-1.5 font-mono text-[0.7rem]"
                  style={{ transform: 'skewX(var(--skew-x))' }}
                >
                  <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: stat card */}
          <StatCard
            name="L. NGO"
            rank="04"
            role="// THE ENGINEER · CODENAME · ROOT"
            stats={stats}
          />
        </div>
      </section>

      {/* === EXPERIENCE === */}
      <section id="experience" className="relative overflow-hidden px-6 py-24 sm:py-32">
        <HalftoneField density="subtle" />
        <div className="relative mx-auto max-w-6xl z-[2]">
          <ScrollReveal>
            <SectionLabel number="04" label="Experience" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Field <span className="text-[var(--color-accent)]">log.</span>
            </h2>
          </ScrollReveal>
          <div className="mt-10 space-y-6">
            {experience.map((exp) => (
              <ExperienceCardP5 key={exp.company} experience={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* === PROJECTS / WORK === */}
      <section id="projects" className="relative overflow-hidden px-6 py-24 sm:py-32">
        <HalftoneField density="subtle" />
        <div className="relative mx-auto max-w-6xl z-[2]">
          <ScrollReveal>
            <SectionLabel number="03" label="Work" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Selected <span className="text-[var(--color-accent)]">work.</span>
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 md:gap-8 md:grid-cols-2">
            {projects.map((project, i) => (
              <div
                key={project.id}
                className={project.featured ? 'md:col-span-2' : ''}
              >
                <ProjectCardP5 project={project} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === CONTACT === */}
      <section id="contact" className="relative overflow-hidden px-6 py-24 sm:py-32">
        <HalftoneField density="medium" />
        <div className="relative mx-auto max-w-5xl z-[2]">
          <ScrollReveal>
            <SectionLabel number="05" label="Contact" />
            <h2
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Interested in <span className="text-[var(--color-accent)]">working</span><br/> together<span className="text-[var(--color-accent)]">?</span>
            </h2>
          </ScrollReveal>

          <div className="mt-10">
            <a
              href="mailto:ngo.leon@gmail.com"
              className="inline-block font-display italic font-black text-[var(--color-accent)] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-[1.04]"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', textShadow: 'var(--shadow-text-sm)' }}
            >
              ngo.leon@gmail.com ↗
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--color-ink)] text-[var(--color-bg)] px-4 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.15em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105"
                style={{ transform: 'skewX(var(--skew-x))' }}
              >
                <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
                  {link.name} ↗
                </span>
              </a>
            ))}
            <a
              href="/resume.pdf"
              className="border-[3px] border-[var(--color-ink)] bg-[var(--color-bg)] px-5 py-2.5 font-mono text-[0.75rem] uppercase tracking-[0.15em] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-105"
              style={{
                transform: 'skewX(var(--skew-x))',
                boxShadow: 'var(--shadow-card-sm)',
              }}
            >
              <span style={{ display: 'inline-block', transform: 'skewX(calc(-1 * var(--skew-x)))' }}>
                ↓ Download Resume
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
