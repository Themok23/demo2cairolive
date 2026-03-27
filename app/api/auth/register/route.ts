import { NextRequest } from 'next/server';
import { success, error } from '../../helpers';
import { RegisterUser } from '@/application/usecases/users/RegisterUser';
import { getUserRepository } from '@/infrastructure/repositories';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useCase = new RegisterUser(
      getUserRepository(),
      async (password: string) => bcrypt.hash(password, 12)
    );
    const user = await useCase.execute(body);
    return success(user, 201);
  } catch (err) {
    return error((err as Error).message, 400);
  }
}
