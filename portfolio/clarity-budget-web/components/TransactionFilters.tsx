"use client";

import { useEffect, useMemo, useState } from "react";
import type { SpendLine } from "@/lib/aggregations";
import {
  activeFilterCount,
  emptyFilters,
  type FilterState,
} from "@/lib/filterState";

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  lines: SpendLine[];
}

function numOrUndef(v: string): number | undefined {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export function TransactionFilters({ filters, onChange, lines }: Props) {
  const [open, setOpen] = useState(false);
  const [payeeInput, setPayeeInput] = useState(filters.payeeQuery ?? "");

  useEffect(() => {
    setPayeeInput(filters.payeeQuery ?? "");
  }, [filters.payeeQuery]);

  useEffect(() => {
    const current = filters.payeeQuery ?? "";
    if (payeeInput === current) return;
    const id = window.setTimeout(() => {
      const next = { ...filters };
      if (payeeInput.trim()) next.payeeQuery = payeeInput.trim();
      else delete next.payeeQuery;
      onChange(next);
    }, 250);
    return () => window.clearTimeout(id);
  }, [payeeInput, filters, onChange]);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const l of lines) set.add(l.categoryName);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [lines]);

  const accountOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of lines) map.set(l.accountId, l.accountName);
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [lines]);

  const count = activeFilterCount(filters);

  const patch = (delta: Partial<FilterState>) => {
    const next: FilterState = { ...filters, ...delta };
    for (const k of Object.keys(next) as (keyof FilterState)[]) {
      const v = next[k];
      if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) delete next[k];
    }
    onChange(next);
  };

  const toggleCategory = (name: string) => {
    const set = new Set(filters.categoryNames ?? []);
    if (set.has(name)) set.delete(name);
    else set.add(name);
    patch({ categoryNames: [...set] });
  };

  const toggleAccount = (id: string) => {
    const set = new Set(filters.accountIds ?? []);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    patch({ accountIds: [...set] });
  };

  return (
    <section className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Filters
          </span>
          {count > 0 && (
            <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-5 text-white">
              {count}
            </span>
          )}
        </span>
        <span className="flex items-center gap-3">
          {count > 0 && (
            <span
              role="button"
              tabIndex={0}
              className="text-xs text-muted underline"
              onClick={(e) => {
                e.stopPropagation();
                onChange(emptyFilters());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(emptyFilters());
                }
              }}
            >
              Clear
            </span>
          )}
          <svg
            className={`h-4 w-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.24 4.52a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-dimmer px-4 py-4">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              Date range
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs text-muted">
                From
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-dimmer bg-bg px-2 py-1.5 text-sm text-neutral-100"
                  value={filters.from ?? ""}
                  onChange={(e) => patch({ from: e.target.value || undefined })}
                />
              </label>
              <label className="block text-xs text-muted">
                To
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-dimmer bg-bg px-2 py-1.5 text-sm text-neutral-100"
                  value={filters.to ?? ""}
                  onChange={(e) => patch({ to: e.target.value || undefined })}
                />
              </label>
            </div>
          </div>

          <label className="block text-xs text-muted">
            Payee
            <input
              type="search"
              placeholder="Search payee…"
              className="mt-1 w-full rounded-md border border-dimmer bg-bg px-2 py-1.5 text-sm text-neutral-100"
              value={payeeInput}
              onChange={(e) => setPayeeInput(e.target.value)}
            />
          </label>

          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              Amount ($)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs text-muted">
                Min
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="mt-1 w-full rounded-md border border-dimmer bg-bg px-2 py-1.5 text-sm text-neutral-100"
                  value={filters.amountMin ?? ""}
                  onChange={(e) => patch({ amountMin: numOrUndef(e.target.value) })}
                />
              </label>
              <label className="block text-xs text-muted">
                Max
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  className="mt-1 w-full rounded-md border border-dimmer bg-bg px-2 py-1.5 text-sm text-neutral-100"
                  value={filters.amountMax ?? ""}
                  onChange={(e) => patch({ amountMax: numOrUndef(e.target.value) })}
                />
              </label>
            </div>
          </div>

          {categoryOptions.length > 0 && (
            <details className="rounded-md border border-dimmer">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs [&::-webkit-details-marker]:hidden">
                <span className="text-muted">
                  Categories{" "}
                  {filters.categoryNames?.length
                    ? `(${filters.categoryNames.length})`
                    : ""}
                </span>
                <span className="text-[11px] text-muted">
                  {categoryOptions.length} available
                </span>
              </summary>
              <ul className="max-h-56 space-y-1 overflow-y-auto border-t border-dimmer px-3 py-2 text-sm">
                {categoryOptions.map((name) => (
                  <li key={name}>
                    <label className="flex items-center gap-2 py-0.5">
                      <input
                        type="checkbox"
                        checked={filters.categoryNames?.includes(name) ?? false}
                        onChange={() => toggleCategory(name)}
                      />
                      <span className="truncate">{name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {accountOptions.length > 0 && (
            <details className="rounded-md border border-dimmer">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-xs [&::-webkit-details-marker]:hidden">
                <span className="text-muted">
                  Accounts{" "}
                  {filters.accountIds?.length
                    ? `(${filters.accountIds.length})`
                    : ""}
                </span>
                <span className="text-[11px] text-muted">
                  {accountOptions.length} available
                </span>
              </summary>
              <ul className="max-h-56 space-y-1 overflow-y-auto border-t border-dimmer px-3 py-2 text-sm">
                {accountOptions.map((a) => (
                  <li key={a.id}>
                    <label className="flex items-center gap-2 py-0.5">
                      <input
                        type="checkbox"
                        checked={filters.accountIds?.includes(a.id) ?? false}
                        onChange={() => toggleAccount(a.id)}
                      />
                      <span className="truncate">{a.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  );
}
