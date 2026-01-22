"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    FolderKanban,
    FileText,
    ChevronLeft,
    ChevronRight,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "People", href: "/people", icon: Users },
    { name: "Programs", href: "/programs", icon: FolderKanban },
    { name: "Applications", href: "/applications", icon: FileText },
];

const settingsItem = {
    name: "Settings",
    href: "/settings",
    icon: Settings,
};

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <div
            className={cn(
                "fixed left-0 top-0 h-screen bg-card shadow-sm shadow-black/3 dark:shadow-black/10 transition-all duration-300 z-50",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex flex-col h-full p-4">
                {/* Toggle Button */}
                <div className="flex justify-end mb-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="h-8 w-8"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                    isCollapsed && "justify-center"
                                )}
                                title={isCollapsed ? item.name : undefined}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {!isCollapsed && (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings at bottom */}
                <div className="mt-auto pt-4 border-t border-border">
                    <Link
                        href={settingsItem.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                            pathname === settingsItem.href
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                            isCollapsed && "justify-center"
                        )}
                        title={isCollapsed ? settingsItem.name : undefined}
                    >
                        <settingsItem.icon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                            <span className="truncate">{settingsItem.name}</span>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    );
}
