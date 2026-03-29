import { success, error } from '../helpers';
import { db } from '@/infrastructure/db/client';
import { categories, items } from '@/infrastructure/db/schema';
import { asc, eq, sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        icon: categories.icon,
        color: categories.color,
        description: categories.description,
        itemCount: sql<number>`count(${items.id})`,
      })
      .from(categories)
      .leftJoin(items, eq(items.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(asc(categories.name));

    return success(result);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
