export interface Category {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly icon: string | null;
  readonly color: string | null;
  readonly description: string | null;
  readonly itemCount: number;
  readonly createdAt: Date;
}

export function createCategory(params: Omit<Category, 'id' | 'createdAt' | 'itemCount'>): Omit<Category, 'id' | 'createdAt'> {
  return {
    ...params,
    itemCount: 0,
  };
}
