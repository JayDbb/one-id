import { Plus, Hash, Type, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const fields = [
  {
    fieldId: "first_name",
    title: "First Name",
    type: "text",
    icon: Type,
  },
  {
    fieldId: "email",
    title: "Email Address",
    type: "email",
    icon: Type,
  },
  {
    fieldId: "phone",
    title: "Phone Number",
    type: "tel",
    icon: Type,
  },
  {
    fieldId: "date_of_birth",
    title: "Date of Birth",
    type: "date",
    icon: FileCheck,
  },
  {
    fieldId: "national_id",
    title: "National ID",
    type: "text",
    icon: Hash,
  },
];

export function FieldRegistrySummary() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Field Registry</CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{field.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {field.fieldId} • {field.type}
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
