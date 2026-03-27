'use client';

import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export default function DashboardCard({
  children,
  className = '',
  onClick,
  interactive = false,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#1A1A35] border border-white/5 rounded-lg p-6
        transition-all duration-200
        ${interactive ? 'cursor-pointer hover:border-white/10 hover:bg-[#222250] hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
