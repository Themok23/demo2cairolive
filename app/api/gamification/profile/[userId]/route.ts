import { NextResponse } from 'next/server';
import { GetUserGamificationProfile } from '@/application/usecases/gamification/GetUserGamificationProfile';
import { getUserProfileRepository, getMembershipLevelRepository } from '@/infrastructure/repositories';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);

    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    const useCase = new GetUserGamificationProfile(
      getUserProfileRepository(),
      getMembershipLevelRepository()
    );
    const profile = await useCase.execute(userId);

    if (!profile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch gamification profile' },
      { status: 500 }
    );
  }
}
