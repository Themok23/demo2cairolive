import { IRewardRepository } from '@/domain/repositories/IRewardRepository';
import { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import { IMembershipLevelRepository } from '@/domain/repositories/IMembershipLevelRepository';

export interface ClaimRewardDTO {
  readonly success: boolean;
  readonly message: string;
  readonly rewardTitle?: string;
  readonly discountCode?: string | null;
}

export class ClaimReward {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly userProfileRepo: IUserProfileRepository,
    private readonly membershipLevelRepo: IMembershipLevelRepository
  ) {}

  async execute(userId: number, rewardId: number): Promise<ClaimRewardDTO> {
    const reward = await this.rewardRepo.findById(rewardId);
    if (!reward) {
      return { success: false, message: 'Reward not found' };
    }

    const userProfile = await this.userProfileRepo.findByUserId(userId);
    if (!userProfile) {
      return { success: false, message: 'User profile not found' };
    }

    const userLevel = await this.membershipLevelRepo.findBySlug(userProfile.level);
    if (!userLevel) {
      return { success: false, message: 'User level not found' };
    }

    const requiredLevel = await this.membershipLevelRepo.findBySlug(reward.minLevel);
    if (!requiredLevel) {
      return { success: false, message: 'Required level not found' };
    }

    if (userLevel.minReviews < requiredLevel.minReviews) {
      return {
        success: false,
        message: `You need to reach ${requiredLevel.name} level to claim this reward`,
      };
    }

    const alreadyClaimed = await this.rewardRepo.hasClaimedReward(userId, rewardId);
    if (alreadyClaimed) {
      return { success: false, message: 'You have already claimed this reward' };
    }

    await this.rewardRepo.claimReward(userId, rewardId);

    return {
      success: true,
      message: 'Reward claimed successfully',
      rewardTitle: reward.title,
      discountCode: reward.discountCode,
    };
  }
}
