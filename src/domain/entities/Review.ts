export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  readonly id: number;
  readonly itemId: number;
  readonly userId: number;
  readonly rating: number;
  readonly title: string | null;
  readonly body: string;
  readonly pros: string | null;
  readonly cons: string | null;
  readonly visitedAt: string | null;
  readonly status: ReviewStatus;
  readonly autoApproved: boolean;
  readonly adminNote: string | null;
  readonly helpfulCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function createReview(
  params: Pick<Review, 'itemId' | 'userId' | 'rating' | 'body'> & Partial<Pick<Review, 'title' | 'pros' | 'cons' | 'visitedAt'>>
): Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'autoApproved' | 'adminNote' | 'helpfulCount'> {
  if (params.rating < 1 || params.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  if (params.body.length < 30) {
    throw new Error('Review body must be at least 30 characters');
  }
  return {
    itemId: params.itemId,
    userId: params.userId,
    rating: params.rating,
    title: params.title ?? null,
    body: params.body,
    pros: params.pros ?? null,
    cons: params.cons ?? null,
    visitedAt: params.visitedAt ?? null,
  };
}
