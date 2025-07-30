import type { Metadata } from "next"
import BreakpointHelper from "./ui/global/breakpoint-helper"
import "./globals.css"

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
      <body className={`antialiased`}>
        {children}
        <BreakpointHelper />
      </body>
    </html>
  )
}
