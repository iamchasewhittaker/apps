"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/reader", label: "Reader", icon: "📖" },
  { href: "/themes", label: "Themes", icon: "🗂" },
  { href: "/actions", label: "Actions", icon: "✅" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function NavTabs() {
  const path = usePathname();

  return (
    <nav style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      background: "#111",
      borderTop: "1px solid #2e2e2e",
      display: "flex",
      zIndex: 100,
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}>
      {tabs.map((t) => {
        const active = path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "10px 4px 8px",
              textDecoration: "none",
              color: active ? "#7c9cff" : "#777",
              fontSize: 11,
              fontWeight: active ? 600 : 400,
              gap: 3,
            }}
          >
            <span style={{ fontSize: 22 }}>{t.icon}</span>
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
