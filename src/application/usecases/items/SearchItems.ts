import { IItemRepository } from '@/domain/repositories/IItemRepository';
import { toItemDTO, ItemDTO } from '@/application/dtos/ItemDTO';

export class SearchItems {
  constructor(private readonly itemRepo: IItemRepository) {}

  async execute(query: string, limit: number = 20): Promise<readonly ItemDTO[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const items = await this.itemRepo.search(query.trim(), limit);
    return items.map(toItemDTO);
  }
}
