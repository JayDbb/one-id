"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Layers,
  FileText,
  BarChart3,
  Settings,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/people", label: "People", icon: Users },
  { href: "/programs", label: "Programs", icon: Layers },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/reports", label: "Reports", icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, isMobileOpen, toggle, setMobileOpen } = useSidebar()

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside
        className={cn(
          "bg-sidebar-bg text-sidebar-foreground flex-shrink-0 flex flex-col border-r border-sidebar-border h-full transition-all duration-300",
          // Desktop: normal sidebar behavior
          "hidden lg:flex",
          isCollapsed ? "lg:w-[72px]" : "lg:w-64",
        )}
      >
        {/* Logo */}
        <div className={cn("p-4 flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <Building2 className="size-5" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white text-base font-bold leading-tight truncate">Admin Panel</h1>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">Registry System</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            if (isCollapsed) {
              return (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-center p-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary/10 text-white"
                            : "hover:bg-slate-800 text-slate-300"
                        )}
                      >
                        <item.icon className={cn("size-5", isActive ? "text-primary" : "text-slate-400")} />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 border-l-4 border-primary text-white"
                    : "hover:bg-slate-800 text-slate-300"
                )}
              >
                <item.icon className={cn("size-5 flex-shrink-0", isActive ? "text-primary" : "text-slate-400")} />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-sidebar-border">
          <TooltipProvider>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/settings"
                    className="flex items-center justify-center p-3 rounded-lg hover:bg-slate-800 transition-colors mb-2"
                  >
                    <Settings className="size-5 text-slate-400" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors mb-2"
              >
                <Settings className="size-5 text-slate-400 flex-shrink-0" />
                <span className="text-sm font-medium truncate">Settings</span>
              </Link>
            )}
          </TooltipProvider>
          
          {/* User profile */}
          <div className={cn(
            "flex items-center gap-3 px-2 py-2 bg-slate-800/50 rounded-xl mb-2",
            isCollapsed && "justify-center px-0"
          )}>
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
              RC
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Robert Chen</p>
                <p className="text-[10px] text-slate-400 truncate">System Admin</p>
              </div>
            )}
          </div>

        {/* Collapse button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggle}
          className={cn(
            "w-full text-slate-400 hover:text-white hover:bg-slate-800",
            isCollapsed && "px-0"
          )}
        >
          {isCollapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <>
              <ChevronsLeft className="size-4 mr-2" />
              <span className="text-xs">Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>

    {/* Mobile sidebar */}
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar-bg text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-transform duration-300 lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <Building2 className="size-5" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-white text-base font-bold leading-tight truncate">Admin Panel</h1>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">Registry System</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(false)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary/10 border-l-4 border-primary text-white"
                  : "hover:bg-slate-800 text-slate-300"
              )}
            >
              <item.icon className={cn("size-5 flex-shrink-0", isActive ? "text-primary" : "text-slate-400")} />
              <span className="text-sm font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-800 transition-colors mb-2"
        >
          <Settings className="size-5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-medium truncate">Settings</span>
        </Link>
        
        {/* User profile */}
        <div className="flex items-center gap-3 px-2 py-2 bg-slate-800/50 rounded-xl">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            RC
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Robert Chen</p>
            <p className="text-[10px] text-slate-400 truncate">System Admin</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  )
}
