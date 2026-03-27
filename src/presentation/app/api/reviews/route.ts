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
    if (!itemId) return error('itemId is required');
    const useCase = new GetReviewsByItem(getReviewRepository(), getUserRepository());
    const reviews = await useCase.execute(Number(itemId));
    return success(reviews);
  } catch (err) {
    return error((err as Error).message, 500);
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
    return error(
      (err as Error).message,
      err instanceof Error && err.message.includes('Authentication') ? 401 : 400
    );
  }
}
