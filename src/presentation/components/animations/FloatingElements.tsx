'use client';

interface FloatingElementsProps {
  variant?: 'light' | 'dark';
}

export default function FloatingElements({ variant = 'light' }: FloatingElementsProps) {
  const baseColor = variant === 'dark' ? 'rgba(232,87,42,0.06)' : 'rgba(232,87,42,0.04)';
  const accentColor = variant === 'dark' ? 'rgba(245,197,66,0.05)' : 'rgba(245,197,66,0.03)';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl animate-float-slow"
        style={{ background: baseColor }}
      />
      <div
        className="absolute top-1/3 -left-8 w-32 h-32 rounded-full blur-2xl animate-float-medium"
        style={{ background: accentColor }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-20 h-20 rounded-full blur-xl animate-float-fast"
        style={{ background: baseColor }}
      />
    </div>
  );
}
