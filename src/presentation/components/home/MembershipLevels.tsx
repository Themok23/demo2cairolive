'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FadeUp from '../animations/FadeUp';
import Button from '../ui/Button';

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

export default function MembershipLevels() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch('/api/gamification/levels');
        const data = await response.json();
        if (data.success) {
          setLevels(data.data);
        }
      } catch (error) {
        console.error('Error fetching levels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80">Loading levels...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
              Membership Journey
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Build your reputation by contributing reviews and unlock exclusive discounts at each level
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {levels.map((level, index) => (
            <FadeUp key={level.id} delay={index * 0.1}>
              <div
                className="rounded-card bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-center hover:border-white/20 transition-all duration-300 hover:bg-white/10"
                style={{
                  borderLeft: `4px solid ${level.color || '#E8572A'}`,
                }}
              >
                {level.icon && (
                  <div className="text-4xl mb-3">{level.icon}</div>
                )}
                <h3 className="font-display text-lg text-white mb-2">{level.name}</h3>
                <p className="text-sm text-white/70 mb-4">
                  {level.minReviews} reviews required
                </p>
                {level.discountPercent > 0 && (
                  <div className="inline-block bg-accent-gold/20 text-accent-gold px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    {level.discountPercent}% Discount
                  </div>
                )}
                <p className="text-xs text-white/60 mb-4">
                  Unlock exclusive rewards and perks
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.5}>
          <div className="mt-12 text-center">
            <Link href="/rewards">
              <Button size="lg">
                View All Rewards
              </Button>
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
