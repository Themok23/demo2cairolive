'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import FadeUp from '@/presentation/components/animations/FadeUp';
import ItemCard from '@/presentation/components/items/ItemCard';

interface Item {
  slug: string;
  name: string;
  imageUrl: string | null;
  governorate: string | null;
  area: string | null;
  avgRating: string;
  totalReviews: number;
  priceLabel: string | null;
  tags: string[] | null;
}

interface CategorySectionProps {
  title: string;
  description: string;
  items: Item[];
  categorySlug: string;
  isDark?: boolean;
}

export default function CategorySection({
  title,
  description,
  items,
  categorySlug,
  isDark = false,
}: CategorySectionProps) {
  if (items.length === 0) {
    return null;
  }

  const bgClass = isDark ? 'bg-secondary text-white' : 'bg-background text-secondary';
  const descriptionClass = isDark ? 'text-white/70' : 'text-text-muted';
  const titleClass = isDark ? 'text-white' : 'text-secondary';

  return (
    <section className={`py-16 sm:py-24 ${bgClass}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeUp>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h2 className={`font-display text-3xl sm:text-4xl ${titleClass} mb-2`}>
                {title}
              </h2>
              <p className={`text-sm sm:text-base ${descriptionClass} max-w-2xl`}>
                {description}
              </p>
            </div>
            <Link
              href={`/explore/${categorySlug}`}
              className="group flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-button text-primary hover:text-primary font-semibold transition-all duration-200"
            >
              View All
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeUp>

        {/* Horizontal Scroll Items */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 pb-4 min-w-min">
            {items.map((item, i) => (
              <FadeUp key={item.slug} delay={i * 0.05}>
                <div className="w-80 flex-shrink-0">
                  <ItemCard
                    slug={item.slug}
                    name={item.name}
                    imageUrl={item.imageUrl}
                    governorate={item.governorate}
                    area={item.area}
                    avgRating={item.avgRating}
                    totalReviews={item.totalReviews}
                    priceLabel={item.priceLabel}
                    tags={item.tags}
                  />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
