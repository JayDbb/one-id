"use client"

import React from "react"

import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Application } from "@/lib/mock-data"

interface ApplicationDocumentsTabProps {
  application: Application
}

const statusStyles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  verified: {
    bg: "bg-emerald-100 dark:bg-emerald-900",
    text: "text-emerald-700 dark:text-emerald-300",
    icon: <CheckCircle className="size-4 text-emerald-600" />,
  },
  pending: {
    bg: "bg-amber-100 dark:bg-amber-900",
    text: "text-amber-700 dark:text-amber-300",
    icon: <Clock className="size-4 text-amber-600" />,
  },
  rejected: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    icon: <XCircle className="size-4 text-red-600" />,
  },
}

export function ApplicationDocumentsTab({ application }: ApplicationDocumentsTabProps) {
  const verifiedCount = application.documents.filter(d => d.status === "verified").length
  const pendingCount = application.documents.filter(d => d.status === "pending").length
  const rejectedCount = application.documents.filter(d => d.status === "rejected").length

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <CheckCircle className="size-4 text-emerald-600" />
          <span className="text-muted-foreground">Verified:</span>
          <span className="font-semibold">{verifiedCount}</span>
        </span>
        <span className="flex items-center gap-2">
          <Clock className="size-4 text-amber-600" />
          <span className="text-muted-foreground">Pending:</span>
          <span className="font-semibold">{pendingCount}</span>
        </span>
        <span className="flex items-center gap-2">
          <XCircle className="size-4 text-red-600" />
          <span className="text-muted-foreground">Rejected:</span>
          <span className="font-semibold">{rejectedCount}</span>
        </span>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {application.documents.map((doc, index) => {
          const status = statusStyles[doc.status]
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", status.bg)}>
                    <FileText className={cn("size-5", status.text)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {status.icon}
                      <Badge variant="secondary" className={cn("text-[10px] font-semibold capitalize", status.bg, status.text)}>
                        {doc.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                    <Eye className="size-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                    <Download className="size-3 mr-1" />
                    Download
                  </Button>
                </div>

                {doc.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="size-3 mr-1" />
                      Verify
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1 text-xs">
                      <XCircle className="size-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Upload Section */}
      <Card className="border-dashed">
        <CardContent className="p-8 text-center">
          <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm font-medium mb-1">Upload Additional Documents</p>
          <p className="text-xs text-muted-foreground mb-4">PDF, JPG, PNG up to 10MB each</p>
          <Button variant="outline">
            Choose Files
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
