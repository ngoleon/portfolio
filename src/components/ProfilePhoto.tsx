'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProfilePhoto() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative h-48 w-48 overflow-hidden rounded-lg border border-border shadow-glow-sm transition-shadow hover:shadow-glow-md md:h-64 md:w-64">
      {imgError ? (
        <div className="flex h-full w-full items-center justify-center bg-surface font-heading text-4xl font-bold text-accent">
          LN
        </div>
      ) : (
        <Image
          src="/images/profile.jpg"
          alt="Leon Ngo"
          fill
          sizes="(max-width: 768px) 192px, 256px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
