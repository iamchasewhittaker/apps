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
import { ProjectPickerAutoOpen } from "@/components/ProjectPickerAutoOpen";
import type { PickerProject } from "@/components/ProjectPickerModal";
import type { LabelKey } from "@/lib/labels";
import { createServerClient } from "@/lib/supabase";
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
  { href: "/bridge", labelKey: "bridge" },
  { href: "/wip", labelKey: "wip" },
  { href: "/review", labelKey: "review" },
  { href: "/learnings", labelKey: "log" },
  { href: "/themes", labelKey: "charts" },
  { href: "/manifest", labelKey: "manifest" },
  { href: "/portfolio", labelKey: "showcase" },
  { href: "/linear", labelKey: "harbor" },
  { href: "/settings", labelKey: "settings" },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allProjects = await loadAllProjectsForPicker();

  return (
    <html
      lang="en"
      className={`${bigShoulders.variable} ${dmMono.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex">
        <ModeProvider>
          <nav className="fixed left-0 top-0 bottom-0 w-[240px] bg-surface/80 backdrop-blur-sm border-r border-dimmer flex flex-col py-6 px-4 z-10">
            <Link href="/" className="flex items-center gap-3 px-2 mb-10">
              <LogoIcon size={36} />
              <LogoLabel />
            </Link>

            <ul className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <NavItem key={item.href} href={item.href} labelKey={item.labelKey} />
              ))}
            </ul>
          </nav>

          <main className="ml-[240px] flex-1 p-8 overflow-y-auto min-h-screen">
            {children}
          </main>

          <ProjectPickerAutoOpen projects={allProjects} />
        </ModeProvider>
      </body>
    </html>
  );
}

async function loadAllProjectsForPicker(): Promise<PickerProject[]> {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from('projects')
      .select('slug,name,type,family,status')
      .order('name');
    return (data ?? []) as PickerProject[];
  } catch {
    return [];
  }
}
