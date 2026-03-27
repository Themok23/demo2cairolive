import { DrizzleItemRepository } from './DrizzleItemRepository';
import { DrizzleReviewRepository } from './DrizzleReviewRepository';
import { DrizzleUserRepository } from './DrizzleUserRepository';
import { DrizzleAdminSettingsRepository } from './DrizzleAdminSettingsRepository';

// Singleton instances for server-side use
let itemRepo: DrizzleItemRepository | null = null;
let reviewRepo: DrizzleReviewRepository | null = null;
let userRepo: DrizzleUserRepository | null = null;
let settingsRepo: DrizzleAdminSettingsRepository | null = null;

export function getItemRepository(): DrizzleItemRepository {
  if (!itemRepo) {
    itemRepo = new DrizzleItemRepository();
  }
  return itemRepo;
}

export function getReviewRepository(): DrizzleReviewRepository {
  if (!reviewRepo) {
    reviewRepo = new DrizzleReviewRepository();
  }
  return reviewRepo;
}

export function getUserRepository(): DrizzleUserRepository {
  if (!userRepo) {
    userRepo = new DrizzleUserRepository();
  }
  return userRepo;
}

export function getAdminSettingsRepository(): DrizzleAdminSettingsRepository {
  if (!settingsRepo) {
    settingsRepo = new DrizzleAdminSettingsRepository();
  }
  return settingsRepo;
}
