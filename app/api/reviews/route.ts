import { NextRequest } from 'next/server';
import { success, error, requireAuth } from '../helpers';
import { GetReviewsByItem } from '@/application/usecases/reviews/GetReviewsByItem';
import { SubmitReview } from '@/application/usecases/reviews/SubmitReview';
import {
  getReviewRepository,
  getItemRepository,
  getUserRepository,
  getAdminSettingsRepository,
} from '@/infrastructure/repositories';

export async function GET(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get('itemId');
    if (!itemId) return error('itemId is required', 400);
    const useCase = new GetReviewsByItem(getReviewRepository(), getUserRepository());
    const reviews = await useCase.execute(Number(itemId));
    return success(reviews);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[GET /api/reviews] Error:', errorMsg, err);
    return error('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const useCase = new SubmitReview(
      getReviewRepository(),
      getItemRepository(),
      getAdminSettingsRepository()
    );
    const review = await useCase.execute(body, Number((session.user as any).id));
    return success(review, 201);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[POST /api/reviews] Error:', errorMsg, err);
    const statusCode = err instanceof Error && err.message.includes('Authentication') ? 401 : 500;
    return error('Internal server error', statusCode);
  }
}
