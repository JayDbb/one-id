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
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Program } from "@/lib/mock-data"

interface ProgramsTableProps {
  programs: Program[]
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  pilot: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  closed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

const categoryStyles: Record<string, string> = {
  "cash-transfer": "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
  "in-kind": "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
  "education": "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
  "healthcare": "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  "housing": "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  "emergency": "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
}

export function ProgramsTable({ programs }: ProgramsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JMD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  return (
    <div className="bg-card px-4 md:px-8">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-border">
            <TableHead className="w-[300px] text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
              Program
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-4">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right py-4">
              Budget
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right py-4">
              Beneficiaries
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right py-4">
              Pending Apps
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => {
            const budgetUtilization = Math.round((program.disbursed / program.budget) * 100)
            const beneficiaryProgress = Math.round((program.beneficiaries / program.targetBeneficiaries) * 100)
            
            return (
              <TableRow
                key={program.id}
                className="group hover:bg-secondary/50 transition-colors cursor-pointer border-b border-border/50"
              >
                <TableCell className="py-5">
                  <Link href={`/programs/${program.id}`} className="block">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {program.code}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {program.name}
                      </span>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="py-5">
                  <Badge variant="secondary" className={cn("text-[10px] font-semibold uppercase", statusStyles[program.status])}>
                    {program.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-5">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-sm">{formatCurrency(program.budget)}</span>
                    <span className="text-[10px] text-muted-foreground">{budgetUtilization}% used</span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-5">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-sm">{program.beneficiaries.toLocaleString()}</span>
                    <span className="text-[10px] text-muted-foreground">
                      of {program.targetBeneficiaries.toLocaleString()} ({beneficiaryProgress}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right py-5">
                  <span className={cn(
                    "font-semibold text-sm",
                    program.applicationsPending > 1000 ? "text-amber-600" : "text-muted-foreground"
                  )}>
                    {program.applicationsPending.toLocaleString()}
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
