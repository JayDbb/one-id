"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgramOverviewTab } from "./program-overview-tab"
import { ProgramBeneficiariesTab } from "./program-beneficiaries-tab"
import { ProgramApplicationsTab } from "./program-applications-tab"
import type { Program } from "@/lib/mock-data"

interface ProgramTabsProps {
  program: Program
}

export function ProgramTabs({ program }: ProgramTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <div className="border-b border-border bg-card px-4 md:px-8">
        <TabsList className="h-12 bg-transparent p-0 gap-4 md:gap-8">
          <TabsTrigger
            value="overview"
            className="relative h-12 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="beneficiaries"
            className="relative h-12 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
          >
            Beneficiaries
          </TabsTrigger>
          <TabsTrigger
            value="applications"
            className="relative h-12 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-emerald-600 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
          >
            Applications
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TabsContent value="overview" className="m-0 h-full">
          <ProgramOverviewTab program={program} />
        </TabsContent>
        <TabsContent value="beneficiaries" className="m-0 h-full">
          <ProgramBeneficiariesTab program={program} />
        </TabsContent>
        <TabsContent value="applications" className="m-0 h-full">
          <ProgramApplicationsTab program={program} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
