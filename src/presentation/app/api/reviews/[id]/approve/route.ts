import { NextRequest } from 'next/server';
import { success, error, requireAdmin } from '../../../helpers';
import { ApproveReview } from '@/application/usecases/reviews/ApproveReview';
import { getReviewRepository, getItemRepository } from '@/infrastructure/repositories';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await request.json().catch(() => ({}));
    const useCase = new ApproveReview(getReviewRepository(), getItemRepository());
    const review = await useCase.execute(Number(params.id), body?.adminNote);
    if (!review) return error('Review not found', 404);
    return success(review);
  } catch (err) {
    return error(
      (err as Error).message,
      err instanceof Error && err.message.includes('Admin') ? 403 : 500
    );
  }
}
