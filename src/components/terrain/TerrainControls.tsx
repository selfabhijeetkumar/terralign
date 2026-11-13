/**
 * TERRALIGN — 3D Terrain Studio Control Sidebar
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-02-terrain-comparison.md
 */

'use client';

import React from 'react';
import {
  useMissionStore,
  useSunLighting,
  useTerrainSync,
} from '@/store/useMissionStore';
import type { ColorMode } from '@/types/store';

export function TerrainControls() {
  const { elevation, azimuth } = useSunLighting();
  const { syncCameras, syncRotation, linkZoom } = useTerrainSync();
  const colorMode = useMissionStore((s) => s.terrain.colorMode);
  const showHillshade = useMissionStore((s) => s.terrain.showHillshade);
  const showContours = useMissionStore((s) => s.terrain.showContours);

  const setSunLighting = useMissionStore((s) => s.setSunLighting);
  const setSunElevation = useMissionStore((s) => s.setSunElevation);
  const setSunAzimuth = useMissionStore((s) => s.setSunAzimuth);
  const setTerrainSync = useMissionStore((s) => s.setTerrainSync);
  const setColorMode = useMissionStore((s) => s.setColorMode);
  const toggleHillshade = useMissionStore((s) => s.toggleHillshade);
  const toggleContours = useMissionStore((s) => s.toggleContours);

  return (
    <aside className="w-full lg:w-80 xl:w-96 h-full flex flex-col bg-[#0A192F]/95 border-l border-[#8B9CB5]/20 backdrop-blur-md p-4 select-none shrink-0 z-20 overflow-y-auto custom-scrollbar space-y-5">
      {/* Sidebar Header */}
      <div className="pb-3 border-b border-[#8B9CB5]/15 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]" />
          <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider">
            Terrain Controls
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#00D4AA]">3D STUDIO</span>
      </div>

      {/* 1. Camera & Viewport Synchronization */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-label uppercase tracking-wider text-[#8B9CB5]">
          Dual Viewport Sync
        </div>
        <div className="space-y-2 bg-[#050811]/60 p-3 rounded-lg border border-[#8B9CB5]/15 text-xs">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-white font-medium">Synchronize Orbit Cameras</span>
            <input
              type="checkbox"
              checked={syncCameras}
              onChange={(e) => setTerrainSync({ syncCameras: e.target.checked })}
              className="rounded border-[#8B9CB5]/30 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-white font-medium">Link 1:1 Scale Zoom</span>
            <input
              type="checkbox"
              checked={linkZoom}
              onChange={(e) => setTerrainSync({ linkZoom: e.target.checked })}
              className="rounded border-[#8B9CB5]/30 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240]"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-white font-medium">Sync Azimuth Orientation</span>
            <input
              type="checkbox"
              checked={syncRotation}
              onChange={(e) => setTerrainSync({ syncRotation: e.target.checked })}
              className="rounded border-[#8B9CB5]/30 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240]"
            />
          </label>
        </div>
      </div>

      {/* 2. Extreme Low-Angle Solar Illumination Slider (0.0° - 5.0°) */}
      <div className="space-y-3 bg-[#050811]/80 p-3.5 rounded-xl border border-[#00D4AA]/30 shadow-[0_0_12px_rgba(0,212,170,0.1)]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-headline font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            Solar Illumination
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#00D4AA]/20 text-[#00D4AA] font-mono text-[10px] font-bold">
            {elevation.toFixed(1)}° ELEVATION
          </span>
        </div>

        {/* Sun Elevation Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#8B9CB5]">
            <span>Horizon (0.0°)</span>
            <span className="text-white font-semibold">Sun Angle</span>
            <span>Max Grazing (5.0°)</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="5.0"
            step="0.1"
            value={elevation}
            onChange={(e) => setSunElevation(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#112240] rounded-lg appearance-none cursor-pointer accent-[#00D4AA]"
          />
        </div>

        {/* Sun Azimuth Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-[#8B9CB5]">
            <span>Azimuth (0°-360°)</span>
            <span className="text-[#1E90FF] font-semibold">{azimuth.toFixed(0)}° CW</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={azimuth}
            onChange={(e) => setSunAzimuth(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#112240] rounded-lg appearance-none cursor-pointer accent-[#1E90FF]"
          />
        </div>

        {/* Presets */}
        <div className="pt-2 border-t border-[#8B9CB5]/15 grid grid-cols-2 gap-1.5 text-[9px] font-mono">
          <button
            type="button"
            onClick={() => setSunLighting(2.3, 135)}
            className="px-2 py-1 rounded bg-[#112240] hover:bg-[#00D4AA]/20 text-white hover:text-[#00D4AA] transition-colors border border-[#8B9CB5]/15 text-left"
          >
            Artemis III (2.3°)
          </button>
          <button
            type="button"
            onClick={() => setSunLighting(0.5, 45)}
            className="px-2 py-1 rounded bg-[#112240] hover:bg-[#00D4AA]/20 text-white hover:text-[#00D4AA] transition-colors border border-[#8B9CB5]/15 text-left"
          >
            Extreme Rim (0.5°)
          </button>
        </div>
      </div>

      {/* 3. Terrain Shading & Visualization Modes */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-label uppercase tracking-wider text-[#8B9CB5]">
          Visualization Layers
        </div>

        <div className="space-y-2 bg-[#050811]/60 p-3 rounded-lg border border-[#8B9CB5]/15 text-xs">
          <div>
            <span className="text-[10px] font-mono text-[#8B9CB5] block mb-1">Color Palette</span>
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as ColorMode)}
              className="w-full px-2.5 py-1.5 rounded bg-[#112240] border border-[#8B9CB5]/30 text-white text-xs font-mono focus:outline-none focus:border-[#00D4AA]"
            >
              <option value="hypsometric">Hypsometric Elevation</option>
              <option value="slope">Slope Gradient (Degrees)</option>
              <option value="aspect">Aspect (Orientation)</option>
              <option value="raw">Raw Monochrome Grayscale</option>
            </select>
          </div>

          <label className="flex items-center justify-between cursor-pointer pt-1">
            <span className="text-white font-medium">Contour Wireframe Grid</span>
            <input
              type="checkbox"
              checked={showContours}
              onChange={() => toggleContours()}
              className="rounded border-[#8B9CB5]/30 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-white font-medium">PCF Directional Hillshade</span>
            <input
              type="checkbox"
              checked={showHillshade}
              onChange={() => toggleHillshade()}
              className="rounded border-[#8B9CB5]/30 text-[#00D4AA] focus:ring-[#00D4AA] bg-[#112240]"
            />
          </label>
        </div>
      </div>

      {/* 4. Topographic Quantitative Metrics (Scientific / Illustrative) */}
      <div className="space-y-2 bg-[#050811]/60 p-3 rounded-lg border border-[#8B9CB5]/15 text-xs">
        <div className="text-[10px] font-mono text-[#8B9CB5] uppercase flex justify-between">
          <span>Terrain Metrics</span>
          <span className="text-[#00D4AA]">ILLUSTRATIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div>
            <span className="text-[#8B9CB5] text-[10px] block">Mean Slope</span>
            <span className="text-white font-bold">12.4°</span>
          </div>
          <div>
            <span className="text-[#8B9CB5] text-[10px] block">RMS Roughness</span>
            <span className="text-white font-bold">0.34m</span>
          </div>
          <div>
            <span className="text-[#8B9CB5] text-[10px] block">Crater Density</span>
            <span className="text-white font-bold">4.2 / km²</span>
          </div>
          <div>
            <span className="text-[#8B9CB5] text-[10px] block">Disparity</span>
            <span className="text-[#FF6B35] font-bold">5.0× (1m vs 5m)</span>
          </div>
        </div>
      </div>

      {/* 5. Resolution Disparity Advisory Card */}
      <div className="p-3 rounded-lg bg-[#112240]/40 border border-[#FF6B35]/30 text-[10px] font-mono text-[#8B9CB5] space-y-1">
        <div className="text-[#FF6B35] font-bold uppercase flex items-center gap-1">
          <span>⚠ RESOLUTION ADVISORY</span>
        </div>
        <p className="leading-relaxed">
          Earth LiDAR provides 1.0m grid spacing (USGS 3DEP); Lunar polar LOLA provides 5.0m interpolated DEM.
          5× resolution disparity requires bilateral downsampling for direct vertex comparison.
        </p>
      </div>
    </aside>
  );
}
