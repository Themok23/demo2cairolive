'use client';

import { useRef, useEffect } from 'react';

interface FloatingElementsProps {
  variant?: 'light' | 'dark';
}

export default function FloatingElements({ variant = 'light' }: FloatingElementsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;

      const elements = el.querySelectorAll('.float-el');
      elements.forEach((item, i) => {
        gsap.to(item, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-15, 15)`,
          duration: `random(4, 8)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.5,
        });
      });
    };

    loadGsap();
  }, []);

  const baseColor = variant === 'dark' ? 'rgba(232,87,42,0.06)' : 'rgba(232,87,42,0.04)';
  const accentColor = variant === 'dark' ? 'rgba(245,197,66,0.05)' : 'rgba(245,197,66,0.03)';

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Circle top-right */}
      <div
        className="float-el absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl"
        style={{ background: baseColor }}
      />
      {/* Small circle mid-left */}
      <div
        className="float-el absolute top-1/3 -left-8 w-32 h-32 rounded-full blur-2xl"
        style={{ background: accentColor }}
      />
      {/* Dot bottom-right */}
      <div
        className="float-el absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full blur-xl"
        style={{ background: baseColor }}
      />
    </div>
  );
}
