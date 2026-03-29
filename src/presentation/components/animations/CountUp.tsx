'use client';

import { useRef, useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({ end, duration = 2, prefix = '', suffix = '', className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          observer.unobserve(el);

          const startTime = performance.now();
          const durationMs = duration * 1000;

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.round(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
