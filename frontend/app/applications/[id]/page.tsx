"use client"

import { ArrowLeft, UserCheck, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { ApplicationTabs } from "@/components/applications/application-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useApplication } from "@/hooks/use-api"
import { cn } from "@/lib/utils"

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

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: application, loading, error } = useApplication(id)

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-8 py-4 md:py-6">
          <Skeleton className="h-24 mb-4" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">
          {error ? `Error loading application: ${error.message}` : 'Application not found'}
        </p>
        <Link href="/applications">
          <Button variant="outline">Back to Applications</Button>
        </Link>
      </div>
    )
  }

  const canApprove = application.status === "pending" || application.status === "under-review"
  const canReject = application.status === "pending" || application.status === "under-review"

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-blue-50 via-blue-100/50 to-transparent dark:from-blue-950 dark:via-blue-900/50 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <Link href="/applications">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-1"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                  Application {application.id}
                </h1>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs font-semibold capitalize", statusStyles[application.status])}
                >
                  {application.status.replace("-", " ")}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs font-semibold capitalize", priorityStyles[application.priority])}
                >
                  {application.priority}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                <span>
                  Applicant: <Link href={`/people/${application.applicantId}`} className="text-foreground font-medium hover:text-blue-600">{application.applicantName}</Link>
                </span>
                <span>
                  Program: <Link href={`/programs/${application.programId}`} className="text-foreground font-medium hover:text-blue-600">{application.programName}</Link>
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto w-full sm:w-auto flex-shrink-0">
            {canReject && (
              <Button variant="outline" className="flex-1 sm:flex-none text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 bg-transparent">
                <XCircle className="size-4 mr-2" />
                Reject
              </Button>
            )}
            {application.status === "pending" && (
              <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                <Clock className="size-4 mr-2" />
                Start Review
              </Button>
            )}
            {canApprove && (
              <Button className="bg-emerald-600 text-white hover:bg-emerald-700 flex-1 sm:flex-none">
                <UserCheck className="size-4 mr-2" />
                Approve
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <ApplicationTabs application={application} />
    </div>
  )
}
