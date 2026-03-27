import { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import { IMembershipLevelRepository } from '@/domain/repositories/IMembershipLevelRepository';
import { parseBadgesJson } from '@/domain/entities/UserProfile';

export interface GamificationProfileDTO {
  readonly userId: number;
  readonly level: string;
  readonly levelName: string;
  readonly levelColor: string | null;
  readonly approvedReviewCount: number;
  readonly totalPoints: number;
  readonly discountPercent: number;
  readonly badges: any[];
  readonly progressToNextLevel: {
    readonly current: number;
    readonly required: number;
    readonly percentage: number;
  };
  readonly joinedAt: string;
}

export class GetUserGamificationProfile {
  constructor(
    private readonly userProfileRepo: IUserProfileRepository,
    private readonly membershipLevelRepo: IMembershipLevelRepository
  ) {}

  async execute(userId: number): Promise<GamificationProfileDTO | null> {
    const profile = await this.userProfileRepo.findByUserId(userId);
    if (!profile) return null;

    const currentLevel = await this.membershipLevelRepo.findBySlug(profile.level);
    if (!currentLevel) return null;

    const nextLevel = await this.membershipLevelRepo.findAll();
    const sortedLevels = nextLevel.sort((a, b) => a.minReviews - b.minReviews);
    const currentLevelIndex = sortedLevels.findIndex(l => l.id === currentLevel.id);
    const nextLevelData = currentLevelIndex >= 0 && currentLevelIndex < sortedLevels.length - 1
      ? sortedLevels[currentLevelIndex + 1]
      : null;

    const progressRequired = nextLevelData?.minReviews ?? currentLevel.minReviews;
    const progressCurrent = profile.approvedReviewCount;
    const progressPercentage = Math.min(100, Math.round((progressCurrent / progressRequired) * 100));

    return {
      userId: profile.userId,
      level: profile.level,
      levelName: currentLevel.name,
      levelColor: currentLevel.color,
      approvedReviewCount: profile.approvedReviewCount,
      totalPoints: profile.totalPoints,
      discountPercent: currentLevel.discountPercent,
      badges: parseBadgesJson(profile.badgesJson),
      progressToNextLevel: {
        current: progressCurrent,
        required: progressRequired,
        percentage: progressPercentage,
      },
      joinedAt: profile.joinedAt.toISOString(),
    };
  }
}
