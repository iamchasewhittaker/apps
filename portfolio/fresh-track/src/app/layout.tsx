import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AppProvider } from "@/lib/context";
import { BottomNav } from "@/components/nav";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fresh Track",
  description: "Grocery freshness tracker with expiration dates and printable fridge plans",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="h-full bg-zinc-950 text-zinc-50 antialiased">
        <AppProvider>
          <main className="h-full overflow-y-auto pb-20 no-print">
            {children}
          </main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
