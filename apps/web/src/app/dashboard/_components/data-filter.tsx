"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GCData } from "../page";
import { parseCSVData, fetchGCData, type GCDataPoint } from "./utils";

interface DataFilterProps {
  selectedLabelId: string | null;
  onLabelIdChange: (value: string | null) => void;
}

export function DataFilter({ selectedLabelId, onLabelIdChange }: DataFilterProps) {
  const [uniqueLabelIds, setUniqueLabelIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const csvData = await fetchGCData();
        const data = parseCSVData(csvData);
        const labels = Array.from(new Set(data.map((d: GCDataPoint) => d.labelId).filter(Boolean)));
        setUniqueLabelIds(labels as string[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading labels...</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="label-filter" className="text-sm font-medium">
          Filter by Label ID
        </label>
        <Select
          value={selectedLabelId || ""}
          onValueChange={(value) => onLabelIdChange(value || null)}
        >
          <SelectTrigger id="label-filter">
            <SelectValue placeholder="Select a label ID" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Labels</SelectItem>
            {uniqueLabelIds.map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 