"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ApplicationDetailsTab } from "./application-details-tab"
import { ApplicationDocumentsTab } from "./application-documents-tab"
import { ApplicationTimelineTab } from "./application-timeline-tab"
import type { Application } from "@/lib/mock-data"

interface ApplicationTabsProps {
  application: Application
}

export function ApplicationTabs({ application }: ApplicationTabsProps) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="flex-1 flex flex-col overflow-hidden"
    >
      <div className="border-b border-border bg-card px-4 md:px-8">
        <TabsList className="h-12 bg-transparent p-0 gap-4 md:gap-8">
          <TabsTrigger
            value="details"
            className="relative h-12 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
          >
            Details
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="relative h-12 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
          >
            Documents ({application.documents.length})
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="relative h-12 px-0 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none text-sm font-medium text-muted-foreground data-[state=active]:text-blue-600 transition-colors after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform"
          >
            Activity
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="flex-1 overflow-y-auto">
        <TabsContent value="details" className="m-0 h-full">
          <ApplicationDetailsTab application={application} />
        </TabsContent>
        <TabsContent value="documents" className="m-0 h-full">
          <ApplicationDocumentsTab application={application} />
        </TabsContent>
        <TabsContent value="timeline" className="m-0 h-full">
          <ApplicationTimelineTab application={application} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
