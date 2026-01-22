"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const data = [12, 45, 38, 52, 28, 35, 42];

export function ApplicationAnalytics() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data);
  const total = data.reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Application Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-4">
        <div className="space-y-1.5">
          <div className="relative pl-8">
            {/* Chart container with fixed height */}
            <div className="flex items-end justify-between gap-2 h-48 relative">
              {/* Y-axis labels */}
              <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-xs text-muted-foreground">
                <span>{maxValue}</span>
                <span>{Math.round(maxValue / 2)}</span>
                <span>0</span>
              </div>

              {/* Bars container */}
              <div className="flex-1 flex items-end justify-between gap-2 h-full">
                {days.map((day, index) => {
                  const height = (data[index] / maxValue) * 100;
                  const isHovered = hoveredIndex === index;

                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center group relative h-full"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10 px-3 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg shadow-lg text-xs font-medium whitespace-nowrap">
                          {data[index]} applications
                        </div>
                      )}

                      {/* Bar container - fills full height for proper alignment */}
                      <div className="relative w-full h-full flex items-end justify-center">
                        <div
                          className={cn(
                            "w-full rounded-t-lg transition-all duration-200 cursor-pointer",
                            isHovered
                              ? "bg-blue-600 opacity-100"
                              : "bg-blue-600 opacity-90 hover:opacity-100"
                          )}
                          style={{
                            height: `${height}%`,
                            minHeight: height > 0 ? "4px" : "0",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Day labels - positioned below chart */}
            <div className="flex items-center justify-between gap-2 mt-1 pl-0">
              {days.map((day, index) => {
                const isHovered = hoveredIndex === index;
                return (
                  <div key={index} className="flex-1 flex justify-center">
                    <span
                      className={cn(
                        "text-xs transition-all",
                        isHovered
                          ? "text-foreground font-bold"
                          : "text-muted-foreground font-medium"
                      )}
                    >
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis summary */}
          <div className="border-t border-border pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last 7 days</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">
                Total: {total} applications
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
