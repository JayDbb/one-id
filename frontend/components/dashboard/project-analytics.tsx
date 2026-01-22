import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const data = [30, 74, 65, 50, 40, 35, 45];

export function ProjectAnalytics() {
  const maxValue = Math.max(...data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-48">
          {days.map((day, index) => {
            const height = (data[index] / maxValue) * 100;
            const isHighlighted = index >= 1 && index <= 3;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative w-full flex items-end justify-center h-40">
                  <div
                    className={`
                      w-full rounded-t-lg transition-all
                      ${isHighlighted ? "bg-blue-600" : "bg-striped bg-muted"}
                    `}
                    style={{ height: `${height}%` }}
                  >
                    {isHighlighted && index === 2 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium text-blue-600">
                        {data[index]}%
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-2">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
