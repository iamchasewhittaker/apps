"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { getTodayCheck, saveCheck } from "@/lib/store";

function CheckForm() {
  const { update } = useApp();
  const [produced, setProduced] = useState<boolean | null>(null);
  const [stayedInLanes, setStayedInLanes] = useState<boolean | null>(null);

  function handleSave() {
    if (produced === null || stayedInLanes === null) return;
    update((s) => saveCheck(s, produced, stayedInLanes));
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Check</h1>
      <p className="text-sm text-zinc-500 mb-10">
        Two questions. That&apos;s it.
      </p>

      <div className="space-y-8 mb-10">
        <div>
          <p className="text-zinc-200 text-lg font-medium mb-4">
            Did you produce something today?
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
          <p className="text-zinc-200 text-lg font-medium mb-4">
            Did you stay in your lanes?
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
      <p className="text-sm text-zinc-500 mb-10">Today is logged.</p>

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
              <span className="text-zinc-500">Produced: </span>
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
