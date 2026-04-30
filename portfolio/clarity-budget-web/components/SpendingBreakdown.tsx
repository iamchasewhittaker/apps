"use client";

import { useMemo, useState } from "react";
import {
  dateRangeLabel,
  groupByCategory,
  groupByPayee,
  groupByWeek,
  outflowCount,
  totalSpent,
  type SpendBucket,
  type SpendLine,
} from "@/lib/aggregations";

type TabKey = "category" | "payee" | "week";

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: "category", label: "By category" },
  { key: "payee", label: "By payee" },
  { key: "week", label: "By week" },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

interface Props {
  lines: SpendLine[];
}

export function SpendingBreakdown({ lines }: Props) {
  const [tab, setTab] = useState<TabKey>("category");

  const buckets = useMemo<SpendBucket[]>(() => {
    if (tab === "category") return groupByCategory(lines);
    if (tab === "payee") return groupByPayee(lines);
    return groupByWeek(lines);
  }, [lines, tab]);

  const total = useMemo(() => totalSpent(lines), [lines]);
  const count = useMemo(() => outflowCount(lines), [lines]);
  const range = useMemo(() => dateRangeLabel(lines), [lines]);

  if (!lines.length) return null;

  const top = buckets.slice(0, 8);
  const max = top[0]?.amount ?? 1;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Where your money went
        </p>
        {range && (
          <span className="text-xs text-muted">
            {range}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5 transition-colors hover:border-green/20">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              Total spent
            </p>
            <p className="mt-1 text-[2rem] font-bold leading-none tabular-nums text-white">
              {fmt(total)}
            </p>
          </div>
          <span className="text-xs text-muted">
            {count} {count === 1 ? "transaction" : "transactions"}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Breakdown"
          className="mt-4 flex gap-1 rounded-lg bg-bg p-1"
        >
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                className={`flex-1 rounded-md border py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-dimmer bg-surface text-white"
                    : "border-transparent bg-transparent text-muted"
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {top.length > 0 ? (
          <div className="mt-5 space-y-3.5">
            {top.map((b, i) => (
              <div key={b.key}>
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className="max-w-[72%] truncate pr-3 text-xs text-white"
                    title={b.label}
                  >
                    {b.label}
                  </span>
                  <span className="shrink-0 tabular-nums text-xs text-muted">
                    {fmt(b.amount)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-dimmer">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{
                      width: `${(b.amount / max) * 100}%`,
                      opacity: Math.max(0.35, 1 - i * 0.09),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs text-muted">
            No outflows in this view.
          </p>
        )}
      </div>
    </section>
  );
}
