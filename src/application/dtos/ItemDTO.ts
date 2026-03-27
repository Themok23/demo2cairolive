import { z } from 'zod';

export const CreateItemSchema = z.object({
  name: z.string().min(2).max(200),
  nameAr: z.string().max(200).nullable().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  description: z.string().min(10),
  descriptionAr: z.string().nullable().optional(),
  imageUrl: z.string().url().max(500).nullable().optional(),
  imageAlt: z.string().max(200).nullable().optional(),
  governorate: z.string().max(100).nullable().optional(),
  area: z.string().max(100).nullable().optional(),
  address: z.string().nullable().optional(),
  googleMapsUrl: z.string().url().max(500).nullable().optional(),
  priceMin: z.number().int().nonnegative().nullable().optional(),
  priceMax: z.number().int().nonnegative().nullable().optional(),
  priceLabel: z.string().max(50).nullable().optional(),
  website: z.string().url().max(300).nullable().optional(),
  instagram: z.string().max(150).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
});

export type CreateItemDTO = z.infer<typeof CreateItemSchema>;

export interface ItemDTO {
  readonly id: number;
  readonly slug: string;
  readonly name: string;
  readonly nameAr: string | null;
  readonly categoryId: number | null;
  readonly description: string;
  readonly imageUrl: string | null;
  readonly governorate: string | null;
  readonly area: string | null;
  readonly priceLabel: string | null;
  readonly priceMin: number | null;
  readonly priceMax: number | null;
  readonly priceCurrency: string;
  readonly tags: string[] | null;
  readonly isVerified: boolean;
  readonly isFeatured: boolean;
  readonly avgRating: string;
  readonly totalReviews: number;
  readonly website: string | null;
  readonly instagram: string | null;
  readonly phone: string | null;
  readonly googleMapsUrl: string | null;
  readonly createdAt: string;
}

export function toItemDTO(item: {
  id: number;
  slug: string;
  name: string;
  nameAr: string | null;
  categoryId: number | null;
  description: string;
  imageUrl: string | null;
  governorate: string | null;
  area: string | null;
  priceLabel: string | null;
  priceMin: number | null;
  priceMax: number | null;
  priceCurrency: string;
  tags: string[] | null;
  isVerified: boolean;
  isFeatured: boolean;
  avgRating: string;
  totalReviews: number;
  website: string | null;
  instagram: string | null;
  phone: string | null;
  googleMapsUrl: string | null;
  createdAt: Date;
}): ItemDTO {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    nameAr: item.nameAr,
    categoryId: item.categoryId,
    description: item.description,
    imageUrl: item.imageUrl,
    governorate: item.governorate,
    area: item.area,
    priceLabel: item.priceLabel,
    priceMin: item.priceMin,
    priceMax: item.priceMax,
    priceCurrency: item.priceCurrency,
    tags: item.tags,
    isVerified: item.isVerified,
    isFeatured: item.isFeatured,
    avgRating: item.avgRating,
    totalReviews: item.totalReviews,
    website: item.website,
    instagram: item.instagram,
    phone: item.phone,
    googleMapsUrl: item.googleMapsUrl,
    createdAt: item.createdAt.toISOString(),
  };
}
