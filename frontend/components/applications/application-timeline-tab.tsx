"use client"

import React from "react"

import {
  FileText,
  CheckCircle,
  Clock,
  UserCheck,
  MessageSquare,
  Upload,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Application } from "@/lib/mock-data"

interface ApplicationTimelineTabProps {
  application: Application
}

interface TimelineEvent {
  id: string
  type: "submitted" | "assigned" | "document" | "note" | "review" | "decision"
  title: string
  description: string
  timestamp: string
  user?: string
}

// Generate mock timeline based on application data
function generateTimeline(application: Application): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "submitted",
      title: "Application Submitted",
      description: `Application for ${application.programName} was submitted successfully.`,
      timestamp: application.submittedDate,
    },
  ]

  // Add document events
  application.documents.forEach((doc, index) => {
    if (doc.status === "verified") {
      events.push({
        id: `doc-${index}`,
        type: "document",
        title: "Document Verified",
        description: `${doc.name} has been verified.`,
        timestamp: new Date(new Date(application.submittedDate).getTime() + (index + 1) * 86400000).toISOString(),
        user: application.assignedOfficer || undefined,
      })
    }
  })

  // Add assignment event if assigned
  if (application.assignedOfficer) {
    events.push({
      id: "assigned",
      type: "assigned",
      title: "Officer Assigned",
      description: `Application assigned to ${application.assignedOfficer} for review.`,
      timestamp: new Date(new Date(application.submittedDate).getTime() + 172800000).toISOString(),
    })
  }

  // Add review event if under review
  if (application.status === "under-review" || application.status === "approved" || application.status === "rejected") {
    events.push({
      id: "review",
      type: "review",
      title: "Review Started",
      description: "Application is being reviewed by the assigned officer.",
      timestamp: new Date(new Date(application.submittedDate).getTime() + 259200000).toISOString(),
      user: application.assignedOfficer || undefined,
    })
  }

  // Add notes as events
  application.notes.forEach((note, index) => {
    events.push({
      id: `note-${index}`,
      type: "note",
      title: "Note Added",
      description: note,
      timestamp: new Date(new Date(application.lastUpdated).getTime() - (application.notes.length - index) * 86400000).toISOString(),
      user: application.assignedOfficer || undefined,
    })
  })

  // Sort by timestamp descending (most recent first)
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const eventIcons: Record<string, { icon: React.ReactNode; bg: string }> = {
  submitted: { icon: <FileText className="size-4" />, bg: "bg-blue-100 text-blue-600 dark:bg-blue-900" },
  assigned: { icon: <UserCheck className="size-4" />, bg: "bg-purple-100 text-purple-600 dark:bg-purple-900" },
  document: { icon: <CheckCircle className="size-4" />, bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900" },
  note: { icon: <MessageSquare className="size-4" />, bg: "bg-amber-100 text-amber-600 dark:bg-amber-900" },
  review: { icon: <Eye className="size-4" />, bg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900" },
  decision: { icon: <CheckCircle className="size-4" />, bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900" },
}

export function ApplicationTimelineTab({ application }: ApplicationTimelineTabProps) {
  const timeline = generateTimeline(application)

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="size-5 text-blue-600" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            
            {/* Events */}
            <div className="space-y-6">
              {timeline.map((event, index) => {
                const { icon, bg } = eventIcons[event.type]
                return (
                  <div key={event.id} className="relative flex gap-4 pl-2">
                    {/* Icon */}
                    <div className={cn("relative z-10 p-2 rounded-full flex-shrink-0", bg)}>
                      {icon}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      {event.user && (
                        <p className="text-xs text-muted-foreground mt-1">
                          By: <span className="font-medium text-foreground">{event.user}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
