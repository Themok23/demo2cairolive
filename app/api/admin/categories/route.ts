import { NextRequest } from 'next/server';
import { success, error } from '../../helpers';
import { requireDashboardAuth } from '../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import {
  categories,
  items,
} from '@/infrastructure/db/schema';
import {
  eq,
  desc,
  asc,
  sql,
} from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'name';
    const order = searchParams.get('order') || 'asc';

    // Get sort column and direction
    let orderByClause: any;
    const sortColumn = (categories as any)[sort as keyof typeof categories] || categories.name;
    orderByClause = order === 'desc' ? desc(sortColumn) : asc(sortColumn);

    // Get all categories with item counts
    const categoriesData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        icon: categories.icon,
        color: categories.color,
        description: categories.description,
        itemCount: sql<number>`count(${items.id})`,
        createdAt: categories.createdAt,
      })
      .from(categories)
      .leftJoin(items, eq(items.categoryId, categories.id))
      .groupBy(categories.id)
      .orderBy(orderByClause);

    return success({
      categories: categoriesData,
      total: categoriesData.length,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[GET /api/admin/categories] Error:', errorMsg, err);
    return error('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return error('Invalid name field. Must be a non-empty string', 400);
    }

    if (!body.slug || typeof body.slug !== 'string' || body.slug.trim() === '') {
      return error('Invalid slug field. Must be a non-empty string', 400);
    }

    // Sanitize and trim inputs
    const sanitizedName = body.name.trim();
    const sanitizedSlug = body.slug.trim().toLowerCase();

    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, sanitizedSlug))
      .limit(1);

    if (existingCategory.length > 0) {
      return error('Category with this slug already exists', 409);
    }

    // Create category
    const result = await db
      .insert(categories)
      .values({
        name: sanitizedName,
        slug: sanitizedSlug,
        icon: body.icon ?? null,
        color: body.color ?? null,
        description: body.description ?? null,
      })
      .returning();

    if (!result[0]) {
      return error('Failed to create category', 500);
    }

    return success(result[0], 201);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[POST /api/admin/categories] Error:', errorMsg, err);
    return error('Internal server error', 500);
  }
}
