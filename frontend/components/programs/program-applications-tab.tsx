"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, FileText, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Program } from "@/lib/mock-data"
import { mockApplications } from "@/lib/mock-data"

interface ProgramApplicationsTabProps {
  program: Program
}

const ITEMS_PER_PAGE = 10

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

export function ProgramApplicationsTab({ program }: ProgramApplicationsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  
  // Filter applications for this program
  const programApplications = mockApplications.filter(app => 
    app.programId === program.id || app.programName === program.code
  )
  
  // If no exact matches, show some sample applications
  const applications = programApplications.length > 0 ? programApplications : mockApplications.slice(0, 8)
  
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(app.status)
    return matchesSearch && matchesStatus
  })
  
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JMD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Filter className="size-4" />
                Status
                {statusFilter.length > 0 && (
                  <Badge variant="secondary" className="ml-1 size-5 p-0 flex items-center justify-center text-[10px]">
                    {statusFilter.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("pending")}
                onCheckedChange={() => toggleStatusFilter("pending")}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("under-review")}
                onCheckedChange={() => toggleStatusFilter("under-review")}
              >
                Under Review
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("approved")}
                onCheckedChange={() => toggleStatusFilter("approved")}
              >
                Approved
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("rejected")}
                onCheckedChange={() => toggleStatusFilter("rejected")}
              >
                Rejected
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("waitlisted")}
                onCheckedChange={() => toggleStatusFilter("waitlisted")}
              >
                Waitlisted
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Pending: <span className="font-semibold text-amber-600">{program.applicationsPending.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            Approved: <span className="font-semibold text-emerald-600">{program.applicationsApproved.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Application
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Submitted
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Assigned To
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((app) => (
              <TableRow key={app.id} className="group hover:bg-secondary/50 cursor-pointer">
                <TableCell>
                  <Link href={`/applications/${app.id}`} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <FileText className="size-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">{app.applicantName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{app.id}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("text-[10px] font-semibold capitalize", statusStyles[app.status])}>
                    {app.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("text-[10px] font-semibold capitalize", priorityStyles[app.priority])}>
                    {app.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(app.submittedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell className="text-sm">
                  {app.assignedOfficer || <span className="text-muted-foreground">Unassigned</span>}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {formatCurrency(app.requestedAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredApplications.length)} of {filteredApplications.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "size-8 p-0",
                  currentPage === page && "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
