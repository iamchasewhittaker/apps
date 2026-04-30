"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { getActiveItems, getWasteStats } from "@/lib/store";
import { ItemCard } from "@/components/item-card";
import { StorageLocation } from "@/lib/types";

export default function InventoryPage() {
  const { state } = useApp();
  const [tab, setTab] = useState<StorageLocation>("fridge");
  const items = getActiveItems(state, tab);
  const stats = getWasteStats(state);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold">Fresh Track</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          {getActiveItems(state).length} items tracked
          {stats.total > 0 && (
            <span>
              {" "}
              · {stats.wastePercent}% waste rate
            </span>
          )}
        </p>
      </header>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("fridge")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "fridge"
              ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
              : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
          }`}
        >
          Fridge ({getActiveItems(state, "fridge").length})
        </button>
        <button
          onClick={() => setTab("freezer")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "freezer"
              ? "bg-sky-900 text-sky-300 border border-sky-700"
              : "bg-zinc-900 text-zinc-400 border border-zinc-700 hover:border-zinc-500"
          }`}
        >
          Freezer ({getActiveItems(state, "freezer").length})
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <p className="text-lg mb-1">
            {tab === "fridge" ? "Fridge is empty" : "Freezer is empty"}
          </p>
          <p className="text-sm">
            Tap <span className="text-emerald-400">Add</span> to track items
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
