import { success, error } from '../helpers';
import { db } from '@/infrastructure/db/client';
import { categories } from '@/infrastructure/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select().from(categories).orderBy(asc(categories.name));
    return success(result);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
