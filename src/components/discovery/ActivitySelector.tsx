/**
 * TERRALIGN — Activity Selector & Planetary Mission Configuration Sidebar
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-01-mission-command.md & stitch prototype
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  useMissionStore,
  useTargetBody,
  useActiveActivity,
} from '@/store/useMissionStore';
import { getAllActivities } from '@/lib/analogs';
import type { TargetBody } from '@/types/store';

export function ActivitySelector() {
  const targetBody = useTargetBody();
  const activeActivity = useActiveActivity();
  const setTargetBody = useMissionStore((s) => s.setTargetBody);
  const setActiveActivity = useMissionStore((s) => s.setActiveActivity);
  const [filterExpanded, setFilterExpanded] = useState(true);

  const activities = getAllActivities();

  return (
    <aside className="w-full lg:w-[380px] xl:w-[420px] h-full flex flex-col bg-[#0A192F]/95 border-r border-[#8B9CB5]/20 backdrop-blur-md select-none shrink-0 z-20 overflow-hidden">
      {/* Target Body Selector Header */}
      <div className="p-4 border-b border-[#8B9CB5]/15 bg-[#050811]/60">
        <div className="flex items-center justify-between mb-2">
          <span className="font-headline font-semibold text-xs tracking-wider uppercase text-white flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]"></span>
            Planetary Target
          </span>
          <span className="text-[10px] font-mono text-[#8B9CB5]">
            DESTINATION: {targetBody.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Moon Button */}
          <button
            type="button"
            onClick={() => setTargetBody('moon')}
            aria-pressed={targetBody === 'moon'}
            className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group ${
              targetBody === 'moon'
                ? 'border-[#1E90FF] bg-[#112240] shadow-[0_0_12px_rgba(30,144,255,0.2)]'
                : 'border-[#8B9CB5]/20 bg-[#050811]/40 hover:border-[#8B9CB5]/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline font-bold text-sm tracking-wide text-white group-hover:text-[#1E90FF] transition-colors">
                MOON
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  targetBody === 'moon'
                    ? 'bg-[#1E90FF] shadow-[0_0_6px_#1E90FF]'
                    : 'bg-transparent border border-[#8B9CB5]'
                }`}
              ></span>
            </div>
            <div className="text-[11px] text-[#8B9CB5]">Lunar South Pole</div>
            <div className="mt-2 text-[10px] font-mono text-[#1E90FF]">
              ARTEMIS III / IV
            </div>
          </button>

          {/* Mars Button */}
          <button
            type="button"
            onClick={() => setTargetBody('mars')}
            aria-pressed={targetBody === 'mars'}
            className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group ${
              targetBody === 'mars'
                ? 'border-[#FF6B35] bg-[#112240] shadow-[0_0_12px_rgba(255,107,53,0.2)]'
                : 'border-[#8B9CB5]/20 bg-[#050811]/40 hover:border-[#8B9CB5]/40 opacity-70'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline font-bold text-sm tracking-wide text-white group-hover:text-[#FF6B35] transition-colors">
                MARS
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  targetBody === 'mars'
                    ? 'bg-[#FF6B35] shadow-[0_0_6px_#FF6B35]'
                    : 'bg-transparent border border-[#8B9CB5]'
                }`}
              ></span>
            </div>
            <div className="text-[11px] text-[#8B9CB5]">Martian Surface</div>
            <div className="mt-2 text-[10px] font-mono text-[#FF6B35]">
              MSR / PERSEVERANCE
            </div>
          </button>
        </div>
      </div>

      {/* Scrollable 9 Activities List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        <div className="flex items-center justify-between px-1 text-[11px] font-label uppercase tracking-wider text-[#8B9CB5]">
          <span>Planetary Mission Activities (9)</span>
          <span className="font-mono text-[10px] text-[#00D4AA]">STANDARDIZED</span>
        </div>

        {activities.map((act) => {
          const isActive = act.id === activeActivity;
          const bodyAccent = targetBody === 'moon' ? '#1E90FF' : '#FF6B35';

          return (
            <div
              key={act.id}
              onClick={() => setActiveActivity(act.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveActivity(act.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              className={`p-3 rounded-lg border cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00D4AA] ${
                isActive
                  ? 'border-[#00D4AA] bg-[#112240] shadow-[0_0_12px_rgba(0,212,170,0.15)]'
                  : 'border-[#8B9CB5]/15 bg-[#050811]/40 hover:bg-[#112240]/60 hover:border-[#8B9CB5]/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]'
                        : 'bg-[#8B9CB5]/40'
                    }`}
                  ></span>
                  <span
                    className={`font-headline font-bold text-xs ${
                      isActive ? 'text-white' : 'text-[#8B9CB5] hover:text-white'
                    }`}
                  >
                    {act.name}
                  </span>
                </div>
                {isActive && (
                  <span className="px-1.5 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] font-mono text-[9px] font-bold shrink-0">
                    ACTIVE
                  </span>
                )}
              </div>

              <p className="text-[11px] text-[#8B9CB5] mt-1 ml-4 leading-relaxed">
                {act.shortDescription}
              </p>

              <div className="mt-2 ml-4 flex flex-wrap items-center gap-1.5 text-[9px] font-mono">
                {act.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 bg-[#050811] rounded border border-[#8B9CB5]/20 text-[#00D4AA]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        {/* Scientific Analog Filters Collapsible */}
        <div className="pt-3 border-t border-[#8B9CB5]/15 space-y-2">
          <button
            type="button"
            onClick={() => setFilterExpanded(!filterExpanded)}
            className="w-full flex items-center justify-between text-left text-xs font-headline font-semibold text-white tracking-wide uppercase hover:text-[#00D4AA] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 text-[#00D4AA]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Scientific Analog Filters
            </span>
            <span className="text-[10px] font-mono text-[#00D4AA]">
              {filterExpanded ? 'COLLAPSE' : 'EXPAND'}
            </span>
          </button>

          {filterExpanded && (
            <div className="space-y-2.5 text-[11px] pt-1">
              <div>
                <span className="text-[#8B9CB5] text-[10px] uppercase font-mono block mb-1">
                  Geology Type
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 text-[10px]">
                    Basaltic
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#112240] text-[#8B9CB5] border border-[#8B9CB5]/15 text-[10px]">
                    Anorthositic
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#112240] text-[#8B9CB5] border border-[#8B9CB5]/15 text-[10px]">
                    Siliciclastic
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#8B9CB5] text-[10px] uppercase font-mono block mb-1">
                  Geomorphology
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 text-[10px]">
                    Crater Field
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#112240] text-[#8B9CB5] border border-[#8B9CB5]/15 text-[10px]">
                    Dunes
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 text-[10px]">
                    Volcanic Field
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#112240] text-[#8B9CB5] border border-[#8B9CB5]/15 text-[10px]">
                    Periglacial
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#8B9CB5] text-[10px] uppercase font-mono block mb-1">
                  Data Availability
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 text-[10px]">
                    DEM ≤1.0m (USGS 3DEP)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] border border-[#00D4AA]/30 text-[10px]">
                    Copernicus GLO-30
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#112240] text-[#8B9CB5] border border-[#8B9CB5]/15 text-[10px]">
                    Core Samples
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Footer Link to Portfolio */}
      <div className="p-3 border-t border-[#8B9CB5]/15 bg-[#050811]/70 shrink-0">
        <Link
          href="/portfolio"
          className="w-full px-3 py-2 rounded-lg border border-[#8B9CB5]/30 bg-[#112240]/60 hover:bg-[#112240] text-white hover:text-[#00D4AA] transition-all flex items-center justify-between text-xs font-headline group"
        >
          <div className="flex items-center gap-2 text-left">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] group-hover:scale-125 transition-transform"></span>
            <div>
              <div className="font-semibold text-white">Multi-Site Portfolio Optimizer</div>
              <div className="text-[10px] text-[#8B9CB5] font-normal">
                Combinatorial set-cover across 30 requirements (k=2, k=3)
              </div>
            </div>
          </div>
          <span className="text-[#00D4AA] font-mono text-sm">→</span>
        </Link>
      </div>
    </aside>
  );
}
