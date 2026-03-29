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
      title: 'Taste of Egypt',
      description: 'Discover the finest restaurants serving authentic and modern cuisine',
      variant: 'featured',
    },
    'cafes-coffee': {
      title: 'Coffee & Vibes',
      description: 'Explore cozy cafes perfect for work, meetings, or relaxation',
      variant: 'masonry',
    },
    'skincare-cosmetics': {
      title: 'Beauty & Skincare',
      description: 'Top rated skincare and cosmetics brands in Egypt',
      variant: 'magazine',
    },
    'beaches-resorts': {
      title: 'Sun & Sea',
      description: "Relax at Egypt's most beautiful coastal destinations",
      variant: 'banner',
    },
    'gyms-fitness': {
      title: 'Fitness & Wellness',
      description: 'Stay active with the best gyms and fitness centers across Egypt',
      variant: 'bold-grid',
    },
    'street-food': {
      title: 'Street Food Gems',
      description: "The authentic street food that makes Egypt's food culture legendary",
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
            text="Rate anything in Egypt."
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight drop-shadow-lg"
          />
          <FadeUp delay={0.5}>
            <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto font-body leading-relaxed drop-shadow-md">
              Discover, review, and rate the best restaurants, cafes, beaches, fitness, skincare, street food, and more across Egypt.
            </p>
          </FadeUp>
          <FadeUp delay={0.7}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/explore">
                <button className="inline-flex items-center justify-center font-body font-semibold rounded-xl px-8 py-4 text-lg bg-primary text-white hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] shadow-lg shadow-primary/25">
                  Explore Now
                </button>
              </Link>
              <Link href="/submit">
                <button className="inline-flex items-center justify-center font-body font-semibold rounded-xl px-8 py-4 text-lg border-2 border-white/80 text-white hover:bg-white/15 transition-all duration-200 backdrop-blur-sm">
                  Add Something
                </button>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Category Grid */}
      <section className="relative py-16 sm:py-24 bg-background">
        <FloatingElements variant="light" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-secondary mb-3 tracking-tight">Browse Categories</h2>
              <p className="text-text-muted max-w-2xl mx-auto">
                Explore curated collections across all of Egypt
              </p>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {allCategories.map((cat: any, i: number) => (
              <FadeUp key={cat.slug} delay={i * 0.05}>
                <Link
                  href={`/explore/${cat.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-card-hover"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <CategoryIcon name={cat.icon ?? 'MapPin'} size={28} />
                  </div>
                  <span className="text-sm font-semibold text-center text-secondary leading-tight">{cat.name}</span>
                  <span className="text-xs text-text-muted">{cat.itemCount ?? 0} items</span>
                </Link>
              </FadeUp>
            ))}
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
                <span className="mt-3 block text-white/80 font-body text-lg">Items Rated</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="p-6">
                <CountUp
                  end={stats.reviews}
                  className="block font-display text-5xl sm:text-6xl font-bold text-accent-gold drop-shadow-lg"
                />
                <span className="mt-3 block text-white/80 font-body text-lg">Reviews</span>
              </div>
            </FadeUp>
            <FadeUp delay={0.3}>
              <div className="p-6">
                <CountUp
                  end={stats.categories}
                  className="block font-display text-5xl sm:text-6xl font-bold text-accent-green drop-shadow-lg"
                />
                <span className="mt-3 block text-white/80 font-body text-lg">Categories</span>
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
              Found something worth rating?
            </h2>
            <p className="text-white/90 font-body text-lg max-w-2xl mx-auto mb-8">
              Help the community discover the best of Egypt by adding and reviewing your favorite places.
            </p>
            <Link href="/submit">
              <button className="inline-flex items-center justify-center font-body font-semibold rounded-xl px-8 py-4 text-lg border-2 border-white text-white hover:bg-white/15 transition-all duration-200 backdrop-blur-sm">
                Add It Now
              </button>
            </Link>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
