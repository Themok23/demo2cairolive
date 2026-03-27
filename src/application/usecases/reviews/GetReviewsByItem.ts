import { IReviewRepository } from '@/domain/repositories/IReviewRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { ReviewDTO } from '@/application/dtos/ReviewDTO';

export class GetReviewsByItem {
  constructor(
    private readonly reviewRepo: IReviewRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(itemId: number): Promise<readonly ReviewDTO[]> {
    const reviews = await this.reviewRepo.findByItem(itemId, 'approved');

    const reviewDTOs: ReviewDTO[] = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userRepo.findById(review.userId);
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
          userName: user?.name ?? 'Anonymous',
          userAvatar: user?.avatarUrl ?? null,
        };
      })
    );

    return reviewDTOs;
  }
}
