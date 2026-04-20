import type { Metadata } from "next";
import {
  Big_Shoulders,
  DM_Mono,
  Instrument_Sans,
} from "next/font/google";
import Link from "next/link";
import { LogoIcon } from "@/components/LogoIcon";
import { LogoLabel } from "@/components/LogoLabel";
import { ModeProvider } from "@/components/ModeProvider";
import { NavItem } from "@/components/NavItem";
import type { LabelKey } from "@/lib/labels";
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

const navItems: { href: string; labelKey: LabelKey }[] = [
  { href: "/", labelKey: "fleet" },
  { href: "/wip", labelKey: "wip" },
  { href: "/review", labelKey: "review" },
  { href: "/learnings", labelKey: "log" },
  { href: "/themes", labelKey: "charts" },
  { href: "/portfolio", labelKey: "showcase" },
  { href: "/linear", labelKey: "harbor" },
  { href: "/settings", labelKey: "settings" },
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
        <ModeProvider>
          <nav className="fixed left-0 top-0 bottom-0 w-[220px] bg-surface border-r border-dimmer flex flex-col py-6 px-4 z-10">
            <Link href="/" className="flex items-center gap-3 px-2 mb-10">
              <LogoIcon size={36} />
              <LogoLabel />
            </Link>

            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavItem key={item.href} href={item.href} labelKey={item.labelKey} />
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
        </ModeProvider>
      </body>
    </html>
  );
}
