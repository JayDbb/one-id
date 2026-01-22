import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
  {
    name: "Alexandra Deff",
    task: "Working on Github Project Repository",
    status: "Completed",
    statusColor: "bg-blue-600",
    initials: "AD",
  },
  {
    name: "Edwin Adenike",
    task: "Working on Integrate User Authentication System",
    status: "In Progress",
    statusColor: "bg-yellow-500",
    initials: "EA",
  },
  {
    name: "Isaac Oluwatemilorun",
    task: "Working on Develop Search and Filter Functionality",
    status: "Pending",
    statusColor: "bg-red-500",
    initials: "IO",
  },
  {
    name: "David Oshodi",
    task: "Working on Responsive Layout for Homepage",
    status: "In Progress",
    statusColor: "bg-yellow-500",
    initials: "DO",
  },
];

export function TeamCollaboration() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Team Collaboration</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
            >
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                <AvatarFallback>{member.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.task}
                </p>
                <span
                  className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${member.statusColor} text-white`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
