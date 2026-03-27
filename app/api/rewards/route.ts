import { NextResponse, NextRequest } from 'next/server';
import { GetRewards } from '@/application/usecases/gamification/GetRewards';
import { getRewardRepository } from '@/infrastructure/repositories';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const minLevel = searchParams.get('minLevel') || undefined;
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const useCase = new GetRewards(getRewardRepository());
    const rewards = await useCase.execute({
      category: category,
      minLevel: minLevel,
      activeOnly: activeOnly,
    });

    return NextResponse.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch rewards' },
      { status: 500 }
    );
  }
}
