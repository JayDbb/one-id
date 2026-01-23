"use client"

import React, { useState } from "react"
import {
  Layers,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatDetailPopup, type StatDetailData } from "@/components/people/stat-detail-popup"

interface ProgramsStatsProps {
  stats: {
    totalPrograms: number
    activePrograms: number
    totalBudget: number
    totalDisbursed: number
    totalBeneficiaries: number
    avgDeliveryRate: number
    pendingApplications: number
    approvalRate: number
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
  variant?: "default" | "primary" | "success" | "warning"
  onClick?: () => void
}

function StatCard({ label, value, icon, trend, variant = "default", onClick }: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border hover:border-muted-foreground/30",
    primary: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    success: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
    warning: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
  }

  const iconStyles = {
    default: "bg-secondary text-muted-foreground",
    primary: "bg-emerald-500/10 text-emerald-600",
    success: "bg-blue-500/10 text-blue-600",
    warning: "bg-amber-500/10 text-amber-600",
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

export function ProgramsStats({ stats }: ProgramsStatsProps) {
  const [selectedStat, setSelectedStat] = useState<StatDetailData | null>(null)

  const formattedBudget = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JMD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stats.totalBudget)

  const formattedDisbursed = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JMD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stats.totalDisbursed)

  const getStatDetail = (statKey: string): StatDetailData => {
    switch (statKey) {
      case "programs":
        return {
          title: "Total Programs",
          value: stats.totalPrograms.toString(),
          subtitle: "Registered social welfare programs",
          description: "Complete count of all social welfare programs in the registry, including active, suspended, and pilot programs.",
          breakdown: [
            { label: "Active", value: stats.activePrograms.toString(), percentage: Math.round((stats.activePrograms / stats.totalPrograms) * 100), color: "bg-emerald-500" },
            { label: "Pilot", value: "1", percentage: 10, color: "bg-blue-500" },
            { label: "Suspended", value: "1", percentage: 10, color: "bg-amber-500" },
          ],
          additionalStats: [
            { label: "Cash Transfer", value: "3" },
            { label: "In-kind Support", value: "3" },
            { label: "Healthcare", value: "1" },
            { label: "Housing", value: "1" },
          ],
        }
      case "beneficiaries":
        return {
          title: "Total Beneficiaries",
          value: stats.totalBeneficiaries.toLocaleString(),
          subtitle: "People receiving program benefits",
          trend: { value: 8, isPositive: true, period: "vs last quarter" },
          description: "Total number of individuals currently enrolled in and receiving benefits from one or more programs.",
          breakdown: [
            { label: "PATH", value: "345,000", percentage: 35, color: "bg-emerald-500" },
            { label: "NHF Drug Subsidy", value: "520,000", percentage: 52, color: "bg-blue-500" },
            { label: "School Feeding", value: "290,000", percentage: 29, color: "bg-amber-500" },
            { label: "Other Programs", value: "155,300", percentage: 16, color: "bg-muted-foreground" },
          ],
        }
      case "budget":
        return {
          title: "Total Budget",
          value: formattedBudget,
          subtitle: "Combined program budgets",
          description: "Total allocated budget across all active and pilot programs for the current fiscal year.",
          programBreakdown: [
            { name: "PATH", amount: 8500000000, status: "approved", date: "FY 2024" },
            { name: "NHF Drug Subsidy", amount: 3200000000, status: "approved", date: "FY 2024" },
            { name: "School Feeding", amount: 2800000000, status: "approved", date: "FY 2024" },
            { name: "Housing Programme", amount: 2500000000, status: "approved", date: "FY 2024" },
          ],
          additionalStats: [
            { label: "Disbursed", value: formattedDisbursed },
            { label: "Remaining", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "JMD", notation: "compact" }).format(stats.totalBudget - stats.totalDisbursed) },
            { label: "Utilization", value: `${Math.round((stats.totalDisbursed / stats.totalBudget) * 100)}%` },
          ],
        }
      case "delivery":
        return {
          title: "Avg. Delivery Rate",
          value: `${stats.avgDeliveryRate}%`,
          subtitle: "Benefits successfully delivered",
          trend: { value: 3, isPositive: true, period: "vs last month" },
          description: "Average percentage of approved benefits that have been successfully delivered to beneficiaries across all programs.",
          breakdown: [
            { label: "Senior Citizens Grant", value: "97%", color: "bg-emerald-500" },
            { label: "NHF Drug Subsidy", value: "96%", color: "bg-emerald-500" },
            { label: "PATH", value: "94%", color: "bg-emerald-500" },
            { label: "Youth Employment", value: "72%", color: "bg-amber-500" },
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
          label="Total Programs"
          value={stats.totalPrograms}
          icon={<Layers className="size-5" />}
          variant="primary"
          onClick={() => setSelectedStat(getStatDetail("programs"))}
        />
        <StatCard
          label="Total Beneficiaries"
          value={stats.totalBeneficiaries.toLocaleString()}
          icon={<Users className="size-5" />}
          trend={{ value: 8, isPositive: true }}
          variant="success"
          onClick={() => setSelectedStat(getStatDetail("beneficiaries"))}
        />
        <StatCard
          label="Total Budget"
          value={formattedBudget}
          icon={<DollarSign className="size-5" />}
          variant="warning"
          onClick={() => setSelectedStat(getStatDetail("budget"))}
        />
        <StatCard
          label="Avg. Delivery Rate"
          value={`${stats.avgDeliveryRate}%`}
          icon={<Percent className="size-5" />}
          trend={{ value: 3, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("delivery"))}
        />
        <StatCard
          label="Active Programs"
          value={stats.activePrograms}
          icon={<CheckCircle className="size-5" />}
          onClick={() => setSelectedStat(getStatDetail("programs"))}
        />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplications.toLocaleString()}
          icon={<Clock className="size-5" />}
          onClick={() => setSelectedStat(getStatDetail("programs"))}
        />
        <StatCard
          label="Disbursed"
          value={formattedDisbursed}
          icon={<Target className="size-5" />}
          trend={{ value: 12, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("budget"))}
        />
        <StatCard
          label="Approval Rate"
          value={`${stats.approvalRate}%`}
          icon={<TrendingUp className="size-5" />}
          trend={{ value: 2, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("delivery"))}
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
