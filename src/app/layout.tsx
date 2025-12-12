import { StateContextProvider } from "@/app/context/StateContext"
import type { Metadata } from "next"
import "@/app/globals.css"
import BreakpointHelper from "@/app/ui/global/breakpoint-helper"

export const metadata = {
  title: "Weather ⛈️ ⛈️ ⛈️",
  description: "A configurable weather app using open data"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <StateContextProvider>{children}</StateContextProvider>
        <BreakpointHelper />
      </body>
    </html>
  )
}
