import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SuppressResizeObserverError } from "@/components/suppress-resize-observer-error"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Host Domain Reseller - Premium Web Hosting & Domain Registration",
  description: "Professional web hosting and domain registration services with 24/7 support and 99.9% uptime guarantee",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SuppressResizeObserverError />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
