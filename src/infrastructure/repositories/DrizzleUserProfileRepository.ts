import { eq, desc } from 'drizzle-orm';
import { db } from '../db/client';
import { userProfiles, users } from '../db/schema';
import { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import { UserProfile } from '@/domain/entities/UserProfile';

export class DrizzleUserProfileRepository implements IUserProfileRepository {
  async findByUserId(userId: number): Promise<UserProfile | null> {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    return (result[0] as unknown as UserProfile) ?? null;
  }

  async findById(id: number): Promise<UserProfile | null> {
    const result = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.id, id))
      .limit(1);

    return (result[0] as unknown as UserProfile) ?? null;
  }

  async create(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(profile as any).returning();
    return result[0] as unknown as UserProfile;
  }

  async update(
    userId: number,
    data: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<UserProfile | null> {
    const result = await db
      .update(userProfiles)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(userProfiles.userId, userId))
      .returning();

    return (result[0] as unknown as UserProfile) ?? null;
  }

  async incrementApprovedReviews(userId: number): Promise<void> {
    await db
      .update(userProfiles)
      .set({
        approvedReviewCount: db.raw('approved_review_count + 1') as any,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, userId));
  }

  async getLeaderboard(limit: number): Promise<UserProfile[]> {
    const result = await db
      .select()
      .from(userProfiles)
      .orderBy(desc(userProfiles.approvedReviewCount))
      .limit(limit);

    return result as unknown as UserProfile[];
  }
}
