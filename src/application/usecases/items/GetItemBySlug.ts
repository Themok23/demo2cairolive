import { IItemRepository } from '@/domain/repositories/IItemRepository';
import { toItemDTO, ItemDTO } from '@/application/dtos/ItemDTO';

export class GetItemBySlug {
  constructor(private readonly itemRepo: IItemRepository) {}

  async execute(slug: string): Promise<ItemDTO | null> {
    const item = await this.itemRepo.findBySlug(slug);
    if (!item) return null;
    return toItemDTO(item);
  }
}
