import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { type AnalysisResult } from "@shared/schema";
import { StatusBadge } from "./StatusBadge";
import { ArrowRight, Globe, FileText } from "lucide-react";

interface AnalysisCardProps {
  analysis: AnalysisResult;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  return (
    <Link href={`/result/${analysis.id}`} className="block group">
      <div className="
        bg-card rounded-xl p-5 border border-border/60
        hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5
        transition-all duration-300 relative overflow-hidden
      ">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            {analysis.url ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            <span>{formatDistanceToNow(new Date(analysis.createdAt || Date.now()), { addSuffix: true })}</span>
          </div>
          <StatusBadge score={analysis.credibilityScore} />
        </div>
        
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {analysis.title || "Untitled Analysis"}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {analysis.contentSnippet || "No content preview available."}
        </p>
        
        <div className="flex items-center text-primary text-sm font-semibold group-hover:underline">
          View Analysis <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
