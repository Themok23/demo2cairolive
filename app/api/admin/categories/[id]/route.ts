import { NextRequest } from 'next/server';
import { success, error, requireAdmin } from '../../../helpers';
import { getDatabase } from '@/infrastructure/db/client';
import {
  categories,
  items,
} from '@/infrastructure/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return error('Invalid category ID', 400);
    }

    const body = await request.json();

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory[0]) {
      return error('Category not found', 404);
    }

    // Check if slug is being changed and if it already exists
    if (body.slug && body.slug !== existingCategory[0].slug) {
      const duplicateSlug = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, body.slug))
        .limit(1);

      if (duplicateSlug.length > 0) {
        return error('Category with this slug already exists', 409);
      }
    }

    // Update category
    const result = await db
      .update(categories)
      .set({
        name: body.name,
        slug: body.slug,
        icon: body.icon,
        color: body.color,
        description: body.description,
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (!result[0]) {
      return error('Failed to update category', 500);
    }

    return success(result[0]);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return error('Invalid category ID', 400);
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!existingCategory[0]) {
      return error('Category not found', 404);
    }

    // Check if category has items
    const itemCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(eq(items.categoryId, categoryId));

    if (Number(itemCount[0]?.count ?? 0) > 0) {
      return error('Cannot delete category with items. Remove items first.', 409);
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    return success({ message: 'Category deleted successfully' });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
