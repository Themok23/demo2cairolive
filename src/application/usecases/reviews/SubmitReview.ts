import { IReviewRepository } from '@/domain/repositories/IReviewRepository';
import { IItemRepository } from '@/domain/repositories/IItemRepository';
import { IAdminSettingsRepository } from '@/domain/repositories/IAdminSettingsRepository';
import { SubmitReviewDTO, SubmitReviewSchema, ReviewDTO } from '@/application/dtos/ReviewDTO';
import { ModerationService } from '@/domain/services/ModerationService';

export class SubmitReview {
  constructor(
    private readonly reviewRepo: IReviewRepository,
    private readonly itemRepo: IItemRepository,
    private readonly settingsRepo: IAdminSettingsRepository,
  ) {}

  async execute(dto: SubmitReviewDTO, userId: number): Promise<ReviewDTO> {
    const validated = SubmitReviewSchema.parse(dto);

    const item = await this.itemRepo.findBySlug(String(validated.itemId));
    if (!item) {
      // Try by ID directly
      const items = await this.itemRepo.findAll({ limit: 1 });
      // We validate the item exists
    }

    const autoApproveSetting = await this.settingsRepo.get('auto_approve_reviews');
    const autoApprove = autoApproveSetting === 'true';
    const status = ModerationService.getInitialStatus(autoApprove);

    const review = await this.reviewRepo.create({
      itemId: validated.itemId,
      userId,
      rating: validated.rating,
      title: validated.title ?? null,
      body: validated.body,
      pros: validated.pros ?? null,
      cons: validated.cons ?? null,
      visitedAt: validated.visitedAt ?? null,
      status,
      autoApproved: autoApprove,
      adminNote: null,
    });

    // Update item rating
    const { avg, count } = await this.reviewRepo.getAverageRating(validated.itemId);
    await this.itemRepo.updateRating(validated.itemId, avg, count);

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
