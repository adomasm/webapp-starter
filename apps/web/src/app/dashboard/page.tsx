"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GCChart } from "./_components/gc-chart";
import { DataFilter } from "./_components/data-filter";
import { useState } from "react";

export type GCData = {
  "sensors::gas-pid-1": number;
  Counter: number;
  "label-id": string;
};

export default function DashboardPage() {
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gas Chromatography Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Data Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <DataFilter
              onLabelIdChange={setSelectedLabelId}
              selectedLabelId={selectedLabelId}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart Controls</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add chart controls here later if needed */}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gas Chromatography Data</CardTitle>
        </CardHeader>
        <CardContent>
          <GCChart selectedLabelId={selectedLabelId} />
        </CardContent>
      </Card>
    </div>
  );
} 