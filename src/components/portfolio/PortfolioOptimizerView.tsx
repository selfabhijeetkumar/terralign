'use client';

/**
 * TERRALIGN — Screen 04: Multi-Site Rehearsal Portfolio Optimizer
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Design Ref: docs/design/screen-04-portfolio-optimizer.md & prototype-data-register.md
 *
 * Epistemic Guardrail:
 *   - The >90% coverage threshold is an UNVALIDATED ENGINEERING RESEARCH TARGET.
 *   - Current empirical portfolio achieves 81.7% partial-weighted (24.5/30) / 76.7% binary (23/30).
 *   - Inescapable terrestrial physics ceiling is 86.7% (26/30) with 4 invariant gaps (13.3%).
 */

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useMissionStore } from '@/store/useMissionStore';
import { getAllAnalogs, getAnalogById, getAllActivities, getActivityById } from '@/lib/analogs';
import { optimizePortfolio, getAllRequirements } from '@/lib/rvm';
import { generateMissionDossier, downloadDossierJson } from '@/lib/dossier';
import type { DomainFilter } from '@/types/store';
import type { AnalogSite } from '@/types/analogs';

export function PortfolioOptimizerView() {
  const targetK = useMissionStore((s) => s.portfolio.targetK);
  const setPortfolioK = useMissionStore((s) => s.setPortfolioK);
  const fidelityThreshold = useMissionStore((s) => s.portfolio.fidelityThreshold);
  const activeDomainFilter = useMissionStore((s) => s.portfolio.activeDomainFilter);
  const setActiveDomainFilter = useMissionStore((s) => s.setActiveDomainFilter);
  const activeActivityId = useMissionStore((s) => s.mission.activeActivity);
  const targetBody = useMissionStore((s) => s.mission.targetBody);
  const selectedSiteId = useMissionStore((s) => s.selection.selectedSiteId);

  const allSites = getAllAnalogs();
  const allReqs = getAllRequirements();
  const activeActivity = getActivityById(activeActivityId) || getAllActivities()[0];
  const primarySelectedSite = getAnalogById(selectedSiteId) || allSites[0];

  const siteLookup = useMemo(() => {
    const map: Record<string, AnalogSite> = {};
    for (const site of allSites) {
      map[site.id] = site;
    }
    return map;
  }, [allSites]);

  // Canonical flagship candidate pool: Cinder Lake (AZ), Askja (IS), Atacama (CL)
  // Reconciled against NASA SP-2016-6105 RVM math: k=2 -> 63.3%, k=3 -> 81.7% partial-weighted / 76.7% binary
  const candidateSiteIds = useMemo(() => {
    return ['cinder-lake', 'askja-caldera', 'atacama-desert'];
  }, []);

  // Compute submodular greedy set-cover portfolio
  const portfolioResult = useMemo(() => {
    return optimizePortfolio(candidateSiteIds, targetK, fidelityThreshold, activeDomainFilter);
  }, [candidateSiteIds, targetK, fidelityThreshold, activeDomainFilter]);

  // Filter RVM table by active domain
  const displayedRequirements = useMemo(() => {
    if (activeDomainFilter === 'all') {
      return allReqs;
    }
    return allReqs.filter((r) => r.category === activeDomainFilter);
  }, [allReqs, activeDomainFilter]);

  // Portfolio sites details
  const portfolioSites = useMemo(() => {
    return portfolioResult.marginalSiteContributions.map((contrib) => {
      const site = siteLookup[contrib.siteId];
      return {
        contrib,
        site,
      };
    });
  }, [portfolioResult, siteLookup]);

  const handleExportDossier = () => {
    const dossierData = generateMissionDossier(
      targetBody,
      activeActivity.name,
      primarySelectedSite,
      portfolioResult,
      siteLookup,
      fidelityThreshold,
      activeDomainFilter
    );
    downloadDossierJson(dossierData, `TERRALIGN-Portfolio-Dossier-k${targetK}-${Date.now()}.json`);
  };

  const domainTabs: Array<{ id: DomainFilter; label: string; count: number }> = [
    { id: 'all', label: 'ALL CRITERIA', count: allReqs.length },
    { id: 'mechanical', label: 'MECHANICAL', count: allReqs.filter((r) => r.category === 'mechanical').length },
    { id: 'optical', label: 'OPTICAL', count: allReqs.filter((r) => r.category === 'optical').length },
    { id: 'geochemical', label: 'GEOCHEMICAL', count: allReqs.filter((r) => r.category === 'geochemical').length },
    { id: 'environmental', label: 'ENVIRONMENTAL', count: allReqs.filter((r) => r.category === 'environmental').length },
    { id: 'operational', label: 'OPERATIONAL', count: allReqs.filter((r) => r.category === 'operational').length },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
      {/* ── Cinematic Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#00D4AA] tracking-widest uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]" />
            <span className="font-semibold">Screen 04</span>
            <span className="text-white/20">//</span>
            <span>Multi-Site Portfolio Optimizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight">
            Submodular Campaign Coverage <span className="text-[#00D4AA]">(k = {targetK})</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8B9CB5] mt-2 font-sans max-w-2xl leading-relaxed">
            Combinatorial optimization of complementary analog sites against 30 NASA Requirements Verification Matrix (RVM) parameters.
          </p>
        </div>

        {/* Global Action / Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Portfolio Size Toggle (k=2 vs k=3) */}
          <div className="inline-flex rounded-xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-1 shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-white/5">
            <button
              onClick={() => setPortfolioK(2)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                targetK === 2
                  ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-bold shadow-[0_0_12px_rgba(0,212,170,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              k = 2 SITES
            </button>
            <button
              onClick={() => setPortfolioK(3)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                targetK === 3
                  ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-bold shadow-[0_0_12px_rgba(0,212,170,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              k = 3 SITES (OPTIMAL)
            </button>
          </div>

          {/* Export Dossier CTA */}
          <button
            onClick={handleExportDossier}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-mono text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_16px_rgba(0,212,170,0.4)]"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>EXPORT MISSION DOSSIER (JSON)</span>
          </button>
        </div>
      </div>

      {/* Epistemic Guardrail Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-mono text-amber-300 flex items-start gap-3 shadow-[0_4px_24px_rgba(245,158,11,0.1)]">
        <span className="text-base leading-none text-amber-400">⚠</span>
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider text-amber-300">
            PROPOSED RESEARCH TARGET — UNVALIDATED HYPOTHESIS
          </div>
          <div className="text-[11px] text-[#CBD5E1] leading-relaxed font-sans">
            The &gt;90% mission coverage target is an architectural research goal. On Earth, invariant physical barriers (hard vacuum, 1/6g dynamics, GCR radiation, cryogenic PSRs) enforce a mathematical terrestrial ceiling of <span className="font-bold text-[#00D4AA]">86.7% (26/30 criteria)</span>. All calculations use partial-weighted coverage verified against NASA SP-2016-6105 specifications.
          </div>
        </div>
      </div>

      {/* Main Split Grid: Left = Optimized Portfolio, Right = RVM Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optimized Candidate Portfolio & Marginal Gains (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Top Score Summary Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 luminous-surface-prominent shine-card">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#8B9CB5] tracking-wider uppercase font-semibold">
                PORTFOLIO COVERAGE (k = {targetK})
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-[#00D4AA]/30 bg-[#00D4AA]/10 text-[#00D4AA] font-bold shadow-[0_0_8px_rgba(0,212,170,0.2)]">
                GREEDY OPTIMAL (1 - 1/e)
              </span>
            </div>

            {/* Coverage Big Numbers */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#00D4AA] drop-shadow-[0_0_12px_rgba(0,212,170,0.3)]">
                  {portfolioResult.partialWeightedPercent.toFixed(1)}%
                </span>
                <span className="text-xs font-mono text-[#8B9CB5] ml-2">
                  ({portfolioResult.partialWeightedCount.toFixed(1)} / {portfolioResult.totalRequirements})
                </span>
              </div>
              <div className="text-right text-[11px] font-mono">
                <div className="text-[#8B9CB5]">BINARY (θ ≥ 0.70):</div>
                <div className="font-bold text-white">
                  {portfolioResult.coveragePercent.toFixed(1)}% ({portfolioResult.coveredCount}/{portfolioResult.totalRequirements})
                </div>
              </div>
            </div>

            {/* Multi-tier Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#8B9CB5]">
                <span>BINARY MARGINAL CONTRIBUTIONS (θ ≥ 0.70)</span>
                <span className="text-[#00D4AA] font-bold">{portfolioResult.coveredCount}/30 Binary ({portfolioResult.coveragePercent.toFixed(1)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/5 flex overflow-hidden p-0.5 border border-white/10 shadow-inner">
                {/* Site Contributions */}
                {portfolioResult.marginalSiteContributions.map((contrib, i) => {
                  const colors = [
                    'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3]',
                    'bg-gradient-to-r from-[#1E90FF] to-[#38BDF8]',
                    'bg-gradient-to-r from-[#FF6B35] to-[#FFA07A]'
                  ];
                  return (
                    <div
                      key={contrib.siteId}
                      className={`h-full first:rounded-l-full last:rounded-r-full ${colors[i % colors.length]} transition-all duration-500`}
                      style={{ width: `${contrib.marginalPercent}%` }}
                      title={`${siteLookup[contrib.siteId]?.shortName || contrib.siteId}: +${contrib.marginalPercent}%`}
                    />
                  );
                })}
              </div>

              {/* Benchmark Reference Marks */}
              <div className="flex justify-between text-[10px] font-mono text-[#8B9CB5] pt-0.5">
                <span>0%</span>
                <span className="text-[#00D4AA]">Weighted: {portfolioResult.partialWeightedPercent.toFixed(1)}%</span>
                <span className="text-[#CBD5E1]">Ceiling: 86.7%</span>
                <span className="text-amber-400">Target: &gt;90%</span>
              </div>
            </div>

            {/* Benchmark Comparison Table */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shadow-inner">
                <div className="text-[10px] text-[#8B9CB5] font-semibold uppercase">INESCAPABLE GAPS</div>
                <div className="text-sm font-bold text-[#FF4D4D] mt-0.5">{portfolioResult.invariantGapCount} / {portfolioResult.totalRequirements} ({portfolioResult.invariantGapPercent.toFixed(1)}%)</div>
                <div className="text-[9px] text-[#8B9CB5] mt-0.5">Vacuum, 1/6g, GCR, Cryo PSR</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shadow-inner">
                <div className="text-[10px] text-[#8B9CB5] font-semibold uppercase">TERRESTRIAL CEILING</div>
                <div className="text-sm font-bold text-[#00D4AA] mt-0.5">26 / 30 (86.7%)</div>
                <div className="text-[9px] text-[#8B9CB5] mt-0.5">Max achievable on Earth</div>
              </div>
            </div>

            {/* Arithmetic Breakdown Ledger */}
            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-[#8B9CB5] space-y-1.5">
              <div className="flex justify-between items-center text-[#CBD5E1]">
                <span>MATHEMATICAL SPECIFICATION:</span>
                <span className="text-[#00D4AA] font-bold">NASA SP-2016-6105 RVM</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-2.5 rounded-xl border border-white/10 text-center shadow-inner">
                <div>
                  <span className="text-emerald-400 font-bold block">{portfolioResult.fullCount} Full</span>
                  <span className="text-[9px] text-[#8B9CB5]">@ 1.0× = {portfolioResult.fullCount}.0</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block">{portfolioResult.partialCount} Partial</span>
                  <span className="text-[9px] text-[#8B9CB5]">@ 0.5× = {(portfolioResult.partialCount * 0.5).toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-[#00D4AA] font-bold block">{portfolioResult.partialWeightedCount.toFixed(1)} Total</span>
                  <span className="text-[9px] text-[#8B9CB5]">{portfolioResult.partialWeightedPercent.toFixed(1)}% Coverage</span>
                </div>
              </div>
            </div>
          </div>

          {/* Spatial Constellation Overview Visualizer */}
          <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-4 sm:p-5 space-y-3 shadow-[0_4px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/5 shine-card">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#8B9CB5] uppercase tracking-wider font-semibold">Campaign Constellation (k={targetK})</span>
              <span className="text-[#00D4AA] text-[10px] font-bold">MULTI-CONTINENTAL LINK</span>
            </div>
            
            <div className="relative w-full h-36 bg-[#050811]/90 rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2 shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 340 120" fill="none">
                {/* Background gridlines */}
                <line x1="20" y1="60" x2="320" y2="60" stroke="rgba(139,156,181,0.1)" strokeDasharray="3 3" />
                <line x1="170" y1="15" x2="170" y2="105" stroke="rgba(139,156,181,0.1)" strokeDasharray="3 3" />
                <circle cx="170" cy="60" r="45" stroke="rgba(139,156,181,0.08)" strokeDasharray="2 2" />

                {/* Geodesic Campaign Links */}
                <path
                  d={targetK === 3 ? "M60,65 Q170,25 280,65 Q170,95 60,65" : "M80,60 Q170,30 260,60"}
                  stroke="rgba(0,212,170,0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Triangulation links for k=3 */}
                {targetK === 3 && (
                  <path
                    d="M60,65 L170,35 L280,65 Z"
                    stroke="rgba(0,212,170,0.2)"
                    fill="rgba(0,212,170,0.05)"
                  />
                )}

                {/* Node A: Cinder Lake */}
                <g transform="translate(60,65)">
                  <circle r="14" fill="rgba(0,212,170,0.2)" stroke="#00D4AA" strokeWidth="1.5" />
                  <circle r="4" fill="#00D4AA" />
                  <text x="0" y="-18" fill="#F8FAFC" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SITE A: CINDER</text>
                  <text x="0" y="24" fill="#8B9CB5" fontSize="7.5" fontFamily="monospace" textAnchor="middle">+11 Req (36.7%)</text>
                </g>

                {/* Node B: Askja Caldera */}
                <g transform={targetK === 3 ? "translate(170,35)" : "translate(260,60)"}>
                  <circle r="14" fill="rgba(30,144,255,0.2)" stroke="#1E90FF" strokeWidth="1.5" />
                  <circle r="4" fill="#1E90FF" />
                  <text x="0" y="-18" fill="#F8FAFC" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SITE B: ASKJA</text>
                  <text x="0" y="24" fill="#8B9CB5" fontSize="7.5" fontFamily="monospace" textAnchor="middle">+8 Req (26.7%)</text>
                </g>

                {/* Node C: Atacama Desert (k=3 only) */}
                {targetK === 3 && (
                  <g transform="translate(280,65)">
                    <circle r="14" fill="rgba(255,107,53,0.2)" stroke="#FF6B35" strokeWidth="1.5" />
                    <circle r="4" fill="#FF6B35" />
                    <text x="0" y="-18" fill="#F8FAFC" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SITE C: ATACAMA</text>
                    <text x="0" y="24" fill="#8B9CB5" fontSize="7.5" fontFamily="monospace" textAnchor="middle">+4 Req (13.3%)</text>
                  </g>
                )}
              </svg>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#8B9CB5] px-1">
              <span>Greedy selection order: A → B {targetK === 3 ? '→ C' : ''}</span>
              <span className="text-[#00D4AA] font-bold">Total Marginal: {portfolioResult.coveredCount}/30 Binary</span>
            </div>
          </div>

          {/* Constituent Analog Sites List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#8B9CB5] font-semibold">
                Optimized Constituent Sites Stack
              </h3>
              <span className="text-[10px] font-mono text-[#8B9CB5]">Binary coverage contribution (θ ≥ 0.70)</span>
            </div>

            {portfolioSites.map((item, index) => {
              const letter = String.fromCharCode(65 + index); // A, B, C
              const accentBorder = index === 0 ? 'border-[#00D4AA]/40' : index === 1 ? 'border-[#1E90FF]/40' : 'border-[#FF6B35]/40';
              const badgeBg = index === 0 ? 'bg-gradient-to-br from-[#00D4AA] to-[#00F2C3] text-[#050811]' : index === 1 ? 'bg-gradient-to-br from-[#1E90FF] to-[#38BDF8] text-[#050811]' : 'bg-gradient-to-br from-[#FF6B35] to-[#FFA07A] text-[#050811]';
              const glowColor = index === 0 ? 'shadow-[0_0_12px_rgba(0,212,170,0.2)]' : index === 1 ? 'shadow-[0_0_12px_rgba(30,144,255,0.2)]' : 'shadow-[0_0_12px_rgba(255,107,53,0.2)]';

              return (
                <div
                  key={item.contrib.siteId}
                  className={`rounded-2xl border ${accentBorder} bg-[#0A192F]/80 backdrop-blur-xl p-4 sm:p-5 space-y-3 transition-all hover:bg-[#0A192F]/95 ${glowColor} ring-1 ring-white/5 shine-card`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${badgeBg} shadow-lg`}>
                        {letter}
                      </span>
                      <div>
                        <h4 className="text-sm font-display font-bold text-white">
                          {item.site?.name || item.contrib.siteId}
                        </h4>
                        <div className="text-[10px] font-mono text-[#8B9CB5]">
                          {item.site?.region}, {item.site?.country} · Elevation: {item.site?.elevationMeters}m (Nominal Baseline)
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-[#00D4AA]">
                        +{item.contrib.marginalPercent.toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-mono text-[#8B9CB5]">
                        +{item.contrib.marginalCount} Binary (θ ≥ 0.70)
                      </div>
                    </div>
                  </div>

                  {/* Primary Mission Relevance */}
                  <div className="text-xs font-sans text-[#CBD5E1] bg-black/30 p-3 rounded-xl border border-white/10 shadow-inner">
                    <span className="font-semibold text-white">Role: </span>
                    {item.site?.primaryMissionRelevance}
                  </div>

                  {/* Inescapable Gap Annotation */}
                  <div className="text-[10px] font-mono text-[#8B9CB5] flex items-center justify-between pt-1 border-t border-white/5">
                    <span>
                      Coordinates: {item.site?.coordinates.lat.toFixed(4)}°, {item.site?.coordinates.lng.toFixed(4)}°
                    </span>
                    <span className="text-amber-400/80">
                      SOURCE REF DEM: {item.site?.demResolutionMeters}m ({item.site?.demSource})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logistics Complexity Card */}
          <div className="rounded-2xl border border-white/10 bg-[#0A192F]/60 backdrop-blur-xl p-4 text-xs font-mono text-[#CBD5E1] space-y-2 ring-1 ring-white/5 shine-card">
            <div className="flex items-center justify-between text-[#8B9CB5] uppercase text-[10px] font-semibold">
              <span>CAMPAIGN LOGISTICS COMPLEXITY</span>
              <span className="text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">MODERATE COMPLEXITY</span>
            </div>
            <p className="text-[11px] font-sans text-[#8B9CB5] leading-relaxed">
              Expedition footprint requires deployment to {portfolioResult.k} sites across multiple continents (North America, Europe, South America). Permitting protocols governed by local jurisdictions.
            </p>
          </div>
        </div>

        {/* Right Column: 30-Parameter Requirements Verification Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#0A192F]/80 backdrop-blur-xl p-5 sm:p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 shine-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
              <div>
                <h3 className="text-base font-display font-bold text-white">
                  Requirements Verification Matrix (RVM)
                </h3>
                <p className="text-xs font-sans text-[#8B9CB5] mt-0.5">
                  Derived from NASA SP-2016-6105 Systems Engineering &amp; Artemis CONOPS.
                </p>
              </div>

              {/* Threshold Indicator */}
              <div className="text-right text-xs font-mono text-[#8B9CB5] flex items-center gap-1.5">
                <span>THRESHOLD θ ≥</span>
                <span className="text-[#00D4AA] font-bold font-mono px-2 py-0.5 rounded-full bg-[#00D4AA]/10 border border-[#00D4AA]/30">
                  {fidelityThreshold.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {domainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDomainFilter(tab.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                    activeDomainFilter === tab.id
                      ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/40 font-bold shadow-[0_0_8px_rgba(0,212,170,0.15)]'
                      : 'bg-white/5 text-[#8B9CB5] hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto max-h-[580px] overflow-y-auto rounded-xl border border-white/10 luminous-table-container">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-[#112240] border-b border-white/10 text-[#8B9CB5] uppercase text-[10px] tracking-wider z-10">
                  <tr>
                    <th className="py-3 px-3">Code</th>
                    <th className="py-3 px-3">Requirement &amp; Metric</th>
                    <th className="py-3 px-2 text-center">A (CL)</th>
                    <th className="py-3 px-2 text-center">B (IS)</th>
                    {targetK === 3 && <th className="py-3 px-2 text-center">C (AT)</th>}
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[#CBD5E1]">
                  {displayedRequirements.map((req) => {
                    const scoreA = req.fidelityScoresBySite['cinder-lake'] ?? 0;
                    const scoreB = req.fidelityScoresBySite['askja-caldera'] ?? 0;
                    const scoreC = req.fidelityScoresBySite['atacama-desert'] ?? 0;

                    const effectiveScores = targetK === 3 ? [scoreA, scoreB, scoreC] : [scoreA, scoreB];
                    const maxScore = Math.max(...effectiveScores);

                    let statusText = 'UNCOVERED';
                    let statusClass = 'bg-red-500/10 text-red-400 border-red-500/30';

                    if (req.isInvariantGap) {
                      statusText = 'INVARIANT GAP';
                      statusClass = 'bg-red-500/20 text-red-400 border-red-500/40';
                    } else if (maxScore >= fidelityThreshold) {
                      statusText = 'COVERED';
                      statusClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold';
                    } else if (maxScore >= 0.50) {
                      statusText = 'PARTIAL (0.5×)';
                      statusClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                    }

                    return (
                      <tr key={req.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 font-bold text-[#00D4AA] whitespace-nowrap">
                          {req.code}
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="font-display font-semibold text-white text-[11px] truncate">
                            {req.name}
                          </div>
                          <div className="text-[10px] text-[#8B9CB5] truncate mt-0.5">
                            {req.targetMetric}
                          </div>
                        </td>

                        {/* Site Scores */}
                        <td className={`py-2.5 px-2 text-center font-mono ${scoreA >= 0.70 ? 'text-[#00D4AA] font-bold' : 'text-[#8B9CB5]/70'}`}>
                          {scoreA.toFixed(2)}
                        </td>
                        <td className={`py-2.5 px-2 text-center font-mono ${scoreB >= 0.70 ? 'text-[#38BDF8] font-bold' : 'text-[#8B9CB5]/70'}`}>
                          {scoreB.toFixed(2)}
                        </td>
                        {targetK === 3 && (
                          <td className={`py-2.5 px-2 text-center font-mono ${scoreC >= 0.70 ? 'text-[#FF6B35] font-bold' : 'text-[#8B9CB5]/70'}`}>
                            {scoreC.toFixed(2)}
                          </td>
                        )}

                        {/* Status Badge */}
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border uppercase ${statusClass}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer Metrics Breakdown */}
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Covered: {portfolioResult.coveredCount} / {portfolioResult.totalRequirements} ({portfolioResult.coveragePercent.toFixed(1)}%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Partial (0.50–0.69): {portfolioResult.partialCount} Criteria (0.5×)</span>
                </span>
                <span className="flex items-center gap-1.5 text-red-400">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span>Physics Gaps: {portfolioResult.invariantGapCount} ({portfolioResult.invariantGapPercent.toFixed(1)}%)</span>
                </span>
              </div>

              <div className="text-[#8B9CB5] text-[10px]">
                Showing {displayedRequirements.length} of {allReqs.length} total parameters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <Link
          href="/reality-gap"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#8B9CB5] hover:text-white transition-colors"
        >
          <span>← PREVIOUS: SCREEN 03 REALITY GAP DIAGNOSTIC</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-mono text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_16px_rgba(0,212,170,0.4)]"
        >
          <span>RETURN TO SCREEN 01: MISSION COMMAND →</span>
        </Link>
      </div>
    </div>
  );
}

