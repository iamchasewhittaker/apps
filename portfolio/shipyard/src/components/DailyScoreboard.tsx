'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'chase_scoreboard_v1';
const FLOOR_APPS = 5;
const FLOOR_OUTREACH = 3;

interface DayEntry {
  apps: number;
  outreach: number;
}

interface ScoreboardState {
  layoffStartDate: string;
  history: Record<string, DayEntry>;
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isWeekday(dateStr: string): boolean {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const wd = dt.getDay();
  return wd >= 1 && wd <= 5;
}

function prevDayKey(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, '0');
  const nd = String(dt.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

function computeStreak(history: Record<string, DayEntry>): number {
  let streak = 0;
  let cursor = todayKey();
  const todayEntry = history[cursor];
  const todayHit =
    todayEntry &&
    todayEntry.apps >= FLOOR_APPS &&
    todayEntry.outreach >= FLOOR_OUTREACH;
  if (!todayHit && isWeekday(cursor)) {
    cursor = prevDayKey(cursor);
  } else if (!todayHit) {
    cursor = prevDayKey(cursor);
  }
  while (true) {
    if (!isWeekday(cursor)) {
      cursor = prevDayKey(cursor);
      continue;
    }
    const entry = history[cursor];
    if (
      !entry ||
      entry.apps < FLOOR_APPS ||
      entry.outreach < FLOOR_OUTREACH
    ) {
      break;
    }
    streak += 1;
    cursor = prevDayKey(cursor);
    if (streak > 365) break;
  }
  return streak;
}

function daysBetween(startDateStr: string): number {
  const [y, m, d] = startDateStr.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const ms = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

function defaultLayoffDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 14);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function load(): ScoreboardState {
  if (typeof window === 'undefined') {
    return { layoffStartDate: defaultLayoffDate(), history: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { layoffStartDate: defaultLayoffDate(), history: {} };
    }
    const parsed = JSON.parse(raw) as Partial<ScoreboardState>;
    return {
      layoffStartDate: parsed.layoffStartDate ?? defaultLayoffDate(),
      history: parsed.history ?? {},
    };
  } catch {
    return { layoffStartDate: defaultLayoffDate(), history: {} };
  }
}

function save(state: ScoreboardState) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function DailyScoreboard() {
  const [state, setState] = useState<ScoreboardState | null>(null);
  const [editingDate, setEditingDate] = useState(false);

  useEffect(() => {
    setState(load());
  }, []);

  if (!state) {
    return (
      <div className="rounded-lg border border-dimmer bg-surface px-4 py-6">
        <p className="font-mono-label text-xs text-dim">LOADING FLOOR</p>
      </div>
    );
  }

  const today = todayKey();
  const todayEntry = state.history[today] ?? { apps: 0, outreach: 0 };
  const streak = computeStreak(state.history);
  const daysSinceLayoff = daysBetween(state.layoffStartDate);
  const appsHit = todayEntry.apps >= FLOOR_APPS;
  const outreachHit = todayEntry.outreach >= FLOOR_OUTREACH;
  const floorHit = appsHit && outreachHit;

  function updateToday(patch: Partial<DayEntry>) {
    setState((prev) => {
      if (!prev) return prev;
      const existing = prev.history[today] ?? { apps: 0, outreach: 0 };
      const next: ScoreboardState = {
        ...prev,
        history: {
          ...prev.history,
          [today]: { ...existing, ...patch },
        },
      };
      save(next);
      return next;
    });
  }

  function bumpApps(delta: number) {
    updateToday({ apps: Math.max(0, todayEntry.apps + delta) });
  }

  function bumpOutreach(delta: number) {
    updateToday({ outreach: Math.max(0, todayEntry.outreach + delta) });
  }

  function saveLayoffDate(newDate: string) {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, layoffStartDate: newDate };
      save(next);
      return next;
    });
    setEditingDate(false);
  }

  return (
    <div className="rounded-lg border border-gold/40 bg-surface">
      <div className="flex items-center justify-between border-b border-dimmer px-4 py-3">
        <div>
          <p className="font-mono-label text-xs text-gold">KASSIE&apos;S FLOOR</p>
          <p className="font-display text-xl text-white mt-0.5">
            {FLOOR_APPS} APPS · {FLOOR_OUTREACH} OUTREACH · DAILY
          </p>
        </div>
        <span
          className={`font-mono-label text-xs px-3 py-1 rounded-full border ${
            floorHit
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
              : 'border-dimmer bg-ghost text-dim'
          }`}
        >
          {floorHit ? 'FLOOR HIT' : 'OPEN'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        <CounterTile
          label={`Apps Today (of ${FLOOR_APPS})`}
          value={todayEntry.apps}
          hit={appsHit}
          onInc={() => bumpApps(1)}
          onDec={() => bumpApps(-1)}
        />
        <CounterTile
          label={`Outreach Today (of ${FLOOR_OUTREACH})`}
          value={todayEntry.outreach}
          hit={outreachHit}
          onInc={() => bumpOutreach(1)}
          onDec={() => bumpOutreach(-1)}
        />
        <StaticTile
          label="Weekday Streak"
          value={streak}
          accent={streak > 0 ? 'text-gold' : 'text-white'}
        />
        <StaticTile
          label="Days Since Layoff"
          value={daysSinceLayoff}
          accent="text-steel"
          footer={
            editingDate ? (
              <input
                type="date"
                defaultValue={state.layoffStartDate}
                className="bg-ghost border border-dimmer rounded px-2 py-0.5 text-xs text-white mt-1 w-full"
                onBlur={(e) => saveLayoffDate(e.target.value)}
                autoFocus
              />
            ) : (
              <button
                className="font-mono-label text-[10px] text-dim hover:text-steel underline underline-offset-2 mt-1"
                onClick={() => setEditingDate(true)}
              >
                set date
              </button>
            )
          }
        />
      </div>
    </div>
  );
}

function CounterTile({
  label,
  value,
  hit,
  onInc,
  onDec,
}: {
  label: string;
  value: number;
  hit: boolean;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 ${
        hit ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-dimmer bg-ghost'
      }`}
    >
      <p
        className={`font-display text-4xl ${hit ? 'text-emerald-400' : 'text-white'}`}
      >
        {value}
      </p>
      <p className="font-mono-label text-xs text-dim mt-1">{label}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onInc}
          className="flex-1 rounded border border-gold/40 bg-gold/10 text-gold font-mono-label text-xs py-1 hover:bg-gold/20 active:scale-95 transition-all"
        >
          +1
        </button>
        <button
          onClick={onDec}
          className="rounded border border-dimmer bg-surface text-dim font-mono-label text-xs px-2 py-1 hover:text-white active:scale-95 transition-all"
        >
          −
        </button>
      </div>
    </div>
  );
}

function StaticTile({
  label,
  value,
  accent,
  footer,
}: {
  label: string;
  value: number;
  accent: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dimmer bg-ghost px-4 py-3">
      <p className={`font-display text-4xl ${accent}`}>{value}</p>
      <p className="font-mono-label text-xs text-dim mt-1">{label}</p>
      {footer}
    </div>
  );
}
