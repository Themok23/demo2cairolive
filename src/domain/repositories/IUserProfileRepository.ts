import { UserProfile } from '@/domain/entities/UserProfile';

export interface IUserProfileRepository {
  findByUserId(userId: number): Promise<UserProfile | null>;
  findById(id: number): Promise<UserProfile | null>;
  create(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile>;
  update(userId: number, data: Partial<Omit<UserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<UserProfile | null>;
  incrementApprovedReviews(userId: number): Promise<void>;
  getLeaderboard(limit: number): Promise<UserProfile[]>;
}
