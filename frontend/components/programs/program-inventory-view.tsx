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
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words">Program Inventory</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-base">
          Comprehensive management of government programs, CDF forms (e.g. Needs Assessment), and application lifecycles.
        </p>
      </div>

      {/* Filter Tabs and Advanced Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full sm:w-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={cn(
                "h-8 sm:h-9 px-2 sm:px-4 text-xs sm:text-sm",
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
        <Button variant="outline" className="h-8 sm:h-9 w-full sm:w-auto text-xs sm:text-sm">
          <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
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
      <div className="rounded-xl bg-card shadow-sm shadow-black/3 dark:shadow-black/10 w-full overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-[600px] sm:min-w-[640px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">PROGRAM / FORM NAME</TableHead>
                <TableHead className="whitespace-nowrap">STATUS</TableHead>
                <TableHead className="whitespace-nowrap">FIELD REQUIREMENTS</TableHead>
                <TableHead className="whitespace-nowrap">CURRENT APPLICATIONS</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
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
      </div>

      {/* Pagination */}
      {!loading && filteredPrograms.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
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
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPrograms.length)} of{" "}
              {filteredPrograms.length} results
            </div>
          </div>
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

      {/* Footer Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3 sm:gap-0">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
          <span className="break-words">SYSTEM: PROGRAM INVENTORY MASTER</span>
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
          TOTAL ACTIVE: {programs.filter((p) => p.status === "active").length} PROGRAMS & FORMS
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-600 shrink-0" />
          <span className="break-words">INVENTORY SYNC: COMPLETED</span>
        </div>
      </div>
    </div>
  );
}
