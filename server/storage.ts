import { db } from "./db";
import { analysisResults, type AnalysisResult, type InsertAnalysisResult } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: InsertAnalysisResult): Promise<AnalysisResult>;
  getAnalysis(id: number): Promise<AnalysisResult | undefined>;
  listAnalyses(): Promise<AnalysisResult[]>;
}

export class DatabaseStorage implements IStorage {
  async createAnalysis(analysis: InsertAnalysisResult): Promise<AnalysisResult> {
    const [result] = await db.insert(analysisResults).values(analysis).returning();
    return result;
  }

  async getAnalysis(id: number): Promise<AnalysisResult | undefined> {
    const [result] = await db.select().from(analysisResults).where(eq(analysisResults.id, id));
    return result;
  }

  async listAnalyses(): Promise<AnalysisResult[]> {
    return await db.select().from(analysisResults).orderBy(desc(analysisResults.createdAt));
  }
}

export const storage = new DatabaseStorage();
