"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { apiClient, Program } from "@/lib/api";

type FilterTab = "all" | "active" | "upcoming" | "closed";

export function ProgramInventoryView() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getForms();
        setPrograms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch programs");
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms =
    activeTab === "all"
      ? programs
      : programs.filter((p) => p.status === activeTab);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPrograms.length / rowsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 text-white border border-green-300";
      case "upcoming":
        return "bg-yellow-500 text-white border border-yellow-300";
      case "closed":
        return "bg-gray-600 text-white border border-gray-400";
      default:
        return "bg-muted text-muted-foreground border border-border";
    }
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: "all", label: "All Programs" },
    { id: "active", label: "Active" },
    { id: "upcoming", label: "Upcoming" },
    { id: "closed", label: "Closed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Program Inventory</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive management of government programs, CDF forms (e.g. Needs Assessment), and application lifecycles.
        </p>
      </div>

      {/* Filter Tabs and Advanced Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={cn(
                "h-9 px-4",
                activeTab === tab.id && "bg-blue-600 hover:bg-blue-700 text-white"
              )}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <Button variant="outline" className="h-9">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 shadow-sm shadow-red-500/5 dark:shadow-red-500/10 p-4">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-card shadow-sm shadow-black/3 dark:shadow-black/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PROGRAM / FORM NAME</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>FIELD REQUIREMENTS</TableHead>
              <TableHead>CURRENT APPLICATIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginatedPrograms.length > 0 ? (
              paginatedPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{program.shortName || program.name}</span>
                        {program.isCDF && (
                          <Badge className="bg-blue-500 text-white border border-blue-300 rounded-md px-3 py-1 text-xs font-medium">
                            CDF
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {program.id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("rounded-md px-3 py-1 text-xs font-medium", getStatusBadge(program.status))}>
                      {program.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{program.fieldRequirements} Requirements</TableCell>
                  <TableCell>{program.currentApplications}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No programs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && filteredPrograms.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(value) => {
                  setRowsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPrograms.length)} of{" "}
              {filteredPrograms.length} results
            </div>
          </div>
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

      {/* Footer Status */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-blue-600" />
          <span>SYSTEM: PROGRAM INVENTORY MASTER</span>
        </div>
        <div className="text-sm text-muted-foreground">
          TOTAL ACTIVE: {programs.filter((p) => p.status === "active").length} PROGRAMS & FORMS
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-600" />
          <span>INVENTORY SYNC: COMPLETED</span>
        </div>
      </div>
    </div>
  );
}
