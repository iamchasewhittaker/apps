"use client";

import { useState } from "react";
import { FridgeItem } from "@/lib/types";
import { useApp } from "@/lib/context";
import { updateItemStatus, deleteItem } from "@/lib/store";
import {
  getUrgency,
  urgencyLabel,
  urgencyColor,
  urgencyBg,
  formatDate,
  formatDaysLeft,
} from "@/lib/expiration";
import { Check, Trash2, X } from "lucide-react";

interface ItemCardProps {
  item: FridgeItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const { state, update } = useApp();
  const [showActions, setShowActions] = useState(false);
  const urgency = getUrgency(
    item.expirationDate,
    item.storage,
    state.settings.warningDays
  );

  return (
    <div
      className={`border rounded-lg p-3 transition-colors ${urgencyBg(urgency)}`}
      onClick={() => setShowActions(!showActions)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{item.name}</div>
          <div className="text-xs text-zinc-400 mt-0.5">
            {item.quantity} {item.unit}
            {item.storage === "freezer" && (
              <span className="ml-1.5 text-sky-400">Freezer</span>
            )}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={`text-sm font-medium ${urgencyColor(urgency)}`}>
            {formatDaysLeft(item.expirationDate, item.storage)}
          </div>
          <div className="text-xs text-zinc-500">
            {urgencyLabel(urgency)} · {formatDate(item.expirationDate)}
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-700/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              update((s) => updateItemStatus(s, item.id, "used"));
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-900/50 hover:bg-emerald-900 border border-emerald-800 rounded-lg text-emerald-300 text-sm transition-colors"
          >
            <Check size={14} />
            Used
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              update((s) => updateItemStatus(s, item.id, "wasted"));
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-900/50 hover:bg-orange-900 border border-orange-800 rounded-lg text-orange-300 text-sm transition-colors"
          >
            <X size={14} />
            Wasted
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              update((s) => deleteItem(s, item.id));
            }}
            className="flex items-center justify-center px-3 py-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-400 text-sm transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
