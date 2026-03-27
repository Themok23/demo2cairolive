'use client';

import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-[#4CAF88]/10 text-[#4CAF88]';
      case 'warning':
        return 'bg-[#F5C542]/10 text-[#F5C542]';
      case 'error':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      case 'info':
        return 'bg-[#E8572A]/10 text-[#E8572A]';
      case 'neutral':
        return 'bg-white/10 text-white/80';
      default:
        return 'bg-white/10 text-white/80';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        transition-colors
        ${getVariantStyles()}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
