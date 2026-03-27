export interface MembershipLevel {
  readonly id: number;
  readonly name: string;
  readonly nameAr: string | null;
  readonly slug: string;
  readonly minReviews: number;
  readonly icon: string | null;
  readonly color: string | null;
  readonly perksJson: string;
  readonly discountPercent: number;
  readonly createdAt: Date;
}

export interface Perk {
  readonly id: string;
  readonly name: string;
  readonly nameAr: string;
  readonly description: string;
  readonly descriptionAr: string;
}

export function parsePerkJson(json: string): Perk[] {
  try {
    return JSON.parse(json) as Perk[];
  } catch {
    return [];
  }
}

export function createMembershipLevel(
  params: Pick<MembershipLevel, 'name' | 'slug' | 'minReviews' | 'discountPercent'> &
    Partial<Pick<MembershipLevel, 'nameAr' | 'icon' | 'color' | 'perksJson'>>
): Omit<MembershipLevel, 'id' | 'createdAt'> {
  return {
    name: params.name,
    nameAr: params.nameAr ?? null,
    slug: params.slug,
    minReviews: params.minReviews,
    icon: params.icon ?? null,
    color: params.color ?? null,
    perksJson: params.perksJson ?? '[]',
    discountPercent: params.discountPercent,
  };
}
