import { eq, desc, asc, ilike, sql, and, gte } from 'drizzle-orm';
import { db } from '../db/client';
import { items, categories } from '../db/schema';
import { IItemRepository, ItemFilters } from '@/domain/repositories/IItemRepository';
import { Item } from '@/domain/entities/Item';

export class DrizzleItemRepository implements IItemRepository {
  async findAll(filters: ItemFilters): Promise<readonly Item[]> {
    const conditions = [eq(items.isActive, true)];

    if (filters.categorySlug) {
      const category = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, filters.categorySlug))
        .limit(1);
      if (category[0]) {
        conditions.push(eq(items.categoryId, category[0].id));
      }
    }

    if (filters.governorate) {
      conditions.push(eq(items.governorate, filters.governorate));
    }

    if (filters.minRating) {
      conditions.push(gte(items.avgRating, String(filters.minRating)));
    }

    if (filters.priceLabel) {
      conditions.push(eq(items.priceLabel, filters.priceLabel));
    }

    let orderBy;
    switch (filters.sortBy) {
      case 'most_reviewed':
        orderBy = desc(items.totalReviews);
        break;
      case 'highest_rated':
        orderBy = desc(items.avgRating);
        break;
      case 'newest':
      default:
        orderBy = desc(items.createdAt);
        break;
    }

    const result = await db
      .select()
      .from(items)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(filters.limit ?? 20)
      .offset(filters.offset ?? 0);

    return result as unknown as readonly Item[];
  }

  async findBySlug(slug: string): Promise<Item | null> {
    const result = await db
      .select()
      .from(items)
      .where(eq(items.slug, slug))
      .limit(1);

    return (result[0] as unknown as Item) ?? null;
  }

  async findFeatured(limit: number = 6): Promise<readonly Item[]> {
    const result = await db
      .select()
      .from(items)
      .where(and(eq(items.isFeatured, true), eq(items.isActive, true)))
      .orderBy(desc(items.avgRating))
      .limit(limit);

    return result as unknown as readonly Item[];
  }

  async create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> {
    const result = await db.insert(items).values(item as any).returning();
    return result[0] as unknown as Item;
  }

  async update(id: number, data: Partial<Item>): Promise<Item | null> {
    const result = await db
      .update(items)
      .set({ ...data as any, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();

    return (result[0] as unknown as Item) ?? null;
  }

  async search(query: string, limit: number = 20): Promise<readonly Item[]> {
    const result = await db
      .select()
      .from(items)
      .where(
        and(
          eq(items.isActive, true),
          sql`(${items.name} ILIKE ${'%' + query + '%'} OR ${items.description} ILIKE ${'%' + query + '%'} OR ${items.governorate} ILIKE ${'%' + query + '%'} OR ${items.area} ILIKE ${'%' + query + '%'})`
        )
      )
      .orderBy(desc(items.avgRating))
      .limit(limit);

    return result as unknown as readonly Item[];
  }

  async count(filters?: ItemFilters): Promise<number> {
    const conditions = [eq(items.isActive, true)];

    if (filters?.categorySlug) {
      const category = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, filters.categorySlug))
        .limit(1);
      if (category[0]) {
        conditions.push(eq(items.categoryId, category[0].id));
      }
    }

    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(and(...conditions));

    return Number(result[0]?.count ?? 0);
  }

  async updateRating(itemId: number, avgRating: string, totalReviews: number): Promise<void> {
    await db
      .update(items)
      .set({ avgRating, totalReviews, updatedAt: new Date() } as any)
      .where(eq(items.id, itemId));
  }
}
