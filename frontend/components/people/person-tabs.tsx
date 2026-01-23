"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { SupportTab } from "./support-tab"
import { OneIdTab } from "./one-id-tab"

interface Program {
  id: string
  name: string
  status: string
  appliedDate: string
  approvedDate: string | null
  benefitAmount: number | null
}

interface Person {
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
  programs: Program[]
  impactScore: {
    overall: number
    breakdown: {
      economicNeed: number
      socialVulnerability: number
      geographicFactor: number
      programParticipation: number
    }
  }
  submissions: {
    total: number
    completed: number
  }
  approvalRate: number
}

interface PersonTabsProps {
  person: Person
}

const TABS = [
  { id: "support", label: "Support" },
  { id: "oneid", label: "OneID" },
] as const

type TabId = (typeof TABS)[number]["id"]

export function PersonTabs({ person }: PersonTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("support")

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Browser-style Tab Bar */}
      <div className="bg-secondary border-b border-border">
        <div className="px-4 md:px-8 flex items-end gap-0 pt-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 md:px-6 py-2.5 md:py-3 text-sm font-semibold transition-all rounded-t-lg",
                activeTab === tab.id
                  ? "bg-card text-foreground border-t border-l border-r border-border -mb-px z-10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-card" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto bg-background">
        {activeTab === "support" && <SupportTab person={person} />}
        {activeTab === "oneid" && <OneIdTab person={person} />}
      </div>
    </div>
  )
}
