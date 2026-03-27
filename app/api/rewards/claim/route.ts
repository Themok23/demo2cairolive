import { NextResponse, NextRequest } from 'next/server';
import { ClaimReward } from '@/application/usecases/gamification/ClaimReward';
import { getRewardRepository, getUserProfileRepository, getMembershipLevelRepository } from '@/infrastructure/repositories';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, rewardId } = body;

    if (!userId || !rewardId) {
      return NextResponse.json(
        { success: false, message: 'Missing userId or rewardId' },
        { status: 400 }
      );
    }

    const useCase = new ClaimReward(
      getRewardRepository(),
      getUserProfileRepository(),
      getMembershipLevelRepository()
    );

    const result = await useCase.execute(userId, rewardId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error claiming reward:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to claim reward' },
      { status: 500 }
    );
  }
}
