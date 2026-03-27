import { NextRequest } from 'next/server';
import { success, error, requireAdmin } from '../../../../helpers';
import { getDatabase } from '@/infrastructure/db/client';
import { rewards } from '@/infrastructure/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const rewardId = parseInt(params.id);
    if (isNaN(rewardId)) {
      return error('Invalid reward ID', 400);
    }

    const body = await request.json();

    // Check if reward exists
    const existingReward = await db
      .select()
      .from(rewards)
      .where(eq(rewards.id, rewardId))
      .limit(1);

    if (!existingReward[0]) {
      return error('Reward not found', 404);
    }

    // Update reward
    const result = await db
      .update(rewards)
      .set({
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        imageUrl: body.imageUrl,
        partnerName: body.partnerName,
        partnerLogo: body.partnerLogo,
        discountPercent: body.discountPercent,
        discountCode: body.discountCode,
        minLevel: body.minLevel,
        category: body.category,
        isActive: body.isActive,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(rewards.id, rewardId))
      .returning();

    if (!result[0]) {
      return error('Failed to update reward', 500);
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

    const rewardId = parseInt(params.id);
    if (isNaN(rewardId)) {
      return error('Invalid reward ID', 400);
    }

    // Check if reward exists
    const existingReward = await db
      .select()
      .from(rewards)
      .where(eq(rewards.id, rewardId))
      .limit(1);

    if (!existingReward[0]) {
      return error('Reward not found', 404);
    }

    await db.delete(rewards).where(eq(rewards.id, rewardId));

    return success({ message: 'Reward deleted successfully' });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const rewardId = parseInt(params.id);
    if (isNaN(rewardId)) {
      return error('Invalid reward ID', 400);
    }

    const body = await request.json();

    // Check if reward exists
    const existingReward = await db
      .select()
      .from(rewards)
      .where(eq(rewards.id, rewardId))
      .limit(1);

    if (!existingReward[0]) {
      return error('Reward not found', 404);
    }

    const updateData: Record<string, any> = { updatedAt: new Date() };

    if ('isActive' in body) {
      updateData.isActive = body.isActive;
    }

    const result = await db
      .update(rewards)
      .set(updateData)
      .where(eq(rewards.id, rewardId))
      .returning();

    if (!result[0]) {
      return error('Failed to update reward', 500);
    }

    return success(result[0]);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
