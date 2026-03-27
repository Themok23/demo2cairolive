import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { membershipLevels } from '../db/schema';
import { IMembershipLevelRepository } from '@/domain/repositories/IMembershipLevelRepository';
import { MembershipLevel } from '@/domain/entities/MembershipLevel';

export class DrizzleMembershipLevelRepository implements IMembershipLevelRepository {
  async findAll(): Promise<MembershipLevel[]> {
    const result = await db.select().from(membershipLevels);
    return result as unknown as MembershipLevel[];
  }

  async findById(id: number): Promise<MembershipLevel | null> {
    const result = await db
      .select()
      .from(membershipLevels)
      .where(eq(membershipLevels.id, id))
      .limit(1);

    return (result[0] as unknown as MembershipLevel) ?? null;
  }

  async findBySlug(slug: string): Promise<MembershipLevel | null> {
    const result = await db
      .select()
      .from(membershipLevels)
      .where(eq(membershipLevels.slug, slug))
      .limit(1);

    return (result[0] as unknown as MembershipLevel) ?? null;
  }

  async findByMinReviews(reviews: number): Promise<MembershipLevel | null> {
    const result = await db
      .select()
      .from(membershipLevels)
      .where(eq(membershipLevels.minReviews, reviews))
      .limit(1);

    return (result[0] as unknown as MembershipLevel) ?? null;
  }

  async create(level: Omit<MembershipLevel, 'id' | 'createdAt'>): Promise<MembershipLevel> {
    const result = await db.insert(membershipLevels).values(level as any).returning();
    return result[0] as unknown as MembershipLevel;
  }

  async update(
    id: number,
    data: Partial<Omit<MembershipLevel, 'id' | 'createdAt'>>
  ): Promise<MembershipLevel | null> {
    const result = await db
      .update(membershipLevels)
      .set(data as any)
      .where(eq(membershipLevels.id, id))
      .returning();

    return (result[0] as unknown as MembershipLevel) ?? null;
  }
}
