import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const applications = [
  {
    formId: "FORM-2024-001",
    applicants: 3,
    status: "pending",
    createdAt: "2024-11-26",
    statusIcon: Clock,
    statusColor: "text-yellow-500",
  },
  {
    formId: "FORM-2024-002",
    applicants: 2,
    status: "approved",
    createdAt: "2024-11-28",
    statusIcon: CheckCircle,
    statusColor: "text-blue-600",
  },
  {
    formId: "FORM-2024-003",
    applicants: 1,
    status: "rejected",
    createdAt: "2024-11-30",
    statusIcon: XCircle,
    statusColor: "text-red-500",
  },
  {
    formId: "FORM-2024-004",
    applicants: 4,
    status: "pending",
    createdAt: "2024-12-01",
    statusIcon: Clock,
    statusColor: "text-yellow-500",
  },
  {
    formId: "FORM-2024-005",
    applicants: 2,
    status: "approved",
    createdAt: "2024-12-02",
    statusIcon: CheckCircle,
    statusColor: "text-blue-600",
  },
];

export function RecentApplications() {
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
        <div className="space-y-4">
          {applications.map((app, index) => {
            const StatusIcon = app.statusIcon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{app.formId}</p>
                  <p className="text-xs text-muted-foreground">
                    {app.applicants} applicant{app.applicants !== 1 ? "s" : ""} • {app.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className={cn("h-4 w-4", app.statusColor)} />
                  <span className="text-xs font-medium capitalize">
                    {app.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
