"use client";

import { useApp } from "@/lib/context";
import { getInboxItems, moveToLane } from "@/lib/store";
import { Lane, LANE_LABELS, LANE_DESCRIPTIONS } from "@/lib/types";

const LANES: Exclude<Lane, "inbox">[] = [
  "regulation",
  "maintenance",
  "support",
  "future",
];

const LANE_COLORS: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "border-sky-500/40 bg-sky-500/5",
  maintenance: "border-emerald-500/40 bg-emerald-500/5",
  support: "border-violet-500/40 bg-violet-500/5",
  future: "border-amber-500/40 bg-amber-500/5",
};

const LANE_TEXT: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "text-sky-400",
  maintenance: "text-emerald-400",
  support: "text-violet-400",
  future: "text-amber-400",
};

export default function SortPage() {
  const { state, update } = useApp();
  const inboxItems = getInboxItems(state);

  const currentItem = inboxItems[0];

  if (!currentItem) {
    return (
      <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Sort</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Move inbox items into lanes.
        </p>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-600 text-center">
            Inbox is empty.
            <br />
            <span className="text-zinc-700 text-sm">Nothing to sort.</span>
          </p>
        </div>
      </div>
    );
  }

  function handleSort(lane: Exclude<Lane, "inbox">) {
    update((s) => moveToLane(s, currentItem.id, lane));
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Sort</h1>
      <p className="text-sm text-zinc-500 mb-6">
        {inboxItems.length} item{inboxItems.length !== 1 && "s"} to sort
      </p>

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 mb-8">
        <p className="text-zinc-100 text-lg">{currentItem.text}</p>
      </div>

      <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">
        Which lane does this belong to?
      </p>

      <div className="space-y-3">
        {LANES.map((lane) => (
          <button
            key={lane}
            onClick={() => handleSort(lane)}
            className={`w-full text-left border rounded-2xl px-5 py-4 transition-all active:scale-[0.98] ${LANE_COLORS[lane]}`}
          >
            <p className={`font-semibold ${LANE_TEXT[lane]}`}>
              {LANE_LABELS[lane]}
            </p>
            <p className="text-zinc-500 text-sm mt-0.5">
              {LANE_DESCRIPTIONS[lane]}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
