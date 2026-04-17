"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/context";
import { getInboxItems, getTodayLock, getTodayCheck } from "@/lib/store";

const tabs = [
  { href: "/inbox", label: "Capture", icon: "+" },
  { href: "/sort", label: "Sort", icon: "↕" },
  { href: "/today", label: "Today", icon: "▲" },
  { href: "/check", label: "Check", icon: "✓" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { state } = useApp();
  const inboxCount = getInboxItems(state).length;
  const hasLock = !!getTodayLock(state);
  const hasCheck = !!getTodayCheck(state);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          const showBadge = tab.href === "/inbox" && inboxCount > 0;
          const showDot =
            (tab.href === "/today" && hasLock) ||
            (tab.href === "/check" && hasCheck);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors relative ${
                active
                  ? "text-amber-400"
                  : "text-zinc-500 active:text-zinc-300"
              }`}
            >
              <span className="text-2xl leading-none">{tab.icon}</span>
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              {showBadge && (
                <span className="absolute top-1 right-1 bg-amber-500 text-zinc-950 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {inboxCount > 9 ? "9+" : inboxCount}
                </span>
              )}
              {showDot && (
                <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
