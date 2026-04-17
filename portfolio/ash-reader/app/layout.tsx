import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavTabs from "@/components/NavTabs";

export const metadata: Metadata = {
  title: "Ash Reader",
  description: "Process your capture system conversation with Ash",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <NavTabs />
        <main style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 80px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
