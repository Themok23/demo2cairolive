import { NextRequest } from 'next/server';
import { success, error, requireAdmin } from '../../../helpers';
import { getDatabase } from '@/infrastructure/db/client';
import { rewards } from '@/infrastructure/db/schema';
import { desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const rewardsData = await db
      .select()
      .from(rewards)
      .orderBy(desc(rewards.createdAt));

    return success({
      rewards: rewardsData,
      total: rewardsData.length,
    });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const db = getDatabase();

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.partnerName || body.discountPercent === undefined) {
      return error('Missing required fields: title, description, partnerName, discountPercent', 400);
    }

    // Create reward
    const result = await db
      .insert(rewards)
      .values({
        title: body.title,
        titleAr: body.titleAr,
        description: body.description,
        descriptionAr: body.descriptionAr,
        imageUrl: body.imageUrl,
        partnerName: body.partnerName,
        partnerLogo: body.partnerLogo,
        discountPercent: body.discountPercent,
        discountCode: body.discountCode,
        minLevel: body.minLevel || 'explorer',
        category: body.category || 'general',
        isActive: body.isActive !== false,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      })
      .returning();

    if (!result[0]) {
      return error('Failed to create reward', 500);
    }

    return success(result[0], 201);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
