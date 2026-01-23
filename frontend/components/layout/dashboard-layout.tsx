"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { SidebarProvider, useSidebar } from "./sidebar-context";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden max-w-full">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 w-full min-w-0 max-w-full ${
          isCollapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <TopBar />
        <main className="p-2 sm:p-6 overflow-x-hidden max-w-full">{children}</main>
      </div>
    </div>
  );
}

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
