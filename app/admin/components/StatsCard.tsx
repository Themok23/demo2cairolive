'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import DashboardCard from './DashboardCard';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  unit?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  unit,
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'up':
        return 'text-[#4CAF88]';
      case 'down':
        return 'text-[#EF4444]';
      default:
        return 'text-white/40';
    }
  };

  const getChangeBgColor = () => {
    switch (changeType) {
      case 'up':
        return 'bg-[#4CAF88]/10';
      case 'down':
        return 'bg-[#EF4444]/10';
      default:
        return 'bg-white/5';
    }
  };

  return (
    <DashboardCard>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-white/60">{title}</h3>
        {icon && <div className="text-[#E8572A]">{icon}</div>}
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-white">
          {value}
          {unit && <span className="text-lg text-white/60 ml-2">{unit}</span>}
        </p>
      </div>

      {change !== undefined && (
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-md ${getChangeBgColor()}`}>
          {changeType === 'up' && <TrendingUp className="w-4 h-4 text-[#4CAF88]" />}
          {changeType === 'down' && <TrendingDown className="w-4 h-4 text-[#EF4444]" />}
          <span className={`text-sm font-medium ${getChangeColor()}`}>
            {changeType === 'down' && '-'}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-white/40 ml-1">vs last month</span>
        </div>
      )}
    </DashboardCard>
  );
}
