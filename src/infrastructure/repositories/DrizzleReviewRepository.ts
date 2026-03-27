import { eq, desc, and, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { reviews } from '../db/schema';
import { IReviewRepository } from '@/domain/repositories/IReviewRepository';
import { Review, ReviewStatus } from '@/domain/entities/Review';

export class DrizzleReviewRepository implements IReviewRepository {
  async findByItem(itemId: number, status?: ReviewStatus): Promise<readonly Review[]> {
    const conditions = [eq(reviews.itemId, itemId)];
    if (status) {
      conditions.push(eq(reviews.status, status));
    }

    const result = await db
      .select()
      .from(reviews)
      .where(and(...conditions))
      .orderBy(desc(reviews.createdAt));

    return result as unknown as readonly Review[];
  }

  async findPending(limit: number = 50, offset: number = 0): Promise<readonly Review[]> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.status, 'pending'))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    return result as unknown as readonly Review[];
  }

  async findById(id: number): Promise<Review | null> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id))
      .limit(1);

    return (result[0] as unknown as Review) ?? null;
  }

  async create(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'>): Promise<Review> {
    const result = await db.insert(reviews).values(review as any).returning();
    return result[0] as unknown as Review;
  }

  async updateStatus(id: number, status: ReviewStatus, adminNote?: string): Promise<Review | null> {
    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };
    if (adminNote !== undefined) {
      updateData.adminNote = adminNote;
    }

    const result = await db
      .update(reviews)
      .set(updateData as any)
      .where(eq(reviews.id, id))
      .returning();

    return (result[0] as unknown as Review) ?? null;
  }

  async countByItem(itemId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(and(eq(reviews.itemId, itemId), eq(reviews.status, 'approved')));

    return Number(result[0]?.count ?? 0);
  }

  async getAverageRating(itemId: number): Promise<{ avg: string; count: number }> {
    const result = await db
      .select({
        avg: sql<string>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 2)::text, '0.00')`,
        count: sql<number>`count(*)`,
      })
      .from(reviews)
      .where(and(eq(reviews.itemId, itemId), eq(reviews.status, 'approved')));

    return {
      avg: result[0]?.avg ?? '0.00',
      count: Number(result[0]?.count ?? 0),
    };
  }

  async countPending(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(eq(reviews.status, 'pending'));

    return Number(result[0]?.count ?? 0);
  }
}
