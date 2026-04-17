"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import {
  getTodayLock,
  lockLanes,
  getActiveItemsForLane,
  completeItem,
  skipItem,
} from "@/lib/store";
import { Lane, LANE_LABELS, LANE_DESCRIPTIONS } from "@/lib/types";

const LANES: Exclude<Lane, "inbox">[] = [
  "regulation",
  "maintenance",
  "support",
  "future",
];

const LANE_COLORS: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "border-sky-500/50 bg-sky-500/10",
  maintenance: "border-emerald-500/50 bg-emerald-500/10",
  support: "border-violet-500/50 bg-violet-500/10",
  future: "border-amber-500/50 bg-amber-500/10",
};

const LANE_TEXT: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "text-sky-400",
  maintenance: "text-emerald-400",
  support: "text-violet-400",
  future: "text-amber-400",
};

const LANE_SELECTED: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "ring-2 ring-sky-400 border-sky-400 bg-sky-500/20",
  maintenance: "ring-2 ring-emerald-400 border-emerald-400 bg-emerald-500/20",
  support: "ring-2 ring-violet-400 border-violet-400 bg-violet-500/20",
  future: "ring-2 ring-amber-400 border-amber-400 bg-amber-500/20",
};

function LanePicker() {
  const { update } = useApp();
  const [selected, setSelected] = useState<Exclude<Lane, "inbox">[]>([]);

  function toggle(lane: Exclude<Lane, "inbox">) {
    setSelected((prev) => {
      if (prev.includes(lane)) return prev.filter((l) => l !== lane);
      if (prev.length >= 2) return [prev[1], lane];
      return [...prev, lane];
    });
  }

  function handleLock() {
    if (selected.length !== 2) return;
    update((s) => lockLanes(s, selected[0], selected[1]));
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Today</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Pick your 2 lanes. The rest disappear.
      </p>

      <div className="space-y-3 mb-8">
        {LANES.map((lane) => {
          const isSelected = selected.includes(lane);
          return (
            <button
              key={lane}
              onClick={() => toggle(lane)}
              className={`w-full text-left border rounded-2xl px-5 py-4 transition-all active:scale-[0.98] ${
                isSelected ? LANE_SELECTED[lane] : LANE_COLORS[lane]
              }`}
            >
              <p className={`font-semibold ${LANE_TEXT[lane]}`}>
                {LANE_LABELS[lane]}
              </p>
              <p className="text-zinc-500 text-sm mt-0.5">
                {LANE_DESCRIPTIONS[lane]}
              </p>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleLock}
        disabled={selected.length !== 2}
        className="w-full bg-amber-500 text-zinc-950 font-bold rounded-2xl py-4 text-lg disabled:opacity-20 active:scale-[0.98] transition-all"
      >
        Lock in for today
      </button>

      <p className="text-center text-zinc-600 text-xs mt-3">
        This can&apos;t be undone until tomorrow.
      </p>
    </div>
  );
}

function FocusView() {
  const { state, update } = useApp();
  const lock = getTodayLock(state)!;
  const lanes = [lock.lane1, lock.lane2] as Exclude<Lane, "inbox">[];

  const allItems = lanes.flatMap((lane) =>
    getActiveItemsForLane(state, lane).map((item) => ({ ...item, lane }))
  );

  const currentItem = allItems[0];

  if (!currentItem) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Today</h1>
        <div className="flex gap-2 mb-8">
          {lanes.map((lane) => (
            <span
              key={lane}
              className={`text-xs font-medium px-3 py-1 rounded-full border ${LANE_COLORS[lane]} ${LANE_TEXT[lane]}`}
            >
              {LANE_LABELS[lane]}
            </span>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">▲</p>
            <p className="text-zinc-400 text-lg font-medium">
              All clear.
            </p>
            <p className="text-zinc-600 text-sm mt-1">
              Nothing left in your active lanes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Today</h1>
      <div className="flex gap-2 mb-8">
        {lanes.map((lane) => (
          <span
            key={lane}
            className={`text-xs font-medium px-3 py-1 rounded-full border ${LANE_COLORS[lane]} ${LANE_TEXT[lane]}`}
          >
            {LANE_LABELS[lane]}
          </span>
        ))}
      </div>

      <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">
        {allItems.length} remaining
      </p>

      <div
        className={`border rounded-2xl px-6 py-8 mb-8 ${LANE_COLORS[currentItem.lane as Exclude<Lane, "inbox">]}`}
      >
        <p
          className={`text-xs font-medium mb-2 ${LANE_TEXT[currentItem.lane as Exclude<Lane, "inbox">]}`}
        >
          {LANE_LABELS[currentItem.lane as Exclude<Lane, "inbox">]}
        </p>
        <p className="text-zinc-100 text-xl font-medium">{currentItem.text}</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => update((s) => skipItem(s, currentItem.id))}
          className="flex-1 border border-zinc-700 text-zinc-400 font-medium rounded-2xl py-4 text-base active:scale-[0.98] transition-all"
        >
          Skip
        </button>
        <button
          onClick={() => update((s) => completeItem(s, currentItem.id))}
          className="flex-1 bg-emerald-600 text-white font-bold rounded-2xl py-4 text-base active:scale-[0.98] transition-all"
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function TodayPage() {
  const { state } = useApp();
  const lock = getTodayLock(state);

  if (!lock) return <LanePicker />;
  return <FocusView />;
}
