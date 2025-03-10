export interface GCDataPoint {
  timestamp: number;
  pid1: number;
  labelId: string;
}

export async function fetchGCData(): Promise<string> {
  const response = await fetch('http://localhost:3004/api/gc/data');
  if (!response.ok) {
    throw new Error('Failed to fetch GC data');
  }
  return response.text();
}

export function parseCSVData(csvData: string): GCDataPoint[] {
  if (!csvData) return [];
  
  const lines = csvData.split('\n');
  const data: GCDataPoint[] = [];
  
  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;
    
    const parts = line.split(',').map(val => val.trim());
    if (parts.length !== 3) continue;
    
    const [timestamp, pid1, labelId] = parts as [string, string, string];
    
    data.push({
      timestamp: parseInt(timestamp, 10),
      pid1: parseFloat(pid1),
      labelId
    });
  }
  
  return data;
} 