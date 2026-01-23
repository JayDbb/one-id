"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  HandCoins,
  Home,
  GraduationCap,
  Stethoscope,
  Package,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  FlaskConical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ProgramFilterItem {
  id: string
  label: string
  icon: React.ReactNode
  category: "category" | "status"
}

const ALL_FILTERS: ProgramFilterItem[] = [
  // Categories
  { id: "cash-transfer", label: "Cash Transfer", icon: <HandCoins className="size-3.5" />, category: "category" },
  { id: "housing", label: "Housing", icon: <Home className="size-3.5" />, category: "category" },
  { id: "education", label: "Education", icon: <GraduationCap className="size-3.5" />, category: "category" },
  { id: "healthcare", label: "Healthcare", icon: <Stethoscope className="size-3.5" />, category: "category" },
  { id: "in-kind", label: "In-Kind Support", icon: <Package className="size-3.5" />, category: "category" },
  { id: "emergency", label: "Emergency", icon: <ShieldAlert className="size-3.5" />, category: "category" },
  
  // Status
  { id: "active", label: "Active", icon: <CheckCircle className="size-3.5" />, category: "status" },
  { id: "pilot", label: "Pilot", icon: <FlaskConical className="size-3.5" />, category: "status" },
  { id: "suspended", label: "Suspended", icon: <PauseCircle className="size-3.5" />, category: "status" },
  { id: "closed", label: "Closed", icon: <PlayCircle className="size-3.5" />, category: "status" },
]

interface ProgramFiltersProps {
  activeFilters: string[]
  onFilterToggle: (filterId: string) => void
}

export function ProgramFilters({ activeFilters, onFilterToggle }: ProgramFiltersProps) {
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

  const getCategoryStyles = (category: ProgramFilterItem["category"], isActive: boolean) => {
    if (isActive) {
      return {
        category: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
        status: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
      }[category]
    }
    return {
      category: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-300",
      status: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300",
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
