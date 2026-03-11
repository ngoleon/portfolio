'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProfilePhoto() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative h-64 w-64 overflow-hidden rounded-lg border border-border shadow-glow-sm transition-shadow hover:shadow-glow-md">
      {imgError ? (
        <div className="flex h-full w-full items-center justify-center bg-surface font-heading text-4xl font-bold text-accent">
          LN
        </div>
      ) : (
        <Image
          src="/images/profile.jpg"
          alt="Leon Ngo"
          fill
          sizes="256px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
