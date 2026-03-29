import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GetItemBySlug } from '@/application/usecases/items/GetItemBySlug';
import { getItemRepository } from '@/infrastructure/repositories';
import { db } from '@/infrastructure/db/client';
import { categories, reviews, users } from '@/infrastructure/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { Star, MapPin, Globe, Phone, ExternalLink, ChevronLeft, ThumbsUp } from 'lucide-react';
import CategoryIcon from '@/presentation/components/ui/CategoryIcon';
import FadeUp from '@/presentation/components/animations/FadeUp';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

async function getItem(slug: string) {
  const useCase = new GetItemBySlug(getItemRepository());
  return useCase.execute(slug);
}

async function getCategory(categoryId: number | null) {
  if (!categoryId) return null;
  const result = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1);
  return result[0] || null;
}

async function getItemReviews(itemId: number) {
  const result = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      body: reviews.body,
      pros: reviews.pros,
      cons: reviews.cons,
      helpfulCount: reviews.helpfulCount,
      createdAt: reviews.createdAt,
      userName: users.name,
      userAvatar: users.avatarUrl,
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(and(eq(reviews.itemId, itemId), eq(reviews.status, 'approved')))
    .orderBy(sql`${reviews.createdAt} DESC`)
    .limit(20);
  return result;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await getItem(params.slug);
  if (!item) return { title: 'Not Found' };
  return {
    title: `${item.name} - demo2cairolive`,
    description: item.description?.slice(0, 160),
  };
}

