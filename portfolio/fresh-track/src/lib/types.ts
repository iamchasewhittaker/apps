export type StorageLocation = "fridge" | "freezer";
export type ItemStatus = "active" | "used" | "wasted";
export type ItemSource = "manual" | "receipt-photo" | "receipt-email";

export interface FridgeItem {
  id: string;
  name: string;
  normalizedName: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expirationDate: string;
  storage: StorageLocation;
  status: ItemStatus;
  source: ItemSource;
  usedDate?: string;
  notes?: string;
}

export interface AppState {
  items: FridgeItem[];
  customShelfLife: Record<string, number>;
  settings: {
    warningDays: number;
    defaultStorage: StorageLocation;
  };
}

export type UrgencyLevel = "expired" | "today" | "soon" | "ok" | "frozen";

export interface FoodKeeperEntry {
  name: string;
  category: string;
  fridgeDaysMin: number;
  fridgeDaysMax: number;
  freezerMonthsMin: number;
  freezerMonthsMax: number;
  tips?: string;
}
