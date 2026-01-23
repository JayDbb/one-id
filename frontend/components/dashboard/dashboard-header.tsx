"use client"

import Image from "next/image"
import { LayoutDashboard, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  lastUpdated: string
}

export function DashboardHeader({ lastUpdated }: DashboardHeaderProps) {
  return (
    <header className="relative flex-shrink-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-border overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Background image with fade effect - hidden on mobile */}
      <div className="absolute right-0 top-0 h-full w-2/5 overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
        <Image
          src="/images/jamaica-aerial.jpg"
          alt="Jamaica aerial view"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
              <LayoutDashboard className="size-6 md:size-7 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Command Center
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Real-time overview of social protection coverage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Last updated: {lastUpdated}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white bg-transparent"
            >
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
