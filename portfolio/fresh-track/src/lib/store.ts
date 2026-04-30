import { AppState, FridgeItem, StorageLocation, ItemStatus } from "./types";

const STORE_KEY = "chase_fresh_track_v1";

const defaultState: AppState = {
  items: [],
  customShelfLife: {},
  settings: {
    warningDays: 2,
    defaultStorage: "fridge",
  },
};

export function load(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

export function save(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addItem(
  state: AppState,
  item: Omit<FridgeItem, "id" | "status" | "source">
): AppState {
  const newItem: FridgeItem = {
    ...item,
    id: crypto.randomUUID(),
    status: "active",
    source: "manual",
  };
  return { ...state, items: [newItem, ...state.items] };
}

export function updateItemStatus(
  state: AppState,
  itemId: string,
  status: ItemStatus
): AppState {
  return {
    ...state,
    items: state.items.map((i) =>
      i.id === itemId
        ? { ...i, status, usedDate: status !== "active" ? today() : undefined }
        : i
    ),
  };
}

export function deleteItem(state: AppState, itemId: string): AppState {
  return { ...state, items: state.items.filter((i) => i.id !== itemId) };
}

export function updateItem(
  state: AppState,
  itemId: string,
  updates: Partial<FridgeItem>
): AppState {
  return {
    ...state,
    items: state.items.map((i) =>
      i.id === itemId ? { ...i, ...updates } : i
    ),
  };
}

export function getActiveItems(
  state: AppState,
  storage?: StorageLocation
): FridgeItem[] {
  return state.items
    .filter((i) => i.status === "active" && (!storage || i.storage === storage))
    .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));
}

export function getWasteStats(state: AppState): {
  used: number;
  wasted: number;
  total: number;
  wastePercent: number;
} {
  const resolved = state.items.filter((i) => i.status !== "active");
  const used = resolved.filter((i) => i.status === "used").length;
  const wasted = resolved.filter((i) => i.status === "wasted").length;
  const total = resolved.length;
  return {
    used,
    wasted,
    total,
    wastePercent: total > 0 ? Math.round((wasted / total) * 100) : 0,
  };
}
