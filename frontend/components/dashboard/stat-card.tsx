import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  highlighted?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  highlighted = false,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        highlighted &&
          "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-700"
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p
              className={cn(
                "text-sm font-medium mb-2",
                highlighted ? "text-white/90" : "text-muted-foreground"
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "text-3xl font-bold mb-1",
                highlighted ? "text-white" : "text-foreground"
              )}
            >
              {value}
            </p>
            <p
              className={cn(
                "text-xs",
                highlighted ? "text-white/80" : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 shrink-0",
              highlighted
                ? "text-white hover:bg-white/20"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
