export type Lane = "inbox" | "regulation" | "maintenance" | "support" | "future";
export type ItemStatus = "active" | "done" | "skipped";

export interface Item {
  id: string;
  text: string;
  lane: Lane;
  status: ItemStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface DailyLock {
  date: string;
  lanes: Exclude<Lane, "inbox">[];
}

export const MIN_LANES = 2;
export const MAX_LANES = 4;

export interface DailyCheck {
  date: string;
  produced: boolean;
  stayedInLanes: boolean;
}

export interface AppState {
  items: Item[];
  locks: DailyLock[];
  checks: DailyCheck[];
}

export const LANE_LABELS: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "Regulation",
  maintenance: "Maintenance",
  support: "Support Others",
  future: "Future",
};

export const LANE_DESCRIPTIONS: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "Sleep, food, water, meds, walks, rest",
  maintenance: "Dishes, laundry, cleaning, errands",
  support: "Kids, wife, church, family",
  future: "Job search, GMAT, building, planning",
};
