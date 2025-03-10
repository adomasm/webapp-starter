import { db, gcData } from "@repo/db";
import { desc, sql } from "drizzle-orm";

export const gcService = {
  async getGCData() {
    return db.select().from(gcData).orderBy(desc(gcData.counter));
  },

  async getUniqueLabelIds() {
    const result = await db
      .select({ labelId: gcData.labelId })
      .from(gcData)
      .where(sql`${gcData.labelId} is not null`)
      .groupBy(gcData.labelId);
    
    return result.map(r => r.labelId);
  },

  async importCSVData(data: { timestamp: string; gasPid1: number; counter: number; labelId?: string }[]) {
    // First clear existing data
    await db.delete(gcData);
    
    // Insert new data
    return db.insert(gcData).values(
      data.map(row => ({
        timestamp: new Date(row.timestamp),
        gasPid1: row.gasPid1,
        counter: row.counter,
        labelId: row.labelId || null,
      }))
    );
  }
}; 