import { Sidebar } from "./sidebar";
import { TopBar } from "./topbar";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <TopBar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
