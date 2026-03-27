import { NextRequest } from 'next/server';
import { success, error } from '../../helpers';
import { requireDashboardAuth } from '../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import {
  reviews,
  items,
  users,
} from '@/infrastructure/db/schema';
import {
  eq,
  desc,
  asc,
  sql,
  and,
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
    const statusFilter = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';
    const rating = searchParams.get('rating');
    const itemId = searchParams.get('itemId');

    // Build conditions
    const conditions: any[] = [];

    if (statusFilter) {
      conditions.push(eq(reviews.status, statusFilter));
    }

    if (search) {
      conditions.push(
        sql`(${reviews.title} ILIKE ${`%${search}%`} OR ${reviews.body} ILIKE ${`%${search}%`})`
      );
    }

    if (rating) {
      conditions.push(eq(reviews.rating, parseInt(rating)));
    }

    if (itemId) {
      conditions.push(eq(reviews.itemId, parseInt(itemId)));
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    // Get sort column and direction
    let orderByClause: any;
    const sortColumn = (reviews as any)[sort as keyof typeof reviews] || reviews.createdAt;
    orderByClause = order === 'desc' ? desc(sortColumn) : asc(sortColumn);

    // Get paginated reviews with item and user details
    const reviewsData = await db
      .select({
        id: reviews.id,
        itemId: reviews.itemId,
        itemName: items.name,
        userId: reviews.userId,
        userName: users.name,
        userEmail: users.email,
        rating: reviews.rating,
        title: reviews.title,
        body: reviews.body,
        pros: reviews.pros,
        cons: reviews.cons,
        visitedAt: reviews.visitedAt,
        status: reviews.status,
        autoApproved: reviews.autoApproved,
        adminNote: reviews.adminNote,
        helpfulCount: reviews.helpfulCount,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      })
      .from(reviews)
      .leftJoin(items, eq(reviews.itemId, items.id))
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    return success({
      reviews: reviewsData,
      total,
      page,
      limit,
      totalPages,
    });
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
      return error('action field is required (approve, reject)', 400);
    }

    if (action === 'approve') {
      await db
        .update(reviews)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(inArray(reviews.id, body.ids));
    } else if (action === 'reject') {
      await db
        .update(reviews)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(inArray(reviews.id, body.ids));
    } else {
      return error('Invalid action. Must be approve or reject', 400);
    }

    return success({ message: `Successfully ${action}ed ${body.ids.length} reviews` });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
