"use client";

import { useState, useEffect } from "react";
import { Filter, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { apiClient, Application } from "@/lib/api";

export function ApplicationsView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Map UI status to API status
        const apiStatus = statusFilter !== "all" ? {
          "under-review": "pending",
          "approved": "approved",
          "draft": "draft",
          "declined": "declined",
          "applied": "submitted",
        }[statusFilter] || statusFilter : undefined;

        const response = await apiClient.getApplications({
          status: apiStatus,
          division: divisionFilter !== "all" ? divisionFilter : undefined,
          form_id: programFilter !== "all" ? programFilter : undefined,
          dateFrom: dateRange ? dateRange.split(" - ")[0] : undefined,
          dateTo: dateRange ? dateRange.split(" - ")[1] : undefined,
          page: currentPage,
          limit: rowsPerPage,
        });
        setApplications(response.data);
        setTotal(response.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch applications");
        setApplications([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [statusFilter, divisionFilter, programFilter, dateRange, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(total / rowsPerPage);

  const clearFilters = () => {
    setStatusFilter("all");
    setDivisionFilter("all");
    setProgramFilter("all");
    setDateRange("");
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    // Map backend status to UI status
    const statusMap: Record<string, string> = {
      "pending": "under-review",
      "submitted": "applied",
    };
    const uiStatus = statusMap[status] || status;

    switch (uiStatus) {
      case "under-review":
        return "bg-orange-500 text-white border border-orange-300";
      case "approved":
        return "bg-green-500 text-white border border-green-300";
      case "draft":
        return "bg-gray-600 text-white border border-gray-400";
      case "declined":
        return "bg-red-500 text-white border border-red-300";
      case "applied":
        return "bg-blue-500 text-white border border-blue-300";
      default:
        return "bg-muted text-muted-foreground border border-border";
    }
  };

  const getStatusLabel = (status: string) => {
    // Map backend status to UI status
    const statusMap: Record<string, string> = {
      "pending": "under-review",
      "submitted": "applied",
    };
    const uiStatus = statusMap[status] || status;

    switch (uiStatus) {
      case "under-review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "draft":
        return "Draft";
      case "declined":
        return "Declined";
      case "applied":
        return "Applied";
      default:
        return status;
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words">Applications</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-base">
          Manage your applications and submissions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Division:</span>
              <Input
                type="text"
                placeholder="Filter by division"
                value={divisionFilter !== "all" ? divisionFilter : ""}
                onChange={(e) => setDivisionFilter(e.target.value || "all")}
                className="w-full sm:w-48 h-9 text-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Program / Project:</span>
              <Select value={programFilter} onValueChange={setProgramFilter}>
                <SelectTrigger className="w-full sm:w-48 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="heart-nsta">HEART/NSTA Trust Online Application</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Date Range:</span>
              <div className="relative w-full sm:w-48">
                <Input
                  type="text"
                  placeholder="Select date range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-9 pl-9 text-sm"
                />
                <Calendar className="absolute left-2 sm:left-3 top-1/2 h-3 w-3 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-9 w-full sm:w-auto text-sm"
              onClick={clearFilters}
            >
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Clear Filters
            </Button>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right w-full sm:w-auto">
            {total} of {total} applications
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 shadow-sm shadow-red-500/5 dark:shadow-red-500/10 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-card shadow-sm shadow-black/3 dark:shadow-black/10 w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px] sm:min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">APPLICANT NAME</TableHead>
                <TableHead className="whitespace-nowrap">APPLICATION NAME</TableHead>
                <TableHead className="whitespace-nowrap">DATE APPLIED</TableHead>
                <TableHead className="whitespace-nowrap">DIVISION</TableHead>
                <TableHead className="whitespace-nowrap">APPLICATION STATUS</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : applications.length > 0 ? (
              applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.applicantName}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {application.citizenId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.applicationName}</TableCell>
                  <TableCell>{application.dateApplied}</TableCell>
                  <TableCell>{application.division}</TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-md px-3 py-1 text-xs font-medium", getStatusBadge(application.status))}>
                      {getStatusLabel(application.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-center sm:justify-end w-full">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 overflow-x-auto max-w-[calc(100vw-8rem)] sm:max-w-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-9 w-9 shrink-0",
                    currentPage === page && "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
