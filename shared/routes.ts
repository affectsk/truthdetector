import { z } from 'zod';
import { analysisResults, analyzeRequestSchema, insertAnalysisSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  articles: {
    analyze: {
      method: 'POST' as const,
      path: '/api/analyze' as const,
      input: analyzeRequestSchema,
      responses: {
        200: z.custom<typeof analysisResults.$inferSelect>(), 
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/history' as const,
      responses: {
        200: z.array(z.custom<typeof analysisResults.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/history/:id' as const,
      responses: {
        200: z.custom<typeof analysisResults.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
