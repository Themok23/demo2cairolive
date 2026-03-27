import { IReviewRepository } from '@/domain/repositories/IReviewRepository';
import { IItemRepository } from '@/domain/repositories/IItemRepository';
import { ReviewDTO } from '@/application/dtos/ReviewDTO';

export class ApproveReview {
  constructor(
    private readonly reviewRepo: IReviewRepository,
    private readonly itemRepo: IItemRepository,
  ) {}

  async execute(reviewId: number, adminNote?: string): Promise<ReviewDTO | null> {
    const review = await this.reviewRepo.updateStatus(reviewId, 'approved', adminNote);
    if (!review) return null;

    // Recalculate item rating
    const { avg, count } = await this.reviewRepo.getAverageRating(review.itemId);
    await this.itemRepo.updateRating(review.itemId, avg, count);

    return {
      id: review.id,
      itemId: review.itemId,
      userId: review.userId,
      rating: review.rating,
      title: review.title,
      body: review.body,
      pros: review.pros,
      cons: review.cons,
      visitedAt: review.visitedAt,
      status: review.status,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
