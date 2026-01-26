"use client"

import { X, TrendingUp, TrendingDown, Calendar, DollarSign, Users, FileCheck, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface TimelineEvent {
  date: string
  title: string
  description: string
  type: "approved" | "pending" | "rejected" | "info" | "payment"
}

export interface ProgramBreakdownItem {
  name: string
  amount: number
  status: "approved" | "pending" | "rejected"
  date: string
  disbursements?: { date: string; amount: number }[]
}

export interface StatDetailData {
  title: string
  value: string | number
  subtitle?: string
  description?: string
  trend?: { value: number; isPositive: boolean; period: string }
  breakdown?: { label: string; value: number | string; percentage?: number; color?: string }[]
  programBreakdown?: ProgramBreakdownItem[]
  timeline?: TimelineEvent[]
  eligibility?: { criterion: string; met: boolean; details?: string }[]
  additionalStats?: { label: string; value: string | number }[]
  applicationId?: string
}

interface StatDetailPopupProps {
  isOpen: boolean
  onClose: () => void
  data: StatDetailData | null
}

function getTimelineIcon(type: TimelineEvent["type"]) {
  switch (type) {
    case "approved":
      return <CheckCircle className="size-4 text-emerald-600" />
    case "pending":
      return <Clock className="size-4 text-amber-600" />
    case "rejected":
      return <XCircle className="size-4 text-red-600" />
    case "payment":
      return <DollarSign className="size-4 text-primary" />
    default:
      return <FileCheck className="size-4 text-muted-foreground" />
  }
}

function getTimelineDotColor(type: TimelineEvent["type"]) {
  switch (type) {
    case "approved":
      return "bg-emerald-500"
    case "pending":
      return "bg-amber-500"
    case "rejected":
      return "bg-red-500"
    case "payment":
      return "bg-primary"
    default:
      return "bg-muted-foreground"
  }
}

export function StatDetailPopup({ isOpen, onClose, data }: StatDetailPopupProps) {
  if (!isOpen || !data) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-200"
        onClick={onClose}
      />
      
      {/* Popup Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-card border-l border-border shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground truncate">{data.title}</h2>
              {data.subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">{data.subtitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-73px)] px-6 py-6 space-y-6">
          {/* Main Value Display */}
          <div className="bg-secondary/50 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-foreground">{data.value}</p>
            {data.trend && (
              <div className="flex items-center justify-center gap-2 mt-2">
                {data.trend.isPositive ? (
                  <TrendingUp className="size-4 text-emerald-600" />
                ) : (
                  <TrendingDown className="size-4 text-red-500" />
                )}
                <span className={cn(
                  "text-sm font-semibold",
                  data.trend.isPositive ? "text-emerald-600" : "text-red-500"
                )}>
                  {data.trend.isPositive ? "+" : ""}{data.trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">{data.trend.period}</span>
              </div>
            )}
            {data.description && (
              <p className="text-sm text-muted-foreground mt-3">{data.description}</p>
            )}
          </div>

          {/* Breakdown Section */}
          {data.breakdown && data.breakdown.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Breakdown
              </h3>
              <div className="space-y-2">
                {data.breakdown.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      {item.color && (
                        <div className={cn("size-3 rounded-full", item.color)} />
                      )}
                      <span className="text-sm text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                      {item.percentage !== undefined && (
                        <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Program Breakdown Section */}
          {data.programBreakdown && data.programBreakdown.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <FileCheck className="size-4 text-primary" />
                Program Breakdown
              </h3>
              <div className="space-y-3">
                {data.programBreakdown.map((program, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-secondary/30 rounded-lg border border-border space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-foreground">{program.name}</p>
                        <p className="text-xs text-muted-foreground">{program.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">
                          ${program.amount.toLocaleString()}
                        </p>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          program.status === "approved" && "bg-emerald-100 text-emerald-700",
                          program.status === "pending" && "bg-amber-100 text-amber-700",
                          program.status === "rejected" && "bg-red-100 text-red-700"
                        )}>
                          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {program.disbursements && program.disbursements.length > 0 && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Disbursements</p>
                        <div className="space-y-1">
                          {program.disbursements.map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{d.date}</span>
                              <span className="font-medium text-foreground">${d.amount.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eligibility Section */}
          {data.eligibility && data.eligibility.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="size-4 text-primary" />
                Eligibility Criteria
              </h3>
              <div className="space-y-2">
                {data.eligibility.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      item.met 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : "bg-red-500/5 border-red-500/20"
                    )}
                  >
                    {item.met ? (
                      <CheckCircle className="size-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="size-4 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.criterion}</p>
                      {item.details && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline Section */}
          {data.timeline && data.timeline.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Timeline
              </h3>
              <div className="relative pl-6 space-y-4">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                
                {data.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    {/* Dot */}
                    <div className={cn(
                      "absolute -left-6 top-1.5 size-3.5 rounded-full border-2 border-card",
                      getTimelineDotColor(event.type)
                    )} />
                    
                    <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                      <div className="flex items-center gap-2 mb-1">
                        {getTimelineIcon(event.type)}
                        <span className="text-xs font-medium text-muted-foreground">{event.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{event.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Stats */}
          {data.additionalStats && data.additionalStats.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Additional Information</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.additionalStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-secondary/30 rounded-lg border border-border text-center"
                  >
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Application Link */}
          {data.applicationId ? (
            <Link href={`/applications/${data.applicationId}`} className="w-full">
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                View Full Application
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              View Full Report
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
