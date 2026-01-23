"use client"

import { Activity, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { type Person } from "@/lib/mock-data"

interface PeopleTableProps {
  people: Person[]
}

function getApprovalColor(rate: number) {
  if (rate >= 80) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
  if (rate >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600"
  if (score >= 50) return "text-amber-600"
  return "text-red-600"
}

export function PeopleTable({ people }: PeopleTableProps) {
  return (
    <div className="bg-card">
      <TooltipProvider>
        {/* Mobile card view */}
        <div className="md:hidden divide-y divide-border">
          {people.map((person) => (
            <Link 
              key={person.id}
              href={`/people/${person.id}`}
              className="block px-4 py-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">{person.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-medium tracking-tight uppercase">
                    ID: {person.id}
                  </p>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0",
                    getApprovalColor(person.approvalRate)
                  )}
                >
                  {person.approvalRate}%
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Submissions:</span>
                  <span className="font-mono font-bold">
                    <span className="text-orange-500">{person.submissionRatio.submitted}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-emerald-500">{person.submissionRatio.total}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">Impact:</span>
                  <span className={cn("font-bold", getScoreColor(person.impactScore))}>
                    {person.impactScore}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop table view */}
        <table className="hidden md:table w-full text-left border-separate border-spacing-0">
          <thead className="sticky top-0 bg-secondary/95 backdrop-blur-sm border-b border-border z-10">
            <tr>
              <th className="px-4 lg:px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Full Name
              </th>
              <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                      Submission Ratio
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px]">
                    <p className="font-semibold">Submission Ratio</p>
                    <p className="text-muted-foreground mt-1">Ratio of completed submissions to total applications started</p>
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                      Approval Success
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[220px]">
                    <p className="font-semibold">Approval Success</p>
                    <p className="text-muted-foreground mt-1">Percentage of submitted applications that were successfully approved</p>
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help border-b border-dashed border-muted-foreground/50">
                      Impact Score
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[240px]">
                    <p className="font-semibold">Impact Score</p>
                    <p className="text-muted-foreground mt-1">Composite score based on economic need, social vulnerability, geographic factors, and program participation</p>
                  </TooltipContent>
                </Tooltip>
              </th>
              <th className="px-4 lg:px-8 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {people.map((person) => (
              <tr
                key={person.id}
                className="hover:bg-secondary/50 transition-colors"
              >
                <td className="px-4 lg:px-8 py-5">
                  <Link href={`/people/${person.id}`} className="flex flex-col group">
                    <span className="text-sm font-bold text-foreground leading-none group-hover:text-primary transition-colors">
                      {person.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1 font-medium tracking-tight uppercase">
                      ID: {person.id}
                    </span>
                  </Link>
                </td>
                <td className="px-4 lg:px-6 py-5 text-sm font-bold">
                  <div className="flex items-center gap-0.5 font-mono tracking-wider">
                    <span className="text-orange-500">{person.submissionRatio.submitted}</span>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-emerald-500">{person.submissionRatio.total}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                      getApprovalColor(person.approvalRate)
                    )}
                  >
                    {person.approvalRate}% Approval
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-5">
                  <div className={cn("flex items-center gap-1.5 text-sm font-bold", getScoreColor(person.impactScore))}>
                    {person.impactScore}%
                  </div>
                </td>
                <td className="px-4 lg:px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      asChild
                    >
                      <Link href={`/people/${person.id}`}>
                        <Activity className="size-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      asChild
                    >
                      <Link href={`/people/${person.id}`}>
                        <Pencil className="size-5" />
                      </Link>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TooltipProvider>
    </div>
  )
}
