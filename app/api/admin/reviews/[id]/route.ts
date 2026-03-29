import { NextRequest } from 'next/server';
import { success, error } from '../../../helpers';
import { requireDashboardAuth } from '../../adminAuth';
import { getDatabase } from '@/infrastructure/db/client';
import { reviews, items, users } from '@/infrastructure/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireDashboardAuth();
    const db = getDatabase();

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return error('Invalid review ID', 400);
    }

    const reviewData = await db
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
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!reviewData[0]) {
      return error('Review not found', 404);
    }

    return success(reviewData[0]);
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

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return error('Invalid review ID', 400);
    }

    const body = await request.json();

    // Validate status if provided
    if ('status' in body) {
      const validStatuses = ['pending', 'approved', 'rejected'];
      if (!validStatuses.includes(body.status)) {
        return error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
    }

    // Check if review exists
    const existingReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!existingReview[0]) {
      return error('Review not found', 404);
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };

    if ('status' in body) {
      updateData.status = body.status;
    }

    if ('adminNote' in body) {
      updateData.adminNote = body.adminNote;
    }

    const result = await db
      .update(reviews)
      .set(updateData)
      .where(eq(reviews.id, reviewId))
      .returning();

    if (!result[0]) {
      return error('Failed to update review', 500);
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

    const reviewId = parseInt(params.id);
    if (isNaN(reviewId)) {
      return error('Invalid review ID', 400);
    }

    // Check if review exists
    const existingReview = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!existingReview[0]) {
      return error('Review not found', 404);
    }

    await db.delete(reviews).where(eq(reviews.id, reviewId));

    return success({ message: 'Review deleted successfully' });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
