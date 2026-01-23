"use client"

import {
  DollarSign,
  Users,
  Target,
  Calendar,
  MapPin,
  FileText,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Percent,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Program } from "@/lib/mock-data"

interface ProgramOverviewTabProps {
  program: Program
}

export function ProgramOverviewTab({ program }: ProgramOverviewTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "JMD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const budgetUtilization = Math.round((program.disbursed / program.budget) * 100)
  const beneficiaryProgress = Math.round((program.beneficiaries / program.targetBeneficiaries) * 100)
  const totalApplications = program.applicationsPending + program.applicationsApproved + program.applicationsRejected
  const approvalRate = Math.round((program.applicationsApproved / (program.applicationsApproved + program.applicationsRejected)) * 100)

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Users className="size-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Beneficiaries</p>
                <p className="text-xl font-bold text-emerald-600">{program.beneficiaries.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Disbursed</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(program.disbursed)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Clock className="size-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold text-amber-600">{program.applicationsPending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Percent className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Delivery Rate</p>
                <p className="text-xl font-bold text-purple-600">{program.deliveryRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Program Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-5 text-emerald-600" />
              Program Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-sm text-foreground">{program.description}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ministry</p>
                <p className="text-sm font-medium">{program.ministry}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Program Weight</p>
                <p className="text-sm font-medium">{program.weight} points</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Start Date</p>
                <p className="text-sm font-medium">{new Date(program.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">End Date</p>
                <p className="text-sm font-medium">{program.endDate ? new Date(program.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Ongoing"}</p>
              </div>
            </div>

            {/* Coverage Areas */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <MapPin className="size-3" /> Coverage Areas
              </p>
              <div className="flex flex-wrap gap-2">
                {program.coverageAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Eligibility Criteria</p>
              <ul className="space-y-2">
                {program.eligibilityCriteria.map((criterion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5 text-emerald-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Budget Utilization */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Budget Utilization</span>
                <span className={cn(
                  "text-sm font-bold",
                  budgetUtilization >= 80 ? "text-emerald-600" :
                  budgetUtilization >= 50 ? "text-amber-600" : "text-red-500"
                )}>
                  {budgetUtilization}%
                </span>
              </div>
              <Progress value={budgetUtilization} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatCurrency(program.disbursed)}</span>
                <span>{formatCurrency(program.budget)}</span>
              </div>
            </div>

            {/* Beneficiary Target */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Beneficiary Target</span>
                <span className={cn(
                  "text-sm font-bold",
                  beneficiaryProgress >= 80 ? "text-emerald-600" :
                  beneficiaryProgress >= 50 ? "text-amber-600" : "text-red-500"
                )}>
                  {beneficiaryProgress}%
                </span>
              </div>
              <Progress value={beneficiaryProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{program.beneficiaries.toLocaleString()}</span>
                <span>{program.targetBeneficiaries.toLocaleString()}</span>
              </div>
            </div>

            {/* Delivery Rate */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Delivery Rate</span>
                <span className={cn(
                  "text-sm font-bold",
                  program.deliveryRate >= 90 ? "text-emerald-600" :
                  program.deliveryRate >= 75 ? "text-amber-600" : "text-red-500"
                )}>
                  {program.deliveryRate}%
                </span>
              </div>
              <Progress value={program.deliveryRate} className="h-2" />
            </div>

            {/* Application Stats */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium mb-3">Application Statistics</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-emerald-500" />
                    Approved
                  </span>
                  <span className="font-semibold">{program.applicationsApproved.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-amber-500" />
                    Pending
                  </span>
                  <span className="font-semibold">{program.applicationsPending.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <XCircle className="size-4 text-red-500" />
                    Rejected
                  </span>
                  <span className="font-semibold">{program.applicationsRejected.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between">
                <span className="text-sm text-muted-foreground">Approval Rate</span>
                <span className="font-bold text-emerald-600">{approvalRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
