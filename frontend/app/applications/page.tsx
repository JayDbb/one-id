"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { ApplicationsHeader } from "@/components/applications/applications-header"
import { ApplicationsStats } from "@/components/applications/applications-stats"
import { ApplicationFilters } from "@/components/applications/application-filters"
import { ApplicationsTable } from "@/components/applications/applications-table"
import { ApplicationsFooter } from "@/components/applications/applications-footer"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplications } from "@/hooks/use-api"
import type { Application } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function filterApplications(applications: Application[], filters: string[]): Application[] {
  if (filters.length === 0) return applications
  
  return applications.filter((app) => {
    // Status filters
    const statusFilters = filters.filter(f => 
      ["pending", "under-review", "approved", "rejected", "waitlisted"].includes(f)
    )
    
    // Priority filters
    const priorityFilters = filters.filter(f => 
      ["urgent", "high", "medium", "low"].includes(f)
    )
    
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(app.status)
    const matchesPriority = priorityFilters.length === 0 || priorityFilters.includes(app.priority)
    
    return matchesStatus && matchesPriority
  })
}

export default function ApplicationsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [applicationsListExpanded, setApplicationsListExpanded] = useState(true)
  
  // Map frontend filters to API query params
  const statusFilter = activeFilters.find(f => 
    ["pending", "under-review", "approved", "rejected", "waitlisted"].includes(f)
  )
  
  // Memoize API filters to prevent infinite loops
  const apiFilters = useMemo(() => ({
    status: statusFilter,
    limit: 100, // Get more for client-side filtering
  }), [statusFilter])
  
  const { data: applications, loading, error } = useApplications(apiFilters)
  
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const filteredApplications = useMemo(() => {
    if (!applications) return []
    return filterApplications(applications, activeFilters)
  }, [applications, activeFilters])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!applications) {
      return {
        totalApplications: 0,
        pending: 0,
        underReview: 0,
        approved: 0,
        rejected: 0,
        waitlisted: 0,
        avgProcessingDays: 0,
        urgentCount: 0,
      }
    }
    
    const pending = applications.filter(a => a.status === "pending").length
    const underReview = applications.filter(a => a.status === "under-review").length
    const approved = applications.filter(a => a.status === "approved").length
    const rejected = applications.filter(a => a.status === "rejected").length
    const waitlisted = applications.filter(a => a.status === "waitlisted").length
    const urgentCount = applications.filter(a => a.priority === "urgent").length
    
    return {
      totalApplications: applications.length,
      pending,
      underReview,
      approved,
      rejected,
      waitlisted,
      avgProcessingDays: 8, // Default - not available in API
      urgentCount,
    }
  }, [applications])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-red-500 mb-4">Error loading applications: {error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ApplicationsHeader 
        totalApplications={applications?.length || 0} 
        pendingApplications={stats.pending + stats.underReview} 
      />
      
      {/* Summary Section - Collapsible */}
      <div className="border-b border-border flex-shrink-0">
        <button
          type="button"
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-secondary/20 hover:bg-secondary/30 transition-colors"
        >
          <span className="text-sm font-medium text-muted-foreground">Summary Overview</span>
          <ChevronDown 
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !summaryExpanded && "-rotate-90"
            )} 
          />
        </button>
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          summaryExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 md:px-8 py-4 bg-secondary/10">
            {loading ? (
              <Skeleton className="h-48" />
            ) : (
              <ApplicationsStats stats={stats} />
            )}
          </div>
        </div>
      </div>

      {/* Applications List Section - Collapsible */}
      <div className="flex flex-col flex-shrink-0">
        <button
          type="button"
          onClick={() => setApplicationsListExpanded(!applicationsListExpanded)}
          className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-card border-b border-border hover:bg-secondary/30 transition-colors"
        >
          <span className="text-sm font-medium text-muted-foreground">
            Applications Queue ({loading ? '...' : filteredApplications.length} results)
          </span>
          <ChevronDown 
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !applicationsListExpanded && "-rotate-90"
            )} 
          />
        </button>
        <div className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          applicationsListExpanded ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <ApplicationFilters 
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
          />
          {loading ? (
            <div className="p-4">
              <Skeleton className="h-64" />
            </div>
          ) : (
            <>
              <ApplicationsTable applications={filteredApplications} />
              <ApplicationsFooter total={applications?.length || 0} showing={filteredApplications.length} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
