"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  href: string;
  label: string;
  icon: string;
}

export function NavItem({ href, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        className={[
          "flex items-center gap-2.5 px-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors",
          active
            ? "bg-green/10 text-green font-semibold"
            : "text-steel hover:text-white hover:bg-white/5",
        ].join(" ")}
      >
        <span className="text-base leading-none">{icon}</span>
        {label}
      </Link>
    </li>
  );
}
