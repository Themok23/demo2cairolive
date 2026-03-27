import { NextResponse } from 'next/server';
import { auth } from '@/infrastructure/auth/auth';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export function success<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, error: null }, { status });
}

export function error(message: string, status: number = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json({ success: false, data: null, error: message }, { status });
}

export async function getSession() {
  return await auth();
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Authentication required');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if ((session.user as any).role !== 'admin') {
    throw new Error('Admin access required');
  }
  return session;
}
