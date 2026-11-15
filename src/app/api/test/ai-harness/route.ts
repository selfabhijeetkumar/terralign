/**
 * TERRALIGN 2.0 — Non-Production Automated Mock AI Test Harness Route
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Isolated test harness using Dependency Injection to test all 12 operational scenarios.
 * Strictly non-production: disabled when NODE_ENV === 'production'.
 * Completely separate from production /api/ai/query.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { AIModelQuery } from '@/types/ai';
import { handleAIQuery } from '@/lib/ai/aiQueryHandler';

export async function POST(req: NextRequest) {
  // Strict non-production and preview guard: unconditionally disabled in production and preview environments
  const isProductionOrPreview =
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview';

  if (isProductionOrPreview) {
    return NextResponse.json(
      { error: 'Not Found' },
      { status: 404 }
    );
  }

  try {
    const body = await req.json();
    const scenario = body.scenario || 'gemini_success';
    const query: AIModelQuery = {
      prompt: body.prompt || 'Evaluate terramechanic parameters.',
      mode: body.mode || 'dual',
      context: body.context,
      temperature: body.temperature,
      maxTokens: body.maxTokens,
    };

    if (scenario === 'gemini_success') {
      const mockFetch: typeof fetch = async () => {
        return new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text:
                        'Grounded terramechanics analysis for ' +
                        (query.context?.locationName || 'target site'),
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      };

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'mock-gemini-test-key-3.8',
        isTestMode: true,
      });
      return NextResponse.json(result);
    }

    if (scenario === 'groq_success' || scenario === 'grok_success') {
      const mockFetch: typeof fetch = async () => {
        return new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content:
                    'GroqCloud critical engineering assessment for ' +
                    (query.context?.locationName || 'target site') +
                    '. Dynamic bounce increases rim cavitation risk.',
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      };

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        groqApiKey: 'mock-groq-test-key-120b',
        grokApiKey: 'mock-groq-test-key-120b',
        isTestMode: true,
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_invalid_credentials') {
      const mockFetch: typeof fetch = async () =>
        new Response('Unauthorized API key provided', { status: 401 });

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'invalid-gemini-key',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_rate_limit') {
      const mockFetch: typeof fetch = async () =>
        new Response('Quota exceeded or rate limited', { status: 429 });

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'test-rate-limit-key',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_5xx') {
      const mockFetch: typeof fetch = async () =>
        new Response('Google Generative Language Backend 503 Service Unavailable', {
          status: 503,
        });

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'test-5xx-key',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_timeout') {
      const mockFetch: typeof fetch = async () => {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        throw err;
      };

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'test-timeout-key',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_unsupported_model') {
      const mockFetch: typeof fetch = async () =>
        new Response('Model unsupported or not found in registry', { status: 404 });

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'test-unsupported-model-key',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_missing_key') {
      const result = await handleAIQuery(query, {
        geminiApiKey: '',
        groqApiKey: '',
        grokApiKey: '',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'gemini_fail_groq_fallback' || scenario === 'gemini_fail_grok_fallback') {
      const mockFetch: typeof fetch = async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          return new Response('Gemini unavailable', { status: 503 });
        }
        return new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content:
                    'GroqCloud fallback engineering assessment for ' +
                    (query.context?.locationName || 'target site'),
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      };

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'mock-gemini-key',
        groqApiKey: 'mock-groq-key',
        grokApiKey: 'mock-groq-key',
        isTestMode: true,
      });
      return NextResponse.json(result);
    }

    if (scenario === 'groq_fail_gemini_fallback' || scenario === 'grok_fail_gemini_fallback') {
      const mockFetch: typeof fetch = async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('api.groq.com') || urlStr.includes('api.x.ai')) {
          return new Response('Groq rate limited', { status: 429 });
        }
        return new Response(
          JSON.stringify({
            candidates: [
              {
                content: {
                  parts: [
                    {
                      text:
                        'Gemini fallback analysis for ' +
                        (query.context?.locationName || 'target site'),
                    },
                  ],
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      };

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'mock-gemini-key',
        groqApiKey: 'mock-groq-key',
        grokApiKey: 'mock-groq-key',
        isTestMode: true,
      });
      return NextResponse.json(result);
    }

    if (scenario === 'both_unavailable') {
      const mockFetch: typeof fetch = async () =>
        new Response('Upstream service error', { status: 503 });

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'mock-gemini-key',
        groqApiKey: 'mock-groq-key',
        grokApiKey: 'mock-groq-key',
      });
      return NextResponse.json(result);
    }

    if (scenario === 'both_mock_success') {
      const mockFetch: typeof fetch = async (url) => {
        const urlStr = String(url);
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          return new Response(
            JSON.stringify({
              candidates: [
                {
                  content: {
                    parts: [{ text: 'Gemini synthesis in concurrent test' }],
                  },
                },
              ],
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content: 'GroqCloud synthesis in concurrent test',
                },
              },
            ],
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      };

      const result = await handleAIQuery(query, {
        fetchFn: mockFetch,
        geminiApiKey: 'mock-gemini-key',
        groqApiKey: 'mock-groq-key',
        grokApiKey: 'mock-groq-key',
        isTestMode: true,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: `Unknown scenario: ${scenario}` },
      { status: 400 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Test harness execution error' },
      { status: 500 }
    );
  }
}
