"use client"

import Link from "next/link"
import { AlertTriangle, Clock, UserX, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Application } from "@/lib/mock-data"

interface Alert {
  id: string
  type: "urgent" | "warning" | "info"
  title: string
  description: string
  count: number
  href: string
}

interface AlertsPanelProps {
  applications?: Application[]
}

export function AlertsPanel({ applications = [] }: AlertsPanelProps) {
  const urgentApplications = applications.filter(a => a.priority === "urgent" && a.status === "pending")
  const unassignedApplications = applications.filter(a => !a.assignedOfficer && a.status === "pending")
  const overdueApplications = applications.filter(a => {
    const days = Math.ceil((new Date().getTime() - new Date(a.submittedDate).getTime()) / (1000 * 60 * 60 * 24))
    return days > 14 && a.status === "pending"
  })

  const alerts: Alert[] = [
    {
      id: "urgent",
      type: "urgent",
      title: "Urgent Applications",
      description: "Require immediate attention",
      count: urgentApplications.length,
      href: "/applications?priority=urgent",
    },
    {
      id: "unassigned",
      type: "warning",
      title: "Unassigned Applications",
      description: "Awaiting officer assignment",
      count: unassignedApplications.length,
      href: "/applications?assigned=false",
    },
    {
      id: "overdue",
      type: "info",
      title: "Overdue Reviews",
      description: "Pending for over 14 days",
      count: overdueApplications.length,
      href: "/applications?overdue=true",
    },
  ].filter(alert => alert.count > 0)

  const alertStyles = {
    urgent: {
      border: "border-red-500/30",
      bg: "bg-red-500/10",
      icon: AlertTriangle,
      iconColor: "text-red-500",
    },
    warning: {
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      icon: UserX,
      iconColor: "text-amber-500",
    },
    info: {
      border: "border-blue-500/30",
      bg: "bg-blue-500/10",
      icon: Clock,
      iconColor: "text-blue-500",
    },
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 text-center">
        <div className="p-3 bg-emerald-500/10 rounded-full w-fit mx-auto mb-3">
          <Clock className="size-5 text-emerald-500" />
        </div>
        <p className="text-sm font-medium text-foreground">All caught up!</p>
        <p className="text-xs text-muted-foreground mt-1">No urgent items requiring attention</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const style = alertStyles[alert.type]
        const Icon = style.icon
        
        return (
          <Link
            key={alert.id}
            href={alert.href}
            className={cn(
              "flex items-center gap-3 p-4 rounded-xl border transition-all",
              "hover:shadow-md",
              style.border,
              style.bg
            )}
          >
            <div className={cn("p-2 rounded-lg bg-background/50")}>
              <Icon className={cn("size-4", style.iconColor)} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{alert.title}</p>
              <p className="text-xs text-muted-foreground">{alert.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-lg font-bold", style.iconColor)}>
                {alert.count}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </Link>
        )
      })}
    </div>
  )
}
