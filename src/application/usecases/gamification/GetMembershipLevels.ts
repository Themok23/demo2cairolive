import { IMembershipLevelRepository } from '@/domain/repositories/IMembershipLevelRepository';
import { parsePerkJson } from '@/domain/entities/MembershipLevel';

export interface MembershipLevelDTO {
  readonly id: number;
  readonly name: string;
  readonly nameAr: string | null;
  readonly slug: string;
  readonly minReviews: number;
  readonly icon: string | null;
  readonly color: string | null;
  readonly perks: any[];
  readonly discountPercent: number;
}

export class GetMembershipLevels {
  constructor(private readonly membershipLevelRepo: IMembershipLevelRepository) {}

  async execute(): Promise<MembershipLevelDTO[]> {
    const levels = await this.membershipLevelRepo.findAll();

    return levels.map(level => ({
      id: level.id,
      name: level.name,
      nameAr: level.nameAr,
      slug: level.slug,
      minReviews: level.minReviews,
      icon: level.icon,
      color: level.color,
      perks: parsePerkJson(level.perksJson),
      discountPercent: level.discountPercent,
    }));
  }
}
