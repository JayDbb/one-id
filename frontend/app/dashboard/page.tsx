"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { CoverageMap } from "@/components/dashboard/coverage-map"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ProgramsOverview } from "@/components/dashboard/programs-overview"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  useDashboardStats,
  useApplications,
  usePeople,
  useForms,
} from "@/hooks/use-api"

export default function DashboardPage() {
  const [mapExpanded, setMapExpanded] = useState(true)
  const [insightsExpanded, setInsightsExpanded] = useState(true)

  // Memoize filter objects to prevent infinite loops
  const applicationsFilters = useMemo(() => ({ limit: 20 }), [])
  const peopleFilters = useMemo(() => ({ limit: 1 }), [])

  // Fetch data from API
  const { data: dashboardStats, loading: statsLoading } = useDashboardStats()
  const { data: applications, loading: applicationsLoading } = useApplications(applicationsFilters)
  const { data: people, loading: peopleLoading } = usePeople(peopleFilters)
  const { data: programs, loading: programsLoading } = useForms()

  // Calculate stats from API data (with fallbacks)
  const stats = {
    totalPeople: dashboardStats?.totalApplicants || people?.length || 0,
    totalPrograms: programs?.filter(p => p.status === "active").length || 0,
    totalApplications: dashboardStats?.totalApplications || applications?.length || 0,
    deliveryRate: 85, // Default - not available in API
    peopleChange: 12, // Default - not available in API
    programsChange: 0, // Default - not available in API
    applicationsChange: 24, // Default - not available in API
    deliveryChange: 3, // Default - not available in API
  }

  const lastUpdated = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  const isLoading = statsLoading || applicationsLoading || peopleLoading || programsLoading

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <DashboardHeader lastUpdated={lastUpdated} />

      {/* Stats Overview - Always visible */}
      <div className="flex-shrink-0 px-4 md:px-8 py-6 bg-background border-b border-border">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : (
          <StatsOverview stats={stats} />
        )}
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
              <AlertsPanel applications={applications || []} />
            </div>

            {/* Two-column grid for Activity and Programs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Application Activity
                </h3>
                {applicationsLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <ActivityFeed applications={applications || []} />
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Program Performance
                </h3>
                {programsLoading ? (
                  <Skeleton className="h-64" />
                ) : (
                  <ProgramsOverview programs={programs || []} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
