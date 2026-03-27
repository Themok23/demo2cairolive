import { MembershipLevel } from '@/domain/entities/MembershipLevel';

export interface IMembershipLevelRepository {
  findAll(): Promise<MembershipLevel[]>;
  findById(id: number): Promise<MembershipLevel | null>;
  findBySlug(slug: string): Promise<MembershipLevel | null>;
  findByMinReviews(reviews: number): Promise<MembershipLevel | null>;
  create(level: Omit<MembershipLevel, 'id' | 'createdAt'>): Promise<MembershipLevel>;
  update(id: number, data: Partial<Omit<MembershipLevel, 'id' | 'createdAt'>>): Promise<MembershipLevel | null>;
}
