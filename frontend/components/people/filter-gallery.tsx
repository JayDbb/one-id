"use client"

import React from "react"

import { useRef } from "react"
import {
  Baby,
  Users,
  GraduationCap,
  Briefcase,
  Heart,
  Home,
  Utensils,
  Stethoscope,
  BookOpen,
  Landmark,
  HandCoins,
  UserCheck,
  Accessibility,
  Users2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface FilterCard {
  id: string
  label: string
  icon: React.ElementType
  category: "demographic" | "program"
  color: string
}

export const FILTER_CARDS: FilterCard[] = [
  // Demographics
  { id: "children", label: "Children", icon: Baby, category: "demographic", color: "bg-pink-500" },
  { id: "youth", label: "Youth", icon: GraduationCap, category: "demographic", color: "bg-purple-500" },
  { id: "adults", label: "Adults", icon: Briefcase, category: "demographic", color: "bg-blue-500" },
  { id: "seniors", label: "Seniors", icon: Clock, category: "demographic", color: "bg-amber-500" },
  { id: "single-parents", label: "Single Parents", icon: Heart, category: "demographic", color: "bg-rose-500" },
  { id: "dependents", label: "Dependents", icon: Users2, category: "demographic", color: "bg-indigo-500" },
  { id: "disabled", label: "Disabled", icon: Accessibility, category: "demographic", color: "bg-teal-500" },
  // Programs
  { id: "path", label: "PATH", icon: HandCoins, category: "program", color: "bg-emerald-500" },
  { id: "housing", label: "Housing", icon: Home, category: "program", color: "bg-cyan-500" },
  { id: "employment", label: "Employment", icon: UserCheck, category: "program", color: "bg-orange-500" },
  { id: "food-support", label: "Food Support", icon: Utensils, category: "program", color: "bg-lime-500" },
  { id: "healthcare", label: "Healthcare", icon: Stethoscope, category: "program", color: "bg-red-500" },
  { id: "education", label: "Education", icon: BookOpen, category: "program", color: "bg-violet-500" },
  { id: "pension", label: "Pension", icon: Landmark, category: "program", color: "bg-slate-500" },
  { id: "nht", label: "NHT", icon: Home, category: "program", color: "bg-sky-500" },
  { id: "social-pension", label: "Social Pension", icon: Users, category: "program", color: "bg-fuchsia-500" },
]

interface FilterGalleryProps {
  selectedFilters: string[]
  onFilterToggle: (filterId: string) => void
  recentFilters: string[]
}

export function FilterGallery({ selectedFilters, onFilterToggle, recentFilters }: FilterGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Sort filters: recent ones first, then alphabetically
  const sortedFilters = [...FILTER_CARDS].sort((a, b) => {
    const aRecentIndex = recentFilters.indexOf(a.id)
    const bRecentIndex = recentFilters.indexOf(b.id)
    
    // If both are recent, sort by recency
    if (aRecentIndex !== -1 && bRecentIndex !== -1) {
      return aRecentIndex - bRecentIndex
    }
    // If only a is recent, it comes first
    if (aRecentIndex !== -1) return -1
    // If only b is recent, it comes first
    if (bRecentIndex !== -1) return 1
    // Otherwise, sort alphabetically
    return a.label.localeCompare(b.label)
  })

  return (
    <div className="relative group">
      {/* Left scroll button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-card/95 backdrop-blur-sm border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5 px-1 -mx-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sortedFilters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.id)
          const isRecent = recentFilters.includes(filter.id)
          const Icon = filter.icon

          return (
            <button
              key={filter.id}
              onClick={() => onFilterToggle(filter.id)}
              className={cn(
                "flex-shrink-0 snap-start flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50",
                isRecent && !isSelected && "ring-1 ring-primary/20"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-5 rounded-full transition-colors",
                  isSelected ? filter.color : "bg-muted"
                )}
              >
                <Icon className={cn("size-3", isSelected ? "text-white" : "text-muted-foreground")} />
              </div>
              <span
                className={cn(
                  "text-[11px] font-medium whitespace-nowrap",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              >
                {filter.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Right scroll button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-card/95 backdrop-blur-sm border-border shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
      >
        <ChevronRight className="size-4" />
      </Button>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-card to-transparent pointer-events-none hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-card to-transparent pointer-events-none hidden md:block" />
    </div>
  )
}
