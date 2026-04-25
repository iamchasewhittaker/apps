"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { getTodayCheck, getTodayLock, saveCheck } from "@/lib/store";
import { Lane, LANE_LABELS } from "@/lib/types";

const LANE_BADGE: Record<Exclude<Lane, "inbox">, string> = {
  regulation: "border-sky-500/50 bg-sky-500/10 text-sky-300",
  maintenance: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
  support: "border-violet-500/50 bg-violet-500/10 text-violet-300",
  future: "border-amber-500/50 bg-amber-500/10 text-amber-300",
};

function LockedLanesHeader() {
  const { state } = useApp();
  const lock = getTodayLock(state);

  if (!lock || lock.lanes.length === 0) {
    return (
      <p className="text-sm text-zinc-500 mb-8">
        No lanes locked today. You can still log a check.
      </p>
    );
  }

  return (
    <div className="mb-8">
      <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">
        Today&apos;s lanes
      </p>
      <div className="flex gap-2 flex-wrap">
        {lock.lanes.map((lane) => (
          <span
            key={lane}
            className={`text-sm font-medium px-3 py-1.5 rounded-full border ${LANE_BADGE[lane]}`}
          >
            {LANE_LABELS[lane]}
          </span>
        ))}
      </div>
    </div>
  );
}

function CheckForm() {
  const { state, update } = useApp();
  const [produced, setProduced] = useState<boolean | null>(null);
  const [stayedInLanes, setStayedInLanes] = useState<boolean | null>(null);

  const lock = getTodayLock(state);
  const hasLock = !!lock && lock.lanes.length > 0;

  function handleSave() {
    if (produced === null || stayedInLanes === null) return;
    update((s) => saveCheck(s, produced, stayedInLanes));
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Check</h1>
      <p className="text-sm text-zinc-500 mb-8">
        Two questions. That&apos;s it.
      </p>

      <LockedLanesHeader />

      <div className="space-y-8 mb-10">
        <div>
          <p className="text-zinc-200 text-lg font-medium mb-1.5">
            Did you finish at least one thing today?
          </p>
          <p className="text-sm text-zinc-500 mb-4">
            Anything that moved &mdash; a task, a chunk of work, a chore. Not
            &ldquo;tried and gave up.&rdquo;
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setProduced(true)}
              className={`flex-1 rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98] ${
                produced === true
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "border border-zinc-700 text-zinc-400"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setProduced(false)}
              className={`flex-1 rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98] ${
                produced === false
                  ? "bg-zinc-700 text-zinc-200 ring-2 ring-zinc-500"
                  : "border border-zinc-700 text-zinc-400"
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div>
          <p className="text-zinc-200 text-lg font-medium mb-1.5">
            Did your effort mostly stay in today&apos;s two lanes?
          </p>
          <p className="text-sm text-zinc-500 mb-4">
            {hasLock
              ? "Most of your energy went into the locked lanes above — not the other two."
              : "You didn't lock lanes today, so this is moot — pick whichever feels right."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setStayedInLanes(true)}
              className={`flex-1 rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98] ${
                stayedInLanes === true
                  ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                  : "border border-zinc-700 text-zinc-400"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setStayedInLanes(false)}
              className={`flex-1 rounded-2xl py-4 text-base font-semibold transition-all active:scale-[0.98] ${
                stayedInLanes === false
                  ? "bg-zinc-700 text-zinc-200 ring-2 ring-zinc-500"
                  : "border border-zinc-700 text-zinc-400"
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={produced === null || stayedInLanes === null}
        className="w-full bg-amber-500 text-zinc-950 font-bold rounded-2xl py-4 text-lg disabled:opacity-20 active:scale-[0.98] transition-all"
      >
        Log it
      </button>
    </div>
  );
}

function CheckDone() {
  const { state } = useApp();
  const check = getTodayCheck(state)!;

  const bothYes = check.produced && check.stayedInLanes;
  const oneYes = check.produced || check.stayedInLanes;

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Check</h1>
      <p className="text-sm text-zinc-500 mb-8">Today is logged.</p>

      <LockedLanesHeader />

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-6">{bothYes ? "▲" : oneYes ? "◆" : "—"}</p>
          <p className="text-zinc-300 text-lg font-medium mb-2">
            {bothYes
              ? "Solid day."
              : oneYes
                ? "Halfway there."
                : "Rest day. That counts too."}
          </p>
          <div className="space-y-2 mt-6">
            <p className="text-sm">
              <span className="text-zinc-500">Finished a thing: </span>
              <span
                className={
                  check.produced ? "text-emerald-400" : "text-zinc-500"
                }
              >
                {check.produced ? "Yes" : "No"}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-zinc-500">Stayed in lanes: </span>
              <span
                className={
                  check.stayedInLanes ? "text-emerald-400" : "text-zinc-500"
                }
              >
                {check.stayedInLanes ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckPage() {
  const { state } = useApp();
  const check = getTodayCheck(state);

  if (check) return <CheckDone />;
  return <CheckForm />;
}
