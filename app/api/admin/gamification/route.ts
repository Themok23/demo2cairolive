import { NextRequest } from 'next/server';
import { success, error, requireAdmin } from '../../helpers';
import { getDatabase } from '@/infrastructure/db/client';
import {
  membershipLevels,
  rewards,
  rewardClaims,
} from '@/infrastructure/db/schema';
import { desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const db = getDatabase();

    // Get all membership levels
    const levelsData = await db
      .select()
      .from(membershipLevels)
      .orderBy(membershipLevels.minReviews);

    // Get all rewards
    const rewardsData = await db
      .select()
      .from(rewards)
      .orderBy(desc(rewards.createdAt));

    // Get reward claims stats
    const claimsStatsData = await db
      .select({
        rewardId: rewardClaims.rewardId,
        count: sql<number>`count(*)`,
      })
      .from(rewardClaims)
      .groupBy(rewardClaims.rewardId);

    const claimsStats = claimsStatsData.reduce((acc: Record<number, number>, claim: any) => {
      acc[claim.rewardId] = Number(claim.count ?? 0);
      return acc;
    }, {});

    // Get total claims
    const totalClaimsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(rewardClaims);

    const totalClaims = Number(totalClaimsResult[0]?.count ?? 0);

    return success({
      levels: levelsData,
      rewards: rewardsData,
      claimsStats,
      totalClaims,
    });
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
