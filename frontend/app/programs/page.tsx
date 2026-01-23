"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { ProgramsHeader } from "@/components/programs/programs-header"
import { ProgramsStats } from "@/components/programs/programs-stats"
import { ProgramFilters } from "@/components/programs/program-filters"
import { ProgramsTable } from "@/components/programs/programs-table"
import { ProgramsFooter } from "@/components/programs/programs-footer"
import { mockPrograms, type Program } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

function filterPrograms(programs: Program[], filters: string[]): Program[] {
  if (filters.length === 0) return programs
  
  return programs.filter((program) => {
    // Category filters
    const categoryFilters = filters.filter(f => 
      ["cash-transfer", "housing", "education", "healthcare", "in-kind", "emergency"].includes(f)
    )
    
    // Status filters
    const statusFilters = filters.filter(f => 
      ["active", "pilot", "suspended", "closed"].includes(f)
    )
    
    const matchesCategory = categoryFilters.length === 0 || categoryFilters.includes(program.category)
    const matchesStatus = statusFilters.length === 0 || statusFilters.includes(program.status)
    
    return matchesCategory && matchesStatus
  })
}

export default function ProgramsPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [programsListExpanded, setProgramsListExpanded] = useState(true)
  
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const filteredPrograms = useMemo(() => {
    return filterPrograms(mockPrograms, activeFilters)
  }, [activeFilters])

  // Calculate statistics
  const stats = useMemo(() => {
    const activePrograms = filteredPrograms.filter(p => p.status === "active").length
    const totalBudget = filteredPrograms.reduce((sum, p) => sum + p.budget, 0)
    const totalDisbursed = filteredPrograms.reduce((sum, p) => sum + p.disbursed, 0)
    const totalBeneficiaries = filteredPrograms.reduce((sum, p) => sum + p.beneficiaries, 0)
    const avgDeliveryRate = filteredPrograms.length > 0
      ? Math.round(filteredPrograms.reduce((sum, p) => sum + p.deliveryRate, 0) / filteredPrograms.length)
      : 0
    const pendingApplications = filteredPrograms.reduce((sum, p) => sum + p.applicationsPending, 0)
    const totalApproved = filteredPrograms.reduce((sum, p) => sum + p.applicationsApproved, 0)
    const totalRejected = filteredPrograms.reduce((sum, p) => sum + p.applicationsRejected, 0)
    const approvalRate = totalApproved + totalRejected > 0
      ? Math.round((totalApproved / (totalApproved + totalRejected)) * 100)
      : 0
    
    return {
      totalPrograms: filteredPrograms.length,
      activePrograms,
      totalBudget,
      totalDisbursed,
      totalBeneficiaries,
      avgDeliveryRate,
      pendingApplications,
      approvalRate,
    }
  }, [filteredPrograms])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <ProgramsHeader 
        totalPrograms={mockPrograms.length} 
        activePrograms={stats.activePrograms} 
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
            <ProgramsStats stats={stats} />
          </div>
        </div>
      </div>

      {/* Programs List Section - Collapsible */}
      <div className="flex flex-col flex-shrink-0">
        <button
          type="button"
          onClick={() => setProgramsListExpanded(!programsListExpanded)}
          className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-card border-b border-border hover:bg-secondary/30 transition-colors"
        >
          <span className="text-sm font-medium text-muted-foreground">
            Programs Directory ({filteredPrograms.length} results)
          </span>
          <ChevronDown 
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !programsListExpanded && "-rotate-90"
            )} 
          />
        </button>
        <div className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          programsListExpanded ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <ProgramFilters 
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
          />
          <ProgramsTable programs={filteredPrograms} />
          <ProgramsFooter total={mockPrograms.length} showing={filteredPrograms.length} />
        </div>
      </div>
    </div>
  )
}
