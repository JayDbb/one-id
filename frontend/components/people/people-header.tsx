import Image from "next/image"

interface PeopleHeaderProps {
  totalPeople: number
}

export function PeopleHeader({ totalPeople }: PeopleHeaderProps) {
  return (
    <header className="relative flex-shrink-0 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 border-b border-border overflow-hidden">
      <div className="relative z-10 px-4 md:px-8 py-6 md:py-8 max-w-2xl">
        <h2 className="text-3xl md:text-5xl font-black text-foreground leading-none tracking-tight">
          People
        </h2>
        <div className="mt-2 md:mt-3">
          <p className="text-base md:text-lg font-bold text-primary leading-tight">
            Total: {totalPeople} People
          </p>
          <p className="text-xs md:text-sm font-medium text-muted-foreground mt-2 leading-relaxed max-w-xl hidden sm:block">
            Consolidated overview of citizen registrations and program effectiveness across all regions. This dashboard reflects our ongoing commitment to community engagement and transparent governance.
          </p>
        </div>
      </div>
      
      {/* Background image with fade effect - hidden on mobile */}
      <div className="absolute right-0 top-0 h-full w-2/5 overflow-hidden hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100/90 to-transparent z-10" />
        <Image
          src="/images/community-banner.jpg"
          alt="Happy community members"
          fill
          className="object-cover object-center opacity-60"
          priority
        />
      </div>
    </header>
  )
}
