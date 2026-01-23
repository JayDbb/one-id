"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { ApplicationsHeader } from "@/components/applications/applications-header"
import { ApplicationsStats } from "@/components/applications/applications-stats"
import { ApplicationFilters } from "@/components/applications/application-filters"
import { ApplicationsTable } from "@/components/applications/applications-table"
import { ApplicationsFooter } from "@/components/applications/applications-footer"
import { mockApplications, type Application } from "@/lib/mock-data"
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
  
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const filteredApplications = useMemo(() => {
    return filterApplications(mockApplications, activeFilters)
  }, [activeFilters])

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = mockApplications.filter(a => a.status === "pending").length
    const underReview = mockApplications.filter(a => a.status === "under-review").length
    const approved = mockApplications.filter(a => a.status === "approved").length
    const rejected = mockApplications.filter(a => a.status === "rejected").length
    const waitlisted = mockApplications.filter(a => a.status === "waitlisted").length
    const urgentCount = mockApplications.filter(a => a.priority === "urgent").length
    
    return {
      totalApplications: mockApplications.length,
      pending,
      underReview,
      approved,
      rejected,
      waitlisted,
      avgProcessingDays: 8,
      urgentCount,
    }
  }, [])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ApplicationsHeader 
        totalApplications={mockApplications.length} 
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
            <ApplicationsStats stats={stats} />
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
            Applications Queue ({filteredApplications.length} results)
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
          <ApplicationsTable applications={filteredApplications} />
          <ApplicationsFooter total={mockApplications.length} showing={filteredApplications.length} />
        </div>
      </div>
    </div>
  )
}
