"use client"

import { useState, useMemo, useCallback } from "react"
import { Filter, UserPlus } from "lucide-react"
import { PeopleHeader } from "@/components/people/people-header"
import { StatsDashboard } from "@/components/people/stats-dashboard"
import { PeopleTable } from "@/components/people/people-table"
import { PeopleFooter } from "@/components/people/people-footer"
import { FilterGallery } from "@/components/people/filter-gallery"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePeople } from "@/hooks/use-api"
import type { Person } from "@/lib/mock-data"
import { 
  AdvancedFiltersModal,
  type AdvancedFiltersState, 
  DEFAULT_FILTERS,
  countActiveFilters 
} from "@/components/people/advanced-filters-modal"

function filterPeople(
  people: Person[], 
  filters: AdvancedFiltersState,
  galleryFilters: string[]
): Person[] {
  return people.filter((person) => {
    // Division filter
    if (filters.division !== "all" && person.division !== filters.division) {
      return false
    }
    
    // Community filter
    if (filters.community !== "all" && person.community !== filters.community) {
      return false
    }
    
    // Age range filter - only apply if person has a valid age (> 0)
    if (person.age > 0 && (person.age < filters.ageRange[0] || person.age > filters.ageRange[1])) {
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

    // Gallery demographic filters
    if (galleryFilters.length > 0) {
      const hasAgeFilter = galleryFilters.some(f => 
        ["children", "youth", "adults", "seniors"].includes(f)
      )
      
      if (hasAgeFilter && person.age > 0) {
        let matchesAge = false
        if (galleryFilters.includes("children") && person.age <= 17) matchesAge = true
        if (galleryFilters.includes("youth") && person.age >= 18 && person.age <= 35) matchesAge = true
        if (galleryFilters.includes("adults") && person.age >= 36 && person.age <= 64) matchesAge = true
        if (galleryFilters.includes("seniors") && person.age >= 65) matchesAge = true
        if (!matchesAge) return false
      }

      // Demographic filters
      const demographicFilters = galleryFilters.filter(f => ["single-parents", "dependents", "disabled"].includes(f))
      if (demographicFilters.length > 0) {
        const matchesDemographic = demographicFilters.some(f => {
          if (f === "single-parents") return person.maritalStatus === "single"
          // For demo purposes, dependents and disabled would need additional data fields
          return true
        })
        if (!matchesDemographic) return false
      }

      // Program filters - check if person has programs matching the filter
      const programFilters = galleryFilters.filter(f => 
        ["path", "housing", "employment", "food-support", "healthcare", "education", "pension", "nht", "social-pension"].includes(f)
      )
      if (programFilters.length > 0) {
        // For demo purposes, check if person has any programs
        // In a real implementation, this would check specific program types
        const hasPrograms = person.programs && person.programs.length > 0
        if (!hasPrograms) return false
      }
    }
    
    return true
  })
}

export default function PeoplePage() {
  const [appliedFilters, setAppliedFilters] = useState<AdvancedFiltersState>(DEFAULT_FILTERS)
  const [modalFilters, setModalFilters] = useState<AdvancedFiltersState>(DEFAULT_FILTERS)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGalleryFilters, setSelectedGalleryFilters] = useState<string[]>([])
  const [recentFilters, setRecentFilters] = useState<string[]>([])
  
  // Map frontend filters to API query params
  const apiFilters = useMemo(() => {
    const filters: { division?: string; search?: string; limit?: number } = {
      limit: 100, // Get more for client-side filtering
    }
    
    if (appliedFilters.division !== "all") {
      filters.division = appliedFilters.division
    }
    
    return filters
  }, [appliedFilters])
  
  const { data: people, loading, error } = usePeople(apiFilters)

  const filteredPeople = useMemo(() => {
    if (!people) return []
    return filterPeople(people, appliedFilters, selectedGalleryFilters)
  }, [people, appliedFilters, selectedGalleryFilters])

  const handleFilterToggle = useCallback((filterId: string) => {
    setSelectedGalleryFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId)
      } else {
        setRecentFilters(recent => {
          const newRecent = [filterId, ...recent.filter(id => id !== filterId)].slice(0, 8)
          return newRecent
        })
        return [...prev, filterId]
      }
    })
  }, [])

  const handleOpenModal = () => {
    setModalFilters(appliedFilters)
    setIsModalOpen(true)
  }

  const handleApplyFilters = () => {
    setAppliedFilters(modalFilters)
    setIsModalOpen(false)
  }

  const activeFilterCount = countActiveFilters(appliedFilters)
  const totalQuickFilters = selectedGalleryFilters.length

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <p className="text-red-500 mb-4">Error loading people: {error.message}</p>
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
    <>
      <PeopleHeader totalPeople={filteredPeople.length} />
      <div className="px-4 md:px-8 py-4 bg-secondary/10">
        {loading ? (
          <Skeleton className="h-48" />
        ) : (
          <StatsDashboard stats={stats} />
        )}
      </div>
      
      {/* Combined compact filter bar */}
      <div className="px-4 md:px-8 py-2 bg-card border-b border-border flex items-center gap-2">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider shrink-0">Filters</span>
        <div className="w-px h-4 bg-border shrink-0" />
        <div className="flex-1 min-w-0 overflow-hidden">
          <FilterGallery 
            selectedFilters={selectedGalleryFilters}
            onFilterToggle={handleFilterToggle}
            recentFilters={recentFilters}
          />
        </div>
        
        {totalQuickFilters > 0 && (
          <button 
            onClick={() => setSelectedGalleryFilters([])}
            className="text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors whitespace-nowrap px-1.5 shrink-0"
          >
            Clear
          </button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenModal}
          className="flex items-center gap-1 h-7 text-[11px] text-muted-foreground hover:text-foreground px-2 bg-transparent shrink-0"
        >
          <Filter className="size-3" />
          <span className="hidden sm:inline">More</span>
          {activeFilterCount > 0 && (
            <span className="px-1 py-0.5 bg-primary/10 text-primary rounded text-[9px] font-bold leading-none">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {loading ? (
        <div className="p-4">
          <Skeleton className="h-64" />
        </div>
      ) : (
        <>
          <PeopleTable people={filteredPeople} />
          <PeopleFooter total={people?.length || 0} showing={filteredPeople.length} />
        </>
      )}

      {/* Floating Add Person Button */}
      <Button 
        className="fixed bottom-20 right-6 h-12 px-5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-full flex items-center gap-2 font-semibold z-50"
      >
        <UserPlus className="size-5" />
        Add Person
      </Button>

      <AdvancedFiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={modalFilters}
        onFiltersChange={setModalFilters}
        onApply={handleApplyFilters}
        onClearAll={() => setModalFilters(DEFAULT_FILTERS)}
      />
    </>
  )
}
