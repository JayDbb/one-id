"use client"

import { useState } from "react"
import {
  MapPin,
  Calendar,
  ChevronDown,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface GeographicSelection {
  county: string
  parish: string
  constituency: string
}

interface NavigationControlsProps {
  geographic: GeographicSelection
  onGeographicChange: (selection: GeographicSelection) => void
  timePeriod: string
  onTimePeriodChange: (period: string) => void
}

const counties = ["Middlesex", "Surrey", "Cornwall"]
const parishes: Record<string, string[]> = {
  Middlesex: ["Manchester", "Kingston", "St. Andrew"],
  Surrey: ["Portland", "St. Thomas", "St. Mary"],
  Cornwall: ["St. James", "Hanover", "Westmoreland"],
}
const constituencies: Record<string, string[]> = {
  Manchester: ["NE Manchester", "NW Manchester", "Central Manchester", "South Manchester"],
  Kingston: ["East Kingston", "West Kingston", "Central Kingston"],
  "St. Andrew": ["NE St. Andrew", "NW St. Andrew", "SE St. Andrew", "SW St. Andrew"],
  Portland: ["East Portland", "West Portland"],
  "St. Thomas": ["East St. Thomas", "West St. Thomas"],
  "St. Mary": ["Central St. Mary", "West St. Mary"],
  "St. James": ["Central St. James", "Montego Bay", "St. James South"],
  Hanover: ["East Hanover", "West Hanover"],
  Westmoreland: ["East Westmoreland", "West Westmoreland"],
}

const timePeriods = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
]

export function NavigationControls({
  geographic,
  onGeographicChange,
  timePeriod,
  onTimePeriodChange,
}: NavigationControlsProps) {
  const [isCountyOpen, setIsCountyOpen] = useState(false)
  const [isParishOpen, setIsParishOpen] = useState(false)
  const [isConstituencyOpen, setIsConstituencyOpen] = useState(false)

  const currentParishes = parishes[geographic.county] || []
  const currentConstituencies = constituencies[geographic.parish] || []

  const handleCountyChange = (county: string) => {
    const newParishes = parishes[county] || []
    const newParish = newParishes[0] || ""
    const newConstituencies = constituencies[newParish] || []
    onGeographicChange({
      county,
      parish: newParish,
      constituency: newConstituencies[0] || "",
    })
  }

  const handleParishChange = (parish: string) => {
    const newConstituencies = constituencies[parish] || []
    onGeographicChange({
      ...geographic,
      parish,
      constituency: newConstituencies[0] || "",
    })
  }

  const handleConstituencyChange = (constituency: string) => {
    onGeographicChange({
      ...geographic,
      constituency,
    })
  }

  const currentTimePeriodLabel = timePeriods.find(t => t.value === timePeriod)?.label || "All Time"

  return (
    <div className="bg-card border-b border-border">
      <div className="px-4 md:px-8 py-3 flex flex-col gap-3">
        {/* Geographic Selection Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
            <MapPin className="size-4" />
            <span className="text-xs font-medium hidden sm:inline">Location:</span>
          </div>
          
          {/* County Dropdown */}
          <DropdownMenu open={isCountyOpen} onOpenChange={setIsCountyOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-medium bg-transparent border-border hover:bg-secondary gap-1.5"
              >
                {geographic.county}
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {counties.map((county) => (
                <DropdownMenuItem
                  key={county}
                  onClick={() => handleCountyChange(county)}
                  className="flex items-center justify-between"
                >
                  {county}
                  {geographic.county === county && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-muted-foreground/50">/</span>

          {/* Parish Dropdown */}
          <DropdownMenu open={isParishOpen} onOpenChange={setIsParishOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs font-medium bg-transparent border-border hover:bg-secondary gap-1.5"
              >
                {geographic.parish}
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {currentParishes.map((parish) => (
                <DropdownMenuItem
                  key={parish}
                  onClick={() => handleParishChange(parish)}
                  className="flex items-center justify-between"
                >
                  {parish}
                  {geographic.parish === parish && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-muted-foreground/50">/</span>

          {/* Constituency Dropdown */}
          <DropdownMenu open={isConstituencyOpen} onOpenChange={setIsConstituencyOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs font-semibold gap-1.5",
                  "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
                )}
              >
                {geographic.constituency}
                <ChevronDown className="size-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {currentConstituencies.map((constituency) => (
                <DropdownMenuItem
                  key={constituency}
                  onClick={() => handleConstituencyChange(constituency)}
                  className="flex items-center justify-between"
                >
                  {constituency}
                  {geographic.constituency === constituency && (
                    <Check className="size-4 text-primary" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Time Period Selection Row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-muted-foreground mr-1">
            <Calendar className="size-4" />
            <span className="text-xs font-medium hidden sm:inline">Period:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {timePeriods.slice(0, 5).map((period) => (
              <Button
                key={period.value}
                variant={timePeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => onTimePeriodChange(period.value)}
                className={cn(
                  "h-7 px-2.5 text-xs",
                  timePeriod === period.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-transparent border-border hover:bg-secondary text-muted-foreground"
                )}
              >
                {period.label}
              </Button>
            ))}
            
            {/* More time options dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs bg-transparent border-border hover:bg-secondary text-muted-foreground"
                >
                  More
                  <ChevronDown className="size-3 ml-1 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {timePeriods.slice(5).map((period) => (
                  <DropdownMenuItem
                    key={period.value}
                    onClick={() => onTimePeriodChange(period.value)}
                    className="flex items-center justify-between"
                  >
                    {period.label}
                    {timePeriod === period.value && (
                      <Check className="size-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-muted-foreground text-xs">
                  Select custom date range...
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
