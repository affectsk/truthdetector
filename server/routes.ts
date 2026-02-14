import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { scrapeUrl } from "./scraper";
import { analyzeContent } from "./analyzer";
import { insertAnalysisSchema } from "@shared/schema";
import { seed } from "./seed";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Seed the database with sample data
  await seed();

  app.post(api.articles.analyze.path, async (req, res) => {
    try {
      const { url, text } = api.articles.analyze.input.parse(req.body);
      
      let contentToAnalyze = text || "";
      let title = "User Input Text";
      let finalUrl = url;

      if (url && !text) {
        try {
          const scraped = await scrapeUrl(url);
          contentToAnalyze = scraped.content;
          title = scraped.title;
        } catch (error) {
           return res.status(400).json({ message: "Failed to scrape URL. Please try pasting the text instead." });
        }
      }

      if (contentToAnalyze.length < 50) {
        return res.status(400).json({ message: "Content is too short to analyze." });
      }

      const analysis = await analyzeContent(contentToAnalyze, finalUrl);

      const result = await storage.createAnalysis({
        url: finalUrl,
        title,
        contentSnippet: contentToAnalyze.slice(0, 200),
        credibilityScore: analysis.score,
        breakdown: {
            redFlags: analysis.redFlags,
            positiveSignals: analysis.positiveSignals,
            recommendation: analysis.recommendation,
            emotionalLanguageScore: analysis.emotionalLanguageScore,
            citationQualityScore: analysis.citationQualityScore,
            domainReputation: analysis.domainReputation,
            writingStyleSummary: analysis.writingStyleSummary,
        },
      });

      res.json(result);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ message: "Failed to analyze content." });
    }
  });

  app.get(api.articles.list.path, async (req, res) => {
    try {
      const results = await storage.listAnalyses();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to list history." });
    }
  });

  app.get(api.articles.get.path, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await storage.getAnalysis(id);
        if (!result) return res.status(404).json({ message: "Analysis not found" });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Failed to get analysis." });
    }
  });

  return httpServer;
}
