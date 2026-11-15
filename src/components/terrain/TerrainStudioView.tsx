/**
 * TERRALIGN — 3D Terrain Studio Dual Viewport View Composite
 * Cinematic Design Overhaul · GOV-AUTH-003
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE → SIMPLIFY → IMPLEMENT)
 * Canonical Reference: docs/design/screen-02-terrain-comparison.md
 */

'use client';

import React from 'react';
import { TerrainCanvas } from './TerrainCanvas';
import { TerrainControls } from './TerrainControls';
import { useSelectedSiteId } from '@/store/useMissionStore';
import { getAnalogById } from '@/lib/analogs';

export function TerrainStudioView() {
  const selectedSiteId = useSelectedSiteId();
  const site = getAnalogById(selectedSiteId) || getAnalogById('cinder-lake');

  const siteName = site?.name ?? 'Cinder Lake Crater Field 1, AZ';
  const siteCoords = site
    ? `${Math.abs(site.coordinates.lat).toFixed(4)}°${site.coordinates.lat >= 0 ? 'N' : 'S'}, ${Math.abs(site.coordinates.lng).toFixed(4)}°${site.coordinates.lng >= 0 ? 'E' : 'W'} · Elev ${site.elevationMeters}m`
    : '35.3071°N, 111.5049°W · Elev 2050m';

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-3rem)] overflow-hidden select-none bg-transparent">

      {/* ── Cinematic Studio Header ── */}
      <div className="px-5 py-3 bg-space-bg/95 backdrop-blur-md border-b border-space-border flex items-center justify-between shrink-0">
        {/* Left — mode label */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-terrestrial flex-shrink-0" />
            <span className="text-accent-terrestrial font-bold tracking-widest uppercase text-[10px]">Screen 02</span>
            <span className="text-space-border hidden sm:inline">//</span>
            <span className="text-text-muted hidden sm:inline">3D Terrain Studio</span>
          </div>
        </div>

        {/* Center — site pair */}
        <div className="hidden md:flex items-center gap-3 text-[11px] font-mono">
          <span className="text-text-muted">TERRESTRIAL:</span>
          <span className="text-text-primary font-semibold">{site?.shortName ?? 'Cinder Lake'}</span>
          <span className="text-space-border px-1">↔</span>
          <span className="text-text-muted">LUNAR:</span>
          <span className="text-accent-lunar font-semibold">Shackleton Rim</span>
        </div>

        {/* Right — sync indicator */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted">
          <span className="hidden sm:inline">LOCK 1:1</span>
          <span className="px-1.5 py-0.5 rounded bg-space-elevated border border-space-border text-accent-terrestrial font-bold">
            SYNC
          </span>
        </div>
      </div>

      {/* ── Main Content: Dual Viewports + Controls ── */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden relative">

        {/* Dual canvas grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2 min-h-[600px] lg:min-h-0 lg:h-full">
          <TerrainCanvas
            mode="terrestrial"
            siteName={siteName}
            locationDetails={siteCoords}
            referenceDataset="USGS 3DEP LiDAR (1.0m Published Standard)"
            modelDescription="Procedural morphometric terrain — parameterized from USGS 3DEP profiles"
          />
          <TerrainCanvas
            mode="lunar"
            siteName="Shackleton Crater Rim — South Pole"
            locationDetails="89.9000°S, 0.0000°E · Peak of Eternal Light"
            referenceDataset="NASA LOLA LDEM_875S (5.0m Published Standard)"
            modelDescription="Procedural lunar terrain visualization — parameterized from NASA LOLA profiles"
          />
        </div>

        {/* Controls sidebar */}
        <TerrainControls />
      </div>

    </div>
  );
}
