import { IItemRepository } from '@/domain/repositories/IItemRepository';
import { CreateItemDTO, CreateItemSchema, toItemDTO, ItemDTO } from '@/application/dtos/ItemDTO';
import { createItem } from '@/domain/entities/Item';

export class CreateItem {
  constructor(private readonly itemRepo: IItemRepository) {}

  async execute(dto: CreateItemDTO, userId: number): Promise<ItemDTO> {
    const validated = CreateItemSchema.parse(dto);
    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const existing = await this.itemRepo.findBySlug(slug);
    if (existing) {
      throw new Error('An item with a similar name already exists');
    }

    const itemData = createItem({
      ...validated,
      slug,
      nameAr: validated.nameAr ?? null,
      categoryId: validated.categoryId ?? null,
      descriptionAr: validated.descriptionAr ?? null,
      imageUrl: validated.imageUrl ?? null,
      imageAlt: validated.imageAlt ?? null,
      governorate: validated.governorate ?? null,
      area: validated.area ?? null,
      address: validated.address ?? null,
      googleMapsUrl: validated.googleMapsUrl ?? null,
      priceMin: validated.priceMin ?? null,
      priceMax: validated.priceMax ?? null,
      priceLabel: validated.priceLabel ?? null,
      website: validated.website ?? null,
      instagram: validated.instagram ?? null,
      phone: validated.phone ?? null,
      tags: validated.tags ?? null,
      submittedBy: userId,
    });

    const item = await this.itemRepo.create(itemData);
    return toItemDTO(item);
  }
}
