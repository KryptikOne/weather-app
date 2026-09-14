import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { CATALOG } from "@/cards/registry";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { StoreProvider } from "@/lib/store/StoreProvider";
import "@/app/globals.css";

const nunito = Nunito({ subsets: ["latin"], weight: ["600", "700", "800", "900"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  title: "Weather",
  description: "A personal weather dashboard",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Weather" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${nunito.variable}`}>
      <body>
        <StoreProvider catalog={CATALOG}>
          <MotionProvider>{children}</MotionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
