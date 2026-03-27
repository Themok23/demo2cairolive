import { success, error } from '../../helpers';
import { GetItemBySlug } from '@/application/usecases/items/GetItemBySlug';
import { getItemRepository } from '@/infrastructure/repositories';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const useCase = new GetItemBySlug(getItemRepository());
    const item = await useCase.execute(params.slug);
    if (!item) return error('Item not found', 404);
    return success(item);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
