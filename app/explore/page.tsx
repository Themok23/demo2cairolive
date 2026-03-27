import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/presentation/components/layout/Navbar';
import Footer from '@/presentation/components/layout/Footer';
import ItemCard from '@/presentation/components/items/ItemCard';
import FadeUp from '@/presentation/components/animations/FadeUp';
import { GetItemsByCategory } from '@/application/usecases/items/GetItemsByCategory';
import { getItemRepository } from '@/infrastructure/repositories';
import { db } from '@/infrastructure/db/client';
import { categories } from '@/infrastructure/db/schema';
import { asc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function getExploreData(searchParams: Record<string, string | undefined>) {
  const cats = await db.select().from(categories).orderBy(asc(categories.name));
  const useCase = new GetItemsByCategory(getItemRepository());
  const result = await useCase.execute({
    categorySlug: searchParams.category,
    sortBy: (searchParams.sort as any) ?? 'newest',
    limit: 20,
    offset: 0,
  });
  return { categories: cats, ...result };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const data = await getExploreData(searchParams);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl sm:text-4xl text-secondary">Explore Egypt</h1>
            <p className="mt-2 text-text-muted">Discover and rate the best across the country</p>

            {/* Filter bar */}
            <div className="mt-8 flex flex-wrap gap-2">
              <Link
                href="/explore"
                className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                  !searchParams.category
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-primary border-muted hover:border-primary'
                }`}
              >
                All
              </Link>
              {data.categories.map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/explore?category=${cat.slug}`}
                  className={`rounded-full px-4 py-2 text-sm font-semibold border transition-colors ${
                    searchParams.category === cat.slug
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-text-primary border-muted hover:border-primary'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Sort */}
            <div className="mt-4 flex items-center gap-4 text-sm text-text-muted">
              <span>Sort by:</span>
              <Link href={`/explore?${searchParams.category ? `category=${searchParams.category}&` : ''}sort=newest`}
                className={searchParams.sort === 'newest' || !searchParams.sort ? 'text-primary font-semibold' : 'hover:text-primary'}>
                Newest
              </Link>
              <Link href={`/explore?${searchParams.category ? `category=${searchParams.category}&` : ''}sort=highest_rated`}
                className={searchParams.sort === 'highest_rated' ? 'text-primary font-semibold' : 'hover:text-primary'}>
                Highest Rated
              </Link>
              <Link href={`/explore?${searchParams.category ? `category=${searchParams.category}&` : ''}sort=most_reviewed`}
                className={searchParams.sort === 'most_reviewed' ? 'text-primary font-semibold' : 'hover:text-primary'}>
                Most Reviewed
              </Link>
            </div>

            {/* Items Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.items.map((item, i) => (
                <FadeUp key={item.slug} delay={i * 0.05}>
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

            {data.items.length === 0 && (
              <div className="mt-16 text-center">
                <p className="text-xl text-text-muted">No items found.</p>
                <p className="mt-2 text-text-muted">Be the first to add something!</p>
                <Link href="/submit" className="mt-4 inline-block">
                  <button className="rounded-button bg-primary text-white px-6 py-3 font-semibold hover:bg-primary/90 transition-colors">
                    Add an Item
                  </button>
                </Link>
              </div>
            )}

            <p className="mt-8 text-sm text-text-muted text-center">{data.total} items total</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
