"use client";

import Link from "next/link";
import { LogoIcon } from "@/components/LogoIcon";
import { NavItem } from "./NavItem";
import { UserPill } from "./UserPill";

const financeNav = [
  { href: "/", label: "Dashboard", icon: "◼" },
  { href: "/categorize", label: "Categorize", icon: "⟳" },
  { href: "/review", label: "Review", icon: "☰" },
];

const systemNav = [
  { href: "/flags", label: "Flags", icon: "⚑" },
  { href: "/settings", label: "Settings", icon: "⚙" },
];

export function Sidebar({ email }: { email: string }) {
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-[240px] bg-surface/80 backdrop-blur-sm border-r border-dimmer flex flex-col py-7 px-4 z-10">
      <Link href="/" className="flex items-center gap-3 px-2 mb-8 pb-6 border-b border-dimmer">
        <LogoIcon size={36} />
        <div className="flex flex-col">
          <span className="font-display text-sm text-white leading-tight">CLARITY BUDGET</span>
          <span className="font-mono-label text-[8px] text-steel mt-1">MONEY COMMAND</span>
        </div>
      </Link>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-steel/60 font-mono-label">
            Finance
          </p>
          <ul className="flex flex-col gap-1">
            {financeNav.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </ul>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider text-steel/60 font-mono-label">
            System
          </p>
          <ul className="flex flex-col gap-1">
            {systemNav.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-dimmer/50">
        <UserPill email={email} />
      </div>
    </nav>
  );
}
