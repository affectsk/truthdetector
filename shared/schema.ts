import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  url: text("url"), // Optional, if text was pasted
  title: text("title"),
  contentSnippet: text("content_snippet"), // Store first few chars or summary
  credibilityScore: integer("credibility_score").notNull(),
  breakdown: jsonb("breakdown").notNull(), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnalysisSchema = createInsertSchema(analysisResults).omit({
  id: true,
  createdAt: true,
});

export type AnalysisResult = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisSchema>;

// Request type for analysis
export const analyzeRequestSchema = z.object({
  url: z.string().url().optional(),
  text: z.string().min(50, "Text must be at least 50 characters long").optional(),
}).refine(data => data.url || data.text, {
  message: "Either URL or text must be provided",
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

export interface AnalysisBreakdown {
  redFlags: string[];
  positiveSignals: string[];
  recommendation: "Trustworthy" | "Verify carefully" | "Likely propaganda";
  emotionalLanguageScore: number; // 0-100
  citationQualityScore: number; // 0-100
  domainReputation: "Safe" | "Suspicious" | "Unknown";
  writingStyleSummary: string;
}
