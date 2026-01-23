import { ArrowLeft, Pencil, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProgramTabs } from "@/components/programs/program-tabs"
import { mockPrograms } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  pilot: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  closed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

function getProgramData(id: string) {
  const program = mockPrograms.find(p => p.id === id)
  if (!program) {
    return {
      ...mockPrograms[0],
      id,
    }
  }
  return program
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const program = getProgramData(id)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-transparent dark:from-emerald-950 dark:via-emerald-900/50 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
            <Link href="/programs">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-1"
              >
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground">
                  {program.code}
                </h1>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs font-semibold uppercase", statusStyles[program.status])}
                >
                  {program.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {program.name}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {program.ministry}
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:ml-auto w-full sm:w-auto flex-shrink-0">
            <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
              <ExternalLink className="size-4 mr-2" />
              View Portal
            </Button>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700 flex-1 sm:flex-none">
              <Pencil className="size-4 mr-2" />
              Edit Program
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <ProgramTabs program={program} />
    </div>
  )
}
