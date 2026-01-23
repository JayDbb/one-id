import React from "react"
import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/sidebar-context'

const publicSans = Public_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: 'Admin Panel - Registry System',
  description: 'Constituency management and registry system',
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${publicSans.className} antialiased overflow-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <TopNav />
                {children}
              </main>
            </div>
          </SidebarProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
