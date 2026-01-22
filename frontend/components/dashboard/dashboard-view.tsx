import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "./stat-card";
import { ApplicationAnalytics } from "./application-analytics";
import { RecentApplications } from "./recent-applications";
import { ApplicationStatus } from "./application-status";
import { ActiveForms } from "./active-forms";

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Monitor applications, forms, and applicant data in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applications"
          value="156"
          subtitle="12 Increased from last week"
          highlighted
        />
        <StatCard
          title="Active Forms"
          value="2"
          subtitle="1 New form this month"
        />
        <StatCard
          title="Total Applicants"
          value="258"
          subtitle="8 Increased from last week"
        />
        <StatCard
          title="Pending Review"
          value="40"
          subtitle="Requires attention"
        />
      </div>

      {/* Second Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ApplicationAnalytics />
        <RecentApplications />
        <ApplicationStatus />
      </div>

      {/* Third Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ActiveForms />
      </div>
    </div>
  );
}
