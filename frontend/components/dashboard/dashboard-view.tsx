"use client";

import { useState, useEffect } from "react";
import { Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "./stat-card";
import { ApplicationAnalytics } from "./application-analytics";
import { RecentApplications } from "./recent-applications";
import { ApplicationStatus } from "./application-status";
import { ActiveForms } from "./active-forms";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";

export function DashboardView() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeForms: 0,
    totalApplicants: 0,
    pendingApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={`skeleton-stat-${index}`} className={index === 0 ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700" : ""}>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Skeleton className={`h-4 w-32 ${index === 0 ? "bg-white/20" : ""}`} />
                  <Skeleton className={`h-8 w-20 ${index === 0 ? "bg-white/30" : ""}`} />
                  <Skeleton className={`h-3 w-40 ${index === 0 ? "bg-white/20" : ""}`} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <StatCard
              title="Total Applications"
              value={stats.totalApplications.toString()}
              subtitle="All submitted applications"
              highlighted
            />
            <StatCard
              title="Active Forms"
              value={stats.activeForms.toString()}
              subtitle="Currently active forms"
            />
            <StatCard
              title="Total Applicants"
              value={stats.totalApplicants.toString()}
              subtitle="Registered applicants"
            />
            <StatCard
              title="Pending Review"
              value={stats.pendingApplications.toString()}
              subtitle="Requires attention"
            />
          </>
        )}
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
