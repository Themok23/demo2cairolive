'use client';

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  AlertCircle,
  Eye,
  Clock,
  Users,
  Package,
  MessageSquare,
} from 'lucide-react';
import StatsCard from './components/StatsCard';
import DashboardCard from './components/DashboardCard';
import Badge from './components/Badge';

interface DashboardStats {
  overview: {
    totalItems: number;
    totalReviews: number;
    totalUsers: number;
    totalCategories: number;
    pendingReviews: number;
    activeItems: number;
  };
  trends: {
    itemsThisMonth: number;
    reviewsThisMonth: number;
    usersThisMonth: number;
    itemsLastMonth: number;
    reviewsLastMonth: number;
    usersLastMonth: number;
  };
  topCategories: Array<{
    name: string;
    itemCount: number;
    avgRating: number;
  }>;
  ratingDistribution: Array<{
    stars: number;
    count: number;
  }>;
  reviewsByDay: Array<{
    date: string;
    count: number;
  }>;
  itemsByCategory: Array<{
    category: string;
    count: number;
  }>;
  topRatedItems: Array<{
    name: string;
    avgRating: number;
    totalReviews: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-[#1A1A35] border border-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center gap-3 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-[#EF4444]" />
        <span className="text-white">{error || 'Failed to load dashboard'}</span>
      </div>
    );
  }

  const itemsChange = stats.trends.itemsLastMonth
    ? Math.round(
        ((stats.trends.itemsThisMonth - stats.trends.itemsLastMonth) /
          stats.trends.itemsLastMonth) *
          100
      )
    : 0;

  const reviewsChange = stats.trends.reviewsLastMonth
    ? Math.round(
        ((stats.trends.reviewsThisMonth - stats.trends.reviewsLastMonth) /
          stats.trends.reviewsLastMonth) *
          100
      )
    : 0;

  const usersChange = stats.trends.usersLastMonth
    ? Math.round(
        ((stats.trends.usersThisMonth - stats.trends.usersLastMonth) /
          stats.trends.usersLastMonth) *
          100
      )
    : 0;

  const COLORS = ['#4CAF88', '#F5C542', '#E8572A', '#9C27B0', '#00BCD4'];

  const chartData = stats.reviewsByDay.map((day) => ({
    date: new Date(day.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    count: day.count,
  }));

  const ratingData = stats.ratingDistribution.map((dist) => ({
    name: `${dist.stars} Star${dist.stars !== 1 ? 's' : ''}`,
    value: dist.count,
  }));

  const categoryData = stats.itemsByCategory.slice(0, 5).map((cat) => ({
    name: cat.category,
    value: cat.count,
  }));

  const timeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const averageRating =
    stats.topRatedItems.length > 0
      ? (
          stats.topRatedItems.reduce((sum, item) => sum + item.avgRating, 0) /
          stats.topRatedItems.length
        ).toFixed(2)
      : '0.00';

  const approvalRate =
    stats.overview.totalReviews > 0
      ? Math.round(
          ((stats.overview.totalReviews - stats.overview.pendingReviews) /
            stats.overview.totalReviews) *
            100
        )
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-white/60">Welcome to Cairo Live admin panel</p>
      </div>

      {/* Row 1 - KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Items"
          value={stats.overview.totalItems}
          change={itemsChange}
          changeType={itemsChange >= 0 ? 'up' : 'down'}
          icon={<Package className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Reviews"
          value={stats.overview.totalReviews}
          change={reviewsChange}
          changeType={reviewsChange >= 0 ? 'up' : 'down'}
          icon={<MessageSquare className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Users"
          value={stats.overview.totalUsers}
          change={usersChange}
          changeType={usersChange >= 0 ? 'up' : 'down'}
          icon={<Users className="w-5 h-5" />}
        />
        <DashboardCard className="flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60">Pending Reviews</h3>
            <AlertCircle className="w-5 h-5 text-[#F5C542]" />
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{stats.overview.pendingReviews}</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F5C542]" />
            <span className="text-xs text-white/60">Awaiting approval</span>
          </div>
        </DashboardCard>
      </div>

      {/* Row 2 - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Reviews Trend</h3>
            <p className="text-xs text-white/60 mt-1">Last 30 days</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8572A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8572A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#E8572A"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Rating Distribution</h3>
            <p className="text-xs text-white/60 mt-1">Approved reviews</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.4)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#E8572A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      {/* Row 3 - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Items by Category</h3>
            <p className="text-xs text-white/60 mt-1">Distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>

        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Top Rated Items</h3>
            <p className="text-xs text-white/60 mt-1">By average rating</p>
          </div>
          <div className="space-y-4">
            {stats.topRatedItems.slice(0, 6).map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="text-xs font-bold text-white/40 w-6">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.name}</p>
                  <p className="text-xs text-white/40">{item.totalReviews} reviews</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#4CAF88]" />
                  <span className="text-sm font-semibold text-white min-w-fit">
                    {item.avgRating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Row 4 - Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <p className="text-xs text-white/60 mt-1">Latest actions</p>
          </div>
          <div className="space-y-4">
            {stats.recentActivity.slice(0, 8).map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-b-0">
                <MessageSquare className="w-4 h-4 text-[#E8572A] mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.description}</p>
                  <p className="text-xs text-white/40 mt-1">{timeAgo(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Top Categories</h3>
            <p className="text-xs text-white/60 mt-1">By item count</p>
          </div>
          <div className="space-y-4">
            {stats.topCategories.map((category, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-white">{category.name}</p>
                  <p className="text-xs text-white/40">{category.itemCount} items</p>
                </div>
                <Badge variant="info">{category.avgRating.toFixed(1)}</Badge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Row 5 - Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard>
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-white/60">Avg Rating</h4>
            <TrendingUp className="w-4 h-4 text-[#4CAF88]" />
          </div>
          <p className="text-2xl font-bold text-white">{averageRating}</p>
          <p className="text-xs text-white/40 mt-2">across all items</p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-white/60">Active Items</h4>
            <Package className="w-4 h-4 text-[#E8572A]" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.overview.activeItems}</p>
          <p className="text-xs text-white/40 mt-2">published items</p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-white/60">Approval Rate</h4>
            <Eye className="w-4 h-4 text-[#4CAF88]" />
          </div>
          <p className="text-2xl font-bold text-white">{approvalRate}%</p>
          <p className="text-xs text-white/40 mt-2">reviews approved</p>
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-medium text-white/60">Categories</h4>
            <Clock className="w-4 h-4 text-[#F5C542]" />
          </div>
          <p className="text-2xl font-bold text-white">{stats.overview.totalCategories}</p>
          <p className="text-xs text-white/40 mt-2">total categories</p>
        </DashboardCard>
      </div>
    </div>
  );
}
