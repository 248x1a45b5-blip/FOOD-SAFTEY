import { FoodItem, HygieneItem, UserProfile } from '../types/foodSafe';
import { INITIAL_FOOD_ITEMS, INITIAL_HYGIENE_ITEMS, DEFAULT_USER_PROFILE } from '../data/defaultData';

const STORAGE_KEYS = {
  FOOD_ITEMS: 'foodsafe_food_items_v2',
  HYGIENE_ITEMS: 'foodsafe_hygiene_items_v2',
  USER_PROFILE: 'foodsafe_user_profile_v2',
  SAVED_ITEMS_COUNT: 'foodsafe_saved_count_v2',
};

export const getStoredFoodItems = (): FoodItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
      return INITIAL_FOOD_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load food items from localStorage:', err);
    return INITIAL_FOOD_ITEMS;
  }
};

export const saveFoodItems = (items: FoodItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save food items:', err);
  }
};

export const getStoredHygieneItems = (): HygieneItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HYGIENE_ITEMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HYGIENE_ITEMS, JSON.stringify(INITIAL_HYGIENE_ITEMS));
      return INITIAL_HYGIENE_ITEMS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load hygiene items:', err);
    return INITIAL_HYGIENE_ITEMS;
  }
};

export const saveHygieneItems = (items: HygieneItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.HYGIENE_ITEMS, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save hygiene items:', err);
  }
};

export const getStoredUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
      return DEFAULT_USER_PROFILE;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.teamMembers || parsed.teamMembers.length === 0) {
      parsed.teamMembers = DEFAULT_USER_PROFILE.teamMembers;
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error('Failed to load user profile:', err);
    return DEFAULT_USER_PROFILE;
  }
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
};

export const resetAllData = (): void => {
  localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(INITIAL_FOOD_ITEMS));
  localStorage.setItem(STORAGE_KEYS.HYGIENE_ITEMS, JSON.stringify(INITIAL_HYGIENE_ITEMS));
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
};

export const getDaysRemaining = (expiryDateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export type ExpiryStatus = 'expired' | 'critical' | 'expiring_soon' | 'fresh';

export const getExpiryStatus = (expiryDateStr: string): { status: ExpiryStatus; label: string; badgeClass: string } => {
  const days = getDaysRemaining(expiryDateStr);
  if (days < 0) {
    return {
      status: 'expired',
      label: `Expired ${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'} ago`,
      badgeClass: 'text-red-700 bg-red-50 border border-red-200'
    };
  }
  if (days === 0) {
    return {
      status: 'critical',
      label: 'Expires Today!',
      badgeClass: 'text-amber-800 bg-amber-50 border border-amber-300 font-semibold'
    };
  }
  if (days <= 2) {
    return {
      status: 'expiring_soon',
      label: `Expires in ${days} ${days === 1 ? 'day' : 'days'}`,
      badgeClass: 'text-amber-700 bg-amber-50 border border-amber-200'
    };
  }
  return {
    status: 'fresh',
    label: `${days} days left`,
    badgeClass: 'text-emerald-700 bg-emerald-50 border border-emerald-200'
  };
};
