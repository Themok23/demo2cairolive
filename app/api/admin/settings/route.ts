import { NextRequest } from 'next/server';
import { success, error } from '../../helpers';
import { requireDashboardAuth } from '../adminAuth';
import { getAdminSettingsRepository } from '@/infrastructure/repositories';

export async function GET() {
  try {
    await requireDashboardAuth();
    const repo = getAdminSettingsRepository();
    const settings = await repo.getAll();
    return success(settings);
  } catch (err) {
    return error((err as Error).message, 403);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireDashboardAuth();
    const { key, value } = await request.json();
    if (!key || value === undefined) return error('key and value are required');
    const repo = getAdminSettingsRepository();
    await repo.set(key, String(value));
    return success({ key, value });
  } catch (err) {
    return error((err as Error).message, 403);
  }
}
