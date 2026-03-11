'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProfilePhoto() {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group relative h-64 w-64 overflow-hidden border border-border shadow-glow-sm transition-shadow hover:shadow-glow-md"
      style={{
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)',
      }}
    >
      {imgError ? (
        /* Fallback: initials */
        <div className="flex h-full w-full items-center justify-center bg-surface text-4xl font-bold text-accent">
          LN
        </div>
      ) : (
        <Image
          src="/images/profile.jpg"
          alt="Leon Ngo"
          fill
          sizes="256px"
          className="object-cover transition-[filter] duration-300 group-hover:[filter:sepia(0.2)_hue-rotate(120deg)_saturate(1.2)]"
          unoptimized
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}
