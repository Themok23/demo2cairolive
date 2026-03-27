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
      className="group block rounded-card bg-surface shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {imageUrl ? (
          <div className="relative h-full w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Overlay gradient on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-accent-gold/5 to-primary/5">
            <span className="text-6xl font-display text-primary/20 mb-2">{name[0]?.toUpperCase()}</span>
            <span className="text-xs text-text-muted/50 text-center px-2">No image available</span>
          </div>
        )}

        {/* Category Badge */}
        {categoryName && (
          <span className="absolute top-3 left-3 rounded-full bg-secondary/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm shadow-sm">
            {categoryName}
          </span>
        )}

        {/* Price Badge */}
        {priceLabel && (
          <span className="absolute top-3 right-3 rounded-full bg-accent-gold/95 px-3 py-1 text-xs font-semibold text-secondary shadow-sm">
            {priceLabel}
          </span>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5">
        <h3 className="font-display text-lg text-secondary group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {name}
        </h3>

        {/* Location */}
        {(governorate || area) && (
          <div className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="line-clamp-1">{[area, governorate].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {/* Rating */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} className="fill-accent-gold text-accent-gold" />
            <span className="text-sm font-semibold text-secondary">
              {rating > 0 ? rating.toFixed(1) : 'New'}
            </span>
            <span className="text-xs text-text-muted">
              ({totalReviews})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
