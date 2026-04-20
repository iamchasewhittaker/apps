import type { Metadata } from "next";
import {
  Big_Shoulders,
  DM_Mono,
  Instrument_Sans,
} from "next/font/google";
import Link from "next/link";
import { LogoIcon } from "@/components/LogoIcon";
import "./globals.css";

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
  weight: ["700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Shipyard — Fleet Command",
  description: "Fleet command for your app portfolio",
};

const navItems = [
  { href: "/", label: "Fleet" },
  { href: "/wip", label: "WIP" },
  { href: "/review", label: "Review" },
  { href: "/learnings", label: "Log" },
  { href: "/themes", label: "Charts" },
  { href: "/portfolio", label: "Showcase" },
  { href: "/linear", label: "Harbor" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${dmMono.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <nav className="fixed left-0 top-0 bottom-0 w-[220px] bg-surface border-r border-dimmer flex flex-col py-6 px-4 z-10">
          <Link href="/" className="flex items-center gap-3 px-2 mb-10">
            <LogoIcon size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl text-white">SHIPYARD</span>
              <span className="font-mono-label text-[9px] text-dim mt-1">
                FLEET COMMAND
              </span>
            </div>
          </Link>

          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md font-mono-label text-[11px] text-dim hover:text-white hover:bg-dimmer/60 transition-colors"
                >
                  <span className="w-4 text-center text-steel">/</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto px-2 pt-6 border-t border-dimmer/60">
            <span className="font-mono-label text-[9px] text-dim">
              44°22&apos;N / 68°12&apos;W
            </span>
          </div>
        </nav>

        <main className="ml-[220px] flex-1 p-8 overflow-y-auto min-h-screen chart-grid">
          {children}
        </main>
      </body>
    </html>
  );
}
