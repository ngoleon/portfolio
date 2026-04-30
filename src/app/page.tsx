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
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useGlitch } from '@/hooks/useGlitch';

const socialLinks = [
  { href: 'https://github.com/ngoleon', name: 'GitHub' },
  { href: 'https://www.linkedin.com/in/ngo-leon/', name: 'LinkedIn' },
];

export default function Home() {
  const aboutGlitch = useGlitch();
  const experienceGlitch = useGlitch();
  const projectsGlitch = useGlitch();
  const contactGlitch = useGlitch();

  // Scroll-driven parallax: scrollYProgress goes from 0 (hero top at viewport
  // top) to 1 (hero bottom at viewport top). Each element maps progress to
  // a translateY/rotate so they drift at different rates, giving depth.
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 80]);     // sinks slowly (background)
  const slashY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const tarotY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const tarotRot = useTransform(scrollYProgress, [0, 1], [0, -8]);
  const missionY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const stampY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const stampRot = useTransform(scrollYProgress, [0, 1], [0, 12]);

  return (
    <>
      {/* === HERO / INDEX === */}
      <section
        id="index"
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          // Reach the BottomNav so the red gradient meets the chrome
          // without a dark gap (subtract only the TopBar height).
          minHeight: 'max(36rem, calc(100dvh - 3rem))',
        }}
      >
        {/* Background watermark numeral — drifts down slowly as you scroll */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          style={{ y: watermarkY }}
          aria-hidden="true"
        >
          <Watermark number="01" position="bl" />
        </motion.div>

        {/* Subtle halftone field over whole hero */}
        <HalftoneField density="subtle" />

        {/* Bottom red glow gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2"
          style={{ background: 'linear-gradient(0deg, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent)' }}
        />

        {/* === Name zone === */}
        <motion.div
          data-name
          className="absolute z-[5] max-w-[80%] md:max-w-[50%]"
          style={{ top: '4rem', left: '2rem' }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.05 }}
        >
          <SectionLabel number="01" label="Index" />
          <div className="mt-2.5">
            <HeroName first="LEON" last="NGO" punct="!" />
          </div>
          <p
            className="mt-8 font-mono tracking-[0.04em] opacity-85"
            style={{ fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)' }}
          >
            Software Engineer{' '}
            <br className="xl:hidden" />
            <span className="text-[var(--color-accent)]">{'// distributed systems · dev tools'}</span>
          </p>
        </motion.div>

        {/* === Tarot card right side === */}
        <motion.div
          data-tarot
          className="absolute z-[6]"
          style={{ top: '11rem', right: '4rem' }}
          initial={{ opacity: 0, scale: 0.7, rotate: 8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.15 }}
        >
          <motion.div
            style={{ y: tarotY, rotate: tarotRot }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
          >
            <Link href="#about" aria-label="Skip to About section" className="block">
              <TarotCard />
            </Link>
          </motion.div>
        </motion.div>

        {/* === Diagonal slash === */}
        {/* data-slash on the parallax wrapper so the existing mobile rules
            (which target `section[id='index'] > div[data-slash]`) still
            hide it on narrow viewports and reset its positioning. */}
        <motion.div
          data-slash
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{ y: slashY }}
          aria-hidden="true"
        >
          <DiagonalSlash top="28rem" height="clamp(60px, 10vw, 75px)" align="center" className="hero-slash-in">
            DISTRIBUTED SYSTEMS{' '}
            <span className="text-[var(--color-accent)]">·</span> CLOUD{' '}
            <span className="text-[var(--color-accent)]">·</span> DEV TOOLS
          </DiagonalSlash>
        </motion.div>

        {/* === Bottom cluster: mission card === */}
        <motion.div
          data-cluster
          className="absolute z-[6]"
          style={{ left: '2rem', top: '29rem' }}
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.35 }}
        >
          <motion.div style={{ y: missionY }}>
            <InfoCard label="// CURRENT MISSION">
              · NET 10 Microservices · Azure
              <br />
              · K8s · Terragrunt · ArgoCD
              <br />
              · AI-assisted dev tooling
            </InfoCard>
          </motion.div>
        </motion.div>

        {/* === ROOT ACCESS stamp anchored bottom-right === */}
        <motion.div
          data-stamp
          className="absolute z-[6]"
          style={{ right: '2rem', bottom: '6rem' }}
          initial={{ opacity: 0, x: 60, scale: 0.85, rotate: -10 }}
          animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1.05], delay: 0.45 }}
        >
          <motion.div
            style={{ y: stampY, rotate: stampRot }}
            animate={{ scale: [1, 1.075, 1] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
          >
            <Link
              href="#projects"
              aria-label="View selected projects"
              className="inline-block"
            >
              <StampTag text="ROOT ACCESS GRANTED" rotate={7} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Narrow / mobile (<1024px): convert hero from absolute composition
            to a stacked column. The absolute layout needs ~1024px of width
            for the tarot + slash + cluster to coexist without overlap. */}
        <style>{`
  @media (max-width: 1279px) {
    section[id='index'] {
      min-height: auto !important;
      max-height: none !important;
      padding: 1.5rem 1rem 4rem;
    }
    section[id='index'] > div[data-name],
    section[id='index'] > div[data-tarot],
    section[id='index'] > div[data-slash],
    section[id='index'] > div[data-cluster],
    section[id='index'] > div[data-stamp] {
      position: static !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      max-width: 100%;
      margin: 0 0 2rem;
      transform: none !important;
    }
    section[id='index'] > div[data-tarot],
    section[id='index'] > div[data-cluster] {
      display: flex;
      justify-content: center;
    }
    /* Hide the slash banner and ROOT ACCESS stamp on narrow viewports —
       they're decorative pieces of the desktop composition that just
       add clutter when stacked. */
    section[id='index'] > div[data-slash],
    section[id='index'] > div[data-stamp] {
      display: none !important;
    }
  }
`}</style>
      </section>

      {/* === ABOUT === */}
      <section
        id="about"
        className="relative flex flex-col justify-center overflow-hidden px-6 py-24 sm:py-32"
        style={{ minHeight: 'calc(100dvh - 6.5rem)' }}
      >
        <HalftoneField density="subtle" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1fr_320px] z-[2]">
          {/* Prose (top-left on desktop, 1st on mobile) */}
          <div>
            <ScrollReveal>
              <SectionLabel number="02" label="About" />
              <h2
                {...aboutGlitch}
                className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', transform: 'skewX(var(--skew-x))' }}
              >
                The <span className="text-[var(--color-accent)]">engineer.</span>
              </h2>
            </ScrollReveal>
            <p className="mt-6 max-w-[55ch] text-base leading-[1.75] sm:text-lg">
              Software engineer specialising in distributed systems, cloud-native platforms, and developer tooling. Currently building .NET 10 microservice systems on Azure with Kubernetes, designing infrastructure-as-code with Terragrunt, and developing AI-assisted tools to improve developer productivity. Background spans embedded Linux, serverless backend architecture, and full-stack platforms used by active online communities.
            </p>
          </div>

          {/* Stat card (right on desktop, 2nd on mobile so it sits above the tags) */}
          <StatCard
            name="L. NGO"
            rank="04"
            role="// THE ENGINEER · CODENAME · ROOT"
            stats={stats}
          />

          {/* Tech tags (under prose on desktop, last on mobile) */}
          <div className="flex flex-wrap gap-2">
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
      </section>

      {/* === EXPERIENCE === */}
      <section
        id="experience"
        className="relative flex flex-col justify-center overflow-hidden px-6 py-24 sm:py-32"
        style={{ minHeight: 'calc(100dvh - 6.5rem)' }}
      >
        <HalftoneField density="subtle" />
        <div className="relative mx-auto w-full max-w-6xl z-[2]">
          <ScrollReveal>
            <SectionLabel number="03" label="Experience" />
            <h2
              {...experienceGlitch}
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

      {/* === PROJECTS === */}
      <section
        id="projects"
        className="relative flex flex-col justify-center px-6 py-24 sm:py-32"
        style={{ minHeight: 'calc(100dvh - 6.5rem)' }}
      >
        <HalftoneField density="subtle" />
        <div className="relative mx-auto w-full max-w-6xl z-[2]">
          <ScrollReveal>
            <SectionLabel number="04" label="Projects" />
            <h2
              {...projectsGlitch}
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
      <section
        id="contact"
        className="relative flex flex-col justify-center overflow-hidden px-6 py-24 sm:py-32"
        style={{ minHeight: 'calc(100dvh - 6.5rem)' }}
      >
        <HalftoneField density="medium" />
        <div className="relative mx-auto w-full max-w-5xl z-[2]">
          <ScrollReveal>
            <SectionLabel number="05" label="Contact" />
            <h2
              {...contactGlitch}
              className="mt-2 origin-left font-display italic font-black leading-[0.95] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', transform: 'skewX(var(--skew-x))' }}
            >
              Interested in <span className="text-[var(--color-accent)]">working</span><br/> together<span className="text-[var(--color-accent)]">?</span>
            </h2>
          </ScrollReveal>

          <div className="mt-10">
            <a
              href="mailto:ngo.leon@gmail.com"
              className="inline-block font-display italic font-black text-[var(--color-ink)] transition-transform duration-200 ease-[var(--ease-snap)] hover:scale-[1.04]"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)', textShadow: '4px 4px 0 var(--color-accent)' }}
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
