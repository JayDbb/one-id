"use client"

import { X, MapPin, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

// Jamaica Counties
const REGIONS = [
  { value: "all", label: "All Counties" },
  { value: "cornwall", label: "Cornwall" },
  { value: "middlesex", label: "Middlesex" },
  { value: "surrey", label: "Surrey" },
]

// Jamaica Parishes by County
const PARISHES: Record<string, { value: string; label: string }[]> = {
  all: [{ value: "all", label: "All Parishes" }],
  cornwall: [
    { value: "all", label: "All Parishes" },
    { value: "hanover", label: "Hanover" },
    { value: "st-james", label: "St. James" },
    { value: "trelawny", label: "Trelawny" },
    { value: "westmoreland", label: "Westmoreland" },
  ],
  middlesex: [
    { value: "all", label: "All Parishes" },
    { value: "clarendon", label: "Clarendon" },
    { value: "manchester", label: "Manchester" },
    { value: "st-ann", label: "St. Ann" },
    { value: "st-catherine", label: "St. Catherine" },
    { value: "st-elizabeth", label: "St. Elizabeth" },
    { value: "st-mary", label: "St. Mary" },
  ],
  surrey: [
    { value: "all", label: "All Parishes" },
    { value: "kingston", label: "Kingston" },
    { value: "portland", label: "Portland" },
    { value: "st-andrew", label: "St. Andrew" },
    { value: "st-thomas", label: "St. Thomas" },
  ],
}

// Jamaica Constituencies by Parish
const CONSTITUENCIES: Record<string, { value: string; label: string }[]> = {
  all: [{ value: "all", label: "All Constituencies" }],
  manchester: [
    { value: "all", label: "All Constituencies" },
    { value: "ne-manchester", label: "North East Manchester" },
    { value: "nw-manchester", label: "North West Manchester" },
    { value: "central-manchester", label: "Central Manchester" },
    { value: "s-manchester", label: "South Manchester" },
  ],
  clarendon: [
    { value: "all", label: "All Constituencies" },
    { value: "n-clarendon", label: "North Clarendon" },
    { value: "nw-clarendon", label: "North West Clarendon" },
    { value: "central-clarendon", label: "Central Clarendon" },
    { value: "se-clarendon", label: "South East Clarendon" },
    { value: "sw-clarendon", label: "South West Clarendon" },
  ],
  "st-catherine": [
    { value: "all", label: "All Constituencies" },
    { value: "n-st-catherine", label: "North St. Catherine" },
    { value: "nw-st-catherine", label: "North West St. Catherine" },
    { value: "ne-st-catherine", label: "North East St. Catherine" },
    { value: "central-st-catherine", label: "Central St. Catherine" },
    { value: "s-st-catherine", label: "South St. Catherine" },
    { value: "se-st-catherine", label: "South East St. Catherine" },
    { value: "sw-st-catherine", label: "South West St. Catherine" },
    { value: "e-st-catherine", label: "East St. Catherine" },
    { value: "w-st-catherine", label: "West St. Catherine" },
  ],
  "st-james": [
    { value: "all", label: "All Constituencies" },
    { value: "st-james-central", label: "St. James Central" },
    { value: "st-james-east", label: "St. James East" },
    { value: "st-james-north", label: "St. James North West" },
    { value: "st-james-south", label: "St. James South" },
    { value: "st-james-west-central", label: "St. James West Central" },
  ],
  kingston: [
    { value: "all", label: "All Constituencies" },
    { value: "e-kingston", label: "East Kingston" },
    { value: "w-kingston", label: "West Kingston" },
    { value: "central-kingston", label: "Central Kingston" },
  ],
  "st-andrew": [
    { value: "all", label: "All Constituencies" },
    { value: "e-st-andrew", label: "East St. Andrew" },
    { value: "w-st-andrew", label: "West St. Andrew" },
    { value: "ne-st-andrew", label: "North East St. Andrew" },
    { value: "nw-st-andrew", label: "North West St. Andrew" },
    { value: "se-st-andrew", label: "South East St. Andrew" },
    { value: "sw-st-andrew", label: "South West St. Andrew" },
    { value: "s-st-andrew", label: "South St. Andrew" },
  ],
  portland: [
    { value: "all", label: "All Constituencies" },
    { value: "e-portland", label: "East Portland" },
    { value: "w-portland", label: "West Portland" },
  ],
  "st-thomas": [
    { value: "all", label: "All Constituencies" },
    { value: "e-st-thomas", label: "East St. Thomas" },
    { value: "w-st-thomas", label: "West St. Thomas" },
  ],
  "st-ann": [
    { value: "all", label: "All Constituencies" },
    { value: "n-st-ann", label: "North St. Ann" },
    { value: "s-st-ann", label: "South St. Ann" },
    { value: "nw-st-ann", label: "North West St. Ann" },
    { value: "ne-st-ann", label: "North East St. Ann" },
  ],
  "st-mary": [
    { value: "all", label: "All Constituencies" },
    { value: "c-st-mary", label: "Central St. Mary" },
    { value: "w-st-mary", label: "West St. Mary" },
    { value: "se-st-mary", label: "South East St. Mary" },
  ],
  "st-elizabeth": [
    { value: "all", label: "All Constituencies" },
    { value: "ne-st-elizabeth", label: "North East St. Elizabeth" },
    { value: "sw-st-elizabeth", label: "South West St. Elizabeth" },
    { value: "se-st-elizabeth", label: "South East St. Elizabeth" },
  ],
  westmoreland: [
    { value: "all", label: "All Constituencies" },
    { value: "e-westmoreland", label: "East Westmoreland" },
    { value: "w-westmoreland", label: "West Westmoreland" },
    { value: "c-westmoreland", label: "Central Westmoreland" },
  ],
  hanover: [
    { value: "all", label: "All Constituencies" },
    { value: "e-hanover", label: "East Hanover" },
    { value: "w-hanover", label: "West Hanover" },
  ],
  trelawny: [
    { value: "all", label: "All Constituencies" },
    { value: "n-trelawny", label: "North Trelawny" },
    { value: "s-trelawny", label: "South Trelawny" },
  ],
}

// Divisions by Constituency
const DIVISIONS: Record<string, { value: string; label: string }[]> = {
  all: [{ value: "all", label: "All Divisions" }],
  "ne-manchester": [
    { value: "all", label: "All Divisions" },
    { value: "craighead", label: "Craighead" },
    { value: "walderston", label: "Walderston" },
    { value: "christiana", label: "Christiana" },
  ],
}

// Communities by Division
const COMMUNITIES: Record<string, { value: string; label: string }[]> = {
  all: [{ value: "all", label: "All Communities" }],
  craighead: [
    { value: "all", label: "All Communities" },
    { value: "craighead-proper", label: "Craighead Proper" },
    { value: "bigwoods", label: "Bigwoods" },
    { value: "golden-run", label: "Golden Run" },
    { value: "mother-fleur", label: "Mother Fleur" },
    { value: "carter", label: "Carter" },
    { value: "norway", label: "Norway" },
    { value: "mason-run", label: "Mason Run" },
    { value: "muir-head", label: "Muir Head" },
    { value: "new-road", label: "New Road" },
    { value: "spanish-town-road", label: "Spanish Town Road" },
    { value: "pike-proper", label: "Pike Proper" },
    { value: "bryce", label: "Bryce" },
    { value: "camp-gate", label: "Camp Gate" },
    { value: "dobson", label: "Dobson" },
    { value: "dump", label: "Dump" },
    { value: "sawmill", label: "Sawmill" },
    { value: "ticky-ticky", label: "Ticky Ticky" },
    { value: "coleyville-proper", label: "Coleyville Proper" },
    { value: "butt-up", label: "Butt-up" },
    { value: "top-silent-hill", label: "Top Silent Hill" },
    { value: "africa", label: "Africa" },
    { value: "robins-hall", label: "Robin's Hall" },
    { value: "bilby", label: "Bilby" },
    { value: "malton", label: "Malton" },
    { value: "harry-watch-proper", label: "Harry Watch Proper" },
    { value: "heavy-tree", label: "Heavy Tree" },
    { value: "waterloo", label: "Waterloo" },
    { value: "whitby", label: "Whitby" },
    { value: "john-rock", label: "John Rock" },
    { value: "clones", label: "Clones" },
    { value: "good-intent", label: "Good Intent" },
  ],
  walderston: [
    { value: "all", label: "All Communities" },
    { value: "chudleigh-proper", label: "Chudleigh Proper" },
    { value: "chudleigh-housing-scheme", label: "Chudleigh Housing Scheme" },
    { value: "chudleigh-path", label: "Chudleigh Path" },
    { value: "mackie", label: "Mackie" },
    { value: "fine-grass", label: "Fine Grass" },
    { value: "top-hill-proper", label: "Top Hill Proper" },
    { value: "bakers-hill", label: "Baker's Hill" },
    { value: "cobbla-proper", label: "Cobbla Proper" },
    { value: "west-road", label: "West Road" },
    { value: "village", label: "Village" },
    { value: "dunkley-avenue", label: "Dunkley Avenue" },
    { value: "allison", label: "Allison" },
    { value: "mile-gully", label: "Mile Gully" },
    { value: "walderston-proper", label: "Walderston Proper" },
    { value: "contrivance", label: "Contrivance" },
    { value: "mt-olivet", label: "Mt. Olivet" },
    { value: "wright-town", label: "Wright Town" },
    { value: "comfort-hall", label: "Comfort Hall" },
    { value: "mizpah", label: "Mizpah" },
    { value: "allside", label: "Allside" },
    { value: "cheapside", label: "Cheapside" },
    { value: "chantilly-proper", label: "Chantilly Proper" },
  ],
  christiana: [
    { value: "all", label: "All Communities" },
    { value: "christiana-proper", label: "Christiana Proper" },
    { value: "brontie", label: "Brontie" },
    { value: "cuba", label: "Cuba" },
    { value: "savoy", label: "Savoy" },
    { value: "brockery", label: "Brockery" },
    { value: "job-lane", label: "Job Lane" },
    { value: "lyns-avenue", label: "Lyns Avenue" },
    { value: "mollison", label: "Mollison" },
    { value: "nevermind", label: "Nevermind" },
    { value: "huddersfield", label: "Huddersfield" },
    { value: "logan-avenue", label: "Logan Avenue" },
    { value: "straun", label: "Straun" },
    { value: "wildman-street", label: "Wildman Street" },
    { value: "time-town", label: "Time Town" },
    { value: "spring-ground-proper", label: "Spring Ground Proper" },
    { value: "kyle", label: "Kyle" },
    { value: "top-spring-ground", label: "Top Spring Ground" },
    { value: "hopewell", label: "Hopewell" },
    { value: "bamboo", label: "Bamboo" },
    { value: "providence", label: "Providence" },
    { value: "top-spaulding", label: "Top Spaulding" },
    { value: "george-north", label: "George North" },
    { value: "hibernia-proper", label: "Hibernia Proper" },
    { value: "yonder-pond", label: "Yonder Pond" },
    { value: "big-pond", label: "Big Pond" },
    { value: "williams-piece", label: "Williams Piece" },
    { value: "clonis", label: "Clonis" },
    { value: "devon-proper", label: "Devon Proper" },
    { value: "dunbar", label: "Dunbar" },
    { value: "congo-town", label: "Congo Town" },
    { value: "long-coffee", label: "Long Coffee" },
    { value: "denham-farm", label: "Denham Farm" },
    { value: "halifax", label: "Halifax" },
  ],
}

const OCCUPATIONS = [
  { value: "all", label: "All Occupations" },
  { value: "public-servant", label: "Public Servant" },
  { value: "private-sector", label: "Private Sector" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
]

const MARITAL_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
]

export interface AdvancedFiltersState {
  region: string
  parish: string
  constituency: string
  division: string
  community: string
  neighborhood: string
  ageRange: [number, number]
  gender: "all" | "male" | "female"
  occupation: string
  maritalStatus: string
}

export const DEFAULT_FILTERS: AdvancedFiltersState = {
  region: "middlesex",
  parish: "manchester",
  constituency: "ne-manchester",
  division: "all",
  community: "all",
  neighborhood: "all",
  ageRange: [18, 100],
  gender: "all",
  occupation: "all",
  maritalStatus: "all",
}

export function countActiveFilters(filters: AdvancedFiltersState): number {
  let count = 0
  // Don't count locked filters (region, parish, constituency)
  if (filters.division !== "all") count++
  if (filters.community !== "all") count++
  if (filters.neighborhood !== "all") count++
  if (filters.ageRange[0] !== 18 || filters.ageRange[1] !== 100) count++
  if (filters.gender !== "all") count++
  if (filters.occupation !== "all") count++
  if (filters.maritalStatus !== "all") count++
  return count
}

interface AdvancedFiltersModalProps {
  isOpen: boolean
  onClose: () => void
  filters: AdvancedFiltersState
  onFiltersChange: (filters: AdvancedFiltersState) => void
  onApply: () => void
  onClearAll: () => void
}

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClearAll,
}: AdvancedFiltersModalProps) {
  if (!isOpen) return null

  const availableParishes = PARISHES[filters.region] || PARISHES.all
  const availableConstituencies = CONSTITUENCIES[filters.parish] || CONSTITUENCIES.all
  const availableDivisions = DIVISIONS[filters.constituency] || DIVISIONS.all
  const availableCommunities = COMMUNITIES[filters.division] || COMMUNITIES.all

  const updateFilter = <K extends keyof AdvancedFiltersState>(
    key: K,
    value: AdvancedFiltersState[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    
    // Reset dependent fields when parent changes
    if (key === "region") {
      newFilters.parish = "all"
      newFilters.constituency = "all"
      newFilters.division = "all"
      newFilters.community = "all"
    }
    if (key === "parish") {
      newFilters.constituency = "all"
      newFilters.division = "all"
      newFilters.community = "all"
    }
    if (key === "constituency") {
      newFilters.division = "all"
      newFilters.community = "all"
    }
    if (key === "division") {
      newFilters.community = "all"
    }
    
    onFiltersChange(newFilters)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card w-full max-w-4xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-secondary/50">
          <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              Advanced Filters
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              Refine your results using location and demographic parameters.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-2 gap-12 overflow-y-auto max-h-[70vh]">
          {/* Location Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="size-5 text-primary" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Location Details
              </h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">County</label>
                <Select
                  value={filters.region}
                  onValueChange={(value) => updateFilter("region", value)}
                  disabled
                >
                  <SelectTrigger className="w-full bg-card border-border opacity-60 cursor-not-allowed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Parish</label>
                <Select
                  value={filters.parish}
                  onValueChange={(value) => updateFilter("parish", value)}
                  disabled
                >
                  <SelectTrigger className="w-full bg-card border-border opacity-60 cursor-not-allowed">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParishes.map((parish) => (
                      <SelectItem key={parish.value} value={parish.value}>
                        {parish.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Constituency
                  </label>
                  <Select
                    value={filters.constituency}
                    onValueChange={(value) => updateFilter("constituency", value)}
                    disabled
                  >
                    <SelectTrigger className="w-full bg-card border-border opacity-60 cursor-not-allowed">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableConstituencies.map((constituency) => (
                        <SelectItem key={constituency.value} value={constituency.value}>
                          {constituency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Division</label>
                  <Select
                    value={filters.division}
                    onValueChange={(value) => updateFilter("division", value)}
                  >
                    <SelectTrigger className="w-full bg-card border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDivisions.map((division) => (
                        <SelectItem key={division.value} value={division.value}>
                          {division.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Community</label>
                <Select
                  value={filters.community}
                  onValueChange={(value) => updateFilter("community", value)}
                >
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCommunities.map((community) => (
                      <SelectItem key={community.value} value={community.value}>
                        {community.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Neighborhood
                </label>
                <Select
                  value={filters.neighborhood}
                  onValueChange={(value) => updateFilter("neighborhood", value)}
                >
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Select Neighborhood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="size-5 text-primary" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Demographics
              </h4>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground">
                    Age Range
                  </label>
                  <span className="text-[11px] font-bold text-primary">
                    {filters.ageRange[0]} - {filters.ageRange[1] >= 100 ? "65+" : filters.ageRange[1]}
                  </span>
                </div>
                <Slider
                  value={filters.ageRange}
                  onValueChange={(value) =>
                    updateFilter("ageRange", value as [number, number])
                  }
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-bold px-1">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100+</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Gender</label>
                <div className="flex gap-2">
                  {(["all", "male", "female"] as const).map((gender) => (
                    <label key={gender} className="flex-1">
                      <input
                        type="radio"
                        name="gender"
                        checked={filters.gender === gender}
                        onChange={() => updateFilter("gender", gender)}
                        className="hidden peer"
                      />
                      <div
                        className={cn(
                          "text-center py-2 text-xs font-bold border border-border rounded-lg cursor-pointer transition-all",
                          filters.gender === gender
                            ? "bg-primary text-primary-foreground border-primary"
                            : "hover:bg-secondary"
                        )}
                      >
                        {gender === "all" ? "All" : gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Occupation
                </label>
                <Select
                  value={filters.occupation}
                  onValueChange={(value) => updateFilter("occupation", value)}
                >
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OCCUPATIONS.map((occupation) => (
                      <SelectItem key={occupation.value} value={occupation.value}>
                        {occupation.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Marital Status
                </label>
                <Select
                  value={filters.maritalStatus}
                  onValueChange={(value) => updateFilter("maritalStatus", value)}
                >
                  <SelectTrigger className="w-full bg-card border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MARITAL_STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-border bg-secondary/50 flex items-center justify-between">
          <button
            onClick={onClearAll}
            className="px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear All Filters
          </button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={onApply}
              className="px-8 py-2.5 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
