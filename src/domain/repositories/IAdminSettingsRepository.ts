export interface AdminSetting {
  readonly id: number;
  readonly key: string;
  readonly value: string;
  readonly updatedAt: Date;
}

export interface IAdminSettingsRepository {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  getAll(): Promise<readonly AdminSetting[]>;
}
