"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, MoreVertical, User, FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PersonDetailProps {
  personId: string;
}

const mockPersonData = {
  id: "147-258",
  fullName: "Michael T. Davis",
  dateOfBirth: "Nov 14, 1987",
  age: 38,
  gender: "Male",
  nationality: "Jamaican",
  nationalId: "147258369",
  maritalStatus: "N/A",
  occupation: "N/A",
  constituency: "Manchester Southern",
  location: "Porus",
  residentialAddress: {
    line1: "34 Willow Road",
    line2: "34 Willow Road, Porus, Manchester Southern",
  },
  primaryPhone: "+1 (876) 555-7890",
  emailAddress: "N/A",
  verificationStatus: "verified" as const,
  applications: [
    {
      id: "APP-2024-001",
      formName: "Scholarship Program 2024",
      status: "approved",
      submittedDate: "Oct 15, 2024",
      decisionDate: "Nov 1, 2024",
    },
    {
      id: "APP-2024-045",
      formName: "Housing Grant Application",
      status: "pending",
      submittedDate: "Nov 20, 2024",
      decisionDate: null,
    },
    {
      id: "APP-2024-012",
      formName: "Education Support Fund",
      status: "rejected",
      submittedDate: "Sep 10, 2024",
      decisionDate: "Sep 25, 2024",
    },
  ],
  qualifications: [
    {
      programName: "Scholarship Program 2024",
      qualified: true,
      reason: "Meets all eligibility criteria",
    },
    {
      programName: "Housing Grant Application",
      qualified: true,
      reason: "Income below threshold, resident for 5+ years",
    },
    {
      programName: "Education Support Fund",
      qualified: false,
      reason: "Age requirement not met",
    },
    {
      programName: "Healthcare Subsidy",
      qualified: true,
      reason: "Eligible based on constituency and income",
    },
  ],
};

export function PersonDetailView({ personId }: PersonDetailProps) {
  const router = useRouter();
  const person = mockPersonData; // In real app, fetch by personId

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-600 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/people" className="hover:text-foreground">
          People
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/people" className="hover:text-foreground">
          Manchester
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{person.fullName}</span>
      </nav>

      {/* Profile Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted border-2 border-border">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{person.fullName}</h1>
            <p className="text-muted-foreground mt-2">
              ID: {person.id} • {person.location} • {person.constituency}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bento Box Grid Layout */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
        {/* Basic Info - Medium box with grid layout */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">BASIC INFORMATION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                <p className="text-sm font-medium">{person.dateOfBirth}</p>
                <p className="text-xs text-muted-foreground">{person.age} years</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Gender</p>
                <p className="text-sm font-medium">{person.gender}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nationality</p>
                <p className="text-sm font-medium">{person.nationality}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">National ID</p>
                <p className="text-sm font-medium">{person.nationalId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Marital Status</p>
                <p className="text-sm font-medium">{person.maritalStatus}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Occupation</p>
                <p className="text-sm font-medium">{person.occupation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info - Medium box */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">CONTACT INFORMATION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Residential Address</p>
              <p className="text-sm font-medium">{person.residentialAddress.line1}</p>
              <p className="text-xs text-muted-foreground">{person.residentialAddress.line2}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Primary Phone</p>
                <p className="text-sm font-medium">{person.primaryPhone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Email Address</p>
                <p className="text-sm font-medium">{person.emailAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications - Full width, no box */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-semibold">APPLICATIONS</h2>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
            {person.applications.map((app, index) => (
              <div
                key={index}
                className="flex flex-col p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                  </div>
                </div>
                <p className="font-medium text-sm mb-2 line-clamp-2">{app.formName}</p>
                <Badge
                  className={cn(
                    "text-xs font-medium w-fit mb-2",
                    getStatusBadge(app.status)
                  )}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </Badge>
                <p className="text-xs text-muted-foreground mb-1">
                  {app.id}
                </p>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Submitted: {app.submittedDate}</p>
                  {app.decisionDate && (
                    <p>Decision: {app.decisionDate}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
