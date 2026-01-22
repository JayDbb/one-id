"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Person {
  id: string;
  fullName: string;
  dateOfBirth: string;
  constituency: string;
  verificationStatus: "verified" | "pending" | "rejected";
  formsApplied: number;
  formsQualified: number;
}

const mockPeople: Person[] = [
  {
    id: "147-258",
    fullName: "Michael T. Davis",
    dateOfBirth: "Nov 14, 1987",
    constituency: "Manchester Southern",
    verificationStatus: "verified",
    formsApplied: 3,
    formsQualified: 2,
  },
  {
    id: "654-789",
    fullName: "Jennifer M. Brown",
    dateOfBirth: "Apr 24, 1995",
    constituency: "Manchester North Western",
    verificationStatus: "verified",
    formsApplied: 2,
    formsQualified: 2,
  },
  {
    id: "321-654",
    fullName: "Robert K. Johnson",
    dateOfBirth: "Dec 2, 1975",
    constituency: "Manchester North Eastern",
    verificationStatus: "verified",
    formsApplied: 5,
    formsQualified: 4,
  },
  {
    id: "789-456",
    fullName: "Maria G. Williams",
    dateOfBirth: "Jul 17, 1988",
    constituency: "Central Manchester",
    verificationStatus: "verified",
    formsApplied: 1,
    formsQualified: 1,
  },
  {
    id: "412-885",
    fullName: "David O. Wellington",
    dateOfBirth: "Mar 11, 1990",
    constituency: "Manchester Southern",
    verificationStatus: "verified",
    formsApplied: 4,
    formsQualified: 3,
  },
  {
    id: "523-147",
    fullName: "Sarah L. Anderson",
    dateOfBirth: "Sep 5, 1992",
    constituency: "Manchester North Western",
    verificationStatus: "verified",
    formsApplied: 2,
    formsQualified: 1,
  },
  {
    id: "689-321",
    fullName: "James P. Martinez",
    dateOfBirth: "Jan 22, 1985",
    constituency: "Central Manchester",
    verificationStatus: "verified",
    formsApplied: 3,
    formsQualified: 3,
  },
  {
    id: "852-963",
    fullName: "David Richards",
    dateOfBirth: "Jun 8, 1989",
    constituency: "Manchester North Eastern",
    verificationStatus: "verified",
    formsApplied: 1,
    formsQualified: 0,
  },
];

export function PeopleView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredPeople = mockPeople.filter((person) => {
    const matchesSearch =
      person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.id.includes(searchQuery);
    const matchesVerification =
      verificationFilter === "all" || person.verificationStatus === verificationFilter;
    return matchesSearch && matchesVerification;
  });

  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPeople = filteredPeople.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">People - Central Manchester</h1>
        <p className="text-muted-foreground mt-2">Manchester • {filteredPeople.length} People</p>
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

          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Verification: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Verification: All</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap">
            <Plus className="h-4 w-4 mr-2" />
            Add Person
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>FULL NAME</TableHead>
              <TableHead>DATE OF BIRTH</TableHead>
              <TableHead>DIVISION</TableHead>
              <TableHead>FORMS APPLIED</TableHead>
              <TableHead>FORMS QUALIFIED</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPeople.length > 0 ? (
              paginatedPeople.map((person) => (
                <TableRow
                  key={person.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/people/${person.id}`)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{person.fullName}</div>
                      <div className="text-sm text-muted-foreground">ID: {person.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{person.dateOfBirth}</TableCell>
                  <TableCell>{person.constituency}</TableCell>
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
      {filteredPeople.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredPeople.length)} of{" "}
            {filteredPeople.length} results
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
