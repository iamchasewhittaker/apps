import { AppState, Item, DailyLock, DailyCheck, Lane, MAX_LANES, MIN_LANES } from "./types";

const STORE_KEY = "unnamed_v1";

const defaultState: AppState = {
  items: [],
  locks: [],
  checks: [],
};

type LegacyDailyLock = {
  date: string;
  lane1?: Exclude<Lane, "inbox">;
  lane2?: Exclude<Lane, "inbox">;
  lanes?: Exclude<Lane, "inbox">[];
};

function migrateLock(lock: LegacyDailyLock): DailyLock {
  if (Array.isArray(lock.lanes) && lock.lanes.length > 0) {
    return { date: lock.date, lanes: lock.lanes };
  }
  const lanes = [lock.lane1, lock.lane2].filter(
    (l): l is Exclude<Lane, "inbox"> => Boolean(l)
  );
  return { date: lock.date, lanes };
}

export function load(): AppState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppState & { locks: LegacyDailyLock[] };
    return {
      ...parsed,
      locks: (parsed.locks ?? []).map(migrateLock),
    };
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

export function getTodayLock(state: AppState): DailyLock | undefined {
  return state.locks.find((l) => l.date === today());
}

export function getTodayCheck(state: AppState): DailyCheck | undefined {
  return state.checks.find((c) => c.date === today());
}

export function addItem(state: AppState, text: string): AppState {
  const item: Item = {
    id: crypto.randomUUID(),
    text: text.trim(),
    lane: "inbox",
    status: "active",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
  return { ...state, items: [item, ...state.items] };
}

export function moveToLane(
  state: AppState,
  itemId: string,
  lane: Exclude<Lane, "inbox">
): AppState {
  return {
    ...state,
    items: state.items.map((i) => (i.id === itemId ? { ...i, lane } : i)),
  };
}

export function updateItemText(
  state: AppState,
  itemId: string,
  text: string
): AppState {
  const trimmed = text.trim();
  if (!trimmed) return state;
  return {
    ...state,
    items: state.items.map((i) =>
      i.id === itemId ? { ...i, text: trimmed } : i
    ),
  };
}

export function deleteItem(state: AppState, itemId: string): AppState {
  return {
    ...state,
    items: state.items.filter((i) => i.id !== itemId),
  };
}

export function completeItem(state: AppState, itemId: string): AppState {
  return {
    ...state,
    items: state.items.map((i) =>
      i.id === itemId
        ? { ...i, status: "done", completedAt: new Date().toISOString() }
        : i
    ),
  };
}

export function skipItem(state: AppState, itemId: string): AppState {
  const idx = state.items.findIndex((i) => i.id === itemId);
  if (idx === -1) return state;
  const items = [...state.items];
  const [moved] = items.splice(idx, 1);
  items.push(moved);
  return { ...state, items };
}

export function lockLanes(
  state: AppState,
  lanes: Exclude<Lane, "inbox">[]
): AppState {
  if (lanes.length < MIN_LANES || lanes.length > MAX_LANES) return state;
  const lock: DailyLock = { date: today(), lanes };
  return {
    ...state,
    locks: [...state.locks.filter((l) => l.date !== today()), lock],
  };
}

export function saveCheck(
  state: AppState,
  produced: boolean,
  stayedInLanes: boolean
): AppState {
  const check: DailyCheck = { date: today(), produced, stayedInLanes };
  return {
    ...state,
    checks: [...state.checks.filter((c) => c.date !== today()), check],
  };
}

export function getActiveItemsForLane(state: AppState, lane: Lane): Item[] {
  return state.items.filter((i) => i.lane === lane && i.status === "active");
}

export function getInboxItems(state: AppState): Item[] {
  return getActiveItemsForLane(state, "inbox");
}
