import { Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Reminders() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">
              Meeting
            </h3>
            <p className="text-sm text-muted-foreground">
              02.00 pm - 04.00 pm
            </p>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Video className="mr-2 h-4 w-4" />
            Start Meeting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
