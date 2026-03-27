import { IItemRepository, ItemFilters } from '@/domain/repositories/IItemRepository';
import { toItemDTO, ItemDTO } from '@/application/dtos/ItemDTO';

export class GetItemsByCategory {
  constructor(private readonly itemRepo: IItemRepository) {}

  async execute(filters: ItemFilters): Promise<{ items: readonly ItemDTO[]; total: number }> {
    const [items, total] = await Promise.all([
      this.itemRepo.findAll(filters),
      this.itemRepo.count(filters),
    ]);
    return {
      items: items.map(toItemDTO),
      total,
    };
  }
}
