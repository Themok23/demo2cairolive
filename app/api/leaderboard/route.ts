import { NextResponse, NextRequest } from 'next/server';
import { GetLeaderboard } from '@/application/usecases/gamification/GetLeaderboard';
import { getUserProfileRepository, getUserRepository } from '@/infrastructure/repositories';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 10;

    const useCase = new GetLeaderboard(
      getUserProfileRepository(),
      getUserRepository()
    );

    const entries = await useCase.execute(limit);

    return NextResponse.json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
