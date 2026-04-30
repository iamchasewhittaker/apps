"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Refrigerator, PlusCircle, Printer } from "lucide-react";

const tabs = [
  { href: "/", icon: Refrigerator, label: "Inventory" },
  { href: "/add", icon: PlusCircle, label: "Add" },
  { href: "/print", icon: Printer, label: "Print" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 px-4 py-2 flex justify-around items-center">
      {tabs.map(({ href, icon: Icon, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              active
                ? "text-emerald-400"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
