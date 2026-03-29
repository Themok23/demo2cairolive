import { Item } from '../entities/Item';

export interface ItemFilters {
  readonly categorySlug?: string;
  readonly governorate?: string;
  readonly minRating?: number;
  readonly priceLabel?: string;
  readonly sortBy?: 'most_reviewed' | 'highest_rated' | 'newest';
  readonly limit?: number;
  readonly offset?: number;
}

export interface IItemRepository {
  findAll(filters: ItemFilters): Promise<readonly Item[]>;
  findById(id: number): Promise<Item | null>;
  findBySlug(slug: string): Promise<Item | null>;
  findFeatured(limit?: number): Promise<readonly Item[]>;
  create(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item>;
  update(id: number, data: Partial<Item>): Promise<Item | null>;
  search(query: string, limit?: number): Promise<readonly Item[]>;
  count(filters?: ItemFilters): Promise<number>;
  updateRating(itemId: number, avgRating: string, totalReviews: number): Promise<void>;
}
