"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Pencil, MoreVertical, User, FileText, CheckCircle2, Clock, XCircle, Search, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn, formatTRN } from "@/lib/utils";
import { apiClient, PersonDetail } from "@/lib/api";

interface PersonDetailProps {
  personId: string;
}

export function PersonDetailView({ personId }: PersonDetailProps) {
  const router = useRouter();
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicationsSearch, setApplicationsSearch] = useState("");
  const [qualificationsSearch, setQualificationsSearch] = useState("");

  console.log('PersonDetailView rendered with personId:', personId);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching person with ID:', personId);
        const data = await apiClient.getPerson(personId);
        console.log('Person data received:', data);
        setPerson(data);
      } catch (err) {
        console.error('Error fetching person:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch person details");
        setPerson(null);
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchPerson();
    } else {
      setError("No person ID provided");
      setLoading(false);
    }
  }, [personId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 shadow-sm shadow-red-500/5 dark:shadow-red-500/10 p-4">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Error loading person</p>
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2">Person ID: {personId}</p>
        </div>
        <Button onClick={() => router.push('/people')} variant="outline">
          Back to People
        </Button>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 shadow-sm shadow-yellow-500/5 dark:shadow-yellow-500/10 p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Person not found</p>
          <p className="text-xs text-yellow-500 dark:text-yellow-400 mt-2">Person ID: {personId}</p>
        </div>
        <Button onClick={() => router.push('/people')} variant="outline">
          Back to People
        </Button>
      </div>
    );
  }

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
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted border-2 border-border shrink-0">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight break-words">{person.fullName}</h1>
            <p className="text-muted-foreground mt-1 sm:mt-2 text-xs sm:text-base break-words">
              TRN: {formatTRN(person.trn || person.id)} • {person.location || person.division} • {person.division}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto h-9 sm:h-10 text-sm sm:text-base">
            <Pencil className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Edit
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
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
                <p className="text-xs text-muted-foreground mb-1">TRN</p>
                <p className="text-sm font-medium">{formatTRN(person.trn) || "N/A"}</p>
              </div>
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
              <p className="text-sm font-medium">{person.residentialAddress?.line1}</p>
              <p className="text-xs text-muted-foreground">{person.residentialAddress?.line2}</p>
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

        {/* Applications - Full width */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-sm font-semibold">APPLICATIONS SUBMITTED</h2>
            {person.applications.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search applications..."
                  className="pl-9 h-9 w-full"
                  value={applicationsSearch}
                  onChange={(e) => setApplicationsSearch(e.target.value)}
                />
              </div>
            )}
          </div>
          {person.applications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-muted-foreground">No applications submitted</p>
                <p className="text-xs text-muted-foreground mt-1">This person has not submitted any applications yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              {person.applications
                .filter((app) =>
                  app.formName.toLowerCase().includes(applicationsSearch.toLowerCase()) ||
                  app.status.toLowerCase().includes(applicationsSearch.toLowerCase())
                )
                .map((app, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-4 rounded-xl bg-card shadow-sm shadow-black/3 dark:shadow-black/10 hover:shadow-md transition-all"
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
          )}
        </div>

        {/* Qualified Applications - Full width */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-sm font-semibold">QUALIFIED FOR</h2>
            {person.qualifications.length > 0 && (
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search programs..."
                  className="pl-9 h-9 w-full"
                  value={qualificationsSearch}
                  onChange={(e) => setQualificationsSearch(e.target.value)}
                />
              </div>
            )}
          </div>
          {person.qualifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium text-muted-foreground">No qualifications found</p>
                <p className="text-xs text-muted-foreground mt-1">This person does not qualify for any programs at this time.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
              {person.qualifications
                .filter((qual) =>
                  qual.programName.toLowerCase().includes(qualificationsSearch.toLowerCase())
                )
                .map((qual, index) => (
                  <Card key={index} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <FolderKanban className="h-4 w-4 text-green-600" />
                        </div>
                        {qual.qualified ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <p className="font-medium text-sm mb-2">{qual.programName}</p>
                      <Badge
                        className={cn(
                          "text-xs font-medium w-fit mb-2",
                          qual.qualified
                            ? "bg-green-600 text-white"
                            : "bg-red-500 text-white"
                        )}
                      >
                        {qual.qualified ? "Qualified" : "Not Qualified"}
                      </Badge>
                      {qual.reason && (
                        <p className="text-xs text-muted-foreground mt-2">{qual.reason}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
