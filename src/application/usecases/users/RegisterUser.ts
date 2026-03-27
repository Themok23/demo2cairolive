import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { createUser, User } from '@/domain/entities/User';
import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(300),
  password: z.string().min(8).max(100),
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;

export class RegisterUser {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly hashPassword: (password: string) => Promise<string>,
  ) {}

  async execute(dto: RegisterUserDTO): Promise<Omit<User, 'passwordHash'>> {
    const validated = RegisterUserSchema.parse(dto);

    const existing = await this.userRepo.findByEmail(validated.email);
    if (existing) {
      throw new Error('A user with this email already exists');
    }

    const userData = createUser({
      name: validated.name,
      email: validated.email,
    });

    const passwordHash = await this.hashPassword(validated.password);

    const user = await this.userRepo.create({
      ...userData,
      emailVerified: null,
      passwordHash,
    });

    const { passwordHash: _, ...safeUser } = user as User & { passwordHash: string };
    return safeUser;
  }
}
