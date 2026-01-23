"use client"

import React, { useState } from "react"
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatDetailPopup, type StatDetailData } from "@/components/people/stat-detail-popup"

interface ApplicationsStatsProps {
  stats: {
    totalApplications: number
    pending: number
    underReview: number
    approved: number
    rejected: number
    waitlisted: number
    avgProcessingDays: number
    urgentCount: number
  }
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "success" | "warning" | "danger"
  onClick?: () => void
}

function StatCard({ label, value, icon, trend, variant = "default", onClick }: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border hover:border-muted-foreground/30",
    primary: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
    success: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    warning: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
    danger: "bg-red-500/5 border-red-500/20 hover:border-red-500/40",
  }

  const iconStyles = {
    default: "bg-secondary text-muted-foreground",
    primary: "bg-blue-500/10 text-blue-600",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    danger: "bg-red-500/10 text-red-600",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer text-left w-full",
        variantStyles[variant]
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 size-10 md:size-12 rounded-lg flex items-center justify-center",
          iconStyles[variant]
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-lg md:text-xl font-bold text-foreground truncate">
            {value}
          </p>
          {trend && (
            <span
              className={cn(
                "text-[10px] font-semibold flex items-center gap-0.5",
                trend.isPositive ? "text-emerald-600" : "text-red-500"
              )}
            >
              <TrendingUp
                className={cn(
                  "size-3",
                  !trend.isPositive && "rotate-180"
                )}
              />
              {trend.value}%
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export function ApplicationsStats({ stats }: ApplicationsStatsProps) {
  const [selectedStat, setSelectedStat] = useState<StatDetailData | null>(null)

  const approvalRate = Math.round((stats.approved / (stats.approved + stats.rejected)) * 100)

  const getStatDetail = (statKey: string): StatDetailData => {
    switch (statKey) {
      case "total":
        return {
          title: "Total Applications",
          value: stats.totalApplications.toLocaleString(),
          subtitle: "All time submissions",
          description: "Complete count of all applications submitted across all programs.",
          breakdown: [
            { label: "Approved", value: stats.approved.toLocaleString(), percentage: Math.round((stats.approved / stats.totalApplications) * 100), color: "bg-emerald-500" },
            { label: "Pending", value: stats.pending.toLocaleString(), percentage: Math.round((stats.pending / stats.totalApplications) * 100), color: "bg-amber-500" },
            { label: "Under Review", value: stats.underReview.toLocaleString(), percentage: Math.round((stats.underReview / stats.totalApplications) * 100), color: "bg-blue-500" },
            { label: "Rejected", value: stats.rejected.toLocaleString(), percentage: Math.round((stats.rejected / stats.totalApplications) * 100), color: "bg-red-500" },
          ],
        }
      case "pending":
        return {
          title: "Pending Applications",
          value: stats.pending.toLocaleString(),
          subtitle: "Awaiting initial review",
          description: "Applications that have been submitted but not yet assigned to a reviewing officer.",
          additionalStats: [
            { label: "Avg. Wait Time", value: "3.2 days" },
            { label: "Urgent Cases", value: stats.urgentCount.toString() },
            { label: "Oldest Pending", value: "12 days" },
          ],
        }
      case "processing":
        return {
          title: "Avg. Processing Time",
          value: `${stats.avgProcessingDays} days`,
          subtitle: "From submission to decision",
          trend: { value: 15, isPositive: true, period: "faster than last month" },
          description: "Average number of days from application submission to final approval or rejection.",
          breakdown: [
            { label: "PATH", value: "4 days", color: "bg-emerald-500" },
            { label: "Housing", value: "18 days", color: "bg-amber-500" },
            { label: "Education", value: "7 days", color: "bg-blue-500" },
            { label: "Healthcare", value: "3 days", color: "bg-emerald-500" },
          ],
        }
      default:
        return {
          title: "Statistic Details",
          value: "-",
          description: "Details not available",
        }
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        <StatCard
          label="Total Applications"
          value={stats.totalApplications.toLocaleString()}
          icon={<FileText className="size-5" />}
          variant="primary"
          onClick={() => setSelectedStat(getStatDetail("total"))}
        />
        <StatCard
          label="Pending Review"
          value={stats.pending.toLocaleString()}
          icon={<Clock className="size-5" />}
          variant="warning"
          onClick={() => setSelectedStat(getStatDetail("pending"))}
        />
        <StatCard
          label="Under Review"
          value={stats.underReview.toLocaleString()}
          icon={<Users className="size-5" />}
          trend={{ value: 12, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("total"))}
        />
        <StatCard
          label="Approved"
          value={stats.approved.toLocaleString()}
          icon={<CheckCircle className="size-5" />}
          variant="success"
          onClick={() => setSelectedStat(getStatDetail("total"))}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected.toLocaleString()}
          icon={<XCircle className="size-5" />}
          variant="danger"
          onClick={() => setSelectedStat(getStatDetail("total"))}
        />
        <StatCard
          label="Waitlisted"
          value={stats.waitlisted}
          icon={<AlertTriangle className="size-5" />}
          onClick={() => setSelectedStat(getStatDetail("total"))}
        />
        <StatCard
          label="Avg. Processing"
          value={`${stats.avgProcessingDays} days`}
          icon={<Calendar className="size-5" />}
          trend={{ value: 15, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("processing"))}
        />
        <StatCard
          label="Approval Rate"
          value={`${approvalRate}%`}
          icon={<TrendingUp className="size-5" />}
          trend={{ value: 3, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("total"))}
        />
      </div>

      <StatDetailPopup
        isOpen={selectedStat !== null}
        onClose={() => setSelectedStat(null)}
        data={selectedStat}
      />
    </>
  )
}
