import { cookies } from 'next/headers';
import { createHash } from 'crypto';

function getToken(): string {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) {
    throw new Error('ADMIN_DASHBOARD_PASSWORD environment variable is not set');
  }
  return createHash('sha256').update(password).digest('hex');
}

export async function requireDashboardAuth(): Promise<void> {
  const token = getToken();
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get('cairo-admin-auth');

  if (!authCookie || authCookie.value !== token) {
    throw new Error('Dashboard access required');
  }
}
