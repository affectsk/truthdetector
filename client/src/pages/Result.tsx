import { useRoute } from "wouter";
import { useAnalysisResult } from "@/hooks/use-analysis.ts";
import { Header } from "@/components/Header";
import { ScoreGauge } from "@/components/ScoreGauge";
import { Loader2, AlertTriangle, CheckCircle, Info, ExternalLink, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { type AnalysisBreakdown } from "@shared/schema";
import { clsx } from "clsx";

export default function Result() {
  const [, params] = useRoute("/result/:id");
  const id = parseInt(params?.id || "0");
  const { data: analysis, isLoading, error } = useAnalysisResult(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Analysis Not Found</h2>
            <p className="text-muted-foreground mb-6">Could not retrieve the analysis result. It may have been deleted or does not exist.</p>
            <Link href="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const breakdown = analysis.breakdown as AnalysisBreakdown;

  return (
    <div className="min-h-screen bg-background gradient-bg flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Analyze
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <ScoreGauge score={analysis.credibilityScore} />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" /> Recommendation
              </h3>
              <p className={clsx("text-lg font-medium mb-2", {
                "text-green-600": breakdown.recommendation === "Trustworthy",
                "text-amber-600": breakdown.recommendation === "Verify carefully",
                "text-red-600": breakdown.recommendation === "Likely propaganda",
              })}>
                {breakdown.recommendation}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {breakdown.writingStyleSummary}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <h3 className="font-bold text-foreground mb-4">Article Details</h3>
              {analysis.title && (
                <div className="mb-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Title</span>
                  <p className="text-sm font-medium mt-1">{analysis.title}</p>
                </div>
              )}
              {analysis.url && (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Source URL</span>
                  <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline mt-1 truncate">
                    {new URL(analysis.url).hostname} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Detailed Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Red Flags */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-100 dark:border-red-900/50"
              >
                <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Red Flags
                </h3>
                {breakdown.redFlags.length > 0 ? (
                  <ul className="space-y-3">
                    {breakdown.redFlags.map((flag, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No major red flags detected.</p>
                )}
              </motion.div>

              {/* Positive Signals */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-50/50 dark:bg-green-950/20 rounded-2xl p-6 border border-green-100 dark:border-green-900/50"
              >
                <h3 className="text-lg font-bold text-green-700 dark:text-green-400 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Positive Signals
                </h3>
                {breakdown.positiveSignals.length > 0 ? (
                  <ul className="space-y-3">
                    {breakdown.positiveSignals.map((signal, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No specific positive signals found.</p>
                )}
              </motion.div>
            </div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <h3 className="text-lg font-bold mb-6">Detailed Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Emotional Language</span>
                    <span className="text-sm font-bold">{breakdown.emotionalLanguageScore}/100</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${breakdown.emotionalLanguageScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Lower is better (less sensationalism)</p>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Citation Quality</span>
                    <span className="text-sm font-bold">{breakdown.citationQualityScore}/100</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                      style={{ width: `${breakdown.citationQualityScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Higher is better (more reliable sources)</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Domain Reputation</span>
                    <span className={clsx("text-sm font-bold px-3 py-1 rounded-full", {
                      "bg-green-100 text-green-700": breakdown.domainReputation === "Safe",
                      "bg-amber-100 text-amber-700": breakdown.domainReputation === "Suspicious" || breakdown.domainReputation === "Unknown",
                    })}>
                      {breakdown.domainReputation}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
