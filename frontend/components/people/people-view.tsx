"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { cn, formatTRN } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient, Person } from "@/lib/api";

export function PeopleView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [people, setPeople] = useState<Person[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getPeople({
          search: searchQuery || undefined,
          division: divisionFilter !== "all" ? divisionFilter : undefined,
          program: programFilter !== "all" ? programFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          page: currentPage,
          limit: itemsPerPage,
        });
        console.log(response.data, 'response.data');
        setPeople(response.data);
        setTotal(response.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch people");
        setPeople([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, [searchQuery, programFilter, statusFilter, divisionFilter, currentPage]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">People - Central Manchester</h1>
        <p className="text-muted-foreground mt-2">Manchester • {total} People</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or ID"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-3 flex-1 sm:flex-initial">
          <Select value={programFilter} onValueChange={setProgramFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Program: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Program: All</SelectItem>
              <SelectItem value="program1">Program 1</SelectItem>
              <SelectItem value="program2">Program 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Status: All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={divisionFilter} onValueChange={setDivisionFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Division: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Division: All</SelectItem>
              <SelectItem value="Central Manchester">Central Manchester</SelectItem>
              <SelectItem value="Manchester Southern">Manchester Southern</SelectItem>
              <SelectItem value="Manchester North Eastern">Manchester North Eastern</SelectItem>
              <SelectItem value="Manchester North Western">Manchester North Western</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        </div>
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
              <TableHead>FULL NAME</TableHead>
              <TableHead>PHONE NUMBER</TableHead>
              <TableHead>DIVISION</TableHead>
              <TableHead>FORMS APPLIED</TableHead>
              <TableHead>FORMS QUALIFIED</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                </TableRow>
              ))
            ) : people.length > 0 ? (
              people.map((person, index) => (
                <TableRow
                  key={`person-${person.id || index}-${person.fullName || index}`}
                  className="cursor-pointer"
                  onClick={() => router.push(`/people/${person.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{person.fullName}</div>
                      <div className="text-sm text-muted-foreground">TRN: {formatTRN(person.trn || person.id)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{person.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{person.division}</TableCell>
                  <TableCell>{person.formsApplied}</TableCell>
                  <TableCell>{person.formsQualified}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No people found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, total)} of{" "}
            {total} results
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
    </div>
  );
}
