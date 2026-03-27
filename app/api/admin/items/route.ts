import { NextRequest, NextResponse } from 'next/server';
import { success, error } from '../../helpers';
import { requireDashboardAuth } from '../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import {
  items,
  categories,
} from '@/infrastructure/db/schema';
import {
  eq,
  desc,
  asc,
  sql,
  and,
  gte,
  lte,
  ilike,
  inArray,
} from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '25'));
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const minRating = searchParams.get('minRating');
    const maxRating = searchParams.get('maxRating');
    const governorate = searchParams.get('governorate') || '';

    // Build conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        sql`(${items.name} ILIKE ${`%${search}%`} OR ${items.description} ILIKE ${`%${search}%`})`
      );
    }

    if (category) {
      const categoryData = await db
        .select({ id: categories.id })
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);

      if (categoryData[0]) {
        conditions.push(eq(items.categoryId, categoryData[0].id));
      }
    }

    if (status === 'active') {
      conditions.push(eq(items.isActive, true));
    } else if (status === 'inactive') {
      conditions.push(eq(items.isActive, false));
    }

    if (minRating) {
      conditions.push(gte(items.avgRating, minRating));
    }

    if (maxRating) {
      conditions.push(lte(items.avgRating, maxRating));
    }

    if (governorate) {
      conditions.push(ilike(items.governorate, `%${governorate}%`));
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(items)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    // Get sort column and direction
    let orderByClause: any;
    const sortColumn = (items as any)[sort as keyof typeof items] || items.createdAt;
    orderByClause = order === 'desc' ? desc(sortColumn) : asc(sortColumn);

    // Get paginated items
    const itemsData = await db
      .select()
      .from(items)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    return success({
      items: itemsData,
      total,
      page,
      limit,
      totalPages,
    });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.slug) {
      return error('Missing required fields: name, description, slug', 400);
    }

    // Check if slug already exists
    const existingItem = await db
      .select()
      .from(items)
      .where(eq(items.slug, body.slug))
      .limit(1);

    if (existingItem.length > 0) {
      return error('Item with this slug already exists', 409);
    }

    // Create item
    const result = await db
      .insert(items)
      .values({
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
        priceCurrency: body.priceCurrency || 'EGP',
        website: body.website,
        instagram: body.instagram,
        phone: body.phone,
        tags: body.tags || [],
        isVerified: body.isVerified || false,
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== false,
        submittedBy: body.submittedBy,
      })
      .returning();

    if (!result[0]) {
      return error('Failed to create item', 500);
    }

    return success(result[0], 201);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const body = await request.json();

    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return error('ids array is required', 400);
    }

    const action = body.action;

    if (!action) {
      return error('action field is required (activate, deactivate, feature, unfeature, delete)', 400);
    }

    switch (action) {
      case 'activate':
        await db
          .update(items)
          .set({ isActive: true, updatedAt: new Date() })
          .where(inArray(items.id, body.ids));
        break;

      case 'deactivate':
        await db
          .update(items)
          .set({ isActive: false, updatedAt: new Date() })
          .where(inArray(items.id, body.ids));
        break;

      case 'feature':
        await db
          .update(items)
          .set({ isFeatured: true, updatedAt: new Date() })
          .where(inArray(items.id, body.ids));
        break;

      case 'unfeature':
        await db
          .update(items)
          .set({ isFeatured: false, updatedAt: new Date() })
          .where(inArray(items.id, body.ids));
        break;

      case 'delete':
        await db.delete(items).where(inArray(items.id, body.ids));
        break;

      default:
        return error('Invalid action', 400);
    }

    return success({ message: `Successfully ${action}d ${body.ids.length} items` });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
