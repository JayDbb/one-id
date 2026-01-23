"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockPrograms } from "@/lib/mock-data"

export function ProgramsOverview() {
  // Get top 5 programs by beneficiaries
  const topPrograms = [...mockPrograms]
    .filter(p => p.status === "active")
    .sort((a, b) => b.beneficiaries - a.beneficiaries)
    .slice(0, 5)

  const maxBeneficiaries = Math.max(...topPrograms.map(p => p.beneficiaries))

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Top Programs</h3>
          <Link 
            href="/programs" 
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="size-3" />
          </Link>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {topPrograms.map((program, index) => {
          const percentage = (program.beneficiaries / maxBeneficiaries) * 100
          const deliveryColor = program.deliveryRate >= 90 
            ? "text-emerald-500" 
            : program.deliveryRate >= 75 
              ? "text-amber-500" 
              : "text-red-500"
          
          return (
            <Link
              key={program.id}
              href={`/programs/${program.id}`}
              className="block group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground w-4">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {program.code}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {program.beneficiaries.toLocaleString()}
                  </span>
                  <span className={cn("text-xs font-semibold", deliveryColor)}>
                    {program.deliveryRate}%
                  </span>
                </div>
              </div>
              <div className="ml-6 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all group-hover:from-primary group-hover:to-primary/80"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
