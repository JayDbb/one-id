"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  ListOrdered,
  AlertTriangle,
  Zap,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ApplicationFilterItem {
  id: string
  label: string
  icon: React.ReactNode
  category: "status" | "priority"
}

const ALL_FILTERS: ApplicationFilterItem[] = [
  // Status
  { id: "pending", label: "Pending", icon: <Clock className="size-3.5" />, category: "status" },
  { id: "under-review", label: "Under Review", icon: <Eye className="size-3.5" />, category: "status" },
  { id: "approved", label: "Approved", icon: <CheckCircle className="size-3.5" />, category: "status" },
  { id: "rejected", label: "Rejected", icon: <XCircle className="size-3.5" />, category: "status" },
  { id: "waitlisted", label: "Waitlisted", icon: <ListOrdered className="size-3.5" />, category: "status" },
  
  // Priority
  { id: "urgent", label: "Urgent", icon: <AlertTriangle className="size-3.5" />, category: "priority" },
  { id: "high", label: "High Priority", icon: <Zap className="size-3.5" />, category: "priority" },
  { id: "medium", label: "Medium Priority", icon: <ArrowUp className="size-3.5" />, category: "priority" },
  { id: "low", label: "Low Priority", icon: <Clock className="size-3.5" />, category: "priority" },
]

interface ApplicationFiltersProps {
  activeFilters: string[]
  onFilterToggle: (filterId: string) => void
}

export function ApplicationFilters({ activeFilters, onFilterToggle }: ApplicationFiltersProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      )
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollButtons)
      }
      window.removeEventListener("resize", checkScrollButtons)
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 200
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const getCategoryStyles = (category: ApplicationFilterItem["category"], isActive: boolean) => {
    if (isActive) {
      return {
        status: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
        priority: "bg-amber-600 text-white border-amber-600 hover:bg-amber-700",
      }[category]
    }
    return {
      status: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300",
      priority: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-950 dark:hover:bg-amber-900 dark:border-amber-800 dark:text-amber-300",
    }[category]
  }

  return (
    <div className="relative px-4 md:px-8 py-3 bg-card border-b border-border">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-1 md:pl-2 bg-gradient-to-r from-card via-card to-transparent pr-6">
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full bg-card shadow-md border-border"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-0.5"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {ALL_FILTERS.map((filter) => {
          const isActive = activeFilters.includes(filter.id)
          
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterToggle(filter.id)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200",
                getCategoryStyles(filter.category, isActive)
              )}
            >
              {filter.icon}
              <span className="whitespace-nowrap">{filter.label}</span>
              {isActive && (
                <X className="size-3 ml-0.5 opacity-70" />
              )}
            </button>
          )
        })}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center pr-1 md:pr-2 bg-gradient-to-l from-card via-card to-transparent pl-6">
          <Button
            variant="outline"
            size="icon"
            className="size-7 rounded-full bg-card shadow-md border-border"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
