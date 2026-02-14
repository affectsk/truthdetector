import OpenAI from "openai";
import { AnalysisBreakdown } from "@shared/schema";

// the newest OpenAI model is "gpt-5", released on April 27, 2025.
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function analyzeContent(content: string, url?: string): Promise<AnalysisBreakdown & { score: number }> {
  const prompt = `Analyze the credibility of the following article content${url ? ` (from URL: ${url})` : ''}.

Content:
"${content.slice(0, 5000)}" 
(Content truncated to first 5000 chars if longer)

Provide a JSON response with the following fields:
- redFlags: array of strings (specific issues found like "Sensationalist headline", "Lack of citations", "Logical fallacies")
- positiveSignals: array of strings (e.g., "Cites reputable sources", "Balanced tone", "Clear authorship")
- recommendation: one of "Trustworthy", "Verify carefully", "Likely propaganda"
- emotionalLanguageScore: number 0-100 (0 = neutral, 100 = highly emotional/manipulative)
- citationQualityScore: number 0-100 (0 = no citations/bad sources, 100 = excellent academic/primary sources)
- domainReputation: one of "Safe", "Suspicious", "Unknown" (if URL provided, check domain; if text, mark Unknown unless obvious)
- writingStyleSummary: string (brief description of tone and style)
- credibilityScore: number 0-100 (overall score, 100 is most credible)

Ensure the response is valid JSON.`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      { role: "system", content: "You are an expert media literacy analyst. Your goal is to help users identify misinformation, propaganda, and low-quality content. Be objective and educational." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || "{}");
  
  return {
    redFlags: result.redFlags || [],
    positiveSignals: result.positiveSignals || [],
    recommendation: result.recommendation || "Verify carefully",
    emotionalLanguageScore: result.emotionalLanguageScore || 50,
    citationQualityScore: result.citationQualityScore || 50,
    domainReputation: result.domainReputation || "Unknown",
    writingStyleSummary: result.writingStyleSummary || "Analysis unavailable",
    score: result.credibilityScore || 50,
  };
}
