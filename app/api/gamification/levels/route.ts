import { NextResponse } from 'next/server';
import { GetMembershipLevels } from '@/application/usecases/gamification/GetMembershipLevels';
import { getMembershipLevelRepository } from '@/infrastructure/repositories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const useCase = new GetMembershipLevels(getMembershipLevelRepository());
    const levels = await useCase.execute();

    return NextResponse.json({
      success: true,
      data: levels,
    });
  } catch (error) {
    console.error('Error fetching membership levels:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch membership levels' },
      { status: 500 }
    );
  }
}
