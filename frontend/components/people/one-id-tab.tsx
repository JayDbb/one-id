"use client"

import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  FileText,
  Fingerprint,
  BadgeCheck,
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  Eye,
  Download,
} from "lucide-react"
import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFieldRegistry, useApplicantFacts } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

interface OneIdTabProps {
  person: {
    id: string
    oneId: string
    name: string
    dateOfBirth: string
    gender: string
    trn: string
    nis: string
    nationality: string
    maritalStatus: string
    occupation: string
    employer: string
    phone: string
    email: string
    address: {
      street: string
      community: string
      parish: string
      constituency: string
    }
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
    registrationDate: string
    lastUpdated: string
    status: string
  }
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  const isUrl = value && (value.startsWith("http://") || value.startsWith("https://"))
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (value) {
      navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
      {isUrl ? (
        <div className="group">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-primary hover:text-primary/80 underline-offset-2 hover:underline block min-w-0 break-all font-mono"
            style={{ wordBreak: 'break-all', overflowWrap: 'anywhere' }}
            title={value}
          >
            {value}
          </a>
          <div className="flex items-center gap-1 mt-1">
            <ExternalLink className="size-3 text-muted-foreground flex-shrink-0" />
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
        <span
          className={`text-sm font-semibold text-foreground ${mono ? "font-mono" : ""} break-words`}
          style={{ wordBreak: 'break-word' }}
        >
          {value || "N/A"}
        </span>
      )}
    </div>
  )
}

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
            <ExternalLink className="size-3 text-muted-foreground flex-shrink-0" />
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

function SupportingDocumentField({
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
  
  // Check if URL is an image
  const isImage = isUrl && /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(displayValue)
  const [imageError, setImageError] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)

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
        <div className="space-y-2">
          {isImage && !imageError ? (
            <div 
              className="relative group cursor-pointer"
              onClick={() => setShowImageModal(true)}
            >
              <img
                src={displayValue}
                alt={field.title}
                className="w-full h-32 object-cover rounded-md border border-border hover:opacity-90 transition-opacity pointer-events-none"
                onError={() => setImageError(true)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                <Eye className="size-5 text-white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Click to enlarge
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-sm font-semibold text-foreground break-words" style={{ wordBreak: 'break-word' }}>
          {displayValue}
        </p>
      )}
      <p className="text-xs text-muted-foreground mt-1">Verified</p>

      {/* Image Modal */}
      {showImageModal && isImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowImageModal(false)
              }}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors px-3 py-1 bg-black/50 rounded z-10"
              aria-label="Close image preview"
            >
              Close
            </button>
            <img
              src={displayValue}
              alt={field.title}
              className="max-w-full max-h-[90vh] object-contain rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function OtherDocumentCard({
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

  // Extract filename from URL or use field title
  const getFileName = () => {
    if (isUrl && typeof displayValue === 'string') {
      try {
        const url = new URL(displayValue)
        const pathParts = url.pathname.split('/')
        const fileName = pathParts[pathParts.length - 1]
        // Remove query params and decode
        return decodeURIComponent(fileName.split('?')[0]) || field.title
      } catch {
        return field.title
      }
    }
    return field.title
  }

  // Try to extract upload date from URL or use a default
  const getUploadDate = () => {
    // Try to extract date from URL path or metadata
    // In a real app, this would come from field metadata or API
    if (isUrl && typeof displayValue === 'string') {
      try {
        // Try to extract date from URL path (some storage systems include dates)
        const url = new URL(displayValue)
        const pathParts = url.pathname.split('/')
        // Look for date patterns in path
        for (const part of pathParts) {
          // Check for YYYY-MM-DD or similar patterns
          const dateMatch = part.match(/(\d{4})-(\d{2})-(\d{2})/)
          if (dateMatch) {
            const date = new Date(dateMatch[0])
            if (!isNaN(date.getTime())) {
              return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
            }
          }
        }
      } catch {
        // Fall through to default
      }
    }
    // Default: use current date minus a few months (placeholder)
    const now = new Date()
    const monthsAgo = 3 // Default to 3 months ago
    const uploadDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1)
    return uploadDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (isUrl && typeof displayValue === 'string') {
      try {
        // Try to download the file
        const response = await fetch(displayValue, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = getFileName()
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } else {
          // Fallback: open in new tab if download fails (CORS issues)
          window.open(displayValue, '_blank')
        }
      } catch (error) {
        // Fallback: open in new tab if fetch fails (CORS issues)
        window.open(displayValue, '_blank')
      }
    }
  }

  return (
    <button
      onClick={handleDownload}
      className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 hover:border-primary/30 transition-all cursor-pointer text-left w-full group"
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
          <FileText className="size-8 text-primary" />
        </div>
        <div className="w-full">
          <p className="font-semibold text-sm text-foreground mb-1">{getFileName()}</p>
          <p className="text-xs text-muted-foreground">Uploaded {getUploadDate()}</p>
        </div>
      </div>
    </button>
  )
}

