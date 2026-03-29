'use client';

import { useRef, useEffect, ReactNode } from 'react';

interface FadeUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay > 0) {
      el.style.transitionDelay = `${delay * 1000}ms`;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('revealed');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`fade-up ${className || ''}`}>
      {children}
    </div>
  );
}
