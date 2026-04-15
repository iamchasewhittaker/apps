// CashFlowEngine.js — Port of CashFlowEngine.swift
import { totalRequired, occurrencesInMonth } from "./MetricsEngine";

/**
 * Build a chronological timeline of income and bill events for the given month.
 * Returns array of CashFlowEvent objects: { date, kind, label, amount, cumulativeIncome, totalRequired, isCovered, shortfall }
 * kind: "paycheck" | "bill" | "mortgageCoveredMarker" | "todayMarker"
 */
export function buildTimeline(sources, balances, month) {
  const required = totalRequired(balances);
  const events = [];

  // Income events
  for (const source of sources) {
    for (const date of occurrencesInMonth(source, month)) {
      events.push({
        date,
        kind: "paycheck",
        label: source.name,
        amount: source.amountCents / 100,
        cumulativeIncome: 0,
        totalRequired: required,
        isCovered: false,
        shortfall: 0,
      });
    }
  }

  // Bill events
  const year = month.getFullYear();
  const mo = month.getMonth();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();

  for (const b of balances) {
    if (b.role !== "mortgage" && b.role !== "bill" && b.role !== "essential") continue;
    const dueDay = b.dueDay > 0 ? b.dueDay : (b.role === "mortgage" ? 1 : 5);
    const clampedDay = Math.min(dueDay, daysInMonth);
    events.push({
      date: new Date(year, mo, clampedDay),
      kind: "bill",
      label: b.name,
      amount: b.monthlyTarget,
      cumulativeIncome: 0,
      totalRequired: required,
      isCovered: b.isCovered,
      shortfall: b.shortfall,
    });
  }

  // Sort: chronological, paychecks before bills on same day
  events.sort((a, b) => {
    if (a.date.getTime() !== b.date.getTime()) return a.date - b.date;
    if (a.kind === "paycheck" && b.kind === "bill") return -1;
    if (a.kind === "bill" && b.kind === "paycheck") return 1;
    return 0;
  });

  // Compute cumulative income + insert mortgage-covered marker
  let cumulativeIncome = 0;
  const mortgageTarget = balances.filter(b => b.role === "mortgage").reduce((s, b) => s + b.monthlyTarget, 0);
  let mortgageMarkerInserted = false;
  const result = [];

  for (const event of events) {
    if (event.kind === "paycheck") {
      cumulativeIncome += event.amount;
      event.cumulativeIncome = cumulativeIncome;
      event.totalRequired = required;
      result.push(event);

      if (!mortgageMarkerInserted && mortgageTarget > 0 && cumulativeIncome >= mortgageTarget) {
        mortgageMarkerInserted = true;
        result.push({
          date: event.date,
          kind: "mortgageCoveredMarker",
          label: "Mortgage fully funded after this paycheck",
          amount: 0,
          cumulativeIncome,
          totalRequired: required,
          isCovered: false,
          shortfall: 0,
        });
      }
    } else {
      event.cumulativeIncome = cumulativeIncome;
      event.totalRequired = required;
      result.push(event);
    }
  }

  // Insert today marker
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (today.getFullYear() === year && today.getMonth() === mo) {
    const idx = result.findIndex(e => e.date > today);
    const marker = {
      date: today,
      kind: "todayMarker",
      label: "Today",
      amount: 0,
      cumulativeIncome: idx > 0 ? result[idx - 1].cumulativeIncome : (idx === -1 ? (result.length > 0 ? result[result.length - 1].cumulativeIncome : 0) : 0),
      totalRequired: required,
      isCovered: false,
      shortfall: 0,
    };
    if (idx >= 0) {
      result.splice(idx, 0, marker);
    } else {
      result.push(marker);
    }
  }

  return result;
}
