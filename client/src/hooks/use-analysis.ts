import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type AnalyzeRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Helper to handle API validation errors
const handleApiError = (error: unknown, toast: any) => {
  console.error("API Error:", error);
  let message = "An unexpected error occurred";
  if (error instanceof Error) {
    message = error.message;
  }
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
};

export function useHistory() {
  return useQuery({
    queryKey: [api.articles.list.path],
    queryFn: async () => {
      const res = await fetch(api.articles.list.path);
      if (!res.ok) throw new Error("Failed to fetch history");
      return api.articles.list.responses[200].parse(await res.json());
    },
  });
}

export function useAnalysisResult(id: number) {
  return useQuery({
    queryKey: [api.articles.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.articles.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch analysis");
      return api.articles.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useAnalyzeArticle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      // Client-side validation before request
      try {
        api.articles.analyze.input.parse(data);
      } catch (err) {
        if (err instanceof z.ZodError) {
          throw new Error(err.errors[0].message);
        }
        throw err;
      }

      const res = await fetch(api.articles.analyze.path, {
        method: api.articles.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.articles.analyze.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
          const error = api.articles.analyze.responses[500].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Analysis failed");
      }

      return api.articles.analyze.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.articles.list.path] });
    },
    onError: (error) => handleApiError(error, toast),
  });
}
