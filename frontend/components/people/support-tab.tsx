"use client"

import { useState, useMemo } from "react"
import {
  TrendingUp,
  FileCheck,
  Clock,
  XCircle,
  CheckCircle,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  FileText,
  CreditCard,
  BadgeCheck,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StatDetailPopup, type StatDetailData } from "./stat-detail-popup"
import { useFieldRegistry, useApplicantFacts } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

const ITEMS_PER_PAGE = 5

interface Program {
  id: string
  name: string
  status: string
  deliveryStatus: "Delivered" | "Partial" | "Pending" | "Not Applicable"
  appliedDate: string
  approvedDate: string | null
  benefitAmount: number | null
  weight: number
}

interface SupportTabProps {
  person: {
    id: string
    programs: Program[]
    submissions: {
      total: number
      completed: number
    }
    approvalRate: number
    impactScore: {
      overall: number
    }
    lastUpdated?: string
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Approved":
      return <CheckCircle className="size-4 text-green-600" />
    case "Pending":
      return <Clock className="size-4 text-amber-600" />
    case "Rejected":
      return <XCircle className="size-4 text-red-600" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700"
    case "Pending":
      return "bg-amber-100 text-amber-700"
    case "Rejected":
      return "bg-red-100 text-red-700"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-amber-600"
  return "text-red-600"
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-amber-500"
  return "bg-red-500"
}

const IMPACT_ITEMS_PER_PAGE = 4

function IdentificationField({
  field,
}: {
  field: { field_id: string; title: string; value: string[] }
}) {
  const displayValue = Array.isArray(field.value)
    ? field.value.length > 0
      ? field.value[0]
      : "N/A"
    : field.value || "N/A"
  
  const isUrl = displayValue && displayValue !== "N/A" && 
    (displayValue.startsWith("http://") || displayValue.startsWith("https://"))
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (displayValue && displayValue !== "N/A") {
      navigator.clipboard.writeText(displayValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {field.title}
        </span>
        <BadgeCheck className="size-4 text-green-600 ml-auto" />
      </div>
      {isUrl ? (
        <div className="group">
          <a
            href={displayValue}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold font-mono text-primary hover:text-primary/80 underline-offset-2 hover:underline block min-w-0 break-all"
            style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
            title={displayValue}
          >
            {displayValue}
          </a>
          <div className="flex items-center gap-1 mt-1">
            <ExternalLink className="size-3 text-muted-foreground shrink-0" />
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded flex items-center"
              title="Copy URL"
            >
              {copied ? (
                <Check className="size-3 text-green-600" />
              ) : (
                <Copy className="size-3 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm font-bold font-mono text-foreground break-words" style={{ wordBreak: 'break-word' }}>
          {displayValue}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">Verified</p>
    </div>
  )
}

export function SupportTab({ person }: SupportTabProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [impactPage, setImpactPage] = useState(1)
  const [selectedDetail, setSelectedDetail] = useState<StatDetailData | null>(null)

  // Fetch field registry and applicant facts
  const { data: fieldRegistry, loading: loadingFields } = useFieldRegistry({
    fields: "field_id,title,type,category",
  })
  const { data: applicantFacts, loading: loadingFacts } = useApplicantFacts({
    user_id: person.id,
  })

  // Group fields by category
  const fieldsByCategory = useMemo(() => {
    if (!fieldRegistry || !applicantFacts) return {}

    // Create a map of field_id to applicant fact value
    const factsMap = new Map<string, string[]>()
    applicantFacts.forEach((fact) => {
      factsMap.set(fact.field_id, fact.value || [])
    })

    // Group fields by category
    const grouped: Record<string, Array<{ field_id: string; title: string; value: string[] }>> = {}
    
    fieldRegistry.forEach((field) => {
      const category = field.category || "other"
      if (!grouped[category]) {
        grouped[category] = []
      }
      
      const values = factsMap.get(field.field_id) || []
      // Include fields that have values or are in important categories (identification, supporting, documents)
      // Also include fields with category names that suggest they might be documents
      const isImportantCategory = ["identification", "supporting", "documents"].includes(category) ||
        category.toLowerCase().includes("document") ||
        category.toLowerCase().includes("attachment") ||
        category.toLowerCase().includes("file")
      
      if (values.length > 0 || isImportantCategory) {
        grouped[category].push({
          field_id: field.field_id,
          title: field.title || field.field_id,
          value: values,
        })
      }
    })

    return grouped
  }, [fieldRegistry, applicantFacts])

  const loading = loadingFields || loadingFacts

  // Debug: Log available categories (remove in production)
  if (process.env.NODE_ENV === 'development' && !loading && fieldRegistry) {
    const categories = new Set(fieldRegistry.map(f => f.category || "other"))
    console.log('Available field categories:', Array.from(categories))
    console.log('Fields by category:', Object.keys(fieldsByCategory))
    console.log('FieldsByCategory object:', fieldsByCategory)
  }

  const approvedPrograms = person.programs.filter(
    (p) => p.status === "Approved"
  )
  const pendingPrograms = person.programs.filter((p) => p.status === "Pending")
  const rejectedPrograms = person.programs.filter((p) => p.status === "Rejected")
  const totalBenefits = approvedPrograms.reduce(
    (sum, p) => sum + (p.benefitAmount || 0),
    0
  )

  // Pagination logic
  const totalPrograms = person.programs.length
  const totalPages = Math.ceil(totalPrograms / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedPrograms = person.programs.slice(startIndex, endIndex)

  // Calculate impact score based on program fulfillment and weights
  const calculateImpactScore = () => {
    const applicablePrograms = person.programs.filter(p => p.status !== "Rejected")
    const totalWeight = applicablePrograms.reduce((sum, p) => sum + p.weight, 0)
    
    let weightedScore = 0
    applicablePrograms.forEach(p => {
      let fulfillmentRate = 0
      if (p.deliveryStatus === "Delivered") fulfillmentRate = 1.0
      else if (p.deliveryStatus === "Partial") fulfillmentRate = 0.5
      else if (p.deliveryStatus === "Pending" && p.status === "Approved") fulfillmentRate = 0.25
      
      weightedScore += (p.weight / totalWeight) * fulfillmentRate * 100
    })
    
    return Math.round(weightedScore)
  }

  const overallImpactScore = calculateImpactScore()

  // Build program-based impact breakdown
  const programImpactBreakdown = person.programs
    .filter(p => p.status === "Approved")
    .map(p => {
      let fulfillmentScore = 0
      if (p.deliveryStatus === "Delivered") fulfillmentScore = 100
      else if (p.deliveryStatus === "Partial") fulfillmentScore = 50
      else if (p.deliveryStatus === "Pending") fulfillmentScore = 25
      
      return {
        id: p.id,
        name: p.name,
        weight: p.weight,
        status: p.status,
        deliveryStatus: p.deliveryStatus,
        fulfillmentScore,
        contributedScore: Math.round((p.weight / person.programs.filter(pr => pr.status === "Approved").reduce((sum, pr) => sum + pr.weight, 0)) * fulfillmentScore),
      }
    })
    .sort((a, b) => b.weight - a.weight)

  // Pagination for impact breakdown
  const totalImpactPages = Math.ceil(programImpactBreakdown.length / IMPACT_ITEMS_PER_PAGE)
  const impactStartIndex = (impactPage - 1) * IMPACT_ITEMS_PER_PAGE
  const impactEndIndex = impactStartIndex + IMPACT_ITEMS_PER_PAGE
  const paginatedImpactPrograms = programImpactBreakdown.slice(impactStartIndex, impactEndIndex)

  const impactBreakdown = [
    { label: "Approved Programs", value: approvedPrograms.length },
    { label: "Pending Programs", value: pendingPrograms.length },
    { label: "Rejected Programs", value: rejectedPrograms.length },
    { label: "Total Benefits", value: totalBenefits },
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <Card 
          className="py-3 md:py-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
          onClick={() => setSelectedDetail({
            title: "Total Programs Applied",
            value: person.programs.length.toString(),
            subtitle: "All program applications",
            description: "Complete list of all programs this person has applied to, including approved, pending, and rejected applications.",
            breakdown: [
              { label: "Approved", value: approvedPrograms.length, percentage: Math.round((approvedPrograms.length / person.programs.length) * 100), color: "bg-emerald-500" },
              { label: "Pending", value: pendingPrograms.length, percentage: Math.round((pendingPrograms.length / person.programs.length) * 100), color: "bg-amber-500" },
              { label: "Rejected", value: rejectedPrograms.length, percentage: Math.round((rejectedPrograms.length / person.programs.length) * 100), color: "bg-red-500" },
            ],
            additionalStats: [
              { label: "First Application", value: "Jul 2023" },
              { label: "Last Application", value: "Jan 2024" },
              { label: "Approval Rate", value: `${person.approvalRate}%` },
              { label: "Avg. Processing", value: "45 days" },
            ],
          })}
        >
          <CardContent className="flex items-center gap-2 md:gap-4">
            <div className="p-2 md:p-3 rounded-xl bg-primary/10">
              <FileCheck className="size-4 md:size-6 text-primary" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                Total Programs
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground">
                {person.programs.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="py-3 md:py-4 cursor-pointer transition-all hover:shadow-md hover:border-emerald-500/30"
          onClick={() => setSelectedDetail({
            title: "Approved Programs",
            value: approvedPrograms.length.toString(),
            subtitle: "Successfully enrolled programs",
            description: "Programs where the application was approved and benefits are being or have been received.",
            programBreakdown: approvedPrograms.map(p => ({
              name: p.name,
              amount: p.benefitAmount || 0,
              status: "approved" as const,
              date: p.approvedDate ? new Date(p.approvedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
              disbursements: p.benefitAmount ? [
                { date: "Jan 15, 2024", amount: Math.round(p.benefitAmount * 0.33) },
                { date: "Dec 15, 2023", amount: Math.round(p.benefitAmount * 0.33) },
                { date: "Nov 15, 2023", amount: Math.round(p.benefitAmount * 0.34) },
              ] : undefined,
            })),
            eligibility: [
              { criterion: "Income eligibility verified", met: true, details: "Below poverty threshold" },
              { criterion: "Residency requirements met", met: true, details: "Confirmed address in constituency" },
              { criterion: "Documentation complete", met: true, details: "All required documents submitted" },
              { criterion: "No duplicate benefits", met: true, details: "Cross-checked with other programs" },
            ],
          })}
        >
          <CardContent className="flex items-center gap-2 md:gap-4">
            <div className="p-2 md:p-3 rounded-xl bg-green-100">
              <CheckCircle className="size-4 md:size-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                Approved
              </p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {approvedPrograms.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="py-3 md:py-4 cursor-pointer transition-all hover:shadow-md hover:border-amber-500/30"
          onClick={() => setSelectedDetail({
            title: "Pending Applications",
            value: pendingPrograms.length.toString(),
            subtitle: "Awaiting review",
            description: "Applications currently being processed or awaiting documentation.",
            programBreakdown: pendingPrograms.map(p => ({
              name: p.name,
              amount: 0,
              status: "pending" as const,
              date: new Date(p.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            })),
            timeline: [
              { date: "Jan 10, 2024", title: "Application submitted", description: "Housing Assistance application received", type: "info" as const },
              { date: "Jan 12, 2024", title: "Documents verified", description: "Identity and income documents confirmed", type: "approved" as const },
              { date: "Pending", title: "Eligibility assessment", description: "Awaiting final review by case worker", type: "pending" as const },
            ],
            additionalStats: [
              { label: "Est. Processing", value: "2-3 weeks" },
              { label: "Queue Position", value: "#47" },
              { label: "Documents", value: "Complete" },
              { label: "Last Updated", value: "Jan 12" },
            ],
          })}
        >
          <CardContent className="flex items-center gap-2 md:gap-4">
            <div className="p-2 md:p-3 rounded-xl bg-amber-100">
              <Clock className="size-4 md:size-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                Pending
              </p>
              <p className="text-xl md:text-2xl font-bold text-amber-600">
                {pendingPrograms.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="py-3 md:py-4 cursor-pointer transition-all hover:shadow-md hover:border-emerald-500/30"
          onClick={() => setSelectedDetail({
            title: "Total Benefits Received",
            value: `$${totalBenefits.toLocaleString()}`,
            subtitle: "Cumulative disbursements",
            description: "Total monetary value of all benefits received from approved programs.",
            programBreakdown: approvedPrograms.filter(p => p.benefitAmount).map(p => ({
              name: p.name,
              amount: p.benefitAmount || 0,
              status: "approved" as const,
              date: p.approvedDate ? new Date(p.approvedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
              disbursements: [
                { date: "Jan 15, 2024", amount: Math.round((p.benefitAmount || 0) * 0.25) },
                { date: "Dec 15, 2023", amount: Math.round((p.benefitAmount || 0) * 0.25) },
                { date: "Nov 15, 2023", amount: Math.round((p.benefitAmount || 0) * 0.25) },
                { date: "Oct 15, 2023", amount: Math.round((p.benefitAmount || 0) * 0.25) },
              ],
            })),
            timeline: [
              { date: "Jan 15, 2024", title: "PATH disbursement", description: "Monthly payment received", type: "payment" as const },
              { date: "Dec 15, 2023", title: "Education Grant", description: "Tuition payment processed", type: "payment" as const },
              { date: "Dec 1, 2023", title: "Housing Assistance", description: "Quarterly housing support", type: "payment" as const },
            ],
            additionalStats: [
              { label: "Monthly Avg.", value: `$${Math.round(totalBenefits / 6).toLocaleString()}` },
              { label: "Next Payment", value: "Feb 15" },
              { label: "Payment Method", value: "Direct" },
              { label: "Active Since", value: "Jul 2023" },
            ],
          })}
        >
          <CardContent className="flex items-center gap-2 md:gap-4">
            <div className="p-2 md:p-3 rounded-xl bg-emerald-100">
              <DollarSign className="size-4 md:size-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                Benefits
              </p>
              <p className="text-xl md:text-2xl font-bold text-emerald-600">
                ${totalBenefits.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Impact Score Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-primary" />
              Impact Score Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Based on program fulfillment and assigned weights
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-secondary rounded-xl">
              <p className="text-sm text-muted-foreground font-medium mb-2">
                Fulfillment Score
              </p>
              <p
                className={cn(
                  "text-5xl font-bold",
                  getScoreColor(overallImpactScore)
                )}
              >
                {overallImpactScore}
              </p>
              <p className="text-xs text-muted-foreground mt-1">out of 100</p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-green-500" />
                Delivered
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-amber-500" />
                Partial
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-blue-500" />
                Pending
              </span>
            </div>

            {/* Program-based Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Approved Programs
                </p>
                {totalImpactPages > 1 && (
                  <p className="text-[10px] text-muted-foreground">
                    {impactStartIndex + 1}-{Math.min(impactEndIndex, programImpactBreakdown.length)} of {programImpactBreakdown.length}
                  </p>
                )}
              </div>
              {paginatedImpactPrograms.map((item) => (
                <div key={item.id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">
                          Weight: {item.weight}
                        </span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                          item.deliveryStatus === "Delivered" && "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
                          item.deliveryStatus === "Partial" && "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
                          item.deliveryStatus === "Pending" && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                        )}>
                          {item.deliveryStatus}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        getScoreColor(item.fulfillmentScore)
                      )}
                    >
                      {item.fulfillmentScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        item.deliveryStatus === "Delivered" && "bg-green-500",
                        item.deliveryStatus === "Partial" && "bg-amber-500",
                        item.deliveryStatus === "Pending" && "bg-blue-500",
                      )}
                      style={{ width: `${item.fulfillmentScore}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {/* Pagination Controls */}
              {totalImpactPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImpactPage((p) => Math.max(1, p - 1))}
                    disabled={impactPage === 1}
                    className="h-7 px-2 text-xs"
                  >
                    <ChevronLeft className="size-3" />
                  </Button>
                  {Array.from({ length: totalImpactPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={impactPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setImpactPage(page)}
                      className={cn(
                        "size-7 p-0 text-xs",
                        impactPage === page && "bg-primary text-primary-foreground"
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setImpactPage((p) => Math.min(totalImpactPages, p + 1))}
                    disabled={impactPage === totalImpactPages}
                    className="h-7 px-2 text-xs"
                  >
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Programs Delivered
                </span>
                <span className="font-bold text-sm text-green-600">
                  {programImpactBreakdown.filter(p => p.deliveryStatus === "Delivered").length} / {programImpactBreakdown.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Approval Rate
                </span>
                <span
                  className={cn(
                    "font-bold text-sm",
                    getScoreColor(person.approvalRate)
                  )}
                >
                  {person.approvalRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Weight (Approved)
                </span>
                <span className="font-mono font-bold text-sm">
                  {programImpactBreakdown.reduce((sum, p) => sum + p.weight, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs List */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck className="size-5 text-primary" />
              Programs Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedPrograms.map((program) => (
                <button
                  type="button"
                  key={program.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 md:p-4 bg-secondary/50 rounded-lg border border-border w-full text-left transition-all hover:shadow-md hover:border-primary/30 cursor-pointer"
                  onClick={() => setSelectedDetail({
                    title: program.name,
                    value: program.benefitAmount ? `$${program.benefitAmount.toLocaleString()}` : "Pending",
                    subtitle: `Status: ${program.status}`,
                    description: `Application for ${program.name} program submitted on ${new Date(program.appliedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`,
                    trend: program.status === "Approved" ? { value: 100, isPositive: true, period: "Approved" } : undefined,
                    applicationId: program.id,
                    programBreakdown: program.benefitAmount ? [{
                      name: program.name,
                      amount: program.benefitAmount,
                      status: program.status.toLowerCase() as "approved" | "pending" | "rejected",
                      date: program.approvedDate 
                        ? new Date(program.approvedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "Pending",
                      disbursements: program.status === "Approved" ? [
                        { date: "Jan 15, 2024", amount: Math.round(program.benefitAmount * 0.25) },
                        { date: "Dec 15, 2023", amount: Math.round(program.benefitAmount * 0.25) },
                        { date: "Nov 15, 2023", amount: Math.round(program.benefitAmount * 0.25) },
                        { date: "Oct 15, 2023", amount: Math.round(program.benefitAmount * 0.25) },
                      ] : undefined,
                    }] : undefined,
                    eligibility: [
                      { criterion: "Income threshold", met: program.status !== "Rejected", details: program.status === "Rejected" ? "Income exceeds program limit" : "Below required threshold" },
                      { criterion: "Age requirement", met: true, details: "Meets age criteria for program" },
                      { criterion: "Residency verified", met: true, details: "Address confirmed in target area" },
                      { criterion: "Documentation complete", met: program.status !== "Pending", details: program.status === "Pending" ? "Awaiting additional documents" : "All documents verified" },
                    ],
                    timeline: [
                      { 
                        date: new Date(program.appliedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), 
                        title: "Application Submitted", 
                        description: "Initial application received and logged", 
                        type: "info" as const 
                      },
                      ...(program.status === "Approved" && program.approvedDate ? [
                        { 
                          date: new Date(program.approvedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), 
                          title: "Application Approved", 
                          description: "All criteria met, benefits authorized", 
                          type: "approved" as const 
                        },
                        ...(program.benefitAmount ? [{ 
                          date: "Monthly", 
                          title: "Benefits Disbursed", 
                          description: `$${Math.round(program.benefitAmount / 4).toLocaleString()} per payment cycle`, 
                          type: "payment" as const 
                        }] : [])
                      ] : []),
                      ...(program.status === "Pending" ? [
                        { 
                          date: "In Progress", 
                          title: "Under Review", 
                          description: "Application being processed by case worker", 
                          type: "pending" as const 
                        }
                      ] : []),
                      ...(program.status === "Rejected" ? [
                        { 
                          date: "Rejected", 
                          title: "Application Denied", 
                          description: "Did not meet eligibility criteria", 
                          type: "rejected" as const 
                        }
                      ] : []),
                    ],
                    additionalStats: [
                      { label: "Program ID", value: program.id.toUpperCase() },
                      { label: "Applied", value: new Date(program.appliedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) },
                      { label: "Processing Time", value: program.approvedDate ? `${Math.round((new Date(program.approvedDate).getTime() - new Date(program.appliedDate).getTime()) / (1000 * 60 * 60 * 24))} days` : "In progress" },
                      { label: "Case Worker", value: "J. Williams" },
                    ],
                  })}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {getStatusIcon(program.status)}
                    <div>
                      <p className="font-semibold text-foreground text-sm sm:text-base">
                        {program.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Applied:{" "}
                        {new Date(program.appliedDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4 pl-7 sm:pl-0">
                    {program.benefitAmount && (
                      <span className="text-sm font-semibold text-emerald-600">
                        ${program.benefitAmount.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={cn(
                        "px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold",
                        getStatusColor(program.status)
                      )}
                    >
                      {program.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
                <p className="text-xs md:text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalPrograms)} of{" "}
                  {totalPrograms} programs
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 px-2 md:px-3"
                  >
                    <ChevronLeft className="size-4" />
                    <span className="hidden sm:inline ml-1">Previous</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "size-8 p-0",
                            currentPage === page &&
                              "bg-primary text-primary-foreground"
                          )}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 px-2 md:px-3"
                  >
                    <span className="hidden sm:inline mr-1">Next</span>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Summary Footer */}
            <div className="mt-4 md:mt-6 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-green-500" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Approved ({approvedPrograms.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-amber-500" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Pending ({pendingPrograms.length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Rejected ({rejectedPrograms.length})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <StatDetailPopup
        isOpen={selectedDetail !== null}
        onClose={() => setSelectedDetail(null)}
        data={selectedDetail}
      />

      {/* Identification Documents Section */}
      {!loading && fieldsByCategory["identification"] && fieldsByCategory["identification"].length > 0 && (
        <Card className="mt-6 md:mt-8 border-2 border-dashed border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Fingerprint className="size-5 text-primary" />
              Identification Documents
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              All government-issued and system identification numbers
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fieldsByCategory["identification"].map((field) => (
                <IdentificationField key={field.field_id} field={field} />
              ))}
            </div>

            {/* ID Verification Status */}
            <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <BadgeCheck className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                    Identity Verified
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    All identification documents have been verified and cross-referenced. Last verification:{" "}
                    {person.lastUpdated
                      ? new Date(person.lastUpdated).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
