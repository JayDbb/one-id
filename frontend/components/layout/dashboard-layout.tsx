"use client";

import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";
import { SidebarProvider, useSidebar } from "./sidebar-context";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "pl-16" : "pl-64"
        }`}
      >
        <TopBar />
        <main className="p-6">{children}</main>
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
