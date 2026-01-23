"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SidebarContextType {
  isCollapsed: boolean
  isMobileOpen: boolean
  toggle: () => void
  setCollapsed: (collapsed: boolean) => void
  toggleMobile: () => void
  setMobileOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggle = () => setIsCollapsed((prev) => !prev)
  const setCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed)
  const toggleMobile = () => setIsMobileOpen((prev) => !prev)
  const setMobileOpen = (open: boolean) => setIsMobileOpen(open)

  return (
    <SidebarContext.Provider value={{ isCollapsed, isMobileOpen, toggle, setCollapsed, toggleMobile, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
