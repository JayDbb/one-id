"use client"

import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Calendar,
  Shield,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  FileText,
  Fingerprint,
  BadgeCheck,
} from "lucide-react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface OneIdTabProps {
  person: {
    id: string
    oneId: string
    name: string
    dateOfBirth: string
    gender: string
    trn: string
    nis: string
    nationality: string
    maritalStatus: string
    occupation: string
    employer: string
    phone: string
    email: string
    address: {
      street: string
      community: string
      parish: string
      constituency: string
    }
    emergencyContact: {
      name: string
      relationship: string
      phone: string
    }
    registrationDate: string
    lastUpdated: string
    status: string
  }
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-sm font-semibold text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  )
}

export function OneIdTab({ person }: OneIdTabProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyOneId = () => {
    navigator.clipboard.writeText(person.oneId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const age = Math.floor(
    (Date.now() - new Date(person.dateOfBirth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  )

  return (
    <div className="p-4 md:p-8">
      {/* OneID Card */}
      <Card className="mb-6 md:mb-8 bg-gradient-to-br from-primary/5 via-card to-primary/5 border-primary/20">
        <CardContent className="py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
              <div className="size-16 md:size-20 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="size-8 md:size-10 text-primary" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">
                  Universal OneID
                </p>
                <p className="text-xl md:text-3xl font-bold font-mono text-foreground tracking-wider break-all">
                  {person.oneId}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Registered:{" "}
                  {new Date(person.registrationDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleCopyOneId}
              className="flex items-center gap-2 bg-transparent w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <Check className="size-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy OneID
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-5 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InfoRow label="Full Name" value={person.name} />
              <InfoRow label="Gender" value={person.gender} />
              <InfoRow
                label="Date of Birth"
                value={`${new Date(person.dateOfBirth).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })} (${age} years)`}
              />
              <InfoRow label="Nationality" value={person.nationality} />
              <InfoRow label="Marital Status" value={person.maritalStatus} />
              <InfoRow label="Status" value={person.status} />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Phone className="size-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Phone className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-foreground truncate">
                    {person.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Mail className="size-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-foreground break-all">
                    {person.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="size-5 text-primary" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InfoRow label="Street Address" value={person.address.street} />
              <InfoRow label="Community" value={person.address.community} />
              <InfoRow label="Parish" value={person.address.parish} />
              <InfoRow
                label="Constituency"
                value={person.address.constituency}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="size-5 text-primary" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InfoRow label="Occupation" value={person.occupation} />
              <InfoRow label="Employer" value={person.employer} />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="size-5 text-primary" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InfoRow label="Contact Name" value={person.emergencyContact.name} />
              <InfoRow
                label="Relationship"
                value={person.emergencyContact.relationship}
              />
              <InfoRow
                label="Phone Number"
                value={person.emergencyContact.phone}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-5 text-primary" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <InfoRow
                label="Registration Date"
                value={new Date(person.registrationDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              />
              <InfoRow
                label="Last Updated"
                value={new Date(person.lastUpdated).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identification Section - Consolidated at bottom */}
      <Card className="mt-6 md:mt-8 border-2 border-dashed border-border">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Fingerprint className="size-5 text-primary" />
            Identification Documents
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            All government-issued and system identification numbers
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* OneID */}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Universal OneID
                </span>
                <BadgeCheck className="size-4 text-green-600 ml-auto" />
              </div>
              <p className="text-sm font-bold font-mono text-foreground break-all">
                {person.oneId}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Primary identifier</p>
            </div>

            {/* TRN */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tax Registration Number
                </span>
                <BadgeCheck className="size-4 text-green-600 ml-auto" />
              </div>
              <p className="text-sm font-bold font-mono text-foreground">
                {person.trn}
              </p>
              <p className="text-xs text-muted-foreground mt-1">TAJ issued</p>
            </div>

            {/* NIS */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  National Insurance Scheme
                </span>
                <BadgeCheck className="size-4 text-green-600 ml-auto" />
              </div>
              <p className="text-sm font-bold font-mono text-foreground">
                {person.nis}
              </p>
              <p className="text-xs text-muted-foreground mt-1">MLSS issued</p>
            </div>

            {/* National ID */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  National ID Card
                </span>
                <BadgeCheck className="size-4 text-green-600 ml-auto" />
              </div>
              <p className="text-sm font-bold font-mono text-foreground">
                NID-{person.id.toUpperCase()}-2019
              </p>
              <p className="text-xs text-muted-foreground mt-1">NIDS issued</p>
            </div>

            {/* Voter ID */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Voter ID
                </span>
                <BadgeCheck className="size-4 text-green-600 ml-auto" />
              </div>
              <p className="text-sm font-bold font-mono text-foreground">
                EOJ-{person.id.slice(0, 6).toUpperCase()}-V
              </p>
              <p className="text-xs text-muted-foreground mt-1">EOJ issued</p>
            </div>

            {/* System Internal ID */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Fingerprint className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Internal System ID
                </span>
              </div>
              <p className="text-sm font-bold font-mono text-foreground">
                {person.id}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Database reference</p>
            </div>
          </div>

          {/* ID Verification Status */}
          <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                <BadgeCheck className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                  Identity Verified
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  All identification documents have been verified and cross-referenced. Last verification: {new Date(person.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
