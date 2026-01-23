"use client"

import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { use, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { PersonTabs } from "@/components/people/person-tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { usePerson } from "@/hooks/use-api"
import type { ApiPersonApplication } from "@/lib/api-types"

// Transform API application to Program format for SupportTab
function transformApplicationToProgram(app: ApiPersonApplication) {
  // Map database status to SupportTab status format
  const statusMap: Record<string, string> = {
    'submitted': 'Pending',
    'pending': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'declined': 'Rejected',
    'draft': 'Pending',
  }
  
  const mappedStatus = statusMap[app.status.toLowerCase()] || 'Pending'
  
  return {
    id: String(app.id),
    name: app.formName,
    status: mappedStatus,
    deliveryStatus: mappedStatus === 'Approved' ? 'Pending' as const : 'Not Applicable' as const,
    appliedDate: app.submittedDate,
    approvedDate: app.decisionDate || null,
    benefitAmount: null, // Not available in API
    weight: 10, // Default weight
  }
}

export default function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: person, loading, error, rawDetail } = usePerson(id)
  
  // Transform applications to programs
  const programs = useMemo(() => {
    if (!rawDetail?.applications) return []
    return rawDetail.applications.map(transformApplicationToProgram)
  }, [rawDetail])
  
  // Transform API person data to match PersonTabs expected format
  const personData = person ? {
    id: person.id,
    oneId: `JM-${person.id.toUpperCase()}-2024-001`,
    name: person.name,
    dateOfBirth: "", // Not available in API
    gender: person.gender === "male" ? "Male" : "Female",
    trn: "", // Not available in basic API
    nis: "", // Not available in API
    nationality: "Jamaican", // Default
    maritalStatus: person.maritalStatus || "N/A",
    occupation: person.occupation || "N/A",
    employer: "", // Not available in API
    phone: "", // Not available in API
    email: "", // Not available in API
    address: {
      street: "",
      community: person.community || "",
      parish: "",
      constituency: person.division || "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    registrationDate: "",
    lastUpdated: "",
    status: "Active",
    programs, // Now populated from API applications
    submissions: {
      total: person.submissionRatio.total,
      completed: person.submissionRatio.submitted,
    },
    approvalRate: person.approvalRate,
    impactScore: {
      overall: person.impactScore,
      breakdown: {
        economicNeed: 0,
        socialVulnerability: 0,
        geographicFactor: 0,
        programParticipation: 0,
      },
    },
  } : null

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

  if (error || !person || !personData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">
          {error ? `Error loading person: ${error.message}` : 'Person not found'}
        </p>
        <Link href="/people">
          <Button variant="outline">Back to People</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 bg-card border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/people">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                  {personData.name}
                </h1>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold rounded-full flex-shrink-0">
                  {personData.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                OneID: <span className="font-mono font-medium">{personData.oneId}</span>
              </p>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 sm:ml-auto w-full sm:w-auto flex-shrink-0">
            <Pencil className="size-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      <PersonTabs person={personData} />
    </div>
  )
}
