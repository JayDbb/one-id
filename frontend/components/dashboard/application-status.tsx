"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";

export function ApplicationStatus() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    declined: 0,
    submitted: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await apiClient.getApplicationStatus();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch application status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const { total, approved, inProgress, pending } = stats;
  const completedPercent = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Loading...
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
            <div className="relative w-40 h-40 sm:w-48 sm:h-48">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 192 192">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - completedPercent / 100)}`}
                  className="text-blue-600 transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold">{completedPercent}%</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-muted-foreground">Approved</span>
                </div>
                <span className="font-medium">{approved}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span className="text-muted-foreground">In Progress</span>
                </div>
                <span className="font-medium">{inProgress}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-muted-foreground">Pending</span>
                </div>
                <span className="font-medium">{pending}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
