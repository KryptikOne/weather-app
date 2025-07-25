import type { Metadata } from "next"
import { Nunito_Sans } from "next/font/google"
import BreakpointHelper from "./ui/global/breakpoint-helper"
import "./globals.css"

const nunito_sans = Nunito_Sans({
  variable: "--font-nunito_sans",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
})

export const metadata = {
  title: "Weather ⛈️ ⛈️ ⛈️",
  description: "A configurable weather app using open data",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito_sans.variable} antialiased`}>
        {children}
        <BreakpointHelper />
      </body>
    </html>
  )
}
