import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

interface ItemCardProps {
  slug: string;
  name: string;
  imageUrl: string | null;
  categoryName?: string;
  governorate: string | null;
  area: string | null;
  avgRating: string;
  totalReviews: number;
  priceLabel: string | null;
  tags: string[] | null;
}

export default function ItemCard({
  slug,
  name,
  imageUrl,
  categoryName,
  governorate,
  area,
  avgRating,
  totalReviews,
  priceLabel,
}: ItemCardProps) {
  const rating = parseFloat(avgRating);

  return (
    <Link
      href={`/items/${slug}`}
      className="group block rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent-gold/10">
            <span className="text-4xl font-display text-primary/30">{name[0]}</span>
          </div>
        )}
        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {categoryName}
          </span>
        )}
        {priceLabel && (
          <span className="absolute top-3 right-3 rounded-full bg-accent-gold/90 px-3 py-1 text-xs font-semibold text-secondary">
            {priceLabel}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-secondary group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        {(governorate || area) && (
          <div className="mt-1 flex items-center gap-1 text-sm text-text-muted">
            <MapPin size={14} />
            <span>{[area, governorate].filter(Boolean).join(', ')}</span>
          </div>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="fill-accent-gold text-accent-gold" />
            <span className="text-sm font-semibold text-secondary">
              {rating > 0 ? rating.toFixed(1) : 'New'}
            </span>
            <span className="text-sm text-text-muted">
              ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
