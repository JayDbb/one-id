"use client"

import React, { useState } from "react"

import {
  Users,
  HandHeart,
  DollarSign,
  TrendingUp,
  Home,
  GraduationCap,
  UserCheck,
  Percent,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatDetailPopup, type StatDetailData } from "./stat-detail-popup"

interface StatsDashboardProps {
  stats: {
    totalPopulation: number
    peopleOnSupport: number
    totalBenefitsGiven: number
    avgApprovalRate: number
    householdsServed: number
    programsActive: number
    newRegistrations: number
    coverageRate: number
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
    primary: "bg-primary/5 border-primary/20 hover:border-primary/40",
    success: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
    warning: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
  }

  const iconStyles = {
    default: "bg-secondary text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
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

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const [selectedStat, setSelectedStat] = useState<StatDetailData | null>(null)

  const formattedBenefits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JMD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(stats.totalBenefitsGiven)

  const fullFormattedBenefits = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JMD",
    maximumFractionDigits: 0,
  }).format(stats.totalBenefitsGiven)

  // Generate detail data for each stat
  const getStatDetail = (statKey: string): StatDetailData => {
    switch (statKey) {
      case "population":
        return {
          title: "Total Population",
          value: stats.totalPopulation.toLocaleString(),
          subtitle: "Registered individuals in selected area",
          description: "Total number of people registered in the system within the current geographic and time filters.",
          breakdown: [
            { label: "Adults (18-59)", value: Math.round(stats.totalPopulation * 0.55).toLocaleString(), percentage: 55, color: "bg-primary" },
            { label: "Children (0-17)", value: Math.round(stats.totalPopulation * 0.28).toLocaleString(), percentage: 28, color: "bg-emerald-500" },
            { label: "Seniors (60+)", value: Math.round(stats.totalPopulation * 0.17).toLocaleString(), percentage: 17, color: "bg-amber-500" },
          ],
          additionalStats: [
            { label: "Male", value: `${Math.round(stats.totalPopulation * 0.48).toLocaleString()}` },
            { label: "Female", value: `${Math.round(stats.totalPopulation * 0.52).toLocaleString()}` },
            { label: "Avg. Household Size", value: "3.2" },
            { label: "Dependency Ratio", value: "45%" },
          ],
        }
      case "support":
        return {
          title: "People On Support Programs",
          value: stats.peopleOnSupport.toLocaleString(),
          subtitle: "Currently receiving benefits",
          trend: { value: 12, isPositive: true, period: "vs last month" },
          description: "Individuals currently enrolled in and receiving benefits from one or more social support programs.",
          breakdown: [
            { label: "PATH Recipients", value: Math.round(stats.peopleOnSupport * 0.35).toLocaleString(), percentage: 35, color: "bg-primary" },
            { label: "Housing Assistance", value: Math.round(stats.peopleOnSupport * 0.22).toLocaleString(), percentage: 22, color: "bg-emerald-500" },
            { label: "Education Grants", value: Math.round(stats.peopleOnSupport * 0.18).toLocaleString(), percentage: 18, color: "bg-amber-500" },
            { label: "Healthcare Subsidy", value: Math.round(stats.peopleOnSupport * 0.15).toLocaleString(), percentage: 15, color: "bg-red-400" },
            { label: "Other Programs", value: Math.round(stats.peopleOnSupport * 0.10).toLocaleString(), percentage: 10, color: "bg-muted-foreground" },
          ],
          additionalStats: [
            { label: "Avg. Programs/Person", value: "1.8" },
            { label: "New This Week", value: "47" },
            { label: "Renewals Due", value: "156" },
            { label: "Active Cases", value: stats.peopleOnSupport.toLocaleString() },
          ],
        }
      case "benefits":
        return {
          title: "Benefits Disbursed",
          value: fullFormattedBenefits,
          subtitle: "Total aid distributed",
          description: "Cumulative monetary value of all benefits disbursed to registered beneficiaries in the selected period.",
          programBreakdown: [
            { 
              name: "PATH Program", 
              amount: Math.round(stats.totalBenefitsGiven * 0.40), 
              status: "approved", 
              date: "Ongoing",
              disbursements: [
                { date: "Jan 15, 2024", amount: Math.round(stats.totalBenefitsGiven * 0.10) },
                { date: "Dec 15, 2023", amount: Math.round(stats.totalBenefitsGiven * 0.10) },
                { date: "Nov 15, 2023", amount: Math.round(stats.totalBenefitsGiven * 0.10) },
              ]
            },
            { 
              name: "Housing Assistance", 
              amount: Math.round(stats.totalBenefitsGiven * 0.25), 
              status: "approved", 
              date: "Q4 2023",
              disbursements: [
                { date: "Dec 1, 2023", amount: Math.round(stats.totalBenefitsGiven * 0.125) },
                { date: "Oct 1, 2023", amount: Math.round(stats.totalBenefitsGiven * 0.125) },
              ]
            },
            { 
              name: "Education Grants", 
              amount: Math.round(stats.totalBenefitsGiven * 0.20), 
              status: "approved", 
              date: "Academic Year 2023-24" 
            },
            { 
              name: "Emergency Relief", 
              amount: Math.round(stats.totalBenefitsGiven * 0.15), 
              status: "approved", 
              date: "Various" 
            },
          ],
          additionalStats: [
            { label: "Avg. per Person", value: "$8,450" },
            { label: "This Month", value: "$2.1M" },
            { label: "Pending Payments", value: "$450K" },
            { label: "YoY Growth", value: "+18%" },
          ],
        }
      case "approval":
        return {
          title: "Average Approval Rate",
          value: `${stats.avgApprovalRate}%`,
          subtitle: "Application success rate",
          trend: { value: 3, isPositive: true, period: "vs last quarter" },
          description: "Percentage of submitted applications that were approved across all programs.",
          breakdown: [
            { label: "PATH", value: "89%", color: "bg-emerald-500" },
            { label: "Housing", value: "72%", color: "bg-amber-500" },
            { label: "Education", value: "85%", color: "bg-emerald-500" },
            { label: "Healthcare", value: "91%", color: "bg-emerald-500" },
            { label: "Emergency", value: "68%", color: "bg-amber-500" },
          ],
          timeline: [
            { date: "Jan 2024", title: "Approval rate improved", description: "New streamlined process implemented", type: "approved" },
            { date: "Dec 2023", title: "Holiday backlog cleared", description: "456 pending applications processed", type: "info" },
            { date: "Nov 2023", title: "System update", description: "Faster verification enabled", type: "info" },
            { date: "Oct 2023", title: "Staff training completed", description: "Reduced processing errors by 15%", type: "approved" },
          ],
        }
      case "households":
        return {
          title: "Households Served",
          value: stats.householdsServed.toLocaleString(),
          subtitle: "Family units receiving support",
          description: "Number of distinct households with at least one member receiving program benefits.",
          breakdown: [
            { label: "Single-parent", value: Math.round(stats.householdsServed * 0.32).toLocaleString(), percentage: 32, color: "bg-primary" },
            { label: "Two-parent", value: Math.round(stats.householdsServed * 0.41).toLocaleString(), percentage: 41, color: "bg-emerald-500" },
            { label: "Multigenerational", value: Math.round(stats.householdsServed * 0.18).toLocaleString(), percentage: 18, color: "bg-amber-500" },
            { label: "Single Adult", value: Math.round(stats.householdsServed * 0.09).toLocaleString(), percentage: 9, color: "bg-muted-foreground" },
          ],
          additionalStats: [
            { label: "Avg. Members", value: "3.2" },
            { label: "With Children", value: "78%" },
            { label: "With Elderly", value: "34%" },
            { label: "Rural", value: "45%" },
          ],
        }
      case "programs":
        return {
          title: "Active Programs",
          value: stats.programsActive.toString(),
          subtitle: "Currently running initiatives",
          description: "Number of social welfare programs currently active and accepting applications.",
          breakdown: [
            { label: "Cash Transfer", value: "4", color: "bg-emerald-500" },
            { label: "In-kind Support", value: "3", color: "bg-primary" },
            { label: "Education", value: "2", color: "bg-amber-500" },
            { label: "Healthcare", value: "2", color: "bg-red-400" },
            { label: "Emergency", value: "1", color: "bg-muted-foreground" },
          ],
          timeline: [
            { date: "Jan 2024", title: "Water Tank Programme expanded", description: "Now covers 3 additional parishes", type: "approved" },
            { date: "Dec 2023", title: "Emergency Relief activated", description: "Response to flooding in St. Mary", type: "info" },
            { date: "Nov 2023", title: "PATH enrollment opened", description: "New cycle accepting applications", type: "approved" },
          ],
        }
      case "registrations":
        return {
          title: "New Registrations",
          value: stats.newRegistrations.toString(),
          subtitle: "This month",
          trend: { value: 8, isPositive: true, period: "vs last month" },
          description: "New individuals registered in the system during the current month.",
          breakdown: [
            { label: "Walk-in", value: Math.round(stats.newRegistrations * 0.45).toString(), percentage: 45, color: "bg-primary" },
            { label: "Online", value: Math.round(stats.newRegistrations * 0.35).toString(), percentage: 35, color: "bg-emerald-500" },
            { label: "Outreach", value: Math.round(stats.newRegistrations * 0.20).toString(), percentage: 20, color: "bg-amber-500" },
          ],
          timeline: [
            { date: "This week", title: "Registration drive", description: "Community center outreach completed", type: "info" },
            { date: "Last week", title: "Online portal updated", description: "Simplified registration form launched", type: "approved" },
          ],
        }
      case "coverage":
        return {
          title: "Coverage Rate",
          value: `${stats.coverageRate}%`,
          subtitle: "Of eligible population",
          trend: { value: 2, isPositive: true, period: "vs last quarter" },
          description: "Percentage of the eligible population currently enrolled in at least one support program.",
          breakdown: [
            { label: "Enrolled", value: `${stats.coverageRate}%`, color: "bg-emerald-500" },
            { label: "Eligible, not enrolled", value: "18%", color: "bg-amber-500" },
            { label: "Under review", value: "9%", color: "bg-muted-foreground" },
          ],
          eligibility: [
            { criterion: "Income below poverty line", met: true, details: "Verified through income assessment" },
            { criterion: "Resident of target area", met: true, details: "Geographic criteria satisfied" },
            { criterion: "Valid identification", met: true, details: "NIS or TRN verified" },
            { criterion: "Not receiving duplicate benefits", met: true, details: "Cross-checked with other programs" },
          ],
          additionalStats: [
            { label: "Target Coverage", value: "85%" },
            { label: "Gap to Target", value: "12%" },
            { label: "Outreach Needed", value: "~340" },
            { label: "Est. Completion", value: "Q3 2024" },
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
          label="Total Population"
          value={stats.totalPopulation.toLocaleString()}
          icon={<Users className="size-5" />}
          variant="primary"
          onClick={() => setSelectedStat(getStatDetail("population"))}
        />
        <StatCard
          label="On Support Programs"
          value={stats.peopleOnSupport.toLocaleString()}
          icon={<HandHeart className="size-5" />}
          trend={{ value: 12, isPositive: true }}
          variant="success"
          onClick={() => setSelectedStat(getStatDetail("support"))}
        />
        <StatCard
          label="Benefits Disbursed"
          value={formattedBenefits}
          icon={<DollarSign className="size-5" />}
          variant="warning"
          onClick={() => setSelectedStat(getStatDetail("benefits"))}
        />
        <StatCard
          label="Avg. Approval Rate"
          value={`${stats.avgApprovalRate}%`}
          icon={<Percent className="size-5" />}
          trend={{ value: 3, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("approval"))}
        />
        <StatCard
          label="Households Served"
          value={stats.householdsServed.toLocaleString()}
          icon={<Home className="size-5" />}
          onClick={() => setSelectedStat(getStatDetail("households"))}
        />
        <StatCard
          label="Active Programs"
          value={stats.programsActive}
          icon={<GraduationCap className="size-5" />}
          onClick={() => setSelectedStat(getStatDetail("programs"))}
        />
        <StatCard
          label="New This Month"
          value={stats.newRegistrations}
          icon={<UserCheck className="size-5" />}
          trend={{ value: 8, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("registrations"))}
        />
        <StatCard
          label="Coverage Rate"
          value={`${stats.coverageRate}%`}
          icon={<TrendingUp className="size-5" />}
          trend={{ value: 2, isPositive: true }}
          onClick={() => setSelectedStat(getStatDetail("coverage"))}
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
