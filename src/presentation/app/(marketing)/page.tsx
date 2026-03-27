import Link from 'next/link';
import StaggerText from '@/presentation/components/animations/StaggerText';
import FadeUp from '@/presentation/components/animations/FadeUp';
import CountUp from '@/presentation/components/animations/CountUp';
import ItemCard from '@/presentation/components/items/ItemCard';
import Button from '@/presentation/components/ui/Button';
import { GetFeaturedItems } from '@/application/usecases/items/GetFeaturedItems';
import { getItemRepository } from '@/infrastructure/repositories';
import { db } from '@/infrastructure/db/client';
import { categories, items, reviews } from '@/infrastructure/db/schema';
import { sql, eq } from 'drizzle-orm';

async function getStats() {
  try {
    const [itemCount, reviewCount, categoryCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(items).where(eq(items.isActive, true)),
      db.select({ count: sql<number>`count(*)` }).from(reviews).where(eq(reviews.status, 'approved')),
      db.select({ count: sql<number>`count(*)` }).from(categories),
    ]);
    return {
      items: Number(itemCount[0]?.count ?? 0),
      reviews: Number(reviewCount[0]?.count ?? 0),
      categories: Number(categoryCount[0]?.count ?? 0),
    };
  } catch {
    return { items: 0, reviews: 0, categories: 0 };
  }
}

async function getFeatured() {
  try {
    const useCase = new GetFeaturedItems(getItemRepository());
    return await useCase.execute(6);
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await db.select().from(categories);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [stats, featured, cats] = await Promise.all([
    getStats(),
    getFeatured(),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <StaggerText
            text="Rate anything in Egypt."
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-secondary leading-tight"
          />
          <FadeUp delay={0.5}>
            <p className="mt-6 text-lg sm:text-xl text-text-muted max-w-2xl mx-auto font-body">
              Discover, review, and rate the best restaurants, products, cafes, gyms, beaches, and more across Egypt.
            </p>
          </FadeUp>
          <FadeUp delay={0.7}>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <Button size="lg">Explore Now</Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg">Add Something</Button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl text-secondary text-center">Browse by Category</h2>
          </FadeUp>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {cats.map((cat, i) => (
              <FadeUp key={cat.slug} delay={i * 0.1}>
                <Link
                  href={`/explore/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-card bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="text-xl">{cat.icon ?? '📍'}</span>
                  </div>
                  <span className="text-sm font-semibold text-center text-secondary">{cat.name}</span>
                  <span className="text-xs text-text-muted">{cat.itemCount ?? 0} items</span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-primary/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <FadeUp>
              <h2 className="font-display text-3xl sm:text-4xl text-secondary text-center">What's Hot Right Now</h2>
              <p className="mt-3 text-text-muted text-center">Top-rated and trending across Egypt</p>
            </FadeUp>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((item, i) => (
                <FadeUp key={item.slug} delay={i * 0.1}>
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
                </FadeUp>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <FadeUp>
              <div className="p-6">
                <CountUp end={stats.items} className="block font-display text-5xl text-primary" />
                <span className="mt-2 block text-text-muted font-body">Items Rated</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="p-6">
                <CountUp end={stats.reviews} className="block font-display text-5xl text-accent-gold" />
                <span className="mt-2 block text-text-muted font-body">Reviews</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="p-6">
                <CountUp end={stats.categories} className="block font-display text-5xl text-accent-green" />
                <span className="mt-2 block text-text-muted font-body">Categories</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl text-white">Found something worth rating?</h2>
            <p className="mt-4 text-white/60 font-body">Help the community discover the best of Egypt.</p>
            <Link href="/submit" className="mt-8 inline-block">
              <Button size="lg">Add It Now</Button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
