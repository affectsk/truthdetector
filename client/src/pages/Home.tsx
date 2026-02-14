import { useState } from "react";
import { useLocation } from "wouter";
import { useAnalyzeArticle, useHistory } from "@/hooks/use-analysis.ts";
import { Header } from "@/components/Header";
import { AnalysisCard } from "@/components/AnalysisCard";
import { Loader2, Link as LinkIcon, FileText, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"url" | "text">("url");
  const [input, setInput] = useState("");
  const { mutate: analyze, isPending } = useAnalyzeArticle();
  const { data: history, isLoading: isHistoryLoading } = useHistory();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAnalyze = () => {
    if (!input.trim()) {
      toast({ title: "Input required", description: "Please enter a URL or paste text to analyze.", variant: "destructive" });
      return;
    }

    const payload = activeTab === "url" ? { url: input } : { text: input };
    
    analyze(payload, {
      onSuccess: (data) => {
        setLocation(`/result/${data.id}`);
      },
    });
  };

  const setExample = (type: "credible" | "propaganda") => {
    setActiveTab("url");
    if (type === "credible") {
      setInput("https://www.reuters.com/science/astronomers-detect-most-distant-black-hole-seen-x-rays-2023-11-06/");
    } else {
      setInput("https://example-propaganda-site.com/shocking-truth-they-dont-want-you-to-know");
    }
  };

  return (
    <div className="min-h-screen bg-background gradient-bg flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3 h-3" /> AI-Powered Analysis
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight leading-tight">
              Decode the Truth Behind <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Every Headline</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Use advanced AI to analyze domain reputation, emotional language, and citation quality instantly.
            </p>
          </motion.div>

          {/* Input Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden max-w-2xl mx-auto"
          >
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab("url")}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "url" ? "bg-card text-primary border-b-2 border-primary" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <LinkIcon className="w-4 h-4" /> Analyze URL
              </button>
              <button
                onClick={() => setActiveTab("text")}
                className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "text" ? "bg-card text-primary border-b-2 border-primary" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <FileText className="w-4 h-4" /> Analyze Text
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative">
                {activeTab === "url" ? (
                  <input
                    type="url"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste article URL here..."
                    className="w-full h-14 pl-4 pr-32 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  />
                ) : (
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Paste full article text here (min 50 characters)..."
                    className="w-full h-32 p-4 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none"
                  />
                )}
                
                {activeTab === "url" && (
                  <div className="absolute right-2 top-2 bottom-2">
                    <button
                      onClick={handleAnalyze}
                      disabled={isPending || !input.trim()}
                      className="h-full px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                    >
                      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      Analyze
                    </button>
                  </div>
                )}
              </div>
              
              {activeTab === "text" && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    disabled={isPending || input.length < 50}
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Analyze Text
                  </button>
                </div>
              )}

              {/* Sample Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                <span>Try examples:</span>
                <button 
                  onClick={() => setExample("credible")}
                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors border border-green-200"
                >
                  Credible
                </button>
                <button 
                  onClick={() => setExample("propaganda")}
                  className="px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors border border-red-200"
                >
                  Clickbait
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Recent Analyses Section */}
        <section className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">Recent Analyses</h2>
          </div>
          
          {isHistoryLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {history && history.length > 0 ? (
                  history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AnalysisCard analysis={item} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-12 text-center text-muted-foreground bg-card/50 rounded-2xl border border-dashed border-border">
                    No analyses yet. Try analyzing your first article above!
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
