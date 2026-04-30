"use client";

import { useApp } from "@/lib/context";
import { getActiveItems } from "@/lib/store";
import {
  getUrgency,
  urgencyLabel,
  daysUntil,
  formatDate,
  formatDaysLeft,
} from "@/lib/expiration";
import { FridgeItem, UrgencyLevel } from "@/lib/types";
import { Printer } from "lucide-react";

function groupByUrgency(
  items: FridgeItem[],
  warningDays: number
): Record<UrgencyLevel, FridgeItem[]> {
  const groups: Record<UrgencyLevel, FridgeItem[]> = {
    expired: [],
    today: [],
    soon: [],
    ok: [],
    frozen: [],
  };
  for (const item of items) {
    const u = getUrgency(item.expirationDate, item.storage, warningDays);
    groups[u].push(item);
  }
  return groups;
}

function buildWeekPlan(
  items: FridgeItem[]
): { date: string; label: string; items: FridgeItem[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: { date: string; label: string; items: FridgeItem[] }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const label =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    days.push({ date: dateStr, label, items: [] });
  }

  const fridgeItems = items
    .filter((it) => it.storage === "fridge")
    .sort((a, b) => a.expirationDate.localeCompare(b.expirationDate));

  for (const item of fridgeItems) {
    const d = daysUntil(item.expirationDate);
    const idx = Math.max(0, Math.min(d, 6));
    days[idx].items.push(item);
  }

  return days.filter((d) => d.items.length > 0);
}

const urgencyOrder: UrgencyLevel[] = ["expired", "today", "soon", "ok"];

const printUrgencyStyle: Record<UrgencyLevel, string> = {
  expired: "border-l-4 border-l-red-600 bg-red-50",
  today: "border-l-4 border-l-orange-500 bg-orange-50",
  soon: "border-l-4 border-l-yellow-500 bg-yellow-50",
  ok: "border-l-4 border-l-green-500 bg-green-50",
  frozen: "border-l-4 border-l-blue-500 bg-blue-50",
};

export default function PrintPage() {
  const { state } = useApp();
  const activeItems = getActiveItems(state);
  const groups = groupByUrgency(activeItems, state.settings.warningDays);
  const weekPlan = buildWeekPlan(activeItems);

  return (
    <>
      {/* Screen preview with print button */}
      <div className="no-print max-w-lg mx-auto px-4 py-6">
        <header className="mb-5">
          <h1 className="text-2xl font-bold">Print View</h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Preview your fridge list before printing
          </p>
        </header>
        {activeItems.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            <p className="text-lg mb-1">Nothing to print</p>
            <p className="text-sm">Add items first</p>
          </div>
        ) : (
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors mb-6"
          >
            <Printer size={18} />
            Print Fridge List
          </button>
        )}
      </div>

      {/* Printable content */}
      <div className="hidden print:block print:bg-white print:text-black p-6 max-w-[8.5in] mx-auto text-sm font-sans">
        <div className="flex justify-between items-baseline mb-4 border-b-2 border-black pb-2">
          <h1 className="text-xl font-bold">Fresh Track</h1>
          <span className="text-xs text-gray-500">
            Printed {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>

        {/* Section 1: Fridge Inventory */}
        <h2 className="text-base font-bold mb-2 uppercase tracking-wide">
          Fridge Inventory
        </h2>
        {urgencyOrder.map((urgency) => {
          const items = groups[urgency];
          if (items.length === 0) return null;
          return (
            <div key={urgency} className="mb-3">
              <div
                className={`px-2 py-1 rounded text-xs font-bold uppercase mb-1 ${printUrgencyStyle[urgency]}`}
              >
                {urgencyLabel(urgency)} ({items.length})
              </div>
              <table className="w-full text-xs">
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200"
                    >
                      <td className="py-1 font-medium">{item.name}</td>
                      <td className="py-1 text-gray-500 text-right">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-1 text-right w-24">
                        {formatDaysLeft(item.expirationDate, item.storage)}
                      </td>
                      <td className="py-1 text-gray-400 text-right w-20">
                        {formatDate(item.expirationDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Freezer section */}
        {groups.frozen.length > 0 && (
          <div className="mb-3">
            <div
              className={`px-2 py-1 rounded text-xs font-bold uppercase mb-1 ${printUrgencyStyle.frozen}`}
            >
              Freezer ({groups.frozen.length})
            </div>
            <table className="w-full text-xs">
              <tbody>
                {groups.frozen.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-1 font-medium">{item.name}</td>
                    <td className="py-1 text-gray-500 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-1 text-right w-24">
                      {formatDaysLeft(item.expirationDate, item.storage)}
                    </td>
                    <td className="py-1 text-gray-400 text-right w-20">
                      {formatDate(item.expirationDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Section 2: 7-Day Suggestions */}
        {weekPlan.length > 0 && (
          <>
            <div className="border-t-2 border-black mt-4 pt-3">
              <h2 className="text-base font-bold mb-2 uppercase tracking-wide">
                Eat This First (7-Day Plan)
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {weekPlan.map(({ date, label, items }) => (
                <div
                  key={date}
                  className="border border-gray-300 rounded p-2"
                >
                  <div className="font-bold text-xs mb-1">{label}</div>
                  {items.map((item) => (
                    <div key={item.id} className="text-xs text-gray-700">
                      {item.name}
                      <span className="text-gray-400">
                        {" "}
                        ({formatDaysLeft(item.expirationDate, item.storage)})
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 pt-2 border-t border-gray-300 text-center text-xs text-gray-400">
          freshtrack.vercel.app
        </div>
      </div>
    </>
  );
}
