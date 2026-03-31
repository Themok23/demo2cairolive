import Link from 'next/link';
import StaggerText from '@/presentation/components/animations/StaggerText';
import FadeUp from '@/presentation/components/animations/FadeUp';
import CountUp from '@/presentation/components/animations/CountUp';
import SectionReveal from '@/presentation/components/animations/SectionReveal';
import FloatingElements from '@/presentation/components/animations/FloatingElements';
import Button from '@/presentation/components/ui/Button';
import CategoryIcon from '@/presentation/components/ui/CategoryIcon';
import CategorySection from '@/presentation/components/home/CategorySection';
import MembershipLevels from '@/presentation/components/home/MembershipLevels';
import TopContributors from '@/presentation/components/home/TopContributors';
import { GetItemsByCategory } from '@/application/usecases/items/GetItemsByCategory';
import { getItemRepository } from '@/infrastructure/repositories';
import { db } from '@/infrastructure/db/client';
import { categories, items, reviews } from '@/infrastructure/db/schema';
import { sql, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

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

async function getCategories() {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        icon: categories.icon,
        color: categories.color,
        itemCount: sql<number>`count(${items.id})`,
      })
      .from(categories)
      .leftJoin(items, eq(items.categoryId, categories.id))
      .groupBy(categories.id);

    return result;
  } catch {
    return [];
  }
}

