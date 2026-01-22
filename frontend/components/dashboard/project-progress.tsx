import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectProgress() {
  const progress = 41;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="text-blue-600 transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold">{progress}%</p>
              </div>
            </div>
          </div>
          <p className="text-sm font-medium text-center">Project Ended</p>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-muted-foreground">Completed</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-muted-foreground">In Progress</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-striped border border-border"></div>
              <span className="text-muted-foreground">Pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
