'use client';

import Link from 'next/link';
import { ChevronRight, MapPin, Star } from 'lucide-react';
import FadeUp from '@/presentation/components/animations/FadeUp';

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
  variant: 'featured' | 'masonry' | 'magazine' | 'banner' | 'bold-grid' | 'filmstrip';
}

export default function CategorySection({
  title,
  description,
  items,
  categorySlug,
  variant,
}: CategorySectionProps) {
  if (items.length === 0) {
    return null;
  }

  // === VARIANT 1: FEATURED HERO LAYOUT (Restaurants) ===
  if (variant === 'featured') {
    const featured = items[0];
    const remaining = items.slice(1, 5);

    return (
      <section className="py-16 sm:py-24 bg-secondary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">{title}</h2>
                <p className="text-sm sm:text-base text-white/70 max-w-2xl">{description}</p>
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

          {/* Featured Hero + Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large Featured Card */}
            <FadeUp delay={0.05}>
              <Link
                href={`/items/${featured.slug}`}
                className="group lg:col-span-2 rounded-card overflow-hidden shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {featured.imageUrl ? (
                    <>
                      <img
                        src={featured.imageUrl}
                        alt={featured.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    </>
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-end p-6">
                      <span className="text-6xl font-display text-primary/20">{featured.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="font-display text-2xl sm:text-3xl mb-2 line-clamp-2">{featured.name}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} />
                      <span>{[featured.area, featured.governorate].filter(Boolean).join(', ')}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <Star size={16} className="fill-accent-gold text-accent-gold" />
                      <span className="font-semibold">{parseFloat(featured.avgRating).toFixed(1)}</span>
                      <span className="text-white/70">({featured.totalReviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            </FadeUp>

            {/* Side Grid */}
            <div className="grid grid-cols-1 gap-6">
              {remaining.map((item, i) => (
                <FadeUp key={item.slug} delay={0.1 + i * 0.05}>
                  <Link
                    href={`/items/${item.slug}`}
                    className="group block rounded-card overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                      {item.imageUrl ? (
                        <>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </>
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <span className="text-4xl font-display text-primary/20">{item.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm sm:text-base text-white line-clamp-1">{item.name}</h3>
                      <div className="mt-2 flex items-center gap-1">
                        <Star size={14} className="fill-accent-gold text-accent-gold" />
                        <span className="text-xs font-semibold text-white">
                          {parseFloat(item.avgRating).toFixed(1)}
                        </span>
                        <span className="text-xs text-white/70">({item.totalReviews})</span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // === VARIANT 2: MASONRY GRID (Cafes) ===
  if (variant === 'masonry') {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-br from-amber-50/50 to-background text-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-secondary mb-2">{title}</h2>
                <p className="text-sm sm:text-base text-text-muted max-w-2xl">{description}</p>
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

          {/* Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {items.slice(0, 6).map((item, i) => {
              const isFirstCard = i === 0;
              const rowSpan = isFirstCard ? 'sm:row-span-2' : '';

              return (
                <FadeUp key={item.slug} delay={i * 0.05}>
                  <Link
                    href={`/items/${item.slug}`}
                    className={`group block rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${rowSpan}`}
                  >
                    <div className={`relative overflow-hidden bg-muted ${isFirstCard ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
                      {item.imageUrl ? (
                        <>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </>
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-amber-100/30 to-amber-50/20 flex items-center justify-center">
                          <span className="text-5xl font-display text-amber-700/20">{item.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm sm:text-base text-secondary line-clamp-2">{item.name}</h3>
                      <div className="mt-2 flex items-center gap-1">
                        <Star size={14} className="fill-accent-gold text-accent-gold" />
                        <span className="text-xs font-semibold text-secondary">
                          {parseFloat(item.avgRating).toFixed(1)}
                        </span>
                        <span className="text-xs text-text-muted">({item.totalReviews})</span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // === VARIANT 3: MAGAZINE SCROLL (Skincare) ===
  if (variant === 'magazine') {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-r from-secondary via-secondary/95 to-primary/20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">{title}</h2>
                <p className="text-sm sm:text-base text-white/70 max-w-2xl">{description}</p>
              </div>
              <Link
                href={`/explore/${categorySlug}`}
                className="group flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-button text-accent-gold hover:text-accent-gold font-semibold transition-all duration-200"
              >
                View All
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeUp>

          {/* Horizontal Scroll */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4 min-w-min">
              {items.map((item, i) => (
                <FadeUp key={item.slug} delay={i * 0.05}>
                  <Link
                    href={`/items/${item.slug}`}
                    className="group flex-shrink-0 w-96 rounded-card overflow-hidden shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      {item.imageUrl ? (
                        <>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </>
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-end p-6">
                          <span className="text-6xl font-display text-primary/30">{item.name[0]}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="font-display text-xl mb-2 line-clamp-2">{item.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} />
                          <span className="line-clamp-1">{[item.area, item.governorate].filter(Boolean).join(', ')}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-1">
                          <Star size={16} className="fill-accent-gold text-accent-gold" />
                          <span className="font-semibold">{parseFloat(item.avgRating).toFixed(1)}</span>
                          <span className="text-white/70">({item.totalReviews})</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // === VARIANT 4: BANNER WITH FLOATING CARDS (Beaches) ===
  if (variant === 'banner') {
    const featured = items[0];
    const floating = items.slice(1, 5);

    return (
      <section className="py-16 sm:py-24 bg-background text-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-secondary mb-2">{title}</h2>
                <p className="text-sm sm:text-base text-text-muted max-w-2xl">{description}</p>
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

          {/* Banner */}
          <FadeUp delay={0.05}>
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-card-hover mb-8">
              {featured.imageUrl ? (
                <>
                  <img
                    src={featured.imageUrl}
                    alt={featured.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-blue-100/50 to-blue-50/30 flex items-end p-8">
                  <span className="text-7xl font-display text-blue-200/30">{featured.name[0]}</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="font-display text-3xl mb-2">{featured.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} />
                  <span>{[featured.area, featured.governorate].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Floating Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {floating.map((item, i) => (
              <FadeUp key={item.slug} delay={0.1 + i * 0.05}>
                <Link
                  href={`/items/${item.slug}`}
                  className="group block rounded-card overflow-hidden bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-100/30 to-blue-50/20 flex items-center justify-center">
                        <span className="text-4xl font-display text-blue-200/30">{item.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm text-secondary line-clamp-1">{item.name}</h3>
                    <div className="mt-2 flex items-center gap-1">
                      <Star size={14} className="fill-accent-gold text-accent-gold" />
                      <span className="text-xs font-semibold text-secondary">
                        {parseFloat(item.avgRating).toFixed(1)}
                      </span>
                      <span className="text-xs text-text-muted">({item.totalReviews})</span>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // === VARIANT 5: BOLD GRID CARDS (Gyms) ===
  if (variant === 'bold-grid') {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-br from-secondary via-secondary to-secondary/90 text-white relative overflow-hidden">
        {/* Accent gradient edge */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-green/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-white mb-2">{title}</h2>
                <p className="text-sm sm:text-base text-white/70 max-w-2xl">{description}</p>
              </div>
              <Link
                href={`/explore/${categorySlug}`}
                className="group flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-button text-accent-green hover:text-accent-green font-semibold transition-all duration-200"
              >
                View All
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeUp>

          {/* Bold Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 6).map((item, i) => (
              <FadeUp key={item.slug} delay={i * 0.05}>
                <Link
                  href={`/items/${item.slug}`}
                  className="group block rounded-card overflow-hidden bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 border-l-4 border-accent-green"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-accent-green/20 to-accent-green/5 flex items-center justify-center">
                        <span className="text-5xl font-display text-accent-green/30">{item.name[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-white line-clamp-1">{item.name}</h3>
                    <div className="mt-3 flex items-center gap-2">
                      <MapPin size={14} className="text-accent-green" />
                      <span className="text-xs text-white/70 line-clamp-1">
                        {[item.area, item.governorate].filter(Boolean).join(', ')}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <Star size={14} className="fill-accent-gold text-accent-gold" />
                      <span className="text-sm font-bold text-white">{parseFloat(item.avgRating).toFixed(1)}</span>
                      <span className="text-xs text-white/50">({item.totalReviews})</span>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // === VARIANT 6: FILMSTRIP (Street Food) ===
  if (variant === 'filmstrip') {
    return (
      <section className="py-16 sm:py-24 bg-gradient-to-r from-background via-background to-primary/5 text-secondary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl sm:text-4xl text-secondary mb-2">{title}</h2>
                <p className="text-sm sm:text-base text-text-muted max-w-2xl">{description}</p>
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

          {/* Filmstrip */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 pb-4 min-w-min">
              {items.map((item, i) => (
                <FadeUp key={item.slug} delay={i * 0.05}>
                  <Link
                    href={`/items/${item.slug}`}
                    className="group flex-shrink-0 flex flex-col items-center gap-3 transition-all duration-300"
                  >
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-card transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover ring-4 ring-transparent group-hover:ring-primary/30">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <span className="text-4xl font-display text-primary/20">{item.name[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="w-32 text-center">
                      <h3 className="font-display text-sm text-secondary line-clamp-2">{item.name}</h3>
                      <div className="mt-2 flex items-center justify-center gap-1">
                        <Star size={12} className="fill-accent-gold text-accent-gold" />
                        <span className="text-xs font-semibold text-secondary">
                          {parseFloat(item.avgRating).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default fallback (should not reach here with proper variant prop)
  return null;
}
