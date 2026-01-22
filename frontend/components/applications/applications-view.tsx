"use client";

import { useState } from "react";
import { Filter, Calendar, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  applicantName: string;
  citizenId: string;
  applicationName: string;
  dateApplied: string;
  constituency: string;
  status: "under-review" | "approved" | "draft" | "declined" | "applied";
}

const mockApplications: Application[] = [
  {
    id: "1",
    applicantName: "John Doe",
    citizenId: "X",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 14, 2024",
    constituency: "Central Manchester",
    status: "under-review",
  },
  {
    id: "2",
    applicantName: "Jane Smith",
    citizenId: "Y",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 15, 2024",
    constituency: "Manchester North Eastern",
    status: "approved",
  },
  {
    id: "3",
    applicantName: "Bob Johnson",
    citizenId: "Z",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 16, 2024",
    constituency: "Central Manchester",
    status: "draft",
  },
  {
    id: "4",
    applicantName: "Alice Williams",
    citizenId: "A",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 17, 2024",
    constituency: "Manchester North Eastern",
    status: "declined",
  },
  {
    id: "5",
    applicantName: "Charlie Brown",
    citizenId: "B",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 18, 2024",
    constituency: "Central Manchester",
    status: "applied",
  },
  {
    id: "6",
    applicantName: "Diana Prince",
    citizenId: "C",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 19, 2024",
    constituency: "Manchester North Eastern",
    status: "approved",
  },
  {
    id: "7",
    applicantName: "Edward Norton",
    citizenId: "D",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 20, 2024",
    constituency: "Central Manchester",
    status: "under-review",
  },
  {
    id: "8",
    applicantName: "Fiona Apple",
    citizenId: "E",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 21, 2024",
    constituency: "Manchester North Eastern",
    status: "applied",
  },
  {
    id: "9",
    applicantName: "George Lucas",
    citizenId: "F",
    applicationName: "HEART/NSTA Trust Online Application",
    dateApplied: "Jan 22, 2024",
    constituency: "Central Manchester",
    status: "draft",
  },
];

export function ApplicationsView() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [constituencyFilter, setConstituencyFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [dateRange, setDateRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const filteredApplications = mockApplications.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (constituencyFilter !== "all" && app.constituency !== constituencyFilter) return false;
    return true;
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredApplications.length / rowsPerPage);

  const clearFilters = () => {
    setStatusFilter("all");
    setConstituencyFilter("all");
    setProgramFilter("all");
    setDateRange("");
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "under-review":
        return "bg-orange-500 text-white";
      case "approved":
        return "bg-green-600 text-white";
      case "draft":
        return "bg-gray-500 text-white";
      case "declined":
        return "bg-red-500 text-white";
      case "applied":
        return "bg-blue-600 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
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

  const constituencies = Array.from(new Set(mockApplications.map((app) => app.constituency)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Applications</h1>
        <p className="text-muted-foreground mt-2">
          Manage your applications and submissions.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-9">
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

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Constituency:</span>
            <Select value={constituencyFilter} onValueChange={setConstituencyFilter}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {constituencies.map((constituency) => (
                  <SelectItem key={constituency} value={constituency}>
                    {constituency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Program / Project:</span>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-48 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="heart-nsta">HEART/NSTA Trust Online Application</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Date Range:</span>
            <div className="relative">
              <Input
                type="text"
                placeholder="Select date range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-48 h-9 pl-9"
              />
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={clearFilters}
          >
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {filteredApplications.length} of {mockApplications.length} applications
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>APPLICANT NAME</TableHead>
              <TableHead>APPLICATION NAME</TableHead>
              <TableHead>DATE APPLIED</TableHead>
              <TableHead>CONSTITUENCY</TableHead>
              <TableHead>APPLICATION STATUS</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.length > 0 ? (
              paginatedApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.applicantName}</div>
                      <div className="text-sm text-muted-foreground">
                        Citizen ID: {application.citizenId}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.applicationName}</TableCell>
                  <TableCell>{application.dateApplied}</TableCell>
                  <TableCell>{application.constituency}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-xs", getStatusBadge(application.status))}>
                      {getStatusLabel(application.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="link"
                        className="h-auto p-0 text-blue-600"
                        size="sm"
                      >
                        {application.status === "under-review" ? "Review" : "View"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No applications found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredApplications.length > 0 && (
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-9 w-9",
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
              className="h-9 w-9"
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
