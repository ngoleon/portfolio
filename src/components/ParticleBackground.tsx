'use client';

import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticleBackground() {
  const [engineReady, setEngineReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  if (prefersReducedMotion || !engineReady) return null;

  return (
    <Particles
      id="tsparticles"
      className="!fixed !inset-0 !-z-10"
      options={{
        fullScreen: false,
        fpsLimit: 60,
        particles: {
          number: { value: 60 },
          color: { value: '#00ffa3' },
          opacity: { value: 0.15 },
          size: { value: { min: 1, max: 2.5 } },
          move: {
            enable: true,
            speed: 0.4,
          },
          links: {
            enable: true,
            color: '#00ffa3',
            opacity: 0.06,
            distance: 150,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: ['repulse', 'grab'],
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            grab: {
              distance: 140,
              links: {
                opacity: 0.2,
              },
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
