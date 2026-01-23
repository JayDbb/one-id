"use client"

import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Application } from "@/lib/mock-data"

interface ApplicationsTableProps {
  applications: Application[]
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "under-review": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  waitlisted: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
}

const priorityStyles: Record<string, string> = {
  low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  medium: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  high: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400",
  urgent: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JMD",
      notation: "compact",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const daysSinceSubmission = (date: string) => {
    const submitted = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - submitted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="bg-card px-4 md:px-8">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="w-[240px] text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
              Applicant
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
              Program
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
              Submitted
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right py-4">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => {
            const daysAgo = daysSinceSubmission(app.submittedDate)
            const isOverdue = daysAgo > 14 && app.status === "pending"
            
            return (
              <TableRow
                key={app.id}
                className="group hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50"
              >
                <TableCell className="py-5">
                  <Link href={`/applications/${app.id}`} className="block">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground group-hover:text-blue-600 transition-colors">
                        {app.applicantName}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {app.id}
                      </span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="py-5">
                  <Link href={`/programs/${app.programId}`} className="text-sm hover:text-blue-600 transition-colors">
                    {app.programName}
                  </Link>
                </TableCell>
                <TableCell className="py-5">
                  <Badge variant="secondary" className={cn("text-[10px] font-semibold capitalize", statusStyles[app.status])}>
                    {app.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="py-5">
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {new Date(app.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className={cn(
                      "text-[10px]",
                      isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"
                    )}>
                      {daysAgo} days ago
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-5">
                  <span className="font-semibold text-sm">
                    {formatCurrency(app.requestedAmount)}
                  </span>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
