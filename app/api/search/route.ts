import { NextRequest } from 'next/server';
import { success, error } from '../helpers';
import { SearchItems } from '@/application/usecases/items/SearchItems';
import { getItemRepository } from '@/infrastructure/repositories';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? '';
    const useCase = new SearchItems(getItemRepository());
    const items = await useCase.execute(q);
    return success(items);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}
