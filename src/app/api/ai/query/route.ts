/**
 * TERRALIGN 2.0 — Multi-Model AI Query API Route
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Secure server-side endpoint for Gemini, Grok, and Dual Consensus queries.
 * Strictly adheres to Next.js 15 Route Handler conventions (HTTP-method exports only).
 * Shared business logic and dependency injection reside in @/lib/ai/aiQueryHandler.
 * Never exposes API keys to client runtime.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AIModelQuery } from '@/types/ai';
import { handleAIQuery } from '@/lib/ai/aiQueryHandler';

export async function POST(req: NextRequest) {
  try {
    const rawBody = (await req.json()) as Record<string, unknown>;

    if (!rawBody || typeof rawBody.prompt !== 'string' || !rawBody.prompt.trim()) {
      return NextResponse.json(
        { error: 'Invalid inquiry: prompt string is required' },
        { status: 400 }
      );
    }

    // Strict input sanitization: strip any client-supplied mock flags or internal fields
    const sanitizedQuery: AIModelQuery = {
      prompt: String(rawBody.prompt).trim().slice(0, 4000),
      mode: (rawBody.mode === 'gemini' || rawBody.mode === 'groq' || rawBody.mode === 'grok' || rawBody.mode === 'dual')
        ? (rawBody.mode === 'grok' ? 'groq' : rawBody.mode)
        : 'dual',
      context: rawBody.context && typeof rawBody.context === 'object'
        ? (rawBody.context as AIModelQuery['context'])
        : undefined,
      temperature: typeof rawBody.temperature === 'number'
        ? Math.max(0, Math.min(1, rawBody.temperature))
        : undefined,
      maxTokens: typeof rawBody.maxTokens === 'number'
        ? Math.max(100, Math.min(2048, rawBody.maxTokens))
        : undefined,
    };

    // Public API route executes with standard server configuration (no mock test injection)
    const result = await handleAIQuery(sanitizedQuery);

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'AI query processing failed',
        message: error?.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
