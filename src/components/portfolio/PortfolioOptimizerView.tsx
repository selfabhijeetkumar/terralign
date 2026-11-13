'use client';

/**
 * TERRALIGN — Screen 04: Multi-Site Rehearsal Portfolio Optimizer
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Design Ref: docs/design/screen-04-portfolio-optimizer.md & prototype-data-register.md
 *
 * Epistemic Guardrail:
 *   - The >90% coverage threshold is an UNVALIDATED ENGINEERING RESEARCH TARGET.
 *   - Current empirical portfolio achieves 78.3% partial-weighted (23.5/30) / 76.7% binary (23/30).
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

  // Candidate pool prioritizing canonical flagship combination: Cinder Lake, Askja, Atacama, McMurdo, Hawaii, etc.
  const candidateSiteIds = useMemo(() => {
    return [
      'cinder-lake',
      'askja-caldera',
      'atacama-desert',
      'mcmurdo-dry-valleys',
      'hawaii-mauna-kea',
      'utah-san-rafael',
      'haughton-crater',
    ];
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
      {/* Top Header & Breadcrumb Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-accent-terrestrial tracking-widest uppercase mb-1">
            <span>SCREEN 04</span>
            <span>//</span>
            <span>MULTI-SITE REHEARSAL PORTFOLIO OPTIMIZER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary tracking-tight">
            Submodular Campaign Coverage (k = {targetK})
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 font-sans">
            Combinatorial optimization of complementary analog sites against 30 NASA Requirements Verification Matrix (RVM) parameters.
          </p>
        </div>

        {/* Global Action / Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Portfolio Size Toggle (k=2 vs k=3) */}
          <div className="inline-flex rounded-card border border-space-border bg-space-surface p-1">
            <button
              onClick={() => setPortfolioK(2)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                targetK === 2
                  ? 'bg-accent-terrestrial text-space-bg font-bold shadow-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              k = 2 SITES
            </button>
            <button
              onClick={() => setPortfolioK(3)}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                targetK === 3
                  ? 'bg-accent-terrestrial text-space-bg font-bold shadow-glow'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              k = 3 SITES (OPTIMAL)
            </button>
          </div>

          {/* Export Dossier CTA */}
          <button
            onClick={handleExportDossier}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-card bg-accent-terrestrial text-space-bg font-mono text-xs font-bold hover:bg-accent-terrestrial/90 transition-all shadow-glow"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>EXPORT MISSION DOSSIER (JSON)</span>
          </button>
        </div>
      </div>

      {/* Epistemic Guardrail Banner */}
      <div className="rounded-card border border-status-warning/40 bg-status-warning/10 p-4 text-xs font-mono text-status-warning flex items-start gap-3">
        <span className="text-base leading-none">⚠</span>
        <div className="space-y-1">
          <div className="font-bold uppercase tracking-wider">
            PROPOSED RESEARCH TARGET — UNVALIDATED HYPOTHESIS
          </div>
          <div className="text-[11px] text-text-secondary leading-relaxed">
            The &gt;90% mission coverage target is an architectural research goal. On Earth, invariant physical barriers (hard vacuum, 1/6g dynamics, GCR radiation, cryogenic PSRs) enforce a mathematical terrestrial ceiling of <span className="font-bold text-accent-terrestrial">86.7% (26/30 criteria)</span>. All calculations use partial-weighted coverage verified against NASA SP-2016-6105 specifications.
          </div>
        </div>
      </div>

      {/* Main Split Grid: Left = Optimized Portfolio, Right = RVM Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Optimized Candidate Portfolio & Marginal Gains (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Top Score Summary Card */}
          <div className="rounded-card border border-space-border bg-space-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-muted tracking-wider uppercase">
                PORTFOLIO COVERAGE (k = {targetK})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-accent-terrestrial/30 bg-accent-terrestrial/10 text-accent-terrestrial">
                GREEDY OPTIMAL (1 - 1/e)
              </span>
            </div>

            {/* Coverage Big Numbers */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-mono font-bold text-accent-terrestrial">
                  {portfolioResult.partialWeightedPercent.toFixed(1)}%
                </span>
                <span className="text-xs font-mono text-text-muted ml-2">
                  ({portfolioResult.partialWeightedCount.toFixed(1)} / {portfolioResult.totalRequirements})
                </span>
              </div>
              <div className="text-right text-[11px] font-mono">
                <div className="text-text-muted">BINARY (θ ≥ 0.70):</div>
                <div className="font-bold text-text-primary">
                  {portfolioResult.coveragePercent.toFixed(1)}% ({portfolioResult.coveredCount}/{portfolioResult.totalRequirements})
                </div>
              </div>
            </div>

            {/* Multi-tier Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-space-elevated flex overflow-hidden p-0.5 border border-space-border">
                {/* Site Contributions */}
                {portfolioResult.marginalSiteContributions.map((contrib, i) => {
                  const colors = ['bg-accent-terrestrial', 'bg-accent-lunar', 'bg-accent-martian'];
                  return (
                    <div
                      key={contrib.siteId}
                      className={`h-full first:rounded-l-full ${colors[i % colors.length]} transition-all duration-500`}
                      style={{ width: `${contrib.marginalPercent}%` }}
                      title={`${siteLookup[contrib.siteId]?.shortName || contrib.siteId}: +${contrib.marginalPercent}%`}
                    />
                  );
                })}
              </div>

              {/* Benchmark Reference Marks */}
              <div className="flex justify-between text-[10px] font-mono text-text-muted">
                <span>0%</span>
                <span className="text-accent-terrestrial">Current: {portfolioResult.partialWeightedPercent.toFixed(1)}%</span>
                <span className="text-text-secondary">Ceiling: 86.7%</span>
                <span className="text-status-warning">Target: &gt;90%</span>
              </div>
            </div>

            {/* Benchmark Comparison Table */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-space-border text-xs font-mono">
              <div className="p-2 rounded bg-space-bg/60 border border-space-border/50">
                <div className="text-[10px] text-text-muted">INESCAPABLE GAPS</div>
                <div className="text-sm font-bold text-status-danger">13.3% (4 / 30)</div>
                <div className="text-[9px] text-text-muted">Vacuum, 1/6g, GCR, PSR</div>
              </div>
              <div className="p-2 rounded bg-space-bg/60 border border-space-border/50">
                <div className="text-[10px] text-text-muted">TERRESTRIAL CEILING</div>
                <div className="text-sm font-bold text-accent-terrestrial">86.7% (26 / 30)</div>
                <div className="text-[9px] text-text-muted">Max achievable on Earth</div>
              </div>
            </div>
          </div>

          {/* Constituent Analog Sites List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted">
                Optimized Constituent Sites Stack
              </h3>
              <span className="text-xs font-mono text-text-muted">{portfolioSites.length} Selected Sites</span>
            </div>

            {portfolioSites.map((item, index) => {
              const letter = String.fromCharCode(65 + index); // A, B, C
              const accentColor = index === 0 ? 'border-accent-terrestrial/60' : index === 1 ? 'border-accent-lunar/60' : 'border-accent-martian/60';
              const badgeBg = index === 0 ? 'bg-accent-terrestrial text-space-bg' : index === 1 ? 'bg-accent-lunar text-space-bg' : 'bg-accent-martian text-space-bg';

              return (
                <div
                  key={item.contrib.siteId}
                  className={`rounded-card border ${accentColor} bg-space-surface p-4 space-y-3 transition-all hover:bg-space-surface/90`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-xs ${badgeBg}`}>
                        {letter}
                      </span>
                      <div>
                        <h4 className="text-sm font-display font-bold text-text-primary">
                          {item.site?.name || item.contrib.siteId}
                        </h4>
                        <div className="text-[10px] font-mono text-text-muted">
                          {item.site?.region}, {item.site?.country} · Elevation: {item.site?.elevationMeters}m
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-accent-terrestrial">
                        +{item.contrib.marginalPercent.toFixed(1)}%
                      </div>
                      <div className="text-[10px] font-mono text-text-muted">
                        +{item.contrib.marginalCount} Criteria
                      </div>
                    </div>
                  </div>

                  {/* Primary Mission Relevance */}
                  <div className="text-xs font-sans text-text-secondary bg-space-bg/60 p-2.5 rounded border border-space-border/40">
                    <span className="font-semibold text-text-primary">Role: </span>
                    {item.site?.primaryMissionRelevance}
                  </div>

                  {/* Inescapable Gap Annotation */}
                  <div className="text-[10px] font-mono text-text-muted flex items-center justify-between pt-1">
                    <span>
                      Coordinates: {item.site?.coordinates.lat.toFixed(4)}°, {item.site?.coordinates.lng.toFixed(4)}°
                    </span>
                    <span className="text-status-warning">
                      DEM: {item.site?.demResolutionMeters}m ({item.site?.demSource})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Logistics Complexity Card */}
          <div className="rounded-card border border-space-border bg-space-surface/60 p-4 text-xs font-mono text-text-secondary space-y-2">
            <div className="flex items-center justify-between text-text-muted uppercase text-[10px]">
              <span>CAMPAIGN LOGISTICS COMPLEXITY</span>
              <span className="text-status-warning font-bold">MODERATE COMPLEXITY</span>
            </div>
            <p className="text-[11px] font-sans text-text-muted leading-relaxed">
              Expedition footprint requires deployment to {portfolioResult.k} sites across multiple continents (North America, Europe, South America). Permitting protocols governed by local jurisdictions.
            </p>
          </div>
        </div>

        {/* Right Column: 30-Parameter Requirements Verification Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-card border border-space-border bg-space-surface p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-space-border">
              <div>
                <h3 className="text-base font-display font-bold text-text-primary">
                  Requirements Verification Matrix (RVM)
                </h3>
                <p className="text-xs font-sans text-text-muted mt-0.5">
                  Derived from NASA SP-2016-6105 Systems Engineering &amp; Artemis CONOPS.
                </p>
              </div>

              {/* Threshold Indicator */}
              <div className="text-right text-xs font-mono text-text-muted">
                <span>THRESHOLD θ ≥ </span>
                <span className="text-accent-terrestrial font-bold font-mono">
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
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    activeDomainFilter === tab.id
                      ? 'bg-accent-terrestrial/20 text-accent-terrestrial border border-accent-terrestrial/40 font-bold'
                      : 'bg-space-elevated text-text-muted hover:text-text-primary border border-space-border'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead className="sticky top-0 bg-space-elevated border-b border-space-border text-text-muted uppercase text-[10px] tracking-wider z-10">
                  <tr>
                    <th className="py-2 px-2.5">Code</th>
                    <th className="py-2 px-2.5">Requirement &amp; Metric</th>
                    <th className="py-2 px-2 text-center">A (CL)</th>
                    <th className="py-2 px-2 text-center">B (IS)</th>
                    {targetK === 3 && <th className="py-2 px-2 text-center">C (AT)</th>}
                    <th className="py-2 px-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-space-border/40 text-text-secondary">
                  {displayedRequirements.map((req) => {
                    const scoreA = req.fidelityScoresBySite['cinder-lake'] ?? 0;
                    const scoreB = req.fidelityScoresBySite['askja-caldera'] ?? 0;
                    const scoreC = req.fidelityScoresBySite['atacama-desert'] ?? 0;

                    const effectiveScores = targetK === 3 ? [scoreA, scoreB, scoreC] : [scoreA, scoreB];
                    const maxScore = Math.max(...effectiveScores);

                    let statusText = 'UNCOVERED';
                    let statusClass = 'bg-status-danger/10 text-status-danger border-status-danger/30';

                    if (req.isInvariantGap) {
                      statusText = 'INVARIANT GAP';
                      statusClass = 'bg-status-danger/20 text-status-danger border-status-danger/40';
                    } else if (maxScore >= fidelityThreshold) {
                      statusText = 'COVERED';
                      statusClass = 'bg-status-success/10 text-status-success border-status-success/30 font-bold';
                    } else if (maxScore >= 0.50) {
                      statusText = 'PARTIAL (0.5×)';
                      statusClass = 'bg-status-warning/10 text-status-warning border-status-warning/30';
                    }

                    return (
                      <tr key={req.id} className="hover:bg-space-elevated/40 transition-colors">
                        <td className="py-2.5 px-2.5 font-bold text-accent-terrestrial whitespace-nowrap">
                          {req.code}
                        </td>
                        <td className="py-2.5 px-2.5 max-w-xs">
                          <div className="font-display font-semibold text-text-primary text-[11px] truncate">
                            {req.name}
                          </div>
                          <div className="text-[10px] text-text-muted truncate mt-0.5">
                            {req.targetMetric}
                          </div>
                        </td>

                        {/* Site Scores */}
                        <td className={`py-2 px-2 text-center font-mono ${scoreA >= 0.70 ? 'text-accent-terrestrial font-bold' : 'text-text-muted'}`}>
                          {scoreA.toFixed(2)}
                        </td>
                        <td className={`py-2 px-2 text-center font-mono ${scoreB >= 0.70 ? 'text-accent-lunar font-bold' : 'text-text-muted'}`}>
                          {scoreB.toFixed(2)}
                        </td>
                        {targetK === 3 && (
                          <td className={`py-2 px-2 text-center font-mono ${scoreC >= 0.70 ? 'text-accent-martian font-bold' : 'text-text-muted'}`}>
                            {scoreC.toFixed(2)}
                          </td>
                        )}

                        {/* Status Badge */}
                        <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${statusClass}`}>
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
            <div className="pt-3 border-t border-space-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-status-success">
                  <span className="w-2 h-2 rounded-full bg-status-success" />
                  <span>Covered: {portfolioResult.coveredCount} / {portfolioResult.totalRequirements}</span>
                </span>
                <span className="flex items-center gap-1.5 text-status-warning">
                  <span className="w-2 h-2 rounded-full bg-status-warning" />
                  <span>Partial (0.50–0.69): 3 Criteria</span>
                </span>
                <span className="flex items-center gap-1.5 text-status-danger">
                  <span className="w-2 h-2 rounded-full bg-status-danger" />
                  <span>Physics Gaps: 4 (13.3%)</span>
                </span>
              </div>

              <div className="text-text-muted text-[10px]">
                Showing {displayedRequirements.length} of {allReqs.length} total parameters
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-space-border">
        <Link
          href="/reality-gap"
          className="inline-flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-primary transition-colors"
        >
          <span>← PREVIOUS: SCREEN 03 REALITY GAP DIAGNOSTIC</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-card bg-accent-terrestrial text-space-bg font-mono text-xs font-bold hover:bg-accent-terrestrial/90 transition-all shadow-glow"
        >
          <span>RETURN TO SCREEN 01: MISSION COMMAND →</span>
        </Link>
      </div>
    </div>
  );
}

