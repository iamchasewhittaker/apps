import { UrgencyLevel } from "./types";

export function daysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getUrgency(
  expirationDate: string,
  storage: "fridge" | "freezer",
  warningDays: number = 2
): UrgencyLevel {
  if (storage === "freezer") return "frozen";
  const days = daysUntil(expirationDate);
  if (days < 0) return "expired";
  if (days === 0) return "today";
  if (days <= warningDays) return "soon";
  return "ok";
}

export function urgencyLabel(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "expired":
      return "Expired";
    case "today":
      return "Use Today";
    case "soon":
      return "Use Soon";
    case "ok":
      return "Fresh";
    case "frozen":
      return "Frozen";
  }
}

export function urgencyColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "expired":
      return "text-red-400";
    case "today":
      return "text-orange-400";
    case "soon":
      return "text-yellow-400";
    case "ok":
      return "text-emerald-400";
    case "frozen":
      return "text-sky-400";
  }
}

export function urgencyBg(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "expired":
      return "bg-red-950 border-red-800";
    case "today":
      return "bg-orange-950 border-orange-800";
    case "soon":
      return "bg-yellow-950 border-yellow-800";
    case "ok":
      return "bg-emerald-950 border-emerald-800";
    case "frozen":
      return "bg-sky-950 border-sky-800";
  }
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatDaysLeft(dateStr: string, storage: "fridge" | "freezer"): string {
  if (storage === "freezer") {
    const days = daysUntil(dateStr);
    if (days < 0) return "Expired";
    const months = Math.floor(days / 30);
    if (months > 0) return `~${months}mo left`;
    return `${days}d left`;
  }
  const days = daysUntil(dateStr);
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d left`;
}
