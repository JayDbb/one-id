"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Search, Bell, HelpCircle, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { useSidebar } from "./sidebar-context"
import { cn } from "@/lib/utils"

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Dashboard"
  if (pathname === "/people") return "People"
  if (pathname.startsWith("/people/")) return "Person Details"
  // Add more routes as needed
  const segment = pathname.split("/").filter(Boolean)[0]
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : "Dashboard"
}

export function TopNav() {
  const { toggleMobile } = useSidebar()
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setSearchQuery("")
      }
    }
    if (isSearchOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isSearchOpen])

  return (
    <>
      <div className="bg-card border-b border-border px-4 md:px-8 py-3 flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground hover:text-foreground flex-shrink-0"
          onClick={toggleMobile}
        >
          <Menu className="size-5" />
        </Button>

        {/* Page Title with Search Icon */}
        <div className="flex items-center gap-2 flex-1">
          <h1 className="text-lg md:text-xl font-semibold text-foreground">
            {pageTitle}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <Bell className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <HelpCircle className="size-5" />
          </Button>
        </div>
      </div>

      {/* ChatGPT-style Search Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity duration-200",
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => {
          setIsSearchOpen(false)
          setSearchQuery("")
        }}
      >
        <div
          className={cn(
            "fixed left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-300 ease-out",
            isSearchOpen ? "top-[20%] opacity-100" : "top-[15%] opacity-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-muted-foreground size-5" />
              <Input
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-base md:text-lg bg-transparent border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
                placeholder="Search people, programs, or records..."
                type="text"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery("")
                }}
              >
                <X className="size-5" />
              </Button>
            </div>

            {/* Quick Actions / Recent Searches */}
            <div className="border-t border-border px-4 py-3">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Quick Actions
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Find by NIS
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Search Programs
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Recent Records
                </button>
              </div>
            </div>

            {/* Search Results Preview (when typing) */}
            {searchQuery && (
              <div className="border-t border-border px-4 py-3 max-h-64 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Results
                </p>
                <div className="space-y-1">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center gap-3"
                  >
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Search for &quot;{searchQuery}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Press Enter to search
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Keyboard Hint */}
            <div className="border-t border-border px-4 py-2 flex items-center justify-end gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">
                  ESC
                </kbd>
                <span>to close</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-[10px] font-mono">
                  Enter
                </kbd>
                <span>to search</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
