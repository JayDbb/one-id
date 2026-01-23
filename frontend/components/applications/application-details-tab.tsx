"use client"

import Link from "next/link"
import {
  User,
  Layers,
  Calendar,
  MapPin,
  DollarSign,
  UserCheck,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Application } from "@/lib/mock-data"

interface ApplicationDetailsTabProps {
  application: Application
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "under-review": "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  waitlisted: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
}

export function ApplicationDetailsTab({ application }: ApplicationDetailsTabProps) {
  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JMD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const daysSinceSubmission = () => {
    const submitted = new Date(application.submittedDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - submitted.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Key Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Days Pending</p>
                <p className="text-xl font-bold text-blue-600">{daysSinceSubmission()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex-shrink-0">
                <DollarSign className="size-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Requested</p>
                <p className="text-base sm:text-xl font-bold text-emerald-600 truncate">{formatCurrency(application.requestedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <FileText className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Documents</p>
                <p className="text-xl font-bold text-amber-600">{application.documents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <MessageSquare className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-xl font-bold text-purple-600">{application.notes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicant Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-5 text-blue-600" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                <Link href={`/people/${application.applicantId}`} className="text-sm font-medium hover:text-blue-600 transition-colors">
                  {application.applicantName}
                </Link>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ID</p>
                <p className="text-sm font-mono">{application.applicantId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Division</p>
                <p className="text-sm capitalize">{application.division}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Community</p>
                <p className="text-sm capitalize">{application.community.replace("-", " ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Program Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="size-5 text-blue-600" />
              Program Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Program</p>
                <Link href={`/programs/${application.programId}`} className="text-sm font-medium hover:text-blue-600 transition-colors">
                  {application.programName}
                </Link>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Program ID</p>
                <p className="text-sm font-mono">{application.programId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Requested Amount</p>
                <p className="text-sm font-semibold">{formatCurrency(application.requestedAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Approved Amount</p>
                <p className="text-sm font-semibold">{formatCurrency(application.approvedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Status */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-5 text-blue-600" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                <Badge variant="secondary" className={cn("text-xs font-semibold capitalize", statusStyles[application.status])}>
                  {application.status.replace("-", " ")}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Priority</p>
                <Badge variant="secondary" className="text-xs font-semibold capitalize">
                  {application.priority}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Submitted</p>
                <p className="text-sm">{new Date(application.submittedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Last Updated</p>
                <p className="text-sm">{new Date(application.lastUpdated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCheck className="size-5 text-blue-600" />
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Assigned Officer</p>
              {application.assignedOfficer ? (
                <p className="text-sm font-medium">{application.assignedOfficer}</p>
              ) : (
                <p className="text-sm text-amber-600 font-medium">Unassigned - Requires attention</p>
              )}
            </div>
            
            {/* Notes */}
            {application.notes.length > 0 && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Officer Notes</p>
                <ul className="space-y-2">
                  {application.notes.map((note, index) => (
                    <li key={index} className="text-sm bg-secondary/50 p-2 rounded-lg">
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
