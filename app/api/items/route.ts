import { NextRequest } from 'next/server';
import { success, error, requireAuth } from '../helpers';
import { GetItemsByCategory } from '@/application/usecases/items/GetItemsByCategory';
import { CreateItem } from '@/application/usecases/items/CreateItem';
import { getItemRepository } from '@/infrastructure/repositories';

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const useCase = new GetItemsByCategory(getItemRepository());
    const result = await useCase.execute({
      categorySlug: params.get('category') ?? undefined,
      governorate: params.get('governorate') ?? undefined,
      minRating: params.get('minRating') ? Number(params.get('minRating')) : undefined,
      priceLabel: params.get('priceLabel') ?? undefined,
      sortBy: (params.get('sortBy') as any) ?? 'newest',
      limit: params.get('limit') ? Number(params.get('limit')) : 20,
      offset: params.get('offset') ? Number(params.get('offset')) : 0,
    });
    return success(result);
  } catch (err) {
    return error((err as Error).message, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const useCase = new CreateItem(getItemRepository());
    const item = await useCase.execute(body, Number((session.user as any).id));
    return success(item, 201);
  } catch (err) {
    return error(
      (err as Error).message,
      err instanceof Error && err.message.includes('Authentication') ? 401 : 400
    );
  }
}
