import { success, error, requireAdmin } from '../../helpers';
import {
  getItemRepository,
  getReviewRepository,
  getUserRepository,
} from '@/infrastructure/repositories';

export async function GET() {
  try {
    await requireAdmin();
    const [totalItems, pendingReviews, totalUsers] = await Promise.all([
      getItemRepository().count(),
      getReviewRepository().countPending(),
      getUserRepository().count(),
    ]);
    return success({ totalItems, pendingReviews, totalUsers });
  } catch (err) {
    return error((err as Error).message, 403);
  }
}
