import { IRewardRepository } from '@/domain/repositories/IRewardRepository';

export interface RewardDTO {
  readonly id: number;
  readonly title: string;
  readonly titleAr: string | null;
  readonly description: string;
  readonly descriptionAr: string | null;
  readonly imageUrl: string | null;
  readonly partnerName: string;
  readonly partnerLogo: string | null;
  readonly discountPercent: number;
  readonly discountCode: string | null;
  readonly minLevel: string;
  readonly category: string;
  readonly isActive: boolean;
  readonly expiresAt: string | null;
}

export interface GetRewardsParams {
  readonly category?: string;
  readonly minLevel?: string;
  readonly activeOnly?: boolean;
}

export class GetRewards {
  constructor(private readonly rewardRepo: IRewardRepository) {}

  async execute(params: GetRewardsParams = {}): Promise<RewardDTO[]> {
    let rewards = await this.rewardRepo.findAll();

    if (params.category) {
      rewards = rewards.filter(r => r.category === params.category);
    }

    if (params.minLevel) {
      rewards = rewards.filter(r => r.minLevel === params.minLevel);
    }

    if (params.activeOnly !== false) {
      rewards = rewards.filter(r => r.isActive && (!r.expiresAt || new Date(r.expiresAt) > new Date()));
    }

    return rewards.map(reward => ({
      id: reward.id,
      title: reward.title,
      titleAr: reward.titleAr,
      description: reward.description,
      descriptionAr: reward.descriptionAr,
      imageUrl: reward.imageUrl,
      partnerName: reward.partnerName,
      partnerLogo: reward.partnerLogo,
      discountPercent: reward.discountPercent,
      discountCode: reward.discountCode,
      minLevel: reward.minLevel,
      category: reward.category,
      isActive: reward.isActive,
      expiresAt: reward.expiresAt?.toISOString() ?? null,
    }));
  }
}
