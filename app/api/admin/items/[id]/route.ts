import { NextRequest } from 'next/server';
import { success, error } from '../../../helpers';
import { requireDashboardAuth } from '../../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import { items } from '@/infrastructure/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return error('Invalid item ID', 400);
    }

    const itemData = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId))
      .limit(1);

    if (!itemData[0]) {
      return error('Item not found', 404);
    }

    return success(itemData[0]);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return error('Invalid item ID', 400);
    }

    const body = await request.json();

    // Check if item exists
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId))
      .limit(1);

    if (!existingItem[0]) {
      return error('Item not found', 404);
    }

    // Check if slug is being changed and if it already exists
    if (body.slug && body.slug !== existingItem[0].slug) {
      const duplicateSlug = await db
        .select()
        .from(items)
        .where(eq(items.slug, body.slug))
        .limit(1);

      if (duplicateSlug.length > 0) {
        return error('Item with this slug already exists', 409);
      }
    }

    // Update item
    const result = await db
      .update(items)
      .set({
        slug: body.slug,
        name: body.name,
        nameAr: body.nameAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        categoryId: body.categoryId,
        imageUrl: body.imageUrl,
        imageAlt: body.imageAlt,
        governorate: body.governorate,
        area: body.area,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        googleMapsUrl: body.googleMapsUrl,
        priceMin: body.priceMin,
        priceMax: body.priceMax,
        priceLabel: body.priceLabel,
        priceCurrency: body.priceCurrency,
        website: body.website,
        instagram: body.instagram,
        phone: body.phone,
        tags: body.tags,
        isVerified: body.isVerified,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
        submittedBy: body.submittedBy,
        updatedAt: new Date(),
      })
      .where(eq(items.id, itemId))
      .returning();

    if (!result[0]) {
      return error('Failed to update item', 500);
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
    await requireDashboardAuth();
    const db = getDatabase();

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return error('Invalid item ID', 400);
    }

    // Check if item exists
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId))
      .limit(1);

    if (!existingItem[0]) {
      return error('Item not found', 404);
    }

    await db.delete(items).where(eq(items.id, itemId));

    return success({ message: 'Item deleted successfully' });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const itemId = parseInt(params.id);
    if (isNaN(itemId)) {
      return error('Invalid item ID', 400);
    }

    const body = await request.json();

    // Check if item exists
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.id, itemId))
      .limit(1);

    if (!existingItem[0]) {
      return error('Item not found', 404);
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };

    if ('isVerified' in body) updateData.isVerified = body.isVerified;
    if ('isFeatured' in body) updateData.isFeatured = body.isFeatured;
    if ('isActive' in body) updateData.isActive = body.isActive;

    const result = await db
      .update(items)
      .set(updateData)
      .where(eq(items.id, itemId))
      .returning();

    if (!result[0]) {
      return error('Failed to update item', 500);
    }

    return success(result[0]);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
