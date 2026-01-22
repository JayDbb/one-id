import { Plus, Wrench, Waves, Puzzle, Zap, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const projects = [
  {
    name: "Develop API Endpoints",
    dueDate: "Nov 26, 2024",
    icon: Wrench,
    color: "text-blue-500",
  },
  {
    name: "Onboarding Flow",
    dueDate: "Nov 28, 2024",
    icon: Waves,
    color: "text-teal-500",
  },
  {
    name: "Build Dashboard",
    dueDate: "Nov 30, 2024",
    icon: Puzzle,
    color: "text-blue-500",
  },
  {
    name: "Optimize Page Load",
    dueDate: "Dec 5, 2024",
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    name: "Cross-Browser Testing",
    dueDate: "Dec 6, 2024",
    icon: Globe,
    color: "text-purple-500",
  },
];

export function ProjectList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${project.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Due date: {project.dueDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
