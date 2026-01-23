import Image from "next/image"

interface ProgramsHeaderProps {
  totalPrograms: number
  activePrograms: number
}

export function ProgramsHeader({ totalPrograms, activePrograms }: ProgramsHeaderProps) {
  return (
    <header className="relative flex-shrink-0 bg-gradient-to-r from-emerald-50 via-emerald-100 to-teal-100 dark:from-emerald-950 dark:via-emerald-900 dark:to-teal-900 border-b border-border overflow-hidden">
      <div className="relative z-10 px-4 md:px-8 py-6 md:py-8 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-black text-foreground leading-none tracking-tight">
          Programs
        </h2>
        <div className="mt-2 md:mt-3">
          <p className="text-base md:text-lg font-bold text-emerald-700 dark:text-emerald-400 leading-tight">
            {activePrograms} Active Programs
          </p>
          <p className="text-xs md:text-sm font-medium text-muted-foreground mt-2 leading-relaxed max-w-xl hidden sm:block">
            Manage and monitor social welfare programs across all ministries. Track budgets, beneficiaries, and delivery rates to ensure effective resource allocation.
          </p>
        </div>
      </div>
      
      {/* Background image with fade effect - hidden on mobile */}
      <div className="absolute right-0 top-0 h-full w-2/5 overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100 dark:from-emerald-900 via-emerald-100/90 dark:via-emerald-900/90 to-transparent z-10" />
        <Image
          src="/images/programs-banner.jpg"
          alt="Social welfare programs"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
      </div>
    </header>
  )
}
