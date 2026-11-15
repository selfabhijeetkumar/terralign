/**
 * TERRALIGN — Candidate Summary Drawer Component
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-01-mission-command.md & prototype-data-register.md
 */

'use client';

import React from 'react';
import Link from 'next/link';
import {
  useSelectedSiteId,
  useActiveActivity,
  useTargetBody,
  useMissionStore,
} from '@/store/useMissionStore';
import { getAnalogById, getActivityById } from '@/lib/analogs';

export function CandidateSummaryDrawer() {
  const selectedSiteId = useSelectedSiteId();
  const activeActivityId = useActiveActivity();
  const targetBody = useTargetBody();
  const toggleComparison = useMissionStore((s) => s.toggleComparisonSite);
  const comparisonSiteIds = useMissionStore((s) => s.selection.comparisonSiteIds);

  const site = getAnalogById(selectedSiteId) || getAnalogById('cinder-lake');
  const activity = getActivityById(activeActivityId);

  if (!site) return null;

  const score = site.suitabilityScores[activeActivityId] ?? 0.5;
  const matchPercent = Math.round(score * 100);
  const confidence = site.confidenceScores[activeActivityId] ?? 0.7;
  const isCompared = comparisonSiteIds.includes(site.id);

  return (
    <div className="relative w-full bg-[#0A192F]/90 border-t border-white/10 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] p-4 lg:p-5 select-none shrink-0 z-30 transition-all luminous-surface shine-card">
      {/* Ambient top glowing line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4AA]/40 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Site Title & Core Provenance Header */}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#00D4AA]/20 text-[#00D4AA] font-mono text-[10px] font-bold uppercase border border-[#00D4AA]/30 shadow-[0_0_8px_rgba(0,212,170,0.2)]">
              {site.classification}
            </span>
            <span className="text-xs font-mono text-[#8B9CB5]">
              ID: {site.id.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-[#1E90FF] flex items-center gap-1">
              <span>🛰</span>
              <span>SOURCE REF DEM: {site.demResolutionMeters}m ({site.demSource.split(' ')[0]})</span>
            </span>
          </div>

          <h2 className="font-headline font-bold text-lg lg:text-xl text-white tracking-wide">
            {site.name}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#8B9CB5]">
            <span>
              COORDS:{' '}
              <span className="text-white">
                {Math.abs(site.coordinates.lat).toFixed(4)}°
                {site.coordinates.lat >= 0 ? 'N' : 'S'},{' '}
                {Math.abs(site.coordinates.lng).toFixed(4)}°
                {site.coordinates.lng >= 0 ? 'E' : 'W'}
              </span>
            </span>
            <span>
              ELEVATION: <span className="text-white">{site.elevationDescription}</span>
            </span>
            <span className="hidden xl:inline text-[#8B9CB5]/60">
              REF: {site.literatureCitations[0]?.citation ?? 'NASA/USGS Field Report'}
            </span>
          </div>
        </div>

        {/* Center: Mission Suitability & Confidence Score Gauges */}
        <div className="flex items-center gap-4 lg:gap-6 bg-[#050811]/60 px-4 py-2.5 rounded-2xl border border-white/10 shrink-0 shadow-inner">
          {/* Suitability Score */}
          <div className="text-center">
            <div className="text-[10px] font-label uppercase tracking-wider text-[#8B9CB5] font-semibold">
              Suitability Fit
            </div>
            <div className="font-headline font-bold text-2xl text-[#00D4AA] flex items-center justify-center gap-1 drop-shadow-[0_0_8px_rgba(0,212,170,0.3)]">
              {matchPercent}%
            </div>
            <div className="text-[9px] font-mono text-[#8B9CB5]/80">
              DEMO VALUE
            </div>
          </div>

          <div className="h-8 w-px bg-white/10" />

          {/* Metric Confidence */}
          <div className="text-center">
            <div className="text-[10px] font-label uppercase tracking-wider text-[#8B9CB5] font-semibold">
              Data Coverage
            </div>
            <div className="font-headline font-bold text-2xl text-[#1E90FF] drop-shadow-[0_0_8px_rgba(30,144,255,0.3)]">
              C={confidence.toFixed(2)}
            </div>
            <div className="text-[9px] font-mono text-[#1E90FF] font-medium">
              {confidence >= 0.85 ? 'HIGH CONFIDENCE' : 'MODERATE'}
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          {/* 5-Dimension Mini Bar Gauges */}
          <div className="hidden sm:flex flex-col gap-1 w-32 text-[9px] font-mono">
            <div className="flex justify-between text-[#8B9CB5]">
              <span>GEOLOGY</span>
              <span className="text-white font-bold">{Math.round(site.dimensions.geological * 100)}%</span>
            </div>
            <div className="w-full bg-[#112240] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] h-full rounded-full"
                style={{ width: `${site.dimensions.geological * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-[#8B9CB5]">
              <span>GEOMORPH</span>
              <span className="text-white font-bold">{Math.round(site.dimensions.geomorphological * 100)}%</span>
            </div>
            <div className="w-full bg-[#112240] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#1E90FF] to-[#38BDF8] h-full rounded-full"
                style={{ width: `${site.dimensions.geomorphological * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Primary Cross-Screen Action Cluster */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => toggleComparison(site.id)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-headline font-semibold transition-all ${
              isCompared
                ? 'border-[#00D4AA]/50 bg-[#00D4AA]/20 text-[#00D4AA] shadow-[0_0_12px_rgba(0,212,170,0.25)]'
                : 'border-white/10 bg-[#112240]/40 text-[#8B9CB5] hover:text-white hover:border-white/20'
            }`}
          >
            {isCompared ? '✓ IN PORTFOLIO' : '+ ADD TO PORTFOLIO'}
          </button>

          <Link
            href="/reality-gap"
            className="px-3.5 py-2.5 rounded-xl border border-white/10 bg-[#112240]/70 hover:bg-[#112240] hover:border-[#00D4AA]/40 text-white hover:text-[#00D4AA] text-xs font-headline font-semibold transition-all shadow-[0_0_10px_rgba(0,0,0,0.3)]"
          >
            REALITY GAP (ARG)
          </Link>

          <Link
            href="/terrain"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] hover:brightness-110 text-[#050811] font-headline font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_16px_rgba(0,212,170,0.4)] flex items-center gap-1.5"
          >
            <span>3D TERRAIN STUDIO</span>
            <span className="font-mono">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
