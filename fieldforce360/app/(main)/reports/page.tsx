"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Service Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Technician completion reports will appear here once submitted from
            the field dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
