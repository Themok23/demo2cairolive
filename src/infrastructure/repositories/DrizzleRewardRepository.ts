import { eq, and, gte } from 'drizzle-orm';
import { db } from '../db/client';
import { rewards, rewardClaims } from '../db/schema';
import { IRewardRepository } from '@/domain/repositories/IRewardRepository';
import { Reward } from '@/domain/entities/Reward';

export class DrizzleRewardRepository implements IRewardRepository {
  async findAll(): Promise<Reward[]> {
    const result = await db.select().from(rewards);
    return result as unknown as Reward[];
  }

  async findById(id: number): Promise<Reward | null> {
    const result = await db.select().from(rewards).where(eq(rewards.id, id)).limit(1);

    return (result[0] as unknown as Reward) ?? null;
  }

  async findByCategory(category: string): Promise<Reward[]> {
    const result = await db.select().from(rewards).where(eq(rewards.category, category));
    return result as unknown as Reward[];
  }

  async findByMinLevel(minLevel: string): Promise<Reward[]> {
    const result = await db.select().from(rewards).where(eq(rewards.minLevel, minLevel));
    return result as unknown as Reward[];
  }

  async findActive(): Promise<Reward[]> {
    const result = await db
      .select()
      .from(rewards)
      .where(and(eq(rewards.isActive, true), gte(rewards.expiresAt, new Date())));

    return result as unknown as Reward[];
  }

  async create(reward: Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reward> {
    const result = await db.insert(rewards).values(reward as any).returning();
    return result[0] as unknown as Reward;
  }

  async update(
    id: number,
    data: Partial<Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Reward | null> {
    const result = await db
      .update(rewards)
      .set({ ...data, updatedAt: new Date() } as any)
      .where(eq(rewards.id, id))
      .returning();

    return (result[0] as unknown as Reward) ?? null;
  }

  async claimReward(userId: number, rewardId: number): Promise<void> {
    await db.insert(rewardClaims).values({ userId, rewardId } as any);
  }

  async hasClaimedReward(userId: number, rewardId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(rewardClaims)
      .where(and(eq(rewardClaims.userId, userId), eq(rewardClaims.rewardId, rewardId)))
      .limit(1);

    return result.length > 0;
  }

  async getUserClaimedRewards(userId: number): Promise<Reward[]> {
    const result = await db
      .select({ reward: rewards })
      .from(rewardClaims)
      .innerJoin(rewards, eq(rewardClaims.rewardId, rewards.id))
      .where(eq(rewardClaims.userId, userId));

    return result.map((r: any) => r.reward as unknown as Reward);
  }
}
