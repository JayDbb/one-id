"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Application } from "@/lib/mock-data"

const ITEMS_PER_PAGE = 5

const statusConfig = {
  approved: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  "under-review": { icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  waitlisted: { icon: Clock, color: "text-slate-500", bg: "bg-slate-500/10" },
}

interface ActivityFeedProps {
  applications?: Application[]
}

export function ActivityFeed({ applications = [] }: ActivityFeedProps) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  )
  
  const totalPages = Math.ceil(sortedApplications.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedApps = sortedApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
          <Link 
            href="/applications" 
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="size-3" />
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-border">
        {paginatedApps.map((app) => {
          const config = statusConfig[app.status]
          const StatusIcon = config.icon
          
          return (
            <Link
              key={app.id}
              href={`/applications/${app.id}`}
              className="flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className={cn("p-2 rounded-lg", config.bg)}>
                <StatusIcon className={cn("size-4", config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {app.applicantName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {app.programName}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  "text-xs font-semibold capitalize",
                  config.color
                )}>
                  {app.status.replace("-", " ")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {new Date(app.lastUpdated).toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric" 
                  })}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, sortedApplications.length)} of {sortedApplications.length}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 px-2"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-7 px-2"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
