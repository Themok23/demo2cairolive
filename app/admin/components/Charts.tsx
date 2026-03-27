'use client';

import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  LineChart as RechartsLineChart,
  Area,
  Bar,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import DashboardCard from './DashboardCard';

const DARK_COLORS = ['#E8572A', '#4CAF88', '#F5C542', '#A78BFA', '#06B6D4'];

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

function ChartContainer({ title, children, description }: ChartContainerProps) {
  return (
    <DashboardCard>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && <p className="text-sm text-white/60 mt-1">{description}</p>}
      </div>
      {children}
    </DashboardCard>
  );
}

interface AreaChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  xAxisKey: string;
}

export function AreaChart({
  title,
  description,
  data,
  dataKey,
  xAxisKey,
}: AreaChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsAreaChart data={data}>
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E8572A" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#E8572A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey={xAxisKey} stroke="#FFFFFF99" style={{ fontSize: '12px' }} />
          <YAxis stroke="#FFFFFF99" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#E8572A"
            fillOpacity={1}
            fill="url(#colorArea)"
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface BarChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKeys: string[];
  xAxisKey: string;
}

export function BarChart({
  title,
  description,
  data,
  dataKeys,
  xAxisKey,
}: BarChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey={xAxisKey} stroke="#FFFFFF99" style={{ fontSize: '12px' }} />
          <YAxis stroke="#FFFFFF99" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={DARK_COLORS[index % DARK_COLORS.length]}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface PieChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  nameKey: string;
}

export function PieChart({
  title,
  description,
  data,
  dataKey,
  nameKey,
}: PieChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={100}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((_, index) => (
              <React.Fragment key={`cell-${index}`}>
                {/* Chart will use default colors, override with DARK_COLORS as needed */}
              </React.Fragment>
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface LineChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKeys: string[];
  xAxisKey: string;
}

export function LineChart({
  title,
  description,
  data,
  dataKeys,
  xAxisKey,
}: LineChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey={xAxisKey} stroke="#FFFFFF99" style={{ fontSize: '12px' }} />
          <YAxis stroke="#FFFFFF99" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A1A35',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={DARK_COLORS[index % DARK_COLORS.length]}
              dot={{ fill: DARK_COLORS[index % DARK_COLORS.length] }}
              strokeWidth={2}
              isAnimationActive={false}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
