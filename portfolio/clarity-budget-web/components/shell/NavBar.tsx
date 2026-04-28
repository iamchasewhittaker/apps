"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/constants";
import { UserMenu } from "./UserMenu";

const LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Dashboard" },
  { href: "/categorize", label: "Categorize" },
  { href: "/review", label: "Review" },
  { href: "/settings", label: "Settings" },
];

export function NavBar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <nav
      style={{
        borderBottom: `1px solid ${T.border}`,
        background: T.surface,
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ fontWeight: 600, color: T.text, fontSize: 15 }}>Clarity Budget</div>
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {LINKS.map((link) => {
          const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 13,
                color: active ? T.text : T.muted,
                background: active ? T.bg : "transparent",
                textDecoration: "none",
                border: active ? `1px solid ${T.border}` : "1px solid transparent",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <UserMenu email={email} />
    </nav>
  );
}
