"use client"

import { useState, useMemo } from "react"
import {
  BadgeCheck,
  Copy,
  Check,
  ExternalLink,
  User,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useFieldRegistry, useApplicantFacts } from "@/hooks/use-api"
import type { Application } from "@/lib/mock-data"
import type { ApiApplicationDetail } from "@/lib/api-types"

interface ApplicationApplicantInfoTabProps {
  application: Application
  rawDetail: ApiApplicationDetail | null
}

function FieldDisplay({
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
        <FileText className="size-4 text-muted-foreground" />
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

export function ApplicationApplicantInfoTab({ 
  application, 
  rawDetail 
}: ApplicationApplicantInfoTabProps) {
  // Fetch field registry and applicant facts
  const { data: fieldRegistry, loading: loadingFields } = useFieldRegistry({
    fields: "field_id,title,type,category",
  })
  
  // Get applicant ID from rawDetail or application
  const applicantId = rawDetail?.applicantId 
    ? String(rawDetail.applicantId) 
    : application.applicantId

  const { data: applicantFacts, loading: loadingFacts } = useApplicantFacts({
    user_id: applicantId,
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
      // Include fields that have values
      if (values.length > 0) {
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

  // If we have applicantFacts from the application detail, use those as well
  const applicationFacts = useMemo(() => {
    if (!rawDetail?.applicantFacts) return {}
    return rawDetail.applicantFacts
  }, [rawDetail])

  // Merge application facts with applicant facts
  const allFieldsByCategory = useMemo(() => {
    const merged = { ...fieldsByCategory }
    
    // Add fields from application.applicantFacts if available
    if (fieldRegistry && applicationFacts && Object.keys(applicationFacts).length > 0) {
      Object.entries(applicationFacts).forEach(([fieldId, values]) => {
        const field = fieldRegistry.find(f => f.field_id === fieldId)
        if (field) {
          const category = field.category || "other"
          if (!merged[category]) {
            merged[category] = []
          }
          
          // Check if field already exists
          const existingIndex = merged[category].findIndex(f => f.field_id === fieldId)
          const fieldData = {
            field_id: fieldId,
            title: field.title || fieldId,
            value: Array.isArray(values) ? values : [String(values)],
          }
          
          if (existingIndex >= 0) {
            // Merge values if field exists
            merged[category][existingIndex].value = [
              ...merged[category][existingIndex].value,
              ...fieldData.value
            ]
          } else {
            merged[category].push(fieldData)
          }
        }
      })
    }
    
    return merged
  }, [fieldsByCategory, fieldRegistry, applicationFacts])

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  const categories = Object.keys(allFieldsByCategory).sort()

  if (categories.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <User className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm font-medium mb-1">No Applicant Information Available</p>
            <p className="text-xs text-muted-foreground">
              No fields have been collected for this applicant yet.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Applicant Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
              <p className="text-sm font-medium">{application.applicantName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Applicant ID</p>
              <p className="text-sm font-mono">{applicantId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fields by Category */}
      {categories.map((category) => {
        const fields = allFieldsByCategory[category]
        if (fields.length === 0) return null

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-base capitalize">
                {category.replace(/_/g, ' ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <FieldDisplay key={field.field_id} field={field} />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
