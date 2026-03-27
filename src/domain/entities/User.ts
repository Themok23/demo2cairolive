export type UserRole = 'user' | 'admin';

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly emailVerified: Date | null;
  readonly passwordHash: string | null;
  readonly avatarUrl: string | null;
  readonly role: UserRole;
  readonly bio: string | null;
  readonly reviewCount: number;
  readonly createdAt: Date;
}

export function createUser(
  params: Pick<User, 'name' | 'email'> & Partial<Pick<User, 'avatarUrl' | 'bio'>>
): Omit<User, 'id' | 'createdAt' | 'emailVerified' | 'passwordHash' | 'reviewCount'> {
  return {
    name: params.name,
    email: params.email.toLowerCase(),
    avatarUrl: params.avatarUrl ?? null,
    role: 'user',
    bio: params.bio ?? null,
  };
}
