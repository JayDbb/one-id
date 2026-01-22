"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api";

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return CheckCircle;
    case "pending":
    case "submitted":
      return Clock;
    case "declined":
    case "rejected":
      return XCircle;
    default:
      return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "text-blue-600";
    case "pending":
    case "submitted":
      return "text-yellow-500";
    case "declined":
    case "rejected":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

export function RecentApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      try {
        const data = await apiClient.getRecentApplications();
        setApplications(data);
      } catch (error) {
        console.error("Failed to fetch recent applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentApplications();
  }, []);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Applications</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No recent applications
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => {
              const StatusIcon = getStatusIcon(app.status);
              const statusColor = getStatusColor(app.status);
              return (
                <div
                  key={`${app.formId}-${index}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{app.formName || app.formId}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.applicants} applicant{app.applicants !== 1 ? "s" : ""} • {app.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={cn("h-4 w-4", statusColor)} />
                    <span className="text-xs font-medium capitalize">
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
