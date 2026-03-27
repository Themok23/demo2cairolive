import { success, error, requireAdmin } from '../../helpers';
import { getReviewRepository } from '@/infrastructure/repositories';

export async function GET() {
  try {
    await requireAdmin();
    const reviews = await getReviewRepository().findPending();
    return success(reviews);
  } catch (err) {
    return error((err as Error).message, 403);
  }
}
