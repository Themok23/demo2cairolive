export interface PriceTag {
  readonly min: number | null;
  readonly max: number | null;
  readonly label: string | null;
  readonly currency: string;
}

export function createPriceTag(params: Partial<PriceTag>): PriceTag {
  const currency = params.currency ?? 'EGP';
  if (params.min !== null && params.min !== undefined && params.min < 0) {
    throw new Error('Price minimum cannot be negative');
  }
  if (params.max !== null && params.max !== undefined && params.max < 0) {
    throw new Error('Price maximum cannot be negative');
  }
  if (
    params.min !== null && params.min !== undefined &&
    params.max !== null && params.max !== undefined &&
    params.min > params.max
  ) {
    throw new Error('Price minimum cannot exceed maximum');
  }
  return {
    min: params.min ?? null,
    max: params.max ?? null,
    label: params.label ?? null,
    currency,
  };
}
