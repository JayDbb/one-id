"use client"

import { useState, useMemo } from "react"
import { ChevronDown } from "lucide-react"
import { PeopleHeader } from "@/components/people/people-header"
import { StatsDashboard } from "@/components/people/stats-dashboard"
import { NavigationControls } from "@/components/people/navigation-controls"
import { PeopleFilters } from "@/components/people/people-filters"
import { PeopleTable } from "@/components/people/people-table"
import { PeopleFooter } from "@/components/people/people-footer"
import { mockPeople, type Person } from "@/lib/mock-data"
import { type AdvancedFiltersState, DEFAULT_FILTERS } from "@/components/people/advanced-filters-modal"
import { cn } from "@/lib/utils"

function filterPeople(people: Person[], filters: AdvancedFiltersState, quickFilters: string[]): Person[] {
  return people.filter((person) => {
    // Division filter
    if (filters.division !== "all" && person.division !== filters.division) {
      return false
    }
    
    // Community filter
    if (filters.community !== "all" && person.community !== filters.community) {
      return false
    }
    
    // Age range filter
    if (person.age < filters.ageRange[0] || person.age > filters.ageRange[1]) {
      return false
    }
    
    // Gender filter
    if (filters.gender !== "all" && person.gender !== filters.gender) {
      return false
    }
    
    // Occupation filter
    if (filters.occupation !== "all" && person.occupation !== filters.occupation) {
      return false
    }
    
    // Marital status filter
    if (filters.maritalStatus !== "all" && person.maritalStatus !== filters.maritalStatus) {
      return false
    }

    // Quick filters
    if (quickFilters.length > 0) {
      // Demographics - Age groups
      const ageFilters = quickFilters.filter(f => ["children", "youth", "adults", "seniors"].includes(f))
      if (ageFilters.length > 0) {
        const matchesAge = ageFilters.some(f => {
          if (f === "children") return person.age <= 12
          if (f === "youth") return person.age >= 13 && person.age <= 24
          if (f === "adults") return person.age >= 25 && person.age <= 59
          if (f === "seniors") return person.age >= 60
          return true
        })
        if (!matchesAge) return false
      }

      // Special focus filters
      const specialFilters = quickFilters.filter(f => ["single-parents", "at-risk", "community"].includes(f))
      if (specialFilters.length > 0) {
        const matchesSpecial = specialFilters.some(f => {
          if (f === "single-parents") return person.maritalStatus === "single"
          // For demo purposes, at-risk and community would need additional data fields
          return true
        })
        if (!matchesSpecial) return false
      }
    }
    
    return true
  })
}

export default function PeoplePage() {
  const [geographic, setGeographic] = useState({
    county: "Middlesex",
    parish: "Manchester",
    constituency: "NE Manchester",
  })
  const [timePeriod, setTimePeriod] = useState("all")
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFiltersState>(DEFAULT_FILTERS)
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([])
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [peopleListExpanded, setPeopleListExpanded] = useState(true)
  
  const handleQuickFilterToggle = (filterId: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    )
  }

  const filteredPeople = useMemo(() => {
    return filterPeople(mockPeople, appliedFilters, activeQuickFilters)
  }, [appliedFilters, activeQuickFilters])

  // Calculate statistics based on filtered data
  const stats = useMemo(() => {
    const avgApprovalRate = filteredPeople.length > 0
      ? Math.round(filteredPeople.reduce((sum, p) => sum + p.approvalRate, 0) / filteredPeople.length)
      : 0
    
    // Simulated data - in real app would come from backend
    const peopleOnSupport = Math.round(filteredPeople.length * 0.68)
    const householdsServed = Math.round(filteredPeople.length * 0.45)
    
    return {
      totalPopulation: filteredPeople.length,
      peopleOnSupport,
      totalBenefitsGiven: filteredPeople.length * 125000, // Avg JMD per person
      avgApprovalRate,
      householdsServed,
      programsActive: 12,
      newRegistrations: Math.round(filteredPeople.length * 0.08),
      coverageRate: 73,
    }
  }, [filteredPeople])

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <PeopleHeader totalPeople={filteredPeople.length} />
      
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
            <StatsDashboard stats={stats} />
          </div>
        </div>
      </div>

      {/* People Directory Section - Collapsible */}
      <div className="flex flex-col flex-shrink-0">
        <button
          type="button"
          onClick={() => setPeopleListExpanded(!peopleListExpanded)}
          className="w-full px-4 md:px-8 py-3 flex items-center justify-between bg-card border-b border-border hover:bg-secondary/30 transition-colors"
        >
          <span className="text-sm font-medium text-muted-foreground">
            People Directory ({filteredPeople.length} results)
          </span>
          <ChevronDown 
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              !peopleListExpanded && "-rotate-90"
            )} 
          />
        </button>
        <div className={cn(
          "flex flex-col transition-all duration-300 ease-in-out",
          peopleListExpanded ? "opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}>
          <NavigationControls
            geographic={geographic}
            onGeographicChange={setGeographic}
            timePeriod={timePeriod}
            onTimePeriodChange={setTimePeriod}
          />
          <PeopleFilters 
            appliedFilters={appliedFilters}
            onFiltersApplied={setAppliedFilters}
            activeQuickFilters={activeQuickFilters}
            onQuickFilterToggle={handleQuickFilterToggle}
          />
          <PeopleTable people={filteredPeople} />
          <PeopleFooter total={mockPeople.length} showing={filteredPeople.length} />
        </div>
      </div>
    </div>
  )
}
