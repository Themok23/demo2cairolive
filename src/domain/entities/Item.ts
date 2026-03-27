export interface Item {
  readonly id: number;
  readonly slug: string;
  readonly name: string;
  readonly nameAr: string | null;
  readonly categoryId: number | null;
  readonly description: string;
  readonly descriptionAr: string | null;
  readonly imageUrl: string | null;
  readonly imageAlt: string | null;
  readonly governorate: string | null;
  readonly area: string | null;
  readonly address: string | null;
  readonly latitude: string | null;
  readonly longitude: string | null;
  readonly googleMapsUrl: string | null;
  readonly priceMin: number | null;
  readonly priceMax: number | null;
  readonly priceLabel: string | null;
  readonly priceCurrency: string;
  readonly website: string | null;
  readonly instagram: string | null;
  readonly phone: string | null;
  readonly tags: string[] | null;
  readonly isVerified: boolean;
  readonly isFeatured: boolean;
  readonly isActive: boolean;
  readonly avgRating: string;
  readonly totalReviews: number;
  readonly submittedBy: number | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function createItem(
  params: Pick<Item, 'name' | 'slug' | 'description'> & Partial<Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'avgRating' | 'totalReviews'>>
): Omit<Item, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    name: params.name,
    slug: params.slug,
    nameAr: params.nameAr ?? null,
    categoryId: params.categoryId ?? null,
    description: params.description,
    descriptionAr: params.descriptionAr ?? null,
    imageUrl: params.imageUrl ?? null,
    imageAlt: params.imageAlt ?? null,
    governorate: params.governorate ?? null,
    area: params.area ?? null,
    address: params.address ?? null,
    latitude: params.latitude ?? null,
    longitude: params.longitude ?? null,
    googleMapsUrl: params.googleMapsUrl ?? null,
    priceMin: params.priceMin ?? null,
    priceMax: params.priceMax ?? null,
    priceLabel: params.priceLabel ?? null,
    priceCurrency: params.priceCurrency ?? 'EGP',
    website: params.website ?? null,
    instagram: params.instagram ?? null,
    phone: params.phone ?? null,
    tags: params.tags ?? null,
    isVerified: params.isVerified ?? false,
    isFeatured: params.isFeatured ?? false,
    isActive: params.isActive ?? true,
    avgRating: '0.00',
    totalReviews: 0,
    submittedBy: params.submittedBy ?? null,
  };
}
