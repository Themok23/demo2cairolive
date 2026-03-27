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
    el.innerHTML = words.map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block stagger-word" style="transform: translateY(100%); opacity: 0">${word}</span></span>`).join(' ');

    const loadGsap = async () => {
      const gsap = (await import('gsap')).default;
      gsap.to(el.querySelectorAll('.stagger-word'), {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2,
      });
    };

    loadGsap();
  }, [text]);

  return <Tag ref={ref as any} className={className}>{text}</Tag>;
}
