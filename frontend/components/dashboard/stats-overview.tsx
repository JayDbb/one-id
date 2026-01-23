"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { 
  Users, 
  Building2, 
  FileText, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ReactNode
  color: string
  href: string
}

function StatCard({ title, value, change, changeLabel, icon, color, href }: StatCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isPositive = change >= 0

  return (
    <Link
      href={href}
      className={cn(
        "group relative p-5 rounded-xl border transition-all duration-300",
        "bg-card hover:bg-secondary/50",
        "border-border hover:border-primary/30",
        "hover:shadow-lg hover:shadow-primary/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "p-2.5 rounded-lg transition-colors",
          color
        )}>
          {icon}
        </div>
        <ChevronRight className={cn(
          "size-4 text-muted-foreground transition-all",
          isHovered ? "translate-x-0.5 text-primary" : ""
        )} />
      </div>

      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground mb-2">{value}</p>
      
      <div className="flex items-center gap-1.5">
        {isPositive ? (
          <ArrowUpRight className="size-3.5 text-emerald-500" />
        ) : (
          <ArrowDownRight className="size-3.5 text-red-500" />
        )}
        <span className={cn(
          "text-xs font-semibold",
          isPositive ? "text-emerald-500" : "text-red-500"
        )}>
          {isPositive ? "+" : ""}{change}%
        </span>
        <span className="text-xs text-muted-foreground">{changeLabel}</span>
      </div>
    </Link>
  )
}

interface StatsOverviewProps {
  stats: {
    totalPeople: number
    totalPrograms: number
    totalApplications: number
    deliveryRate: number
    peopleChange: number
    programsChange: number
    applicationsChange: number
    deliveryChange: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Beneficiaries"
        value={stats.totalPeople.toLocaleString()}
        change={stats.peopleChange}
        changeLabel="vs last month"
        icon={<Users className="size-5 text-blue-600" />}
        color="bg-blue-100 dark:bg-blue-900/30"
        href="/people"
      />
      <StatCard
        title="Active Programs"
        value={stats.totalPrograms.toString()}
        change={stats.programsChange}
        changeLabel="vs last month"
        icon={<Building2 className="size-5 text-emerald-600" />}
        color="bg-emerald-100 dark:bg-emerald-900/30"
        href="/programs"
      />
      <StatCard
        title="Applications"
        value={stats.totalApplications.toLocaleString()}
        change={stats.applicationsChange}
        changeLabel="this week"
        icon={<FileText className="size-5 text-amber-600" />}
        color="bg-amber-100 dark:bg-amber-900/30"
        href="/applications"
      />
      <StatCard
        title="Delivery Rate"
        value={`${stats.deliveryRate}%`}
        change={stats.deliveryChange}
        changeLabel="vs last quarter"
        icon={<TrendingUp className="size-5 text-purple-600" />}
        color="bg-purple-100 dark:bg-purple-900/30"
        href="/programs"
      />
    </div>
  )
}
