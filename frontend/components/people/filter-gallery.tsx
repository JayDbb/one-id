"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Baby,
  Users,
  UserRound,
  Briefcase,
  GraduationCap,
  Home,
  Stethoscope,
  Utensils,
  HandCoins,
  ShieldAlert,
  Accessibility,
  PersonStanding,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartHandshake,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FilterItem {
  id: string
  label: string
  icon: React.ReactNode
  category: "demographics" | "programs" | "special"
}

const ALL_FILTERS: FilterItem[] = [
  // Demographics
  { id: "children", label: "Children (0-12)", icon: <Baby className="size-3.5" />, category: "demographics" },
  { id: "youth", label: "Youth (13-24)", icon: <PersonStanding className="size-3.5" />, category: "demographics" },
  { id: "adults", label: "Adults (25-59)", icon: <UserRound className="size-3.5" />, category: "demographics" },
  { id: "seniors", label: "Senior Citizens (60+)", icon: <Accessibility className="size-3.5" />, category: "demographics" },
  { id: "disabled", label: "Persons with Disabilities", icon: <Accessibility className="size-3.5" />, category: "demographics" },
  { id: "dependents", label: "Dependents & Caregivers", icon: <HeartHandshake className="size-3.5" />, category: "demographics" },
  
  // Support Programs
  { id: "cash-assistance", label: "Cash Assistance", icon: <HandCoins className="size-3.5" />, category: "programs" },
  { id: "employment", label: "Employment & Training", icon: <Briefcase className="size-3.5" />, category: "programs" },
  { id: "education", label: "Education Support", icon: <GraduationCap className="size-3.5" />, category: "programs" },
  { id: "healthcare", label: "Healthcare & Wellness", icon: <Stethoscope className="size-3.5" />, category: "programs" },
  { id: "housing", label: "Housing & Shelter", icon: <Home className="size-3.5" />, category: "programs" },
  { id: "food", label: "Food & Nutrition", icon: <Utensils className="size-3.5" />, category: "programs" },
  
  // Special Focus / Status
  { id: "at-risk", label: "At-Risk Individuals", icon: <ShieldAlert className="size-3.5" />, category: "special" },
  { id: "single-parents", label: "Single Parents", icon: <UserRound className="size-3.5" />, category: "special" },
  { id: "community", label: "Community Support", icon: <Users className="size-3.5" />, category: "special" },
]

const STORAGE_KEY = "filter-gallery-recent"

interface FilterGalleryProps {
  activeFilters: string[]
  onFilterToggle: (filterId: string) => void
}

export function FilterGallery({ activeFilters, onFilterToggle }: FilterGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [recentFilters, setRecentFilters] = useState<string[]>([])

  // Load recent filters from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setRecentFilters(JSON.parse(stored))
      } catch {
        setRecentFilters([])
      }
    }
  }, [])

  // Sort filters: recent first, then alphabetically by category
  const sortedFilters = [...ALL_FILTERS].sort((a, b) => {
    const aRecentIndex = recentFilters.indexOf(a.id)
    const bRecentIndex = recentFilters.indexOf(b.id)
    
    // Both are recent - sort by recency
    if (aRecentIndex !== -1 && bRecentIndex !== -1) {
      return aRecentIndex - bRecentIndex
    }
    // Only a is recent
    if (aRecentIndex !== -1) return -1
    // Only b is recent
    if (bRecentIndex !== -1) return 1
    
    // Neither is recent - sort by category then alphabetically
    const categoryOrder = { demographics: 0, programs: 1, special: 2 }
    if (categoryOrder[a.category] !== categoryOrder[b.category]) {
      return categoryOrder[a.category] - categoryOrder[b.category]
    }
    return a.label.localeCompare(b.label)
  })

  const handleFilterClick = (filterId: string) => {
    // Update recent filters
    const newRecent = [filterId, ...recentFilters.filter(id => id !== filterId)].slice(0, 5)
    setRecentFilters(newRecent)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecent))
    
    onFilterToggle(filterId)
  }

  const checkScroll = () => {
    const container = scrollContainerRef.current
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      )
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScroll)
      window.addEventListener("resize", checkScroll)
    }
    return () => {
      container?.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
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

  const getCategoryStyles = (category: FilterItem["category"], isActive: boolean) => {
    if (isActive) {
      return {
        demographics: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700",
        programs: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
        special: "bg-amber-600 text-white border-amber-600 hover:bg-amber-700",
      }[category]
    }
    return {
      demographics: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300",
      programs: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:hover:bg-emerald-900 dark:border-emerald-800 dark:text-emerald-300",
      special: "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 dark:bg-amber-950 dark:hover:bg-amber-900 dark:border-amber-800 dark:text-amber-300",
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
        {sortedFilters.map((filter) => {
          const isActive = activeFilters.includes(filter.id)
          const isRecent = recentFilters.includes(filter.id)
          
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => handleFilterClick(filter.id)}
              className={cn(
                "flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200",
                getCategoryStyles(filter.category, isActive),
                isRecent && !isActive && "ring-1 ring-offset-1 ring-primary/30"
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
