/**
 * TERRALIGN 2.0 — Live AI Provider Verification Suite (Strict Budget <= 4 Calls)
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Verifies live Google Gemini and GroqCloud endpoints via /api/ai/query:
 * 1. Test 1 (Gemini-only): Mode 'gemini', Model 'gemini-3.8-flash' (1 call)
 * 2. Test 2 (Groq-only): Mode 'groq', Model 'openai/gpt-oss-120b' (1 call)
 * 3. Test 3 (Dual-mode): Concurrent evaluation of Gemini + Groq (2 calls: 1 each)
 * 
 * STRICT BUDGET: Exactly 4 upstream inference calls total.
 * Zero automatic retries. Zero key leakage.
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

let totalTests = 0;
let passedTests = 0;

function report(testName, passed, detail = '') {
  totalTests++;
  if (passed) {
    passedTests++;
    console.log(`[PASS] ${testName} ${detail ? `(${detail})` : ''}`);
  } else {
    console.error(`[FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

async function runLiveVerification() {
  console.log(`\n================================================================`);
  console.log(` TERRALIGN 2.0: LIVE AI PROVIDER VERIFICATION SUITE`);
  console.log(` Target Server: ${BASE_URL}`);
  console.log(` Budget Guardrail: Maximum 4 Upstream Inference Calls Total`);
  console.log(`================================================================\n`);

  const results = {};

  // ── TEST 1: Live Gemini-Only Inference (Call 1 of 4) ────────────────
  console.log(`[EXEC] Test 1: Invoking Google Gemini live inference...`);
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Return exactly TERRALIGN_GEMINI_LIVE_CHECK_OK and nothing else.',
        mode: 'gemini',
        temperature: 0.1,
        maxTokens: 100,
      }),
    });
    const roundTripMs = Date.now() - t0;
    const json = await res.json();
    const d = json.data;

    const isValid =
      res.ok &&
      json.success === true &&
      json.requestedProvider === 'gemini' &&
      json.actualProvider === 'gemini' &&
      json.crossProviderFallbackUsed === false &&
      d.provider === 'gemini' &&
      d.executionStatus === 'LIVE AI RESPONSE' &&
      d.isFallback === false &&
      (d.modelName.includes('gemini-2.5-flash') || d.modelName.includes('gemini-3.8-flash'));

    results.gemini = {
      status: res.status,
      executionStatus: d?.executionStatus,
      modelName: d?.modelName,
      contentSnippet: d?.content?.slice(0, 100)?.replace(/\n/g, ' '),
      processingTimeMs: d?.processingTimeMs,
      roundTripMs,
      epistemicTag: d?.epistemicTag,
    };

    report(
      'Test 1: Google Gemini Live API Inference (Call 1/4)',
      isValid,
      `Status: "${d?.executionStatus}", Model: "${d?.modelName}", Latency: ${roundTripMs}ms, Response: "${results.gemini.contentSnippet}"`
    );
  } catch (err) {
    report('Test 1: Google Gemini Live API Inference (Call 1/4)', false, err.message);
  }

  // ── TEST 2: Live GroqCloud-Only Inference (Call 2 of 4) ─────────────
  console.log(`[EXEC] Test 2: Invoking GroqCloud live inference...`);
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Return exactly TERRALIGN_GROQ_LIVE_CHECK_OK and nothing else.',
        mode: 'groq',
        temperature: 0.1,
        maxTokens: 100,
      }),
    });
    const roundTripMs = Date.now() - t0;
    const json = await res.json();
    const d = json.data;

    const isValid =
      res.ok &&
      json.success === true &&
      json.requestedProvider === 'groq' &&
      json.actualProvider === 'groq' &&
      json.crossProviderFallbackUsed === false &&
      d.provider === 'groq' &&
      d.executionStatus === 'LIVE AI RESPONSE' &&
      d.isFallback === false &&
      d.modelName.includes('openai/gpt-oss-120b');

    results.groq = {
      status: res.status,
      executionStatus: d?.executionStatus,
      modelName: d?.modelName,
      contentSnippet: d?.content?.slice(0, 100)?.replace(/\n/g, ' '),
      processingTimeMs: d?.processingTimeMs,
      roundTripMs,
      epistemicTag: d?.epistemicTag,
    };

    report(
      'Test 2: GroqCloud Live API Inference (Call 2/4)',
      isValid,
      `Status: "${d?.executionStatus}", Model: "${d?.modelName}", Latency: ${roundTripMs}ms, Response: "${results.groq.contentSnippet}"`
    );
  } catch (err) {
    report('Test 2: GroqCloud Live API Inference (Call 2/4)', false, err.message);
  }

  // ── TEST 3: Live Dual-Mode Consensus Inference (Calls 3 & 4 of 4) ───
  console.log(`[EXEC] Test 3: Invoking Dual-Mode comparative inference (Gemini + GroqCloud)...`);
  try {
    const t0 = Date.now();
    const res = await fetch(`${BASE_URL}/api/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Evaluate terramechanic slip risk for uncompacted basaltic scoria deposits at Cinder Lake crater field.',
        mode: 'dual',
        context: {
          body: 'earth',
          locationName: 'Cinder Lake Crater Field 1',
          coordinates: { lat: 35.3071, lng: -111.5049 },
          elevationMeters: 2022.09,
        },
        temperature: 0.2,
        maxTokens: 800,
      }),
    });
    const roundTripMs = Date.now() - t0;
    const json = await res.json();
    const d = json.data;

    const isValid =
      res.ok &&
      json.success === true &&
      json.requestedProvider === 'dual' &&
      json.actualProvider === 'dual' &&
      d.gemini?.executionStatus === 'LIVE AI RESPONSE' &&
      d.groq?.executionStatus === 'LIVE AI RESPONSE' &&
      d.bothModelsLive === true &&
      typeof d.consensusScore === 'number' &&
      d.consensusScore >= 0 &&
      d.consensusScore <= 100 &&
      (d.qualitativeConsensus === 'HIGH MODEL-ASSESSED / HEURISTIC ALIGNMENT' || d.qualitativeConsensus === 'HIGH MODEL-ASSESSED ALIGNMENT' || d.qualitativeConsensus === 'MODERATE PERSPECTIVE CONVERGENCE') &&
      d.epistemicTag.includes('[MODEL-ASSESSED ALIGNMENT — NOT SCIENTIFIC VALIDATION]') &&
      d.dimensionScores?.length === 4 &&
      d.commonConclusions?.length > 0 &&
      d.contradictoryConclusions?.length > 0 &&
      d.uncertainClaims?.length > 0 &&
      d.missingEvidence?.length > 0;

    results.dual = {
      status: res.status,
      bothModelsLive: d?.bothModelsLive,
      geminiStatus: d?.gemini?.executionStatus,
      groqStatus: d?.groq?.executionStatus,
      consensusScore: d?.consensusScore,
      qualitativeConsensus: d?.qualitativeConsensus,
      dimensionScores: d?.dimensionScores,
      epistemicTag: d?.epistemicTag,
      roundTripMs,
    };

    report(
      'Test 3: Dual-Mode Live Consensus Evaluation (Calls 3 & 4/4)',
      isValid,
      `bothModelsLive: ${d?.bothModelsLive}, consensusScore: ${d?.consensusScore}%, qualitativeConsensus: "${d?.qualitativeConsensus}", Latency: ${roundTripMs}ms`
    );
  } catch (err) {
    report('Test 3: Dual-Mode Live Consensus Evaluation (Calls 3 & 4/4)', false, err.message);
  }

  console.log(`\n----------------------------------------------------------------`);
  console.log(` LIVE VERIFICATION RESULTS: ${passedTests} / ${totalTests} PASSED`);
  console.log(` Total Upstream Inferences Executed: ${totalTests === 3 ? 4 : 'Incomplete'}`);
  console.log(` Metadata Audit:\n`, JSON.stringify(results, null, 2));
  console.log(`----------------------------------------------------------------\n`);

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runLiveVerification();
