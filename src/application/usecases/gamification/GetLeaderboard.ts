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

    if (profiles.length === 0) {
      return [];
    }

    // Collect all user IDs for batch query
    const userIds = profiles.map((profile) => profile.userId);

    // Fetch all users in a single query instead of one per profile
    const users = await this.userRepo.findByIds(userIds);
    const userMap = new Map(users.map((user) => [user.id, user]));

    // Map profiles to leaderboard entries
    const entries = profiles
      .map((profile, index) => {
        const user = userMap.get(profile.userId);
        if (!user) return null;

        return {
          userId: profile.userId,
          name: user.name,
          avatarUrl: user.avatarUrl,
          level: profile.level,
          approvedReviewCount: profile.approvedReviewCount,
          rank: index + 1,
        };
      })
      .filter(Boolean) as LeaderboardEntryDTO[];

    return entries;
  }
}
