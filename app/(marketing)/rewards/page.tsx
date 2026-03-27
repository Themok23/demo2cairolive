'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Lock, Check } from 'lucide-react';
import StaggerText from '@/presentation/components/animations/StaggerText';
import FadeUp from '@/presentation/components/animations/FadeUp';
import Button from '@/presentation/components/ui/Button';

interface Reward {
  id: number;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  imageUrl: string | null;
  partnerName: string;
  partnerLogo: string | null;
  discountPercent: number;
  discountCode: string | null;
  minLevel: string;
  category: string;
  isActive: boolean;
  expiresAt: string | null;
}

interface Level {
  id: number;
  name: string;
  nameAr: string | null;
  slug: string;
  minReviews: number;
  icon: string | null;
  color: string | null;
  discountPercent: number;
}

const categories = [
  { id: 'food', label: 'Food & Dining' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'travel', label: 'Travel' },
  { id: 'wellness', label: 'Wellness' },
];

const levelOrder: Record<string, number> = {
  explorer: 1,
  contributor: 2,
  insider: 3,
  expert: 4,
  ambassador: 5,
};

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rewardsRes, levelsRes] = await Promise.all([
          fetch('/api/rewards'),
          fetch('/api/gamification/levels'),
        ]);

        const rewardsData = await rewardsRes.json();
        const levelsData = await levelsRes.json();

        if (rewardsData.success) {
          setRewards(rewardsData.data);
        }
        if (levelsData.success) {
          setLevels(levelsData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedLevels = [...levels].sort((a, b) => {
    const aOrder = levelOrder[a.slug] || 0;
    const bOrder = levelOrder[b.slug] || 0;
    return aOrder - bOrder;
  });

  const filteredRewards = selectedCategory
    ? rewards.filter(r => r.category === selectedCategory)
    : rewards;

  return (
    <div className="overflow-hidden">
      <section
        className="relative overflow-hidden py-20 sm:py-32 md:py-40"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1556740712-a01 bf67340d5?w=1500&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <StaggerText
            text="Exclusive Rewards & Discounts"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-white leading-tight drop-shadow-lg"
          />
          <FadeUp delay={0.5}>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-body drop-shadow-md">
              Unlock amazing deals from our partner brands as you build your reputation in the community
            </p>
          </FadeUp>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl text-secondary mb-3">
                Your Path to Benefits
              </h2>
              <p className="text-text-muted max-w-2xl mx-auto mb-12">
                Complete more reviews to unlock higher membership levels and greater discounts
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
            {sortedLevels.map((level, index) => (
              <FadeUp key={level.id} delay={index * 0.1}>
                <div
                  className="rounded-card bg-white border border-muted p-6 text-center hover:shadow-card-hover transition-all duration-300"
                  style={{
                    borderTop: `4px solid ${level.color || '#E8572A'}`,
                  }}
                >
                  <h3 className="font-display text-lg text-secondary mb-2">{level.name}</h3>
                  <p className="text-sm text-text-muted mb-4">{level.minReviews}+ reviews</p>
                  <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {level.discountPercent}% Discount
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
                Featured Offers
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Partner discounts tailored for our community members
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-button font-semibold transition-all duration-200 ${
                    selectedCategory === ''
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-button font-semibold transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {loading ? (
            <p className="text-white/80 text-center">Loading rewards...</p>
          ) : filteredRewards.length === 0 ? (
            <p className="text-white/80 text-center">No rewards available in this category</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward, index) => (
                <FadeUp key={reward.id} delay={(index % 3) * 0.1}>
                  <div className="rounded-card bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:bg-white/10 flex flex-col">
                    {reward.imageUrl && (
                      <div className="h-40 bg-gradient-to-br from-primary/20 to-accent-gold/20 overflow-hidden">
                        <img
                          src={reward.imageUrl}
                          alt={reward.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-white mb-2">{reward.title}</h3>
                        <p className="text-sm text-white/70 mb-4 line-clamp-2">{reward.description}</p>
                        <p className="text-xs text-accent-gold font-semibold mb-3">{reward.partnerName}</p>
                      </div>

                      <div className="border-t border-white/10 pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">Discount</span>
                          <span className="text-lg font-bold text-accent-gold">{reward.discountPercent}%</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-white/60">
                          <Lock size={14} />
                          <span>Requires {reward.minLevel} level</span>
                        </div>

                        {reward.discountCode && (
                          <div className="bg-white/10 rounded-button p-3">
                            <p className="text-xs text-white/70 mb-1">Code</p>
                            <p className="text-sm font-mono font-bold text-accent-gold">{reward.discountCode}</p>
                          </div>
                        )}

                        <Button size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary to-primary/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Start Earning Rewards Today
            </h2>
            <p className="text-white/90 font-body text-lg max-w-2xl mx-auto mb-8">
              Write your first review and join thousands of community members enjoying exclusive benefits.
            </p>
            <Link href="/submit">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Write a Review
              </Button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
