import { success, error } from '../../helpers';
import { GetFeaturedItems } from '@/application/usecases/items/GetFeaturedItems';
import { getItemRepository } from '@/infrastructure/repositories';

export async function GET() {
  try {
    const useCase = new GetFeaturedItems(getItemRepository());
    const items = await useCase.execute(6);
    return success(items);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
