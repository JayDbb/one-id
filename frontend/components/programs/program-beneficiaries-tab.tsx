"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react"
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
import { cn } from "@/lib/utils"
import type { Program } from "@/lib/mock-data"
import { mockPeople } from "@/lib/mock-data"

interface ProgramBeneficiariesTabProps {
  program: Program
}

const ITEMS_PER_PAGE = 10

// Mock beneficiaries data linked to people
const generateBeneficiaries = (program: Program) => {
  return mockPeople.slice(0, 12).map((person, index) => ({
    id: person.id,
    name: person.name,
    division: person.division,
    enrollmentDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    status: index % 5 === 0 ? "suspended" : index % 7 === 0 ? "pending-renewal" : "active",
    lastPayment: new Date(2024, 0, Math.floor(Math.random() * 20) + 1).toISOString(),
    totalReceived: Math.round(Math.random() * 500000) + 50000,
  }))
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  suspended: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  "pending-renewal": "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
}

export function ProgramBeneficiariesTab({ program }: ProgramBeneficiariesTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  const beneficiaries = generateBeneficiaries(program)
  
  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const totalPages = Math.ceil(filteredBeneficiaries.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedBeneficiaries = filteredBeneficiaries.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JMD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-4 md:p-8 space-y-4">
      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search beneficiaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Total: <span className="font-semibold text-foreground">{program.beneficiaries.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            Target: <span className="font-semibold text-foreground">{program.targetBeneficiaries.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Beneficiary
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Division
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Enrolled
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Payment
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Total Received
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBeneficiaries.map((beneficiary) => (
              <TableRow key={beneficiary.id} className="group hover:bg-secondary/50 cursor-pointer">
                <TableCell>
                  <Link href={`/people/${beneficiary.id}`} className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                      <User className="size-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors">{beneficiary.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{beneficiary.id}</p>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={cn("text-[10px] font-semibold capitalize", statusStyles[beneficiary.status])}>
                    {beneficiary.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm capitalize">{beneficiary.division}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(beneficiary.enrollmentDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(beneficiary.lastPayment).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {formatCurrency(beneficiary.totalReceived)}
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
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredBeneficiaries.length)} of {filteredBeneficiaries.length}
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
