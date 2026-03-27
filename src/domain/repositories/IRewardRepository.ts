import { Reward } from '@/domain/entities/Reward';

export interface IRewardRepository {
  findAll(): Promise<Reward[]>;
  findById(id: number): Promise<Reward | null>;
  findByCategory(category: string): Promise<Reward[]>;
  findByMinLevel(minLevel: string): Promise<Reward[]>;
  findActive(): Promise<Reward[]>;
  create(reward: Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reward>;
  update(id: number, data: Partial<Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Reward | null>;
  claimReward(userId: number, rewardId: number): Promise<void>;
  hasClaimedReward(userId: number, rewardId: number): Promise<boolean>;
  getUserClaimedRewards(userId: number): Promise<Reward[]>;
}
