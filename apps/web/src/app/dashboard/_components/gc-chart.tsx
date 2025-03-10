"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GCData } from "../page";
import { parseCSVData, fetchGCData, type GCDataPoint } from "./utils";

interface GCChartProps {
  selectedLabelId: string | null;
}

export function GCChart({ selectedLabelId }: GCChartProps) {
  const [data, setData] = useState<GCDataPoint[]>([]);
  const [maxPID1, setMaxPID1] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const csvData = await fetchGCData();
        const parsedData = parseCSVData(csvData);
        setData(parsedData);
        
        // Calculate max PID1 value for Y-axis scaling
        const maxValue = Math.max(...parsedData.map((d: GCDataPoint) => d.pid1 || 0));
        setMaxPID1(maxValue);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading chart data...</div>;
  }

  if (error) {
    return <div className="text-sm text-destructive">Error: {error}</div>;
  }

  // Filter data based on selected label-id
  const filteredData = selectedLabelId
    ? data.filter((d: GCDataPoint) => d.labelId === selectedLabelId)
    : data;

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={filteredData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="linear"
            label={{ value: "Timestamp", position: "bottom" }}
          />
          <YAxis
            domain={[0, maxPID1 * 1.1]} // Add 10% padding to max value
            label={{
              value: "Gas PID-1",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pid1"
            stroke="#8884d8"
            dot={false}
            name="Gas PID-1"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 