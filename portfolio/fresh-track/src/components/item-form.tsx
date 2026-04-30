"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FoodSearch } from "./food-search";
import { useApp } from "@/lib/context";
import { addItem, today } from "@/lib/store";
import { addDays } from "@/lib/expiration";
import { getShelfLifeDays } from "@/lib/foodkeeper";
import { FoodKeeperEntry, StorageLocation } from "@/lib/types";
import { Snowflake, Thermometer } from "lucide-react";

export function ItemForm() {
  const { update } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("each");
  const [storage, setStorage] = useState<StorageLocation>("fridge");
  const [purchaseDate, setPurchaseDate] = useState(today());
  const [expirationDate, setExpirationDate] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<FoodKeeperEntry | null>(
    null
  );
  const [tips, setTips] = useState<string | null>(null);

  function handleFoodSelect(entry: FoodKeeperEntry) {
    setName(entry.name);
    setSelectedEntry(entry);
    setTips(entry.tips || null);
    const days = getShelfLifeDays(entry, storage);
    if (days > 0) {
      setExpirationDate(addDays(purchaseDate, days));
    }
  }

  function handleStorageChange(s: StorageLocation) {
    setStorage(s);
    if (selectedEntry) {
      const days = getShelfLifeDays(selectedEntry, s);
      if (days > 0) {
        setExpirationDate(addDays(purchaseDate, days));
      }
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const exp =
      expirationDate || addDays(purchaseDate, storage === "fridge" ? 7 : 90);

    update((state) =>
      addItem(state, {
        name: name.trim(),
        normalizedName: name.trim().toLowerCase(),
        quantity,
        unit,
        purchaseDate,
        expirationDate: exp,
        storage,
      })
    );

    setName("");
    setQuantity(1);
    setUnit("each");
    setExpirationDate("");
    setSelectedEntry(null);
    setTips(null);
    router.push("/");
  }

  const units = ["each", "lb", "oz", "pack", "bag", "bunch", "container", "dozen"];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Item name</label>
        <FoodSearch
          value={name}
          onChange={(v) => {
            setName(v);
            setSelectedEntry(null);
            setTips(null);
          }}
          onSelect={handleFoodSelect}
        />
        {selectedEntry && (
          <div className="mt-2 px-3 py-2 bg-emerald-950/50 border border-emerald-900 rounded-lg text-xs text-emerald-400">
            Matched: {selectedEntry.name} ({selectedEntry.category})
            {tips && (
              <div className="mt-1 text-zinc-400">{tips}</div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-zinc-400 mb-1.5">Qty</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 focus:outline-none focus:border-emerald-600"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-zinc-400 mb-1.5">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 focus:outline-none focus:border-emerald-600"
          >
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1.5">Storage</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleStorageChange("fridge")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              storage === "fridge"
                ? "bg-emerald-950 border-emerald-700 text-emerald-300"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <Thermometer size={16} />
            Fridge
          </button>
          <button
            type="button"
            onClick={() => handleStorageChange("freezer")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
              storage === "freezer"
                ? "bg-sky-950 border-sky-700 text-sky-300"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            <Snowflake size={16} />
            Freezer
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-zinc-400 mb-1.5">
            Purchased
          </label>
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => {
              setPurchaseDate(e.target.value);
              if (selectedEntry) {
                const days = getShelfLifeDays(selectedEntry, storage);
                if (days > 0)
                  setExpirationDate(addDays(e.target.value, days));
              }
            }}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 focus:outline-none focus:border-emerald-600"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-zinc-400 mb-1.5">
            Expires
          </label>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-medium rounded-lg transition-colors"
      >
        Add to {storage === "fridge" ? "Fridge" : "Freezer"}
      </button>
    </form>
  );
}
