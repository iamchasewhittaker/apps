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

export interface LaneHelp {
  summary: string;
  examples: string[];
  rule: string;
}

export const LANE_HELP: Record<Exclude<Lane, "inbox">, LaneHelp> = {
  regulation: {
    summary: "Your body and brain. Anything that keeps you regulated.",
    examples: [
      "Sleep, naps, rest",
      "Eating, hydration, meds",
      "Walks, exercise, movement",
      "Decompression, breathing, alone time",
      "Therapy or doctor appts",
    ],
    rule: "If I skip this, my whole day falls apart.",
  },
  maintenance: {
    summary: "The house and small stuff that keeps life from rotting.",
    examples: [
      "Dishes, laundry, trash",
      "Cleaning, tidying, organizing",
      "Errands, bills, paperwork",
      "Car, yard, repairs",
      "Groceries",
    ],
    rule: "It's boring and it has to happen.",
  },
  support: {
    summary: "Showing up for the people in your circle.",
    examples: [
      "Time with Reese, Buzz, or Kassie",
      "Helping family or friends",
      "Church and ministering",
      "Texts, calls, visits",
      "School and family events",
    ],
    rule: "Someone else is the point of this.",
  },
  future: {
    summary: "Building tomorrow. Job search, learning, projects.",
    examples: [
      "Job apps and interview prep",
      "GMAT and studying",
      "Portfolio apps, building",
      "Reading, courses, learning",
      "Planning, journaling",
    ],
    rule: "This makes my future bigger.",
  },
};
