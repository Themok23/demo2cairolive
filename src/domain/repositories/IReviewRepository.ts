import { Review, ReviewStatus } from '../entities/Review';

export interface ReviewFilters {
  readonly itemId?: number;
  readonly userId?: number;
  readonly status?: ReviewStatus;
  readonly limit?: number;
  readonly offset?: number;
}

export interface IReviewRepository {
  findByItem(itemId: number, status?: ReviewStatus): Promise<readonly Review[]>;
  findPending(limit?: number, offset?: number): Promise<readonly Review[]>;
  findById(id: number): Promise<Review | null>;
  create(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpfulCount'> ): Promise<Review>;
  updateStatus(id: number, status: ReviewStatus, adminNote?: string): Promise<Review | null>;
  countByItem(itemId: number): Promise<number>;
  getAverageRating(itemId: number): Promise<{ avg: string; count: number }>;
  countPending(): Promise<number>;
}
