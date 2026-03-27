import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { adminSettings } from '../db/schema';
import { IAdminSettingsRepository, AdminSetting } from '@/domain/repositories/IAdminSettingsRepository';

export class DrizzleAdminSettingsRepository implements IAdminSettingsRepository {
  async get(key: string): Promise<string | null> {
    const result = await db
      .select()
      .from(adminSettings)
      .where(eq(adminSettings.key, key))
      .limit(1);

    return result[0]?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    const existing = await this.get(key);

    if (existing !== null) {
      await db
        .update(adminSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(adminSettings.key, key));
    } else {
      await db.insert(adminSettings).values({ key, value });
    }
  }

  async getAll(): Promise<readonly AdminSetting[]> {
    const result = await db.select().from(adminSettings);
    return result as unknown as readonly AdminSetting[];
  }
}
