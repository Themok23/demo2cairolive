'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FadeUp from '../animations/FadeUp';
import Button from '../ui/Button';

interface LeaderboardEntry {
  userId: number;
  name: string;
  avatarUrl: string | null;
  level: string;
  approvedReviewCount: number;
  rank: number;
}

const levelColors: Record<string, string> = {
  explorer: '#6B6B7B',
  contributor: '#4CAF88',
  insider: '#F5C542',
  expert: '#E8572A',
  ambassador: '#1A1A2E',
};

const levelEmojis: Record<string, string> = {
  explorer: '🗺️',
  contributor: '✍️',
  insider: '⭐',
  expert: '🚀',
  ambassador: '👑',
};

export default function TopContributors() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard?limit=5');
        const data = await response.json();
        if (data.success) {
          setEntries(data.data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-10 w-56 bg-muted rounded-lg mx-auto mb-3 animate-pulse" />
            <div className="h-5 w-80 bg-muted/50 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-card bg-surface border border-muted p-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted mb-4" />
                  <div className="h-4 w-20 bg-muted rounded mb-2" />
                  <div className="h-6 w-24 bg-muted/50 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-secondary mb-3 tracking-tight">
              Top Contributors
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Recognize our most active community members
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {entries.map((entry, index) => (
            <FadeUp key={entry.userId} delay={index * 0.1}>
              <div className="rounded-card bg-surface border border-muted p-6 hover:shadow-card-hover transition-all duration-300">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    {entry.avatarUrl ? (
                      <img
                        src={entry.avatarUrl}
                        alt={entry.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl text-primary">
                        {entry.name[0]}
                      </div>
                    )}
                    {entry.rank === 1 && (
                      <div className="absolute -top-2 -right-2 bg-accent-gold text-secondary rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                    )}
                    {entry.rank === 2 && (
                      <div className="absolute -top-2 -right-2 bg-gray-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                    )}
                    {entry.rank === 3 && (
                      <div className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-text-primary text-center mb-2 truncate w-full">
                    {entry.name}
                  </h3>

                  <div
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-3"
                    style={{ backgroundColor: levelColors[entry.level] }}
                  >
                    {levelEmojis[entry.level]} {entry.level.charAt(0).toUpperCase() + entry.level.slice(1)}
                  </div>

                  <p className="text-sm text-text-muted">
                    {entry.approvedReviewCount} reviews
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {entries.length > 0 && (
          <FadeUp delay={0.5}>
            <div className="mt-12 text-center">
              <Link href="/leaderboard">
                <Button variant="secondary" size="lg">
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
