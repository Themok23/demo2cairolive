export interface Reward {
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
  readonly expiresAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function createReward(
  params: Pick<
    Reward,
    'title' | 'description' | 'partnerName' | 'discountPercent' | 'category' | 'minLevel'
  > &
    Partial<
      Pick<
        Reward,
        'titleAr' | 'descriptionAr' | 'imageUrl' | 'partnerLogo' | 'discountCode' | 'isActive' | 'expiresAt'
      >
    >
): Omit<Reward, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    title: params.title,
    titleAr: params.titleAr ?? null,
    description: params.description,
    descriptionAr: params.descriptionAr ?? null,
    imageUrl: params.imageUrl ?? null,
    partnerName: params.partnerName,
    partnerLogo: params.partnerLogo ?? null,
    discountPercent: params.discountPercent,
    discountCode: params.discountCode ?? null,
    minLevel: params.minLevel,
    category: params.category,
    isActive: params.isActive ?? true,
    expiresAt: params.expiresAt ?? null,
  };
}
