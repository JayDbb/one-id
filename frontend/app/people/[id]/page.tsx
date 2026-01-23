import { ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PersonTabs } from "@/components/people/person-tabs"

// Mock data - in production this would come from an API
function getPersonData(id: string) {
  return {
    id,
    oneId: `JM-${id.toUpperCase()}-2024-001`,
    name: "Trudi-Ann Barrett",
    dateOfBirth: "1985-03-15",
    gender: "Female",
    trn: "123-456-789",
    nis: "NIS-2024-78901",
    nationality: "Jamaican",
    maritalStatus: "Married",
    occupation: "Teacher",
    employer: "Ministry of Education",
    phone: "+1 (876) 555-0123",
    email: "trudi.barrett@example.com",
    address: {
      street: "15 Hope Road",
      community: "Liguanea",
      parish: "Kingston",
      constituency: "North East Manchester",
    },
    emergencyContact: {
      name: "Michael Barrett",
      relationship: "Spouse",
      phone: "+1 (876) 555-0456",
    },
    registrationDate: "2023-06-15",
    lastUpdated: "2024-01-10",
    status: "Active",
    programs: [
      {
        id: "prog-1",
        name: "PATH",
        status: "Approved",
        deliveryStatus: "Delivered",
        appliedDate: "2023-07-01",
        approvedDate: "2023-08-15",
        benefitAmount: 3500,
        weight: 15,
      },
      {
        id: "prog-2",
        name: "Housing Assistance",
        status: "Pending",
        deliveryStatus: "Pending",
        appliedDate: "2024-01-05",
        approvedDate: null,
        benefitAmount: null,
        weight: 20,
      },
      {
        id: "prog-3",
        name: "Education Grant",
        status: "Approved",
        deliveryStatus: "Delivered",
        appliedDate: "2023-09-01",
        approvedDate: "2023-10-01",
        benefitAmount: 15000,
        weight: 18,
      },
      {
        id: "prog-4",
        name: "Agricultural Support",
        status: "Rejected",
        deliveryStatus: "Not Applicable",
        appliedDate: "2023-05-10",
        approvedDate: null,
        benefitAmount: null,
        weight: 12,
      },
      {
        id: "prog-5",
        name: "Healthcare Subsidy",
        status: "Approved",
        deliveryStatus: "Delivered",
        appliedDate: "2023-04-15",
        approvedDate: "2023-05-20",
        benefitAmount: 8000,
        weight: 16,
      },
      {
        id: "prog-6",
        name: "Small Business Grant",
        status: "Pending",
        deliveryStatus: "Pending",
        appliedDate: "2024-01-10",
        approvedDate: null,
        benefitAmount: null,
        weight: 14,
      },
      {
        id: "prog-7",
        name: "Water Tank Programme",
        status: "Approved",
        deliveryStatus: "Delivered",
        appliedDate: "2023-02-01",
        approvedDate: "2023-03-15",
        benefitAmount: 25000,
        weight: 10,
      },
      {
        id: "prog-8",
        name: "School Feeding Programme",
        status: "Approved",
        deliveryStatus: "Partial",
        appliedDate: "2023-08-20",
        approvedDate: "2023-09-01",
        benefitAmount: 5000,
        weight: 8,
      },
      {
        id: "prog-9",
        name: "Senior Citizens Grant",
        status: "Rejected",
        deliveryStatus: "Not Applicable",
        appliedDate: "2023-06-01",
        approvedDate: null,
        benefitAmount: null,
        weight: 12,
      },
      {
        id: "prog-10",
        name: "Disaster Relief Fund",
        status: "Approved",
        deliveryStatus: "Delivered",
        appliedDate: "2023-11-15",
        approvedDate: "2023-12-01",
        benefitAmount: 12000,
        weight: 10,
      },
      {
        id: "prog-11",
        name: "Youth Employment Initiative",
        status: "Pending",
        deliveryStatus: "Pending",
        appliedDate: "2024-01-15",
        approvedDate: null,
        benefitAmount: null,
        weight: 15,
      },
      {
        id: "prog-12",
        name: "Community Development Grant",
        status: "Approved",
        deliveryStatus: "Delivered",
        appliedDate: "2023-03-10",
        approvedDate: "2023-04-20",
        benefitAmount: 18000,
        weight: 12,
      },
    ],
    submissions: {
      total: 8,
      completed: 6,
    },
    approvalRate: 75,
  }
}

export default async function PersonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const person = getPersonData(id)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 bg-card border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/people">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                  {person.name}
                </h1>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-green-100 text-green-700 text-[10px] sm:text-xs font-semibold rounded-full flex-shrink-0">
                  {person.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
                OneID: <span className="font-mono font-medium">{person.oneId}</span>
              </p>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 sm:ml-auto w-full sm:w-auto flex-shrink-0">
            <Pencil className="size-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      <PersonTabs person={person} />
    </div>
  )
}
