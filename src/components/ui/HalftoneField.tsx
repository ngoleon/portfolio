import type { ReactNode } from 'react';

interface HalftoneFieldProps {
  density?: 'subtle' | 'medium' | 'heavy';
  className?: string;
  children?: ReactNode;
}

export default function HalftoneField({
  density = 'subtle',
  className = '',
  children,
}: HalftoneFieldProps) {
  // Each density maps to one of the @utility classes in globals.css
  const densityClass =
    density === 'heavy'
      ? 'halftone-bg-heavy'
      : density === 'medium'
      ? 'halftone-bg-medium'
      : 'halftone-bg-subtle';

  return (
    <div className={`pointer-events-none absolute inset-0 ${densityClass} ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}
