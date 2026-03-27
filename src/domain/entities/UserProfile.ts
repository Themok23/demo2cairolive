export type MembershipLevelType = 'explorer' | 'contributor' | 'insider' | 'expert' | 'ambassador';

export interface Badge {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string;
  readonly icon: string;
  readonly color: string;
}

export interface UserProfile {
  readonly id: number;
  readonly userId: number;
  readonly level: MembershipLevelType;
  readonly approvedReviewCount: number;
  readonly totalPoints: number;
  readonly joinedAt: Date;
  readonly bio: string | null;
  readonly avatarUrl: string | null;
  readonly badgesJson: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function parseBadgesJson(json: string): Badge[] {
  try {
    return JSON.parse(json) as Badge[];
  } catch {
    return [];
  }
}

export function getBadgesJson(badges: Badge[]): string {
  return JSON.stringify(badges);
}

export function createUserProfile(
  params: Pick<UserProfile, 'userId'> &
    Partial<Pick<UserProfile, 'level' | 'approvedReviewCount' | 'totalPoints' | 'bio' | 'avatarUrl'>>
): Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId: params.userId,
    level: params.level ?? 'explorer',
    approvedReviewCount: params.approvedReviewCount ?? 0,
    totalPoints: params.totalPoints ?? 0,
    joinedAt: new Date(),
    bio: params.bio ?? null,
    avatarUrl: params.avatarUrl ?? null,
    badgesJson: '[]',
  };
}
