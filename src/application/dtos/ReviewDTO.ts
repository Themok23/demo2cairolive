import { z } from 'zod';

export const SubmitReviewSchema = z.object({
  itemId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).nullable().optional(),
  body: z.string().min(30),
  pros: z.string().nullable().optional(),
  cons: z.string().nullable().optional(),
  visitedAt: z.string().nullable().optional(),
});

export type SubmitReviewDTO = z.infer<typeof SubmitReviewSchema>;

export interface ReviewDTO {
  readonly id: number;
  readonly itemId: number;
  readonly userId: number;
  readonly rating: number;
  readonly title: string | null;
  readonly body: string;
  readonly pros: string | null;
  readonly cons: string | null;
  readonly visitedAt: string | null;
  readonly status: string;
  readonly helpfulCount: number;
  readonly createdAt: string;
  readonly userName?: string;
  readonly userAvatar?: string | null;
}
