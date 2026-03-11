'use client';

import dynamic from 'next/dynamic';

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
      <CursorGradient />
      <CommandPalette />
    </>
  );
}
