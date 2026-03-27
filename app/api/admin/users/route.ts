import { NextRequest } from 'next/server';
import { success, error } from '../../helpers';
import { requireDashboardAuth } from '../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import {
  users,
  userProfiles,
  reviews,
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
    const search = searchParams.get('search') || '';
    const roleFilter = searchParams.get('role') || '';

    // Build conditions
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        sql`(${users.name} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`})`
      );
    }

    if (roleFilter) {
      conditions.push(eq(users.role, roleFilter));
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count ?? 0);
    const totalPages = Math.ceil(total / limit);

    // Get sort column and direction
    let orderByClause: any;
    const sortColumn = (users as any)[sort as keyof typeof users] || users.createdAt;
    orderByClause = order === 'desc' ? desc(sortColumn) : asc(sortColumn);

    // Get paginated users with review count and profile data
    const usersData = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        emailVerified: users.emailVerified,
        avatarUrl: users.avatarUrl,
        role: users.role,
        bio: users.bio,
        reviewCount: users.reviewCount,
        createdAt: users.createdAt,
        level: userProfiles.level,
        totalPoints: userProfiles.totalPoints,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset((page - 1) * limit);

    return success({
      users: usersData,
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
      return error('action field is required (makeAdmin, removeAdmin, ban, unban)', 400);
    }

    switch (action) {
      case 'makeAdmin':
        await db
          .update(users)
          .set({ role: 'admin' })
          .where(inArray(users.id, body.ids));
        break;

      case 'removeAdmin':
        await db
          .update(users)
          .set({ role: 'user' })
          .where(inArray(users.id, body.ids));
        break;

      case 'ban':
        await db
          .update(users)
          .set({ role: 'banned' })
          .where(inArray(users.id, body.ids));
        break;

      case 'unban':
        await db
          .update(users)
          .set({ role: 'user' })
          .where(inArray(users.id, body.ids));
        break;

      default:
        return error('Invalid action', 400);
    }

    return success({ message: `Successfully ${action}d ${body.ids.length} users` });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
