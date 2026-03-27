import { IUserProfileRepository } from '@/domain/repositories/IUserProfileRepository';
import { IUserRepository } from '@/domain/repositories/IUserRepository';

export interface LeaderboardEntryDTO {
  readonly userId: number;
  readonly name: string;
  readonly avatarUrl: string | null;
  readonly level: string;
  readonly approvedReviewCount: number;
  readonly rank: number;
}

export class GetLeaderboard {
  constructor(
    private readonly userProfileRepo: IUserProfileRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(limit: number = 10): Promise<LeaderboardEntryDTO[]> {
    const profiles = await this.userProfileRepo.getLeaderboard(limit);

    const entries: LeaderboardEntryDTO[] = [];

    for (let i = 0; i < profiles.length; i++) {
      const profile = profiles[i];
      const user = await this.userRepo.findById(profile.userId);

      if (user) {
        entries.push({
          userId: profile.userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
          level: profile.level,
          approvedReviewCount: profile.approvedReviewCount,
          rank: i + 1,
        });
      }
    }

    return entries;
  }
}
