"use client";

import { useState } from "react";
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

interface Program {
  id: string;
  name: string;
  status: "active" | "upcoming" | "closed";
  fieldRequirements: number;
  currentApplications: number;
  isCDF?: boolean;
}

const mockPrograms: Program[] = [
  {
    id: "HEART-NSTA-2024-001",
    name: "HEART/NSTA Trust Online Application",
    status: "active",
    fieldRequirements: 20,
    currentApplications: 5,
  },
  {
    id: "CDF-needs-assessment-001",
    name: "Needs Assessment Form",
    status: "active",
    fieldRequirements: 20,
    currentApplications: 4,
    isCDF: true,
  },
];

type FilterTab = "all" | "active" | "upcoming" | "closed";

export function ProgramInventoryView() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const filteredPrograms =
    activeTab === "all"
      ? mockPrograms
      : mockPrograms.filter((p) => p.status === activeTab);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedPrograms = filteredPrograms.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPrograms.length / rowsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600 text-white";
      case "upcoming":
        return "bg-yellow-500 text-white";
      case "closed":
        return "bg-gray-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
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

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PROGRAM / FORM NAME</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>FIELD REQUIREMENTS</TableHead>
              <TableHead>CURRENT APPLICATIONS</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPrograms.length > 0 ? (
              paginatedPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{program.name}</span>
                        {program.isCDF && (
                          <Badge className="bg-blue-600 text-white text-xs">
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
                    <Badge className={cn("text-xs", getStatusBadge(program.status))}>
                      {program.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{program.fieldRequirements} Requirements</TableCell>
                  <TableCell>{program.currentApplications}</TableCell>
                  <TableCell>
                    <Button variant="link" className="h-auto p-0 text-blue-600">
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No programs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredPrograms.length > 0 && (
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
          TOTAL ACTIVE: {mockPrograms.filter((p) => p.status === "active").length} PROGRAMS & FORMS
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-green-600" />
          <span>INVENTORY SYNC: COMPLETED</span>
        </div>
      </div>
    </div>
  );
}