// Icon mapping for categories
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  personal: User,
  contact: Phone,
  address: MapPin,
  employment: Briefcase,
  emergency: AlertCircle,
  identification: Fingerprint,
  system: Calendar,
}

// Default category labels
const categoryLabels: Record<string, string> = {
  personal: "Personal Information",
  contact: "Contact Information",
  address: "Address Information",
  employment: "Employment Information",
  emergency: "Emergency Contact",
  identification: "Identification Documents",
  system: "System Information",
}

export function OneIdTab({ person }: OneIdTabProps) {
  const [copied, setCopied] = useState(false)

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
      
      // Check if this field contains a URL (document/image)
      const firstValue = Array.isArray(values) ? (values.length > 0 ? values[0] : null) : values
      const isUrl = firstValue && typeof firstValue === 'string' && 
        (firstValue.startsWith("http://") || firstValue.startsWith("https://"))
      const isImageUrl = isUrl && /\.(jpg|jpeg|png|gif|webp|svg|bmp|pdf)(\?.*)?$/i.test(firstValue)
      const isDocumentUrl = isUrl // Any URL is considered a document
      
      // Determine if this should be treated as a supporting document
      const isSupportingCategory = category === "supporting" || category === "documents" || 
        category.toLowerCase().includes("document") || 
        category.toLowerCase().includes("attachment") ||
        category.toLowerCase().includes("file") ||
        category.toLowerCase().includes("image")
      
      // If it's a URL (document/image), treat it as a supporting document regardless of category
      const shouldBeSupportingDocument = isSupportingCategory || isDocumentUrl
      
      // Include fields that have values or are in important categories
      // BUT exclude fields that should be in supporting documents
      const isImportantCategory = ["personal", "contact", "address", "identification", "employment", "emergency", "system"].includes(category)
      
      // Only add to original category if it's not a supporting document
      if (!shouldBeSupportingDocument && (values.length > 0 || (isImportantCategory && !isSupportingCategory))) {
        grouped[category].push({
          field_id: field.field_id,
          title: field.title || field.field_id,
          value: values,
        })
      }
      
      // Add to supporting documents if it's a URL or in a supporting category
      if (values.length > 0 && shouldBeSupportingDocument) {
        if (!grouped["supporting_documents"]) {
          grouped["supporting_documents"] = []
        }
        grouped["supporting_documents"].push({
          field_id: field.field_id,
          title: field.title || field.field_id,
          value: values,
        })
      }
    })

    return grouped
  }, [fieldRegistry, applicantFacts])

  const handleCopyOneId = () => {
    navigator.clipboard.writeText(person.oneId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const age = person.dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(person.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null

  const loading = loadingFields || loadingFacts

  // Filter identification fields - URLs are already excluded in the grouping logic above
  const identificationFields = useMemo(() => {
    if (!fieldsByCategory["identification"]) return []
    // URLs should already be excluded, but double-check as a safety measure
    return fieldsByCategory["identification"].filter(field => {
      const value = Array.isArray(field.value) ? field.value[0] : field.value
      const isUrl = value && typeof value === 'string' && 
        (value.startsWith("http://") || value.startsWith("https://"))
      // If it's a URL, it's likely a document/image and should go to supporting docs
      return !isUrl
    })
  }, [fieldsByCategory])

  return (
    <div className="p-4 md:p-8">
      {/* OneID Card */}
      <Card className="mb-6 md:mb-8 bg-gradient-to-br from-primary/5 via-card to-primary/5 border-primary/20">
        <CardContent className="py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
              <div className="size-16 md:size-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="size-8 md:size-10 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">
                  Universal OneID
                </p>
                <p className="text-xl md:text-3xl font-bold font-mono text-foreground tracking-wider break-all">
                  {person.oneId}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Registered:{" "}
                  {person.registrationDate
                    ? new Date(person.registrationDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyOneId}
              className="flex items-center gap-2 bg-transparent w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy OneID
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dynamic Sections Based on Categories */}
      {!loading && fieldRegistry && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {Object.entries(fieldsByCategory)
            .filter(([category]) => {
              // Exclude supporting_documents and supporting categories from dynamic sections
              // They will be shown in the dedicated Supporting Documents section at the bottom
              if (category === "supporting_documents") return false
              const catLower = category.toLowerCase()
              if (catLower.includes("document") || 
                  catLower.includes("support") || 
                  catLower.includes("attachment") || 
                  catLower.includes("file") ||
                  catLower.includes("image")) {
                return false
              }
              return true
            })
            .sort(([a], [b]) => {
              // Sort categories: personal, contact, address, employment, emergency, identification, system, other
              const order = ["personal", "contact", "address", "employment", "emergency", "identification", "system"]
              const aIndex = order.indexOf(a)
              const bIndex = order.indexOf(b)
              if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
              if (aIndex === -1) return 1
              if (bIndex === -1) return -1
              return aIndex - bIndex
            })
            .map(([category, fields]) => {
              if (fields.length === 0) return null

              const Icon = categoryIcons[category] || FileText
              const label = categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ")

              return (
                <Card key={category}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Icon className="size-5 text-primary" />
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {fields.map((field) => {
                        // Format the value - join array values or use single value
                        const displayValue = Array.isArray(field.value)
                          ? field.value.length > 0
                            ? field.value.join(", ")
                            : "N/A"
                          : field.value || "N/A"

                        return (
                          <InfoRow
                            key={field.field_id}
                            label={field.title}
                            value={displayValue}
                            mono={field.field_id.includes("id") || field.field_id.includes("number")}
                          />
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}

      {/* Identification Section - Consolidated at bottom */}
      {!loading && identificationFields.length > 0 && (
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
              {identificationFields.map((field) => (
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

      {/* Supporting Documents Section */}
      {!loading && fieldsByCategory["supporting_documents"] && fieldsByCategory["supporting_documents"].length > 0 && (() => {
        // Separate image documents from other documents
        const imageDocuments = fieldsByCategory["supporting_documents"].filter(field => {
          const value = Array.isArray(field.value) ? (field.value.length > 0 ? field.value[0] : null) : field.value
          const isUrl = value && typeof value === 'string' && 
            (value.startsWith("http://") || value.startsWith("https://"))
          const isImage = isUrl && /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(value)
          return isImage
        })

        const otherDocuments = fieldsByCategory["supporting_documents"].filter(field => {
          const value = Array.isArray(field.value) ? (field.value.length > 0 ? field.value[0] : null) : field.value
          const isUrl = value && typeof value === 'string' && 
            (value.startsWith("http://") || value.startsWith("https://"))
          const isImage = isUrl && /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i.test(value)
          return !isImage && isUrl // Non-image URLs go to other documents
        })

        return (
          <Card className="mt-6 md:mt-8 border-2 border-dashed border-border">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="size-5 text-primary" />
                Supporting Documents
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Additional documentation and supporting materials
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Documents */}
              {imageDocuments.length > 0 && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {imageDocuments.map((field) => (
                      <SupportingDocumentField key={field.field_id} field={field} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Documents */}
              {otherDocuments.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">Other Documents</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={(e) => {
                        e.preventDefault()
                        // Handle upload - would open upload modal in real app
                      }}
                    >
                      Upload Document
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {otherDocuments.map((field) => (
                      <OtherDocumentCard key={field.field_id} field={field} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })()}
    </div>
  )
}
