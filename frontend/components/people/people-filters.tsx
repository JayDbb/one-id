"use client"

import { useState, useEffect } from "react"
import { Filter, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AdvancedFiltersModal,
  type AdvancedFiltersState,
  DEFAULT_FILTERS,
  countActiveFilters,
} from "./advanced-filters-modal"
import { FilterGallery } from "./filter-gallery"

interface PeopleFiltersProps {
  appliedFilters: AdvancedFiltersState
  onFiltersApplied: (filters: AdvancedFiltersState) => void
  activeQuickFilters: string[]
  onQuickFilterToggle: (filterId: string) => void
}

export function PeopleFilters({ 
  appliedFilters, 
  onFiltersApplied,
  activeQuickFilters,
  onQuickFilterToggle,
}: PeopleFiltersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<AdvancedFiltersState>(appliedFilters)

  // Sync local filters with applied filters when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setFilters(appliedFilters)
    }
  }, [isModalOpen, appliedFilters])

  const activeFilterCount = countActiveFilters(appliedFilters)
  const totalActiveFilters = activeFilterCount + activeQuickFilters.length

  const handleApplyFilters = () => {
    onFiltersApplied(filters)
    setIsModalOpen(false)
  }

  const handleClearAll = () => {
    setFilters(DEFAULT_FILTERS)
  }

  const handleClearAllApplied = () => {
    setFilters(DEFAULT_FILTERS)
    onFiltersApplied(DEFAULT_FILTERS)
    // Clear quick filters too
    activeQuickFilters.forEach(id => onQuickFilterToggle(id))
  }

  return (
    <>
      {/* Filter Gallery */}
      <FilterGallery 
        activeFilters={activeQuickFilters}
        onFilterToggle={onQuickFilterToggle}
      />

      {/* Action Bar */}
      <div className="px-4 md:px-8 py-2.5 bg-secondary/30 border-b border-border flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border-border text-muted-foreground hover:bg-card bg-transparent text-xs"
          >
            <Filter className="size-3.5" />
            More Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {totalActiveFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAllApplied}
              className="text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
            >
              <X className="size-3" />
              Clear All ({totalActiveFilters})
            </Button>
          )}
        </div>

        <Button 
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm flex-shrink-0"
        >
          <UserPlus className="size-3.5" />
          <span>Add Person</span>
        </Button>
      </div>

      <AdvancedFiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        onClearAll={handleClearAll}
      />
    </>
  )
}
