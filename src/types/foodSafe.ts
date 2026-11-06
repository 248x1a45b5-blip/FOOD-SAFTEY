export type FoodCategory =
  | 'dairy'
  | 'meat'
  | 'poultry'
  | 'seafood'
  | 'produce'
  | 'leftovers'
  | 'bakery'
  | 'pantry'
  | 'canned';

export type StorageLocation = 'fridge' | 'freezer' | 'pantry';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  storageLocation: StorageLocation;
  purchaseDate: string; // YYYY-MM-DD
  expiryDate: string;   // YYYY-MM-DD
  quantity: string;     // e.g. "1 L", "500g", "4 pieces"
  notes?: string;
  isConsumed?: boolean;
  idealTempMinC: number;
  idealTempMaxC: number;
  riskLevel: 'low' | 'medium' | 'high';
  handlingTip: string;
}

export interface HygieneItem {
  id: string;
  category: 'handwashing' | 'kitchen' | 'storage' | 'cooking';
  title: string;
  description: string;
  completed: boolean;
  frequency: 'daily' | 'each_meal' | 'weekly';
}

export interface SafetyTip {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: 'handling' | 'storage' | 'cooking' | 'poisoning_prevention';
  recommendedTemp?: string;
  iconName: string;
}

export interface PathogenInfo {
  id: string;
  name: string;
  type: 'Bacteria' | 'Virus' | 'Parasite' | 'Toxin';
  commonFoods: string[];
  onsetDuration: string;
  symptoms: string[];
  prevention: string[];
  dangerTempRange: string;
  severity: 'Moderate' | 'Severe' | 'Critical';
}

export interface SafeCookingTemp {
  food: string;
  minTempC: number;
  minTempF: number;
  restTime?: string;
  dangerNote: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  studentId?: string;
  email?: string;
  contribution: string;
  avatarColor?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  householdType: 'single' | 'family_with_kids' | 'elderly' | 'general';
  isLoggedIn: boolean;
  notificationDaysBefore: number;
  enableExpiryPush: boolean;
  enableHygieneReminder: boolean;
  dietaryNotes: string;
  safetyScore: number;
  teamMembers: TeamMember[];
}

