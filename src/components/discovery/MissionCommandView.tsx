/**
 * TERRALIGN — Mission Command (Flagship Planetary Environment)
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 *
 * Architecture:
 * - 100% Full-Bleed 3D Planetary Earth Canvas (Dominant Visual Environment)
 * - True WGS84 Geolocation of 7 Flagship Sites
 * - Smooth Camera Glide to Inspected Site
 * - Minimal Floating Aerospace HUD (Restrained, No Garish Neon Borders)
 * - Expandable Floating Site Dossier with USGS/NASA Provenance
 * - Direct Contextual Routing to Terrain Studio, Reality Gap, and Portfolio
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EarthGlobe } from '@/components/globe/EarthGlobe';
import { DiscoveryMap } from './DiscoveryMap';
import {
  useMissionStore,
  useSelectedSiteId,
  useTargetBody,
  useActiveActivity,
} from '@/store/useMissionStore';
import { getAllAnalogs, getAnalogById, getAllActivities, getActivityById } from '@/lib/analogs';
import type { AnalogSite } from '@/types/analogs';

export function MissionCommandView() {
  const selectedSiteId = useSelectedSiteId();
  const selectSite = useMissionStore((s) => s.selectSite);
  const targetBody = useTargetBody();
  const setTargetBody = useMissionStore((s) => s.setTargetBody);
  const activeActivityId = useActiveActivity();
  const setActiveActivity = useMissionStore((s) => s.setActiveActivity);
  const comparisonSiteIds = useMissionStore((s) => s.selection.comparisonSiteIds);
  const toggleComparison = useMissionStore((s) => s.toggleComparisonSite);

  const [dossierOpen, setDossierOpen] = useState(true);
  const [show2DMap, setShow2DMap] = useState(false);
  const [activityMenuOpen, setActivityMenuOpen] = useState(false);

  const sites = getAllAnalogs();
  const site = getAnalogById(selectedSiteId) || sites[0];
  const activities = getAllActivities();
  const activeActivity = getActivityById(activeActivityId) || activities[0];

  const score = site.suitabilityScores[activeActivityId] ?? 0.5;
  const matchPercent = Math.round(score * 100);
  const confidence = site.confidenceScores[activeActivityId] ?? 0.7;
  const isCompared = comparisonSiteIds.includes(site.id);

  return (
    <div className="relative w-full h-[calc(100vh-3rem)] overflow-hidden bg-transparent select-none">
      {/* ── 1. Full-Bleed 3D Planetary Environment ── */}
      <div className="absolute inset-0 z-0">
        <EarthGlobe
          className="w-full h-full"
          cameraDistance={7.8}
          onSiteClick={() => setDossierOpen(true)}
        />
      </div>

      {/* ── 2. Cinematic Edge Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 60%, rgba(5,8,17,0.85) 100%),
            linear-gradient(to bottom, rgba(5,8,17,0.7) 0%, transparent 15%, transparent 85%, rgba(5,8,17,0.9) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* ── 3. Top-Left Floating Mission Telemetry HUD ── */}
      <div className="absolute top-4 left-4 sm:left-6 z-20 flex flex-col gap-2.5 max-w-sm">
        {/* Planetary Target Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 text-xs font-mono shine-card shine-delay-1">
          <span className="px-2 text-[10px] text-[#8B9CB5] tracking-widest uppercase font-semibold">Target</span>
          <button
            onClick={() => setTargetBody('moon')}
            className={`px-3 py-1.5 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
              targetBody === 'moon'
                ? 'bg-gradient-to-r from-[#1E90FF]/30 to-[#1E90FF]/15 text-white border border-[#1E90FF]/60 font-semibold shadow-[0_0_12px_rgba(30,144,255,0.3)]'
                : 'text-[#8B9CB5] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-[#38BDF8]">☽</span>
            <span>MOON (Shackleton)</span>
          </button>
          <button
            onClick={() => setTargetBody('mars')}
            className={`px-3 py-1.5 rounded-lg text-[11px] transition-all flex items-center gap-1.5 ${
              targetBody === 'mars'
                ? 'bg-gradient-to-r from-[#FF6B35]/30 to-[#FF6B35]/15 text-white border border-[#FF6B35]/60 font-semibold shadow-[0_0_12px_rgba(255,107,53,0.3)]'
                : 'text-[#8B9CB5] hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="text-[#FF6B35]">♂</span>
            <span>MARS (Jezero)</span>
          </button>
        </div>

        {/* Active Mission Activity Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setActivityMenuOpen(!activityMenuOpen)}
            className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5 text-xs text-left hover:border-[#00D4AA]/40 hover:shadow-[0_0_14px_rgba(0,212,170,0.15)] transition-all group"
          >
            <div>
              <div className="text-[9px] font-mono text-[#00D4AA] tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
                <span>Active Rehearsal Activity</span>
              </div>
              <div className="text-white font-medium truncate max-w-[240px] mt-0.5">
                {activeActivity.name}
              </div>
            </div>
            <svg
              className={`w-4 h-4 text-[#8B9CB5] group-hover:text-white transition-transform ${activityMenuOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {activityMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-full max-h-60 overflow-y-auto rounded-xl bg-[#0A192F]/95 backdrop-blur-2xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-1.5 z-30 space-y-1">
              {activities.map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    setActiveActivity(act.id);
                    setActivityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between ${
                    act.id === activeActivityId
                      ? 'bg-[#00D4AA]/20 text-[#00D4AA] font-semibold border border-[#00D4AA]/30'
                      : 'text-[#CBD5E1] hover:bg-[#112240] hover:text-white border border-transparent'
                  }`}
                >
                  <span className="truncate pr-2">{act.name}</span>
                  <span className="text-[9px] font-mono text-[#8B9CB5] shrink-0 uppercase">
                    {act.targetBody}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Cartographic 2D Map Toggle */}
        <button
          type="button"
          onClick={() => setShow2DMap(!show2DMap)}
          className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A192F]/70 backdrop-blur-xl border border-white/10 text-[10px] font-mono text-[#8B9CB5] hover:text-white hover:border-[#00D4AA]/40 hover:shadow-[0_0_12px_rgba(0,212,170,0.15)] transition-all"
        >
          <svg className="w-3.5 h-3.5 text-[#00D4AA]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
          </svg>
          <span>{show2DMap ? 'HIDE 2D EQUIRECTANGULAR MAP' : 'OVERLAY 2D CARTOGRAPHIC MAP'}</span>
        </button>
      </div>

      {/* ── 4. Optional 2D Map Modal Overlay ── */}
      {show2DMap && (
        <div className="absolute inset-4 sm:inset-12 z-30 rounded-xl bg-[#050811]/95 backdrop-blur-xl border border-[#8B9CB5]/30 shadow-2xl p-4 flex flex-col shine-card">
          <div className="flex items-center justify-between pb-3 border-b border-[#8B9CB5]/20 mb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#00D4AA]">
              <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
              <span>WGS84 EQUIRECTANGULAR CARTOGRAPHY // 7 FLAGSHIP SITES</span>
            </div>
            <button
              onClick={() => setShow2DMap(false)}
              className="p-1 rounded text-[#8B9CB5] hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 w-full h-full min-h-0">
            <DiscoveryMap />
          </div>
        </div>
      )}

      {/* ── 5. Bottom Floating Analog Site Quick Selector ── */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto z-20 flex items-center gap-2 overflow-x-auto max-w-2xl p-1.5 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/5 custom-scrollbar shine-card shine-delay-2">
        {sites.map((s) => {
          const isSelected = s.id === selectedSiteId;
          return (
            <button
              key={s.id}
              onClick={() => {
                selectSite(s.id);
                setDossierOpen(true);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811] font-bold shadow-[0_0_14px_rgba(0,212,170,0.5)] scale-105'
                  : 'bg-[#112240]/40 backdrop-blur-md text-[#CBD5E1] border border-white/5 hover:text-white hover:border-[#00D4AA]/30 hover:bg-[#112240]/80'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-[#050811]' : 'bg-[#00D4AA] animate-pulse'
                }`}
              />
              <span>{s.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* ── 6. Right Floating Minimalist Site Dossier ── */}
      {dossierOpen ? (
        <div className="absolute top-4 right-4 sm:right-6 bottom-16 sm:bottom-4 z-20 w-full sm:w-[430px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl bg-[#0A192F]/85 backdrop-blur-2xl border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.65)] ring-1 ring-white/5 overflow-hidden animate-in fade-in slide-in-from-right duration-300 shine-card shine-delay-3">
          {/* Subtle top edge highlight */}
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00D4AA]/40 to-transparent shrink-0" />

          {/* Dossier Header */}
          <div className="p-4 border-b border-white/10 flex items-start justify-between bg-gradient-to-b from-[#050811]/60 to-[#0A192F]/40">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#00D4AA] uppercase tracking-wider mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_8px_#00D4AA]" />
                <span className="font-semibold">Analog Site Dossier</span>
                <span className="text-[#8B9CB5]">// ID: {site.id}</span>
              </div>
              <h2 className="text-base font-display font-bold text-white tracking-tight leading-tight">
                {site.name}
              </h2>
              <div className="text-[11px] font-mono text-[#8B9CB5] mt-1 flex items-center gap-2 flex-wrap">
                <span>
                  {Math.abs(site.coordinates.lat).toFixed(4)}°{site.coordinates.lat >= 0 ? 'N' : 'S'},{' '}
                  {Math.abs(site.coordinates.lng).toFixed(4)}°{site.coordinates.lng >= 0 ? 'E' : 'W'}
                </span>
                <span 
                  className="px-1.5 py-0.5 rounded bg-white/5 text-white font-semibold text-[10px] border border-white/10"
                  title="Nominal geomorphic regional baseline from literature catalog (USGS OFR 68-24)"
                >
                  Elev {site.elevationMeters}m (Nominal)
                </span>
              </div>
            </div>

            <button
              onClick={() => setDossierOpen(false)}
              className="p-1.5 rounded-lg text-[#8B9CB5] hover:text-white hover:bg-white/5 transition-colors"
              title="Close Dossier"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Dossier Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
            {/* Match Metric Callout */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#112240]/50 backdrop-blur-md border border-white/10 shadow-inner font-mono">
              <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                <span className="text-[9px] text-[#8B9CB5] block uppercase tracking-wider font-semibold">Suitability Match</span>
                <span className="text-xl font-bold text-[#00D4AA] tracking-tight">{matchPercent}%</span>
                <span className="text-[8.5px] text-[#8B9CB5]/80 block mt-0.5">Literature Model</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20 border border-white/5">
                <span className="text-[9px] text-[#8B9CB5] block uppercase tracking-wider font-semibold">Confidence Index</span>
                <span className="text-xl font-bold text-white tracking-tight">{(confidence * 100).toFixed(0)}%</span>
                <span className="text-[8.5px] text-[#8B9CB5]/80 block mt-0.5">Heuristic Rating</span>
              </div>
            </div>

            {/* Geomorphology & Relevance */}
            <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-[#00D4AA] uppercase tracking-wider block font-semibold">
                Geomorphological Context
              </span>
              <p className="text-[#CBD5E1] leading-relaxed font-sans text-xs">
                {site.geomorphology}
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] font-mono text-[#1E90FF] uppercase tracking-wider block font-semibold">
                Primary Mission Relevance
              </span>
              <p className="text-[#CBD5E1] leading-relaxed font-sans text-xs">
                {site.primaryMissionRelevance}
              </p>
            </div>

            {/* DEM Technical Provenance */}
            <div className="p-3 rounded-xl bg-[#050811]/60 border border-white/10 space-y-1.5 text-[11px] font-mono">
              <div className="text-[#1E90FF] font-semibold flex items-center gap-1.5">
                <span>🛰</span>
                <span>SOURCE REFERENCE: {site.demSource.split(' ')[0]} — Published {site.demResolutionMeters}m Resolution</span>
              </div>
              <div className="text-[#8B9CB5] text-[10px]">{site.demSource}</div>
              <div className="text-[#8B9CB5]/70 text-[9.5px] leading-tight">
                RENDERED MODEL: Procedural morphometric visualization parameterized from published {site.demSource.split(' ')[0]} profiles.
              </div>
            </div>

            {/* Literature Citations */}
            {site.literatureCitations && site.literatureCitations.length > 0 && (
              <div className="space-y-1.5 text-[10px] font-mono">
                <span className="text-[#8B9CB5] uppercase tracking-wider block font-semibold">
                  Ground-Truth Literature
                </span>
                <div className="p-2.5 rounded-xl bg-[#050811]/50 border border-white/10 text-[#CBD5E1] space-y-0.5">
                  <div className="text-white font-medium">{site.literatureCitations[0].title}</div>
                  <div className="text-[#8B9CB5]">
                    {site.literatureCitations[0].authors} ({site.literatureCitations[0].year}) ·{' '}
                    <span className="text-[#00D4AA]">{site.literatureCitations[0].citation}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dossier Bottom Action Buttons */}
          <div className="p-3.5 border-t border-white/10 bg-[#050811]/85 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/terrain"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#112240] to-[#1E3A8A]/40 hover:from-[#1E3A8A]/60 hover:to-[#1E90FF]/30 border border-[#1E90FF]/40 text-white font-mono text-xs font-semibold transition-all shadow-[0_0_12px_rgba(30,144,255,0.15)] hover:shadow-[0_0_16px_rgba(30,144,255,0.3)] text-center"
              >
                <span>3D TERRAIN STUDIO →</span>
              </Link>
              <Link
                href="/reality-gap"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#112240] to-[#0D9488]/30 hover:from-[#0D9488]/50 hover:to-[#00D4AA]/30 border border-[#00D4AA]/40 text-white font-mono text-xs font-semibold transition-all shadow-[0_0_12px_rgba(0,212,170,0.15)] hover:shadow-[0_0_16px_rgba(0,212,170,0.3)] text-center"
              >
                <span>REALITY GAP (ARG) →</span>
              </Link>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => toggleComparison(site.id)}
                className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg transition-all ${
                  isCompared
                    ? 'bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/40 shadow-[0_0_10px_rgba(0,212,170,0.2)]'
                    : 'text-[#8B9CB5] hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                {isCompared ? '✓ INCLUDED IN PORTFOLIO' : '+ ADD TO PORTFOLIO POOL'}
              </button>

              <Link
                href="/portfolio"
                className="text-[10px] font-mono text-[#00D4AA] hover:text-[#00F2C3] hover:underline transition-colors flex items-center gap-1"
              >
                <span>OPTIMIZE PORTFOLIO (k=3)</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Floating Button to Reopen Dossier when closed */
        <button
          onClick={() => setDossierOpen(true)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/15 text-xs font-mono text-white hover:border-[#00D4AA] hover:shadow-[0_0_14px_rgba(0,212,170,0.25)] transition-all"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
          <span>INSPECT {site.shortName.toUpperCase()}</span>
        </button>
      )}
    </div>
  );
}
