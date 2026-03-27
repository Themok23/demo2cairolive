'use client';

import { useEffect, useState } from 'react';

interface GamificationProfile {
  userId: number;
  level: string;
  levelName: string;
  levelColor: string | null;
  approvedReviewCount: number;
  totalPoints: number;
  discountPercent: number;
  badges: any[];
  progressToNextLevel: {
    current: number;
    required: number;
    percentage: number;
  };
  joinedAt: string;
}

interface Props {
  userId: number;
}

const levelEmojis: Record<string, string> = {
  explorer: '🗺️',
  contributor: '✍️',
  insider: '⭐',
  expert: '🚀',
  ambassador: '👑',
};

export default function GamificationCard({ userId }: Props) {
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/gamification/profile/${userId}`);
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        }
      } catch (error) {
        console.error('Error fetching gamification profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="rounded-card bg-surface border border-muted p-6">
        <p className="text-text-muted text-center">Loading...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-card bg-surface border border-muted p-6">
        <p className="text-text-muted text-center">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface border border-muted p-6">
      <h3 className="font-display text-xl text-secondary mb-6">Gamification Status</h3>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{levelEmojis[profile.level] || '⭐'}</span>
            <div>
              <p className="text-sm text-text-muted">Current Level</p>
              <p className="font-semibold text-text-primary">{profile.levelName}</p>
            </div>
          </div>
          {profile.discountPercent > 0 && (
            <div className="bg-accent-gold/20 text-accent-gold px-4 py-2 rounded-button font-semibold">
              {profile.discountPercent}% Discount
            </div>
          )}
        </div>

        <div className="border-t border-muted pt-6">
          <p className="text-sm text-text-muted mb-3">Progress to Next Level</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-text-primary">
                {profile.progressToNextLevel.current} / {profile.progressToNextLevel.required} Reviews
              </span>
              <span className="text-sm text-text-muted">{profile.progressToNextLevel.percentage}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${profile.progressToNextLevel.percentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-button p-4">
            <p className="text-xs text-text-muted mb-1">Total Points</p>
            <p className="text-2xl font-bold text-primary">{profile.totalPoints}</p>
          </div>
          <div className="bg-background rounded-button p-4">
            <p className="text-xs text-text-muted mb-1">Reviews</p>
            <p className="text-2xl font-bold text-secondary">{profile.approvedReviewCount}</p>
          </div>
        </div>

        {profile.badges.length > 0 && (
          <div className="border-t border-muted pt-6">
            <p className="text-sm text-text-muted mb-3">Badges</p>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge: any) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-1 bg-background rounded-button px-3 py-2"
                  title={badge.name}
                >
                  <span className="text-lg">{badge.icon}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-text-muted text-center pt-4">
          Member since {new Date(profile.joinedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