function safeRating(val: string): string {
  const n = parseFloat(val);
  return isNaN(n) || n === 0 ? 'New' : n.toFixed(1);
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={star <= rating ? 'fill-accent-gold text-accent-gold' : 'text-muted'}
        />
      ))}
    </div>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default async function ItemPage({ params }: PageProps) {
  const item = await getItem(params.slug);
  if (!item) notFound();

  const [category, itemReviews] = await Promise.all([
    getCategory(item.categoryId),
    getItemReviews(item.id),
  ]);

  const rating = parseFloat(item.avgRating);
  const ratingDisplay = safeRating(item.avgRating);
  const location = [item.area, item.governorate].filter(Boolean).join(', ');

  // Rating distribution from reviews
  const distribution = [0, 0, 0, 0, 0];
  for (const r of itemReviews) {
    if (r.rating >= 1 && r.rating <= 5) {
      distribution[r.rating - 1]++;
    }
  }
  const maxCount = Math.max(...distribution, 1);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar spacer */}
      <div className="h-16"></div>

      {/* Hero Image */}
      <div className="relative w-full h-[320px] sm:h-[420px] overflow-hidden bg-secondary">
        {item.imageUrl ? (
          <>
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
            <span className="text-8xl font-display text-white/20">{item.name[0]}</span>
          </div>
        )}

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/50 transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </Link>
        </div>

        {/* Tags overlay */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <FadeUp>
              {/* Title & Meta */}
              <div>
                {category && (
                  <Link
                    href={`/explore/${category.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mb-3 hover:underline"
                  >
                    <CategoryIcon name={category.icon ?? "MapPin"} size={16} />
                    {category.name}
                  </Link>
                )}
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-secondary tracking-tight">
                  {item.name}
                </h1>
                {location && (
                  <div className="flex items-center gap-2 mt-3 text-text-muted">
                    <MapPin size={16} />
                    <span>{location}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Star size={20} className="fill-accent-gold text-accent-gold" />
                    <span className="text-xl font-bold text-secondary">{ratingDisplay}</span>
                    <span className="text-text-muted">({item.totalReviews} review{item.totalReviews !== 1 ? 's' : ''})</span>
                  </div>
                  {item.isVerified && (
                    <span className="px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green text-xs font-semibold">
                      Verified
                    </span>
                  )}
                  {item.priceLabel && (
                    <span className="text-text-muted font-medium">{item.priceLabel}</span>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* Description */}
            <FadeUp delay={0.1}>
              <div>
                <h2 className="font-display text-lg font-semibold text-secondary mb-3">About</h2>
                <p className="text-text-muted leading-relaxed whitespace-pre-line">{item.description}</p>
              </div>
            </FadeUp>

            {/* Rating Distribution */}
            {item.totalReviews > 0 && (
              <FadeUp delay={0.15}>
                <div>
                  <h2 className="font-display text-lg font-semibold text-secondary mb-4">Rating Breakdown</h2>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = distribution[star - 1];
                      const pct = (count / maxCount) * 100;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-text-muted w-4">{star}</span>
                          <Star size={14} className="fill-accent-gold text-accent-gold" />
                          <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent-gold rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-sm text-text-muted w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeUp>
            )}

            {/* Reviews */}
            <FadeUp delay={0.2}>
              <div>
                <h2 className="font-display text-lg font-semibold text-secondary mb-4">
                  Reviews ({itemReviews.length})
                </h2>

                {itemReviews.length === 0 ? (
                  <div className="text-center py-12 bg-surface rounded-card">
                    <p className="text-text-muted mb-4">No reviews yet. Be the first to share your experience!</p>
                    <Link
                      href={`/submit?itemId=${item.id}`}
                      className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-button font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Write a Review
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {itemReviews.map((review: any) => (
                      <div key={review.id} className="bg-surface rounded-card p-5 shadow-card">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {review.userName?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-secondary text-sm">{review.userName || 'Anonymous'}</p>
                              <p className="text-xs text-text-muted">{timeAgo(review.createdAt)}</p>
                            </div>
                          </div>
                          <RatingStars rating={review.rating} />
                        </div>

                        {review.title && (
                          <h3 className="font-semibold text-secondary mb-1">{review.title}</h3>
                        )}
                        <p className="text-text-muted text-sm leading-relaxed">{review.body}</p>

                        {(review.pros || review.cons) && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {review.pros && (
                              <div className="text-sm">
                                <span className="font-medium text-accent-green">Pros: </span>
                                <span className="text-text-muted">{review.pros}</span>
                              </div>
                            )}
                            {review.cons && (
                              <div className="text-sm">
                                <span className="font-medium text-primary">Cons: </span>
                                <span className="text-text-muted">{review.cons}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {(review.helpfulCount ?? 0) > 0 && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
                            <ThumbsUp size={12} />
                            <span>{review.helpfulCount} found this helpful</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FadeUp>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FadeUp delay={0.1}>
              <div className="sticky top-24 space-y-6">
                {/* Quick Info Card */}
                <div className="bg-surface rounded-card p-6 shadow-card space-y-4">
                  <h3 className="font-display font-semibold text-secondary">Details</h3>

                  {item.priceLabel && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Price Range</span>
                      <span className="font-semibold text-secondary">{item.priceLabel}</span>
                    </div>
                  )}

                  {item.priceMin != null && item.priceMax != null && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Price</span>
                      <span className="font-semibold text-secondary">
                        {item.priceMin} - {item.priceMax} {item.priceCurrency}
                      </span>
                    </div>
                  )}

                  {category && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Category</span>
                      <Link href={`/explore/${category.slug}`} className="font-semibold text-primary hover:underline">
                        <CategoryIcon name={category.icon ?? "MapPin"} size={14} className="inline-block mr-1" /> {category.name}
                      </Link>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Location</span>
                      <span className="font-semibold text-secondary">{location}</span>
                    </div>
                  )}
                </div>

                {/* Contact Card */}
                {(item.phone || item.website || item.instagram || item.googleMapsUrl) && (
                  <div className="bg-surface rounded-card p-6 shadow-card space-y-3">
                    <h3 className="font-display font-semibold text-secondary">Contact</h3>

                    {item.phone && (
                      <a href={`tel:${item.phone}`} className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition-colors">
                        <Phone size={16} />
                        <span>{item.phone}</span>
                      </a>
                    )}

                    {item.website && (
                      <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition-colors">
                        <Globe size={16} />
                        <span className="truncate">{item.website.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink size={12} className="ml-auto flex-shrink-0" />
                      </a>
                    )}

                    {item.instagram && (
                      <a href={`https://instagram.com/${item.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span>@{item.instagram.replace('@', '')}</span>
                        <ExternalLink size={12} className="ml-auto flex-shrink-0" />
                      </a>
                    )}

                    {item.googleMapsUrl && (
                      <a href={item.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-text-muted hover:text-primary transition-colors">
                        <MapPin size={16} />
                        <span>View on Google Maps</span>
                        <ExternalLink size={12} className="ml-auto flex-shrink-0" />
                      </a>
                    )}
                  </div>
                )}

                {/* CTA */}
                <Link
                  href={`/submit?itemId=${item.id}`}
                  className="block w-full text-center px-6 py-3 bg-primary text-white rounded-button font-semibold hover:bg-primary/90 transition-colors shadow-card"
                >
                  Write a Review
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </div>
    </div>
  );
}
