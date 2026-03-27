import { IItemRepository } from '@/domain/repositories/IItemRepository';
import { toItemDTO, ItemDTO } from '@/application/dtos/ItemDTO';

export class GetFeaturedItems {
  constructor(private readonly itemRepo: IItemRepository) {}

  async execute(limit: number = 6): Promise<readonly ItemDTO[]> {
    const items = await this.itemRepo.findFeatured(limit);
    return items.map(toItemDTO);
  }
}
