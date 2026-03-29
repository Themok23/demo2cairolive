import { eq, sql, inArray } from 'drizzle-orm';
import { db } from '../db/client';
import { users } from '../db/schema';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

export class DrizzleUserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return (result[0] as unknown as User) ?? null;
  }

  async findByIds(ids: number[]): Promise<User[]> {
    if (ids.length === 0) {
      return [];
    }

    const result = await db
      .select()
      .from(users)
      .where(inArray(users.id, ids));

    return result as unknown as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    return (result[0] as unknown as User) ?? null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'reviewCount'> & { passwordHash: string | null }): Promise<User> {
    const result = await db.insert(users).values(user as any).returning();
    return result[0] as unknown as User;
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    const result = await db
      .update(users)
      .set(data as any)
      .where(eq(users.id, id))
      .returning();

    return (result[0] as unknown as User) ?? null;
  }

  async count(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    return Number(result[0]?.count ?? 0);
  }

  async incrementReviewCount(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ reviewCount: sql`${users.reviewCount} + 1` } as any)
      .where(eq(users.id, userId));
  }
}
