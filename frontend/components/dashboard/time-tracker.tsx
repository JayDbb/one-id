"use client";

import { useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState({ hours: 1, minutes: 24, seconds: 8 });

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-white mb-2">
              {formatTime(time.hours)}:{formatTime(time.minutes)}:
              {formatTime(time.seconds)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 bg-red-500/20 hover:bg-red-500/30 text-white"
            >
              <Square className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
