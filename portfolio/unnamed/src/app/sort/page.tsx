"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { getInboxItems, moveToLane, skipItem } from "@/lib/store";
import {
  Lane,
  LANE_LABELS,
  LANE_DESCRIPTIONS,
  LANE_HELP,
} from "@/lib/types";

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

const LANE_BAR: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "bg-sky-500",
  maintenance: "bg-emerald-500",
  support: "bg-violet-500",
  future: "bg-amber-500",
};

const LANE_CTA: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "bg-sky-500 text-zinc-950",
  maintenance: "bg-emerald-500 text-zinc-950",
  support: "bg-violet-500 text-zinc-950",
  future: "bg-amber-500 text-zinc-950",
};

export default function SortPage() {
  const { state, update } = useApp();
  const inboxItems = getInboxItems(state);
  const [helpLane, setHelpLane] = useState<Exclude<Lane, "inbox"> | null>(null);

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

  function handleSortFromSheet(lane: Exclude<Lane, "inbox">) {
    setHelpLane(null);
    handleSort(lane);
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
          <div
            key={lane}
            className={`relative w-full border rounded-2xl ${LANE_COLORS[lane]}`}
          >
            <button
              type="button"
              onClick={() => handleSort(lane)}
              className="w-full text-left px-5 py-4 pr-14 active:scale-[0.98] transition-all"
              aria-label={`Sort into ${LANE_LABELS[lane]}`}
            >
              <p className={`font-semibold ${LANE_TEXT[lane]}`}>
                {LANE_LABELS[lane]}
              </p>
              <p className="text-zinc-500 text-sm mt-0.5">
                {LANE_DESCRIPTIONS[lane]}
              </p>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHelpLane(lane);
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-lg ${LANE_TEXT[lane]} active:scale-90 transition-transform`}
              aria-label={`What goes in ${LANE_LABELS[lane]}?`}
            >
              {infoIcon}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => update((s) => skipItem(s, currentItem.id))}
        className="w-full text-zinc-500 text-sm py-3 mt-4 active:scale-[0.98] transition-all"
      >
        Skip
      </button>

      {helpLane && (
        <LaneHelpSheet
          lane={helpLane}
          onClose={() => setHelpLane(null)}
          onSort={() => handleSortFromSheet(helpLane)}
        />
      )}
    </div>
  );
}

function LaneHelpSheet({
  lane,
  onClose,
  onSort,
}: {
  lane: Exclude<Lane, "inbox">;
  onClose: () => void;
  onSort: () => void;
}) {
  const help = LANE_HELP[lane];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`lane-help-title-${lane}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-zinc-950/80"
      />
      <div className="relative w-full max-w-md bg-zinc-900 border-t border-zinc-800 rounded-t-3xl px-5 pt-3 pb-8 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-center mb-3">
          <span className="block w-12 h-1.5 rounded-full bg-zinc-700" />
        </div>

        <div className={`h-1.5 rounded-full mb-5 ${LANE_BAR[lane]}`} />

        <div className="flex items-start justify-between mb-4 gap-3">
          <h2
            id={`lane-help-title-${lane}`}
            className={`text-2xl font-bold ${LANE_TEXT[lane]}`}
          >
            {LANE_LABELS[lane]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 active:scale-90 transition-transform"
            aria-label="Close help"
          >
            {closeIcon}
          </button>
        </div>

        <p className="text-zinc-300 text-base leading-relaxed mb-6">
          {help.summary}
        </p>

        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
          Examples
        </p>
        <ul className="space-y-2 mb-6">
          {help.examples.map((ex) => (
            <li
              key={ex}
              className="flex items-start gap-3 text-zinc-300 text-sm"
            >
              <span className={`mt-2 w-1.5 h-1.5 rounded-full ${LANE_BAR[lane]} flex-shrink-0`} />
              <span>{ex}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
          Goes here when
        </p>
        <p className="text-zinc-200 text-base italic mb-7">
          &ldquo;{help.rule}&rdquo;
        </p>

        <button
          type="button"
          onClick={onSort}
          className={`w-full rounded-2xl py-4 text-base font-bold active:scale-[0.98] transition-all ${LANE_CTA[lane]}`}
        >
          Sort into {LANE_LABELS[lane]}
        </button>
      </div>
    </div>
  );
}

const infoIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const closeIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
