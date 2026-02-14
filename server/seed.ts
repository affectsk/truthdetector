
import { storage } from "./storage";

export async function seed() {
  const existing = await storage.listAnalyses();
  if (existing.length > 0) return;

  await storage.createAnalysis({
    title: "Sample Credible Article: Mars Exploration Update",
    contentSnippet: "NASA's Perseverance rover has successfully collected its 10th rock sample...",
    credibilityScore: 95,
    breakdown: {
      redFlags: [],
      positiveSignals: ["Cites official NASA reports", "Neutral tone", "Clear authorship"],
      recommendation: "Trustworthy",
      emotionalLanguageScore: 10,
      citationQualityScore: 90,
      domainReputation: "Safe",
      writingStyleSummary: "Professional and objective scientific reporting.",
    }
  });

  await storage.createAnalysis({
    title: "Sample Clickbait: YOU WON'T BELIEVE WHAT HAPPENED!",
    contentSnippet: "Doctors hate this one weird trick! The secret they don't want you to know...",
    credibilityScore: 20,
    breakdown: {
      redFlags: ["Sensationalist headline", "All-caps", "Vague authority figures"],
      positiveSignals: [],
      recommendation: "Likely propaganda",
      emotionalLanguageScore: 90,
      citationQualityScore: 10,
      domainReputation: "Suspicious",
      writingStyleSummary: "Highly emotional, clickbait style with poor grammar.",
    }
  });
}
