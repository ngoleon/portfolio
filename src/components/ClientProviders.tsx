'use client';

import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(
  () => import('@/components/ParticleBackground'),
  { ssr: false }
);

const CursorGradient = dynamic(
  () => import('@/components/CursorGradient'),
  { ssr: false }
);

const CommandPalette = dynamic(
  () => import('@/components/CommandPalette'),
  { ssr: false }
);

export default function ClientProviders() {
  return (
    <>
      <ParticleBackground />
      <CursorGradient />
      <CommandPalette />
    </>
  );
}
