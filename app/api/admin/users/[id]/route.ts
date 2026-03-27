import { NextRequest } from 'next/server';
import { success, error } from '../../../helpers';
import { requireDashboardAuth } from '../../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import {
  users,
  userProfiles,
  reviews,
  items,
} from '@/infrastructure/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return error('Invalid user ID', 400);
    }

    // Get user with profile
    const userData = await db
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
        approvedReviewCount: userProfiles.approvedReviewCount,
      })
      .from(users)
      .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
      .where(eq(users.id, userId))
      .limit(1);

    if (!userData[0]) {
      return error('User not found', 404);
    }

    // Get recent reviews
    const recentReviews = await db
      .select({
        id: reviews.id,
        itemName: items.name,
        rating: reviews.rating,
        status: reviews.status,
        createdAt: reviews.createdAt,
      })
      .from(reviews)
      .leftJoin(items, eq(reviews.itemId, items.id))
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(10);

    return success({
      user: userData[0],
      recentReviews,
    });
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

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return error('Invalid user ID', 400);
    }

    const body = await request.json();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser[0]) {
      return error('User not found', 404);
    }

    const updateData: Record<string, any> = {};

    if ('role' in body && ['user', 'admin', 'banned'].includes(body.role)) {
      updateData.role = body.role;
    }

    if ('name' in body) {
      updateData.name = body.name;
    }

    if ('bio' in body) {
      updateData.bio = body.bio;
    }

    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (!result[0]) {
      return error('Failed to update user', 500);
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

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return error('Invalid user ID', 400);
    }

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existingUser[0]) {
      return error('User not found', 404);
    }

    // Delete user profile first (foreign key constraint)
    await db.delete(userProfiles).where(eq(userProfiles.userId, userId));

    // Delete user
    await db.delete(users).where(eq(users.id, userId));

    return success({ message: 'User deleted successfully' });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
