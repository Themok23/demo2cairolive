import { User } from '../entities/User';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByIds(ids: number[]): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'reviewCount'> & { passwordHash: string | null }): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User | null>;
  count(): Promise<number>;
  incrementReviewCount(userId: number): Promise<void>;
}
