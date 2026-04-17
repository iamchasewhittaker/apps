import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shipyard",
  description: "Fleet command for your app portfolio",
};

const navItems = [
  { href: "/", label: "Fleet", icon: "\u2693" },
  { href: "/wip", label: "WIP", icon: "\u{1F6E0}" },
  { href: "/review", label: "Review", icon: "\u{1F50D}" },
  { href: "/learnings", label: "Learnings", icon: "\u{1F4D6}" },
  { href: "/themes", label: "Themes", icon: "\u{1F3A8}" },
  { href: "/portfolio", label: "Portfolio", icon: "\u{1F4CB}" },
  { href: "/linear", label: "Linear", icon: "\u{1F4CA}" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <nav className="fixed left-0 top-0 bottom-0 w-[220px] bg-card border-r border-border flex flex-col py-6 px-4 z-10">
          <div className="flex items-center gap-2 px-2 mb-8">
            <span className="text-2xl">&#9875;</span>
            <span className="text-lg font-semibold text-accent tracking-tight">
              Shipyard
            </span>
          </div>

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted hover:text-foreground hover:bg-border/50 transition-colors"
                >
                  <span className="w-5 text-center text-base">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="ml-[220px] flex-1 p-8 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
