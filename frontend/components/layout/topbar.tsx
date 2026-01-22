"use client";

import { Search, Mail, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function TopBar() {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-6">
      <div className="flex flex-1 items-center gap-4">
        {/* <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search task"
            className="pl-9 pr-20"
          />

        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

      </div>
    </div>
  );
}
