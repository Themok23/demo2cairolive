'use client';

import { useRef, useEffect } from 'react';

interface StaggerTextProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p';
}

export default function StaggerText({ text, className, tag: Tag = 'h1' }: StaggerTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = text.split(' ');
    el.innerHTML = words
      .map(
        (word, i) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block stagger-word" style="transform: translateY(100%); opacity: 0; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1); transition-delay: ${200 + i * 80}ms">${word}</span></span>`
      )
      .join(' ');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.stagger-word').forEach((word) => {
            (word as HTMLElement).style.transform = 'translateY(0)';
            (word as HTMLElement).style.opacity = '1';
          });
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [text]);

  return <Tag ref={ref as any} className={className}>{text}</Tag>;
}
