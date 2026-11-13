/**
 * TERRALIGN — 3D Terrain Studio Dual Viewport View Composite
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-02-terrain-comparison.md
 */

'use client';

import React from 'react';
import { TerrainCanvas } from './TerrainCanvas';
import { TerrainControls } from './TerrainControls';
import { useMissionStore, useSelectedSiteId } from '@/store/useMissionStore';
import { getAnalogById } from '@/lib/analogs';

export function TerrainStudioView() {
  const selectedSiteId = useSelectedSiteId();
  const site = getAnalogById(selectedSiteId) || getAnalogById('cinder-lake');

  const siteName = site?.name ?? 'Cinder Lake Crater Field 1, AZ';
  const siteCoords = site
    ? `${Math.abs(site.coordinates.lat).toFixed(4)}°${site.coordinates.lat >= 0 ? 'N' : 'S'}, ${Math.abs(site.coordinates.lng).toFixed(4)}°${site.coordinates.lng >= 0 ? 'E' : 'W'} · Elev ${site.elevationMeters}m`
    : '35.3071°N, 111.5049°W · Elev 2050m';

  return (
    <div className="flex-1 flex flex-col w-full h-[calc(100vh-4rem)] overflow-hidden select-none bg-[#050811]">
      {/* Top Studio Synchronized Header Bar */}
      <div className="px-5 py-2.5 bg-[#0A192F]/90 border-b border-[#8B9CB5]/15 flex items-center justify-between text-xs font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#00D4AA] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
            SYNCHRONIZED DUAL 3D VIEWPORT
          </span>
          <span className="hidden sm:inline text-[#8B9CB5]/40">|</span>
          <span className="hidden sm:inline text-[#8B9CB5]">
            LOCK 1:1 SCALE · EXTREME LOW-ANGLE LIGHTING
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#8B9CB5]">
          <span>
            TERRESTRIAL: <span className="text-white font-semibold">{site?.shortName ?? 'Cinder Lake'}</span>
          </span>
          <span className="text-[#8B9CB5]/40">↔</span>
          <span>
            LUNAR: <span className="text-[#1E90FF] font-semibold">Shackleton Rim (89.9°S)</span>
          </span>
        </div>
      </div>

      {/* Main Content Area: Dual 3D Viewports (Left 75-80%) + Controls (Right 20-25%) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden relative">
        {/* Dual Canvas Grid Container */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 h-full overflow-hidden">
          {/* Viewport 1: Terrestrial Analog */}
          <TerrainCanvas
            mode="terrestrial"
            siteName={siteName}
            locationDetails={siteCoords}
            datasetName="USGS 3DEP LiDAR"
            resolutionText="1.0m Grid Spacing"
          />

          {/* Viewport 2: Lunar Reference */}
          <TerrainCanvas
            mode="lunar"
            siteName="Shackleton Crater Rim — South Pole"
            locationDetails="89.9000°S, 0.0000°E · Peak of Eternal Light"
            datasetName="NASA LRO LOLA (LDEM_875S_5M)"
            resolutionText="5.0m Polar Interpolated DEM"
          />
        </div>

        {/* Right Controls Sidebar */}
        <TerrainControls />
      </div>
    </div>
  );
}
