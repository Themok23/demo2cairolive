import { cookies } from 'next/headers';
import { createHash } from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_DASHBOARD_PASSWORD || '@123Cairolive@123';
const TOKEN = createHash('sha256').update(ADMIN_PASSWORD).digest('hex');

export async function requireDashboardAuth(): Promise<void> {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get('cairo-admin-auth');

  if (!authCookie || authCookie.value !== TOKEN) {
    throw new Error('Dashboard access required');
  }
}
