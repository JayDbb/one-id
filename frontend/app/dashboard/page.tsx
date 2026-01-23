"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { CoverageMap } from "@/components/dashboard/coverage-map"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ProgramsOverview } from "@/components/dashboard/programs-overview"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { mockPeople, mockPrograms, mockApplications } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const [mapExpanded, setMapExpanded] = useState(true)
  const [insightsExpanded, setInsightsExpanded] = useState(true)

  // Calculate stats from mock data
  const stats = {
    totalPeople: mockPeople.length,
    totalPrograms: mockPrograms.filter(p => p.status === "active").length,
    totalApplications: mockApplications.length,
    deliveryRate: Math.round(
      mockPrograms.reduce((sum, p) => sum + p.deliveryRate, 0) / mockPrograms.length
    ),
    peopleChange: 12,
    programsChange: 0,
    applicationsChange: 24,
    deliveryChange: 3,
  }

  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <DashboardHeader lastUpdated={lastUpdated} />

      {/* Stats Overview - Always visible */}
      <div className="flex-shrink-0 px-4 md:px-8 py-6 bg-background border-b border-border">
        <StatsOverview stats={stats} />
      </div>

      {/* Geographic Coverage Section - Collapsible */}
      <div className="border-b border-border flex-shrink-0">
        <button
          type="button"
          onClick={() => setMapExpanded(!mapExpanded)}
          className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-secondary/20 hover:bg-secondary/30 transition-colors"
        >
          <span className="text-sm font-medium text-muted-foreground">Geographic Coverage</span>
          <ChevronDown 
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !mapExpanded && "-rotate-90"
            )} 
          />
        </button>
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          mapExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 md:px-8 py-4 bg-secondary/10">
            <div className="h-[400px] md:h-[500px] rounded-xl overflow-hidden">
              <CoverageMap />
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section - Collapsible */}
      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={() => setInsightsExpanded(!insightsExpanded)}
          className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-card border-b border-border hover:bg-secondary/30 transition-colors"
        >
          <span className="text-sm font-medium text-muted-foreground">Insights & Activity</span>
          <ChevronDown 
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !insightsExpanded && "-rotate-90"
            )} 
          />
        </button>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          insightsExpanded ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <div className="px-4 md:px-8 py-6 bg-background">
            {/* Alerts */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Attention Required
              </h3>
              <AlertsPanel />
            </div>

            {/* Two-column grid for Activity and Programs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Application Activity
                </h3>
                <ActivityFeed />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Program Performance
                </h3>
                <ProgramsOverview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
