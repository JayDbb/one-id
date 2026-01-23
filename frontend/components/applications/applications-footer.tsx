interface ApplicationsFooterProps {
  total: number
  showing: number
}

export function ApplicationsFooter({ total, showing }: ApplicationsFooterProps) {
  return (
    <footer className="px-4 md:px-8 py-3 bg-card border-t border-border flex items-center justify-between">
      <p className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{showing}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span> applications
      </p>
      <p className="text-xs text-muted-foreground hidden sm:block">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </footer>
  )
}
