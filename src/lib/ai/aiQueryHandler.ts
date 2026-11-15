/**
 * TERRALIGN 2.0 — Multi-Model AI Query Handler
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Server-only execution engine for Gemini, GroqCloud, and Dual Consensus queries.
 * Manages dependency injection for automated test harnesses and production API routes.
 * Supports cross-provider fallback when one provider is unconfigured or unavailable.
 * Never exposes credentials to client runtimes.
 */

import type { AIModelQuery, AIProviderId } from '@/types/ai';
import { queryGemini } from '@/lib/ai/geminiAdapter';
import { queryGroq } from '@/lib/ai/groqAdapter';
import { evaluateDualModels } from '@/lib/ai/dualEvaluator';

export interface AIQueryOptions {
  fetchFn?: typeof fetch;
  geminiApiKey?: string;
  groqApiKey?: string;
  grokApiKey?: string;
  geminiModel?: string;
  groqModel?: string;
  grokModel?: string;
  isTestMode?: boolean;
}

export async function handleAIQuery(query: AIModelQuery, options?: AIQueryOptions) {
  const mode = query.mode || 'dual';
  const geminiApiKey = options?.geminiApiKey ?? process.env.GEMINI_API_KEY;
  const groqApiKey = options?.groqApiKey ?? options?.grokApiKey ?? process.env.GROQ_API_KEY ?? process.env.GROK_API_KEY;
  const groqModel = options?.groqModel ?? options?.grokModel ?? process.env.GROQ_MODEL ?? process.env.GROK_MODEL ?? 'openai/gpt-oss-120b';

  if (mode === 'gemini') {
    let result = await queryGemini(query, {
      fetchFn: options?.fetchFn,
      apiKey: geminiApiKey,
      modelName: options?.geminiModel,
      isTestMode: options?.isTestMode,
    });
    let crossProviderFallbackUsed = false;
    let actualProvider: AIProviderId = 'gemini';
    let fallbackRationale: string | undefined = undefined;

    // Cross-provider fallback: if primary Gemini failed or returned fallback, and Groq credentials exist
    const groqAvailable = Boolean(groqApiKey && groqApiKey.trim().length > 0);

    if (result.isFallback && groqAvailable) {
      const groqFallback = await queryGroq(query, {
        fetchFn: options?.fetchFn,
        apiKey: groqApiKey,
        modelName: groqModel,
        isTestMode: options?.isTestMode,
      });
      if (!groqFallback.isFallback) {
        fallbackRationale = `Primary provider Gemini returned ${result.executionStatus} (${result.errorMessage || 'Key unconfigured'}); automatically routed to GroqCloud fallback.`;
        result = groqFallback;
        actualProvider = 'groq';
        crossProviderFallbackUsed = true;
      }
    }

    result.requestedProvider = 'gemini';
    result.actualProvider = actualProvider;
    result.crossProviderFallbackUsed = crossProviderFallbackUsed;
    if (fallbackRationale) result.fallbackRationale = fallbackRationale;

    return {
      success: true,
      mode: 'gemini',
      requestedProvider: 'gemini',
      actualProvider,
      crossProviderFallbackUsed,
      data: result,
    };
  }

  if (mode === 'groq' || (mode as string) === 'grok') {
    let result = await queryGroq(query, {
      fetchFn: options?.fetchFn,
      apiKey: groqApiKey,
      modelName: groqModel,
      isTestMode: options?.isTestMode,
    });
    let crossProviderFallbackUsed = false;
    let actualProvider: AIProviderId = 'groq';
    let fallbackRationale: string | undefined = undefined;

    // Cross-provider fallback: if primary Groq failed or returned fallback, and Gemini credentials exist
    const geminiAvailable = Boolean(geminiApiKey && geminiApiKey.trim().length > 0);

    if (result.isFallback && geminiAvailable) {
      const geminiFallback = await queryGemini(query, {
        fetchFn: options?.fetchFn,
        apiKey: geminiApiKey,
        modelName: options?.geminiModel,
        isTestMode: options?.isTestMode,
      });
      if (!geminiFallback.isFallback) {
        fallbackRationale = `Primary provider GroqCloud returned ${result.executionStatus} (${result.errorMessage || 'Key unconfigured'}); automatically routed to Gemini fallback.`;
        result = geminiFallback;
        actualProvider = 'gemini';
        crossProviderFallbackUsed = true;
      }
    }

    result.requestedProvider = 'groq';
    result.actualProvider = actualProvider;
    result.crossProviderFallbackUsed = crossProviderFallbackUsed;
    if (fallbackRationale) result.fallbackRationale = fallbackRationale;

    return {
      success: true,
      mode: 'groq',
      requestedProvider: 'groq',
      actualProvider,
      crossProviderFallbackUsed,
      data: result,
    };
  }

  // Default to Dual Comparative Evaluation
  const result = await evaluateDualModels(query, {
    fetchFn: options?.fetchFn,
    geminiApiKey,
    groqApiKey,
    geminiModel: options?.geminiModel,
    groqModel,
    isTestMode: options?.isTestMode,
  });
  result.requestedProvider = 'dual';
  result.actualProvider = 'dual';
  result.crossProviderFallbackUsed = false;

  return {
    success: true,
    mode: 'dual',
    requestedProvider: 'dual',
    actualProvider: 'dual',
    crossProviderFallbackUsed: false,
    data: result,
  };
}