async function getItemsByCategory(categorySlug: string, limit: number = 8) {
  try {
    const useCase = new GetItemsByCategory(getItemRepository());
    const result = await useCase.execute({
      categorySlug,
      limit,
      offset: 0,
    });
    return result.items.map((item: any) => ({
      slug: item.slug,
      name: item.name,
      imageUrl: item.imageUrl,
      governorate: item.governorate,
      area: item.area,
      avgRating: String(item.avgRating ?? '0'),
      totalReviews: Number(item.totalReviews ?? 0),
      priceLabel: item.priceLabel ?? null,
      tags: item.tags || null,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [stats, allCategories] = await Promise.all([
    getStats(),
    getCategories(),
  ]);

  const categorySlugs = ['restaurants-food', 'cafes-coffee', 'skincare-cosmetics', 'beaches-resorts', 'gyms-fitness', 'street-food'];
  const categoryTitles: Record<string, { title: string; description: string; variant: 'featured' | 'masonry' | 'magazine' | 'banner' | 'bold-grid' | 'filmstrip' }> = {
    'restaurants-food': {
      title: 'The Real Taste Test',
      description: 'We settle the debate on who actually serves the best in Egypt',
      variant: 'featured',
    },
    'cafes-coffee': {
      title: 'Where You Actually Want to Work',
      description: 'Overrated or underrated? The community decides which cafes are worth your time',
      variant: 'masonry',
    },
    'skincare-cosmetics': {
      title: 'No Filter Needed',
      description: 'Honest reviews on the skincare and cosmetics brands that actually deliver',
      variant: 'magazine',
    },
    'beaches-resorts': {
      title: 'Worth the Drive?',
      description: 'Find out which beaches and resorts live up to the hype',
      variant: 'banner',
    },
    'gyms-fitness': {
      title: 'No Pain, All Gains',
      description: 'The gyms and fitness spots that actually get results, rated by real people',
      variant: 'bold-grid',
    },
    'street-food': {
      title: 'Street Cred',
      description: 'The street food spots locals swear by, now rated and ranked',
      variant: 'filmstrip',
    },
  };

  const itemsByCategory = await Promise.all(
    categorySlugs.map(slug => getItemsByCategory(slug, 8))
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-24 sm:py-36 md:py-44"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=1500&h=600&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <FloatingElements variant="dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <StaggerText
            text="Make or break reviews."
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg"
          />
          <FadeUp delay={0.5}>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-body leading-relaxed drop-shadow-md">
              Real opinions. No sugarcoating. Rate restaurants, cafes, gyms, beaches, and everything in between across Egypt.
            </p>
          </FadeUp>
          <FadeUp delay={0.7}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <button className="inline-flex items-center justify-center font-body font-semibold rounded-xl px-8 py-4 text-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/25">
                  Start Rating
                </button>
              </Link>
              <Link href="/submit">
                <button className="inline-flex items-center justify-center font-body font-semibold rounded-xl px-8 py-4 text-lg border-2 border-white/80 text-white hover:bg-white/15 transition-all duration-200 backdrop-blur-sm">
                  Drop a Review
                </button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category Grid */}
      <section className="relative py-16 sm:py-24 bg-secondary overflow-hidden">
        <FloatingElements variant="dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">Pick Your Arena</h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg font-body">
                What are you here to rate?
              </p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 auto-rows-max">
            {allCategories.map((cat: any, i: number) => {
              // Create asymmetric layout: first 2 categories span 2 rows, others normal
              const isLarge = i < 2;
              const rowSpan = isLarge ? 'sm:row-span-2' : '';
              const colSpan = isLarge ? 'lg:col-span-2' : '';

              return (
                <FadeUp key={cat.slug} delay={i * 0.08}>
                  <Link
                    href={`/explore/${cat.slug}`}
                    className={`group relative flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm p-6 sm:p-8 shadow-lg transition-all duration-500 overflow-hidden h-full min-h-[140px] sm:min-h-[160px] ${rowSpan} ${colSpan} hover:shadow-2xl hover:-translate-y-1 active:scale-95`}
                  >
                    {/* Animated background gradient on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 via-transparent to-accent-gold/5" />

                    {/* Glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-accent-gold to-primary rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500 -z-10" />

                    {/* Icon container with animation */}
                    <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary transition-all duration-500 group-hover:from-primary group-hover:to-primary/90 group-hover:text-white group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/40">
                      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 animate-pulse duration-2000" />
                      <CategoryIcon name={cat.icon ?? 'MapPin'} size={isLarge ? 36 : 28} />
                    </div>

                    {/* Text content */}
                    <div className="relative flex flex-col items-center gap-1.5 flex-1 justify-center">
                      <span className="text-sm sm:text-base font-bold text-center text-secondary leading-snug font-body transition-colors duration-300 group-hover:text-primary line-clamp-2">
                        {cat.name}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-secondary/60 font-medium transition-colors duration-300 group-hover:text-primary/70">
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                        {cat.itemCount ?? 0} items
                      </span>
                    </div>

                    {/* Hover arrow indicator */}
                    <div className="absolute right-4 top-4 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Showcase Sections */}
      {categorySlugs.map((slug, index) => {
        const categoryConfig = categoryTitles[slug];
        const categoryItems = itemsByCategory[index];

        if (!categoryItems || categoryItems.length === 0) return null;

        return (
          <SectionReveal key={slug}>
            <CategorySection
              title={categoryConfig.title}
              description={categoryConfig.description}
              items={categoryItems}
              categorySlug={slug}
              variant={categoryConfig.variant}
            />
          </SectionReveal>
        );
      })}

      {/* Membership Levels Section */}
      <SectionReveal>
        <MembershipLevels />
      </SectionReveal>

      {/* Top Contributors Section */}
      <SectionReveal>
        <TopContributors />
      </SectionReveal>

      {/* Stats Section */}
      <section className="relative py-16 sm:py-24 bg-secondary overflow-hidden">
        <FloatingElements variant="dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            <FadeUp>
              <div className="p-6">
                <CountUp
                  end={stats.items}
                  className="block font-display text-5xl sm:text-6xl font-bold text-primary drop-shadow-lg"
                />
                <span className="mt-3 block text-white/80 font-body text-lg">Places Judged</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="p-6">
                <CountUp
                  end={stats.reviews}
                  className="block font-display text-5xl sm:text-6xl font-bold text-accent-gold drop-shadow-lg"
                />
                <span className="mt-3 block text-white/80 font-body text-lg">Honest Reviews</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="p-6">
                <CountUp
                  end={stats.categories}
                  className="block font-display text-5xl sm:text-6xl font-bold text-accent-green drop-shadow-lg"
                />
                <span className="mt-3 block text-white/80 font-body text-lg">Arenas</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-24 bg-primary overflow-hidden">
        <FloatingElements variant="dark" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Got something to say?
            </h2>
            <p className="text-white/90 font-body text-lg max-w-2xl mx-auto mb-8">
              Good or terrible, the community needs to hear it. Your review could be the one that tips the scale.
            </p>
            <Link href="/submit">
              <button className="inline-flex items-center justify-center font-body font-semibold rounded-xl px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/15 transition-all duration-200 backdrop-blur-sm">
                Drop Your Review
              </button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
