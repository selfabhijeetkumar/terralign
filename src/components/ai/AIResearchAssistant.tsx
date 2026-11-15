/**
 * TERRALIGN 2.0 — Context-Aware AI Research Assistant
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Floating, dockable multi-model planetary research HUD with
 * Google Gemini, xAI Grok, Dual Consensus comparative analysis,
 * and user dataset context attachment.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useMissionStore } from '@/store/useMissionStore';
import { getAnalogById, ALL_ANALOG_SITES } from '@/lib/analogs';
import { getApiUrl } from '@/lib/apiConfig';
import type { AIComparisonResult, AIModelResponse, AIProviderId } from '@/types/ai';

export default function AIResearchAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AIProviderId>('dual');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [singleResponse, setSingleResponse] = useState<AIModelResponse | null>(null);
  const [dualResponse, setDualResponse] = useState<AIComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState<'consensus' | 'gemini' | 'groq' | 'grok'>('consensus');

  // Active dataset context
  const [activeDataset, setActiveDataset] = useState<any | null>(null);
  const [attachDataset, setAttachDataset] = useState(true);

  // Connect to Zustand store for contextual awareness
  const selectedSiteId = useMissionStore((s) => s.selection.selectedSiteId);
  const targetK = useMissionStore((s) => s.portfolio.targetK);
  const targetBody = useMissionStore((s) => s.mission.targetBody);

  const selectedSite = getAnalogById(selectedSiteId) || ALL_ANALOG_SITES[0];

  useEffect(() => {
    // Check initial active dataset
    if (typeof window !== 'undefined' && (window as any).__TERRALIGN_DATASET__) {
      setActiveDataset((window as any).__TERRALIGN_DATASET__);
    }

    const handleDatasetChanged = (e: any) => {
      setActiveDataset(e.detail);
    };

    window.addEventListener('terralign:dataset-changed', handleDatasetChanged);
    return () => window.removeEventListener('terralign:dataset-changed', handleDatasetChanged);
  }, []);

  const quickPrompts = [
    activeDataset && attachDataset
      ? `Summarize elevation and slip hazards in uploaded "${activeDataset.filename}".`
      : 'Analyze Bekker-Wong wheel slip risk for this analog terrain.',
    activeDataset && attachDataset
      ? `Which canonical Earth analog best models the trajectory in "${activeDataset.filename}"?`
      : 'Evaluate planetary environmental reality gaps under vacuum & microgravity.',
    'Compare traction dynamics between Cinder Lake basalt and lunar regolith.',
    'Explain the RVM coverage percentage and reality gap index.',
  ];

  const handleQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    setIsLoading(true);
    setSingleResponse(null);
    setDualResponse(null);

    const activeDatasetPayload =
      attachDataset && activeDataset
        ? {
            id: activeDataset.id,
            filename: activeDataset.filename,
            format: activeDataset.format,
            rowCount: activeDataset.quality.totalRows,
            validCoordinateRows: activeDataset.records.length,
            planetaryBody: activeDataset.planetaryBody,
            elevationStats: {
              min: activeDataset.elevation.minMeters,
              max: activeDataset.elevation.maxMeters,
              mean: activeDataset.elevation.meanMeters,
              span: activeDataset.elevation.spanMeters,
            },
            spatialBounds: activeDataset.bounds,
            qualityCompletenessPercent: activeDataset.quality.completenessScore,
            detectedChannels: Object.values(activeDataset.columns).filter(Boolean) as string[],
            sampleRecordsSummary: activeDataset.records
              .slice(0, 5)
              .map(
                (r: any) =>
                  `Point ${r.id}: (${r.lat}, ${r.lng}) Elev: ${r.elevation ?? 'N/A'}m, Slip: ${r.slipRatio ?? 'N/A'}`
              )
              .join('\n'),
          }
        : undefined;

    const payload = {
      prompt: queryText,
      mode,
      context: {
        body: selectedSite ? 'earth' : 'moon',
        locationName: selectedSite ? selectedSite.name : 'Shackleton Crater Rim',
        coordinates: selectedSite ? selectedSite.coordinates : { lat: -89.9, lng: 0.0 },
        elevationMeters: selectedSite ? selectedSite.elevationMeters : -4200,
        rvmDimensions: selectedSite ? selectedSite.dimensions : undefined,
        activeDataset: activeDatasetPayload,
      },
    };

    try {
      const res = await fetch(getApiUrl('/api/ai/query'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        if (mode === 'dual') {
          setDualResponse(json.data as AIComparisonResult);
          setActiveTab('consensus');
        } else {
          setSingleResponse(json.data as AIModelResponse);
        }
      }
    } catch {
      // Error handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0A192F]/90 hover:bg-[#0A192F] border border-[#00D4AA]/40 hover:border-[#00D4AA] text-white text-xs font-mono font-semibold tracking-wider shadow-[0_4px_24px_rgba(0,212,170,0.25)] backdrop-blur-xl transition-all hover:scale-105 active:scale-95 group luminous-surface shine-card shine-delay-3"
          aria-label="Open AI Research Assistant"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4AA] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D4AA]"></span>
          </span>
          <span className="group-hover:text-[#00D4AA] transition-colors">AI RESEARCH ASSISTANT</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30">
            GEMINI · GROQ
          </span>
        </button>
      )}

      {/* Slide-Up Floating HUD Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[95vw] sm:w-[560px] max-h-[85vh] flex flex-col rounded-2xl bg-[#050811]/95 backdrop-blur-2xl border border-[#00D4AA]/30 shadow-[0_12px_48px_rgba(0,0,0,0.8)] ring-1 ring-white/10 overflow-hidden text-white font-sans animate-in fade-in slide-in-from-bottom-4 duration-200 luminous-surface-prominent shine-card shine-delay-1">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_8px_#00D4AA]" />
              <h3 className="font-headline font-bold text-xs uppercase tracking-wider text-white">
                Planetary AI Research Assistant
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSingleResponse(null);
                  setDualResponse(null);
                  setPrompt('');
                }}
                className="text-[10px] font-mono text-[#8B9CB5] hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors"
                title="Reset session"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[#8B9CB5] hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close Assistant"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Model Selector Bar */}
          <div className="px-5 py-2.5 bg-[#0A192F]/60 border-b border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-[#8B9CB5] text-[10px] uppercase">Engine:</span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
              <button
                onClick={() => setMode('dual')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  mode === 'dual'
                    ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] shadow-[0_0_10px_rgba(0,212,170,0.4)]'
                    : 'text-[#8B9CB5] hover:text-white'
                }`}
              >
                Dual Consensus
              </button>
              <button
                onClick={() => setMode('gemini')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  mode === 'gemini'
                    ? 'bg-[#1E90FF] text-white shadow-[0_0_10px_rgba(30,144,255,0.4)]'
                    : 'text-[#8B9CB5] hover:text-white'
                }`}
              >
                Gemini
              </button>
              <button
                onClick={() => setMode('groq')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  mode === 'groq'
                    ? 'bg-white text-[#050811] shadow-[0_0_10px_rgba(255,255,255,0.3)]'
                    : 'text-[#8B9CB5] hover:text-white'
                }`}
              >
                Groq
              </button>
            </div>
          </div>

          {/* Active Context Chip */}
          <div className="px-5 py-2 bg-black/40 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-[#8B9CB5]">
            <div className="truncate">
              TARGET: <span className="text-white font-semibold">{selectedSite ? selectedSite.name : 'Global Catalog'}</span>
              {selectedSite && <span className="text-[#00D4AA] ml-1.5">({selectedSite.elevationMeters}m)</span>}
            </div>

            {/* User Dataset Context Attachment Toggle */}
            {activeDataset && (
              <label className="flex items-center gap-1.5 cursor-pointer bg-white/5 px-2 py-0.5 rounded border border-white/10 hover:border-[#00D4AA]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={attachDataset}
                  onChange={(e) => setAttachDataset(e.target.checked)}
                  className="w-3 h-3 rounded text-[#00D4AA] focus:ring-0 bg-[#112240]"
                />
                <span className={attachDataset ? 'text-[#00D4AA] font-bold truncate max-w-[140px]' : 'text-[#8B9CB5] truncate max-w-[140px]'}>
                  {activeDataset.filename}
                </span>
              </label>
            )}

            <div>
              PORTFOLIO: <span className="text-[#38BDF8]">k={targetK}</span>
            </div>
          </div>

          {/* Content Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[48vh] text-xs">
            {/* Initial Welcome & Quick Prompts if no response yet */}
            {!singleResponse && !dualResponse && !isLoading && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-b from-[#0A192F]/80 to-[#050811] border border-white/10 text-xs text-[#CBD5E1] space-y-2">
                  <p className="font-medium text-white">
                    TERRALIGN Multi-Model Scientific Assistant
                  </p>
                  <p className="text-[11px] text-[#8B9CB5] leading-relaxed">
                    Powered by server-side Google Gemini and GroqCloud. Ask questions regarding terramechanics,
                    analog fidelity, Bekker-Wong slip calculations, or investigate your attached geospatial dataset.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#8B9CB5]">
                    Suggested Investigations:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setPrompt(qp);
                          handleQuery(qp);
                        }}
                        className="text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#00D4AA]/30 text-[11px] text-[#CBD5E1] hover:text-white transition-all flex items-center justify-between group"
                      >
                        <span className="truncate">{qp}</span>
                        <span className="text-[#8B9CB5] group-hover:text-[#00D4AA] font-mono text-[10px] shrink-0 ml-2">
                          →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
              <div className="space-y-3 py-6 text-center">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#0A192F] border border-[#00D4AA]/30 text-xs font-mono text-[#00D4AA]">
                  <span className="w-3.5 h-3.5 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
                  <span>
                    {mode === 'dual'
                      ? 'Executing concurrent Gemini + Groq evaluation...'
                      : `Querying ${mode.toUpperCase()} model engine...`}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#8B9CB5]">
                  Evaluating soil shear equations, wheel sinkage, and epistemic boundaries
                </p>
              </div>
            )}

            {/* Single Model Response View */}
            {singleResponse && !isLoading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono border-b border-white/10 pb-2">
                  <span className="text-[#00D4AA] font-bold">{singleResponse.modelName}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/5 text-[#8B9CB5] border border-white/10">
                      {singleResponse.executionStatus}
                    </span>
                    <span className="text-[#8B9CB5]">{singleResponse.processingTimeMs}ms</span>
                  </div>
                </div>

                <div className="prose prose-invert prose-xs text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                  {singleResponse.content}
                </div>

                {/* Terramechanics HUD */}
                {singleResponse.terramechanicsAssessment && (
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 grid grid-cols-2 gap-3 text-[10px] font-mono">
                    <div>
                      <span className="text-[#8B9CB5] block">Internal Friction:</span>
                      <span className="text-white font-bold">{singleResponse.terramechanicsAssessment.internalFrictionAngle}</span>
                    </div>
                    <div>
                      <span className="text-[#8B9CB5] block">Cohesion (c):</span>
                      <span className="text-white font-bold">{singleResponse.terramechanicsAssessment.cohesionKPa}</span>
                    </div>
                    <div>
                      <span className="text-[#8B9CB5] block">Est. Slip Risk:</span>
                      <span className="text-[#00D4AA] font-bold">{singleResponse.terramechanicsAssessment.slipRiskPercent}%</span>
                    </div>
                    <div>
                      <span className="text-[#8B9CB5] block">Est. Wheel Sinkage:</span>
                      <span className="text-white font-bold">{singleResponse.terramechanicsAssessment.sinkageEstimateCm}</span>
                    </div>
                  </div>
                )}

                <div className="text-[9px] font-mono text-[#8B9CB5]/80 pt-2 border-t border-white/5">
                  STATUS: {singleResponse.epistemicTag}
                </div>
              </div>
            )}

            {/* Dual Model Consensus View */}
            {dualResponse && !isLoading && (
              <div className="space-y-4">
                {/* Consensus Score Banner with Qualitative Level */}
                {dualResponse.consensusScore !== null ? (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#00D4AA]/10 via-[#1E90FF]/10 to-transparent border border-[#00D4AA]/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-[#00D4AA] uppercase font-bold tracking-wider">
                        {dualResponse.qualitativeConsensus}
                      </div>
                      <div className="text-xl font-headline font-bold text-white flex items-baseline gap-1 mt-0.5">
                        {dualResponse.consensusScore}%
                        <span className="text-[10px] text-[#8B9CB5] font-mono font-normal">Model-Assessed / Heuristic Alignment Index</span>
                      </div>
                      <div className="text-[9px] font-mono text-[#8B9CB5] mt-1">
                        MODEL-ASSESSED ALIGNMENT — NOT SCIENTIFIC VALIDATION
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#8B9CB5] space-y-0.5">
                      <div className="text-[#00D4AA]">Gemini ({dualResponse.gemini.executionStatus})</div>
                      <div className="text-white">Groq ({(dualResponse.groq || dualResponse.grok)?.executionStatus})</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                        {dualResponse.qualitativeConsensus}
                      </div>
                      <div className="text-sm font-headline font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-400">⚡</span>
                        <span>Model-to-Model Consensus Unavailable</span>
                      </div>
                      <div className="text-[9px] font-mono text-[#8B9CB5] mt-1">
                        Requires concurrent live responses from both Gemini & Groq · Showing deterministic synthesis
                      </div>
                    </div>
                    <div className="text-right text-[10px] font-mono text-[#8B9CB5] space-y-0.5">
                      <div className="px-1.5 py-0.5 rounded bg-white/5 text-[9px]">
                        Gemini: {dualResponse.gemini.executionStatus}
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-white/5 text-[9px]">
                        Groq: {(dualResponse.groq || dualResponse.grok)?.executionStatus}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4-Dimension Rubric Alignment Bar Gauges (Only rendered when live consensus score exists) */}
                {dualResponse.consensusScore !== null && dualResponse.dimensionScores && dualResponse.dimensionScores.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2 text-[10px] font-mono">
                    <div className="flex justify-between items-center text-[#8B9CB5] text-[9px]">
                      <span className="uppercase font-bold">Scoring Rubric (1 Calculated Slip Comparison + 3 Heuristic Baselines):</span>
                      <span className="text-[8px] text-[#00D4AA]">Weights: 35% / 25% / 25% / 15%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {dualResponse.dimensionScores.map((ds) => (
                        <div key={ds.dimension} className="space-y-1">
                          <div className="flex justify-between text-[#8B9CB5]">
                            <span className="uppercase text-[9px] flex items-center gap-1">
                              {ds.dimension.replace('_', ' ')}
                              {ds.dimension === 'terramechanics' ? (
                                <span className="text-[8px] text-[#00D4AA] font-normal">(computed)</span>
                              ) : (
                                <span className="text-[8px] text-[#8B9CB5] font-normal">(heuristic)</span>
                              )}
                            </span>
                            <span className="text-white font-bold">{ds.scorePercent}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                            <div
                              className="bg-[#00D4AA] h-full rounded-full"
                              style={{ width: `${ds.scorePercent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-[8px] text-[#8B9CB5] pt-1 border-t border-white/5">
                      Terramechanics is deterministically calculated from model slip variance; geomorphology, hazards, and mission limits reflect structured heuristic baselines.
                    </div>
                  </div>
                )}

                {/* Tab Navigation for Dual Results */}
                <div className="flex border-b border-white/10 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveTab('consensus')}
                    className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
                      activeTab === 'consensus'
                        ? 'border-[#00D4AA] text-[#00D4AA]'
                        : 'border-transparent text-[#8B9CB5] hover:text-white'
                    }`}
                  >
                    Consensus Synthesis
                  </button>
                  <button
                    onClick={() => setActiveTab('gemini')}
                    className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
                      activeTab === 'gemini'
                        ? 'border-[#1E90FF] text-[#1E90FF]'
                        : 'border-transparent text-[#8B9CB5] hover:text-white'
                    }`}
                  >
                    Gemini Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('groq')}
                    className={`pb-2 px-3 border-b-2 font-bold transition-colors ${
                      activeTab === 'groq' || activeTab === 'grok'
                        ? 'border-white text-white'
                        : 'border-transparent text-[#8B9CB5] hover:text-white'
                    }`}
                  >
                    Groq Analysis
                  </button>
                </div>

                {/* Tab 1: Consensus Synthesis */}
                {activeTab === 'consensus' && (
                  <div className="space-y-3.5">
                    {/* Common Conclusions */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-[10px] font-mono text-[#00D4AA] uppercase font-bold">
                        Shared Agreement Conclusions:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-[#CBD5E1]">
                        {dualResponse.commonConclusions.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#00D4AA] mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Contradictory Conclusions */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-[10px] font-mono text-[#38BDF8] uppercase font-bold">
                        Analytical Nuance & Divergence:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-[#CBD5E1]">
                        {dualResponse.contradictoryConclusions.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#38BDF8] mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Uncertainties & Limitations */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                        Uncertain Claims & Limitations:
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-[#CBD5E1]">
                        {dualResponse.uncertainClaims.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-400 mt-0.5">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Synthesis Recommendation */}
                    <div className="p-3.5 rounded-xl bg-[#00D4AA]/5 border border-[#00D4AA]/20 text-[11px] text-[#E2E8F0] leading-relaxed">
                      {dualResponse.synthesisRecommendation}
                    </div>
                  </div>
                )}

                {/* Tab 2: Gemini Direct */}
                {activeTab === 'gemini' && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono text-[#8B9CB5] flex items-center justify-between">
                      <span>{dualResponse.gemini.epistemicTag}</span>
                      <span className="text-[#00D4AA] font-bold">{dualResponse.gemini.executionStatus}</span>
                    </div>
                    <div className="prose prose-invert prose-xs text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                      {dualResponse.gemini.content}
                    </div>
                  </div>
                )}

                {/* Tab 3: Groq Direct */}
                {(activeTab === 'groq' || activeTab === 'grok') && (
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono text-[#8B9CB5] flex items-center justify-between">
                      <span>{(dualResponse.groq || dualResponse.grok)?.epistemicTag}</span>
                      <span className="text-white font-bold">{(dualResponse.groq || dualResponse.grok)?.executionStatus}</span>
                    </div>
                    <div className="prose prose-invert prose-xs text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                      {(dualResponse.groq || dualResponse.grok)?.content}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Input Form */}
          <div className="p-4 border-t border-white/10 bg-black/50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleQuery(prompt);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeDataset && attachDataset
                    ? `Ask about ${activeDataset.filename} or terramechanics...`
                    : 'Ask about terramechanics, slip hazards, or analog testing...'
                }
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-[#8B9CB5] text-xs font-mono focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA]"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] hover:brightness-110 disabled:opacity-40 text-[#050811] font-headline font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center shadow-[0_0_12px_rgba(0,212,170,0.3)]"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
