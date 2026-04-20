"use client";

import { useMemo, useState } from "react";
import { T } from "@/lib/constants";
import { roleColor, type SpendLine } from "@/lib/aggregations";

type SortKey = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "payee-asc";

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "date-desc", label: "Newest first" },
  { key: "date-asc", label: "Oldest first" },
  { key: "amount-desc", label: "Amount (high → low)" },
  { key: "amount-asc", label: "Amount (low → high)" },
  { key: "payee-asc", label: "Payee A–Z" },
];

const PAGE_SIZE = 50;

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function shortDate(ymd: string) {
  const d = new Date(ymd + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface Props {
  lines: SpendLine[];
}

export function TransactionList({ lines }: Props) {
  const [sort, setSort] = useState<SortKey>("date-desc");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    const copy = [...lines];
    switch (sort) {
      case "date-desc":
        copy.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "date-asc":
        copy.sort((a, b) => a.date.localeCompare(b.date));
        break;
      case "amount-desc":
        copy.sort((a, b) => Math.abs(b.amountDollars) - Math.abs(a.amountDollars));
        break;
      case "amount-asc":
        copy.sort((a, b) => Math.abs(a.amountDollars) - Math.abs(b.amountDollars));
        break;
      case "payee-asc":
        copy.sort((a, b) => a.payeeName.localeCompare(b.payeeName));
        break;
    }
    return copy;
  }, [lines, sort]);

  const visible = sorted.slice(0, limit);
  const hasMore = sorted.length > limit;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: T.muted }}
        >
          Transactions
        </p>
        <span className="text-xs" style={{ color: T.muted }}>
          {sorted.length} {sorted.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div
        className="rounded-[18px] border"
        style={{ borderColor: T.border, background: T.surface }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-2"
          style={{ borderColor: T.border }}
        >
          <label className="text-xs" style={{ color: T.muted }}>
            Sort
            <select
              className="ml-2 rounded-md border px-2 py-1 text-xs text-neutral-100"
              style={{ borderColor: T.border, background: T.bg }}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="px-4 py-6 text-center text-xs" style={{ color: T.muted }}>
            No transactions match these filters.
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: T.border }}>
            {visible.map((l) => {
              const role = roleColor(l.role);
              const inflow = l.amountDollars < 0;
              const key = l.subId ? `${l.txId}:${l.subId}` : l.txId;
              return (
                <li
                  key={key}
                  className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3"
                  style={{ borderColor: T.border }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm" style={{ color: T.text }}>
                      {l.payeeName || "(no payee)"}
                    </p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px]" style={{ color: T.muted }}>
                      <span className="truncate" title={l.categoryName}>
                        {l.categoryName}
                      </span>
                      {role && (
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none"
                          style={{ background: role.bg, color: role.fg }}
                        >
                          {role.label}
                        </span>
                      )}
                      <span className="truncate" title={l.accountName}>
                        · {l.accountName}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p
                      className="tabular-nums text-sm font-semibold"
                      style={{ color: inflow ? T.safe : T.text }}
                    >
                      {inflow ? "+" : ""}
                      {fmt(Math.abs(l.amountDollars))}
                    </p>
                    <p className="text-[11px]" style={{ color: T.muted }}>
                      {shortDate(l.date)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {hasMore && (
          <div className="border-t px-4 py-3" style={{ borderColor: T.border }}>
            <button
              type="button"
              className="w-full rounded-md py-1.5 text-xs font-medium"
              style={{ background: T.bg, color: T.text, border: `1px solid ${T.border}` }}
              onClick={() => setLimit((n) => n + PAGE_SIZE)}
            >
              Show more ({sorted.length - limit} remaining)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
