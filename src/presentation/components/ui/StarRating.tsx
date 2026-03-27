'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = 20,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of ${maxStars} stars`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.floor(displayRating);
        const isHalf = !isFilled && starValue - 0.5 <= displayRating;

        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            disabled={!interactive}
            className={clsx(
              'transition-transform duration-150',
              interactive && 'cursor-pointer hover:scale-110',
              !interactive && 'cursor-default',
            )}
            onClick={() => interactive && onRate?.(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            aria-label={interactive ? `Rate ${starValue} stars` : undefined}
          >
            <Star
              size={size}
              className={clsx(
                'transition-colors duration-150',
                isFilled && 'fill-accent-gold text-accent-gold',
                isHalf && 'fill-accent-gold/50 text-accent-gold',
                !isFilled && !isHalf && 'fill-muted text-muted',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
