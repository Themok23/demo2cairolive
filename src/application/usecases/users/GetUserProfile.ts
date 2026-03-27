import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '@/domain/entities/User';

export interface UserProfileDTO {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string | null;
  readonly role: string;
  readonly bio: string | null;
  readonly reviewCount: number;
  readonly createdAt: string;
}

export class GetUserProfile {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(userId: number): Promise<UserProfileDTO | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role,
      bio: user.bio,
      reviewCount: user.reviewCount,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
