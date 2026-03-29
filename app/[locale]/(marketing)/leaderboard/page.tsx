'use client';

import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';
import StaggerText from '@/presentation/components/animations/StaggerText';
import FadeUp from '@/presentation/components/animations/FadeUp';

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

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard?limit=100');
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

  return (
    <div className="overflow-hidden">
      <section
        className="relative overflow-hidden py-20 sm:py-32 md:py-40"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?w=1500&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <StaggerText
            text="Top Contributors"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-tight drop-shadow-lg"
          />
          <FadeUp delay={0.5}>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-body drop-shadow-md">
              Celebrating our most engaged community members
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl text-secondary mb-3">
                Community Leaderboard
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Recognition for those who share their honest reviews and experiences
              </p>
            </div>
          </FadeUp>

          {loading ? (
            <p className="text-text-muted text-center">Loading leaderboard...</p>
          ) : entries.length === 0 ? (
            <p className="text-text-muted text-center">No contributors yet. Be the first to join!</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, index) => (
                <FadeUp key={entry.userId} delay={Math.min(index * 0.05, 0.3)}>
                  <div className="rounded-card bg-surface border border-muted p-6 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        {entry.rank <= 3 ? (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{
                              backgroundColor:
                                entry.rank === 1
                                  ? '#F5C542'
                                  : entry.rank === 2
                                    ? '#C0C0C0'
                                    : '#CD7F32',
                            }}
                          >
                            {entry.rank}
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-text-primary font-bold">
                            {entry.rank}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {entry.avatarUrl ? (
                            <img
                              src={entry.avatarUrl}
                              alt={entry.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                              {entry.name[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-semibold text-text-primary truncate">{entry.name}</h3>
                          </div>
                        </div>

                        <div
                          className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
                          style={{ backgroundColor: levelColors[entry.level] }}
                        >
                          {levelEmojis[entry.level]} {entry.level.charAt(0).toUpperCase() + entry.level.slice(1)}
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm text-text-muted">Reviews</p>
                        <p className="text-2xl font-bold text-secondary">{entry.approvedReviewCount}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gradient-to-r from-secondary to-secondary/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Make Your Mark
            </h2>
            <p className="text-white/90 font-body text-lg max-w-2xl mx-auto">
              Join the leaderboard by writing quality reviews. Your contributions help the community discover the best places in Egypt.
            </p>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
