import { clsx } from 'clsx';
import Link from 'next/link';

interface CategoryPillProps {
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  count?: number;
  active?: boolean;
}

export default function CategoryPill({ name, slug, count, active }: CategoryPillProps) {
  return (
    <Link
      href={`/explore/${slug}`}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold font-body transition-all duration-200',
        'border hover:shadow-sm',
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-surface text-text-primary border-muted hover:border-primary hover:text-primary',
      )}
    >
      <span>{name}</span>
      {count !== undefined && (
        <span className={clsx(
          'rounded-full px-2 py-0.5 text-xs',
          active ? 'bg-white/20' : 'bg-muted',
        )}>
          {count}
        </span>
      )}
    </Link>
  );
}
