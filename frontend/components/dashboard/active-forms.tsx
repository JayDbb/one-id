"use client";

import { useState } from "react";
import { FileText, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const forms = [
  {
    formName: "scholarship_2024",
    version: 3,
    isActive: true,
    applicants: 124,
  },
  {
    formName: "grant_application",
    version: 2,
    isActive: true,
    applicants: 89,
  },
  {
    formName: "fellowship_program",
    version: 1,
    isActive: false,
    applicants: 45,
  },
];

export function ActiveForms() {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-blue-700">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-white" />
            <h3 className="font-semibold text-lg text-white">Active Forms</h3>
          </div>
          <div className="space-y-3">
            {forms.map((form, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg transition-colors cursor-pointer",
                  form.isActive
                    ? "bg-white/20 hover:bg-white/30"
                    : "bg-white/10 hover:bg-white/20"
                )}
                onClick={() => setSelectedForm(form.formName)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-white">
                        {form.formName}
                      </p>
                      {form.isActive && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <p className="text-xs text-white/80">
                      v{form.version} • {form.applicants} applicants
                    </p>
                  </div>
                  {form.isActive && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/20">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      <span className="text-xs text-white">Active</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
