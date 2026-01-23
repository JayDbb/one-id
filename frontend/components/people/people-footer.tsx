"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PeopleFooterProps {
  total: number
  showing: number
}

export function PeopleFooter({ total, showing }: PeopleFooterProps) {
  return (
    <footer className="bg-card border-t border-border px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">
        Showing 1 to {showing} of {total} results
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-secondary"
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          variant="default"
          size="sm"
          className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold"
        >
          1
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:bg-secondary"
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </footer>
  )
}
