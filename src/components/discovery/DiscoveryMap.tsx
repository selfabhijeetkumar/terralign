/**
 * TERRALIGN — Precision Cartographic Discovery Map Component
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-01-mission-command.md & stitch prototype
 */

'use client';

import React, { useState } from 'react';
import {
  useMissionStore,
  useSelectedSiteId,
  useTargetBody,
  useActiveActivity,
} from '@/store/useMissionStore';
import { getAllAnalogs } from '@/lib/analogs';
import type { AnalogSite } from '@/types/analogs';

export function DiscoveryMap() {
  const selectedSiteId = useSelectedSiteId();
  const selectSite = useMissionStore((s) => s.selectSite);
  const targetBody = useTargetBody();
  const activeActivity = useActiveActivity();

  const [hoveredSite, setHoveredSite] = useState<AnalogSite | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const sites = getAllAnalogs();

  // Equirectangular projection mapping to SVG 1000x520 viewport
  const projectCoords = (lat: number, lng: number): [number, number] => {
    const x = ((lng + 180) / 360) * 1000;
    const y = ((90 - lat) / 180) * 520;
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  };

  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];

  return (
    <div className="relative flex-1 w-full h-full bg-[#050811] overflow-hidden select-none">
      {/* Background Graticule Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 156, 181, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 156, 181, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Aerospace Telemetry Top HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-[#0A192F]/90 border border-[#8B9CB5]/20 backdrop-blur-md shadow-lg text-[11px] font-mono text-[#8B9CB5]">
          <span className="text-[#00D4AA] font-bold">TARGET LOCK:</span>{' '}
          <span className="text-white font-semibold">{selectedSite.shortName}</span>
          <span className="mx-2 text-[#8B9CB5]/40">|</span>
          <span>
            {Math.abs(selectedSite.coordinates.lat).toFixed(4)}°
            {selectedSite.coordinates.lat >= 0 ? 'N' : 'S'},{' '}
            {Math.abs(selectedSite.coordinates.lng).toFixed(4)}°
            {selectedSite.coordinates.lng >= 0 ? 'E' : 'W'}
          </span>
          <span className="mx-2 text-[#8B9CB5]/40">|</span>
          <span className="text-[#00D4AA]">ELEV: {selectedSite.elevationMeters}m</span>
        </div>
      </div>

      {/* Mode Indicator & Active Filter Tag */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-[#112240]/80 border border-[#8B9CB5]/20 text-[10px] font-mono text-[#00D4AA] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse"></span>
          <span>7 FLAGSHIP SITES ACTIVE</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg bg-[#0A192F]/90 border border-[#8B9CB5]/20 overflow-hidden font-mono text-xs">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
            className="px-2.5 py-1 text-[#8B9CB5] hover:text-white hover:bg-[#112240] transition-colors"
            title="Zoom In"
          >
            +
          </button>
          <span className="px-2 py-1 text-[10px] text-[#8B9CB5] border-x border-[#8B9CB5]/20">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(1.0, z - 0.25))}
            className="px-2.5 py-1 text-[#8B9CB5] hover:text-white hover:bg-[#112240] transition-colors"
            title="Zoom Out"
          >
            -
          </button>
        </div>
      </div>

      {/* Interactive Cartographic Map SVG Layer */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 1000 520"
          className="w-full h-full max-h-[700px] object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="mapVignette" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#112240" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#050811" stopOpacity="0.9" />
            </radialGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Radial Glow */}
          <rect width="1000" height="520" fill="url(#mapVignette)" />

          {/* Latitude Graticules */}
          <line x1="0" y1="65" x2="1000" y2="65" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 6" /> {/* Arctic Circle ~66.5°N */}
          <line x1="0" y1="195" x2="1000" y2="195" stroke="#8B9CB5" strokeOpacity="0.15" strokeDasharray="3 5" /> {/* Tropic of Cancer ~23.5°N */}
          <line x1="0" y1="260" x2="1000" y2="260" stroke="#8B9CB5" strokeOpacity="0.25" /> {/* Equator 0° */}
          <line x1="0" y1="325" x2="1000" y2="325" stroke="#8B9CB5" strokeOpacity="0.15" strokeDasharray="3 5" /> {/* Tropic of Capricorn ~23.5°S */}
          <line x1="0" y1="455" x2="1000" y2="455" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 6" /> {/* Antarctic Circle ~66.5°S */}

          {/* Longitude Graticules */}
          <line x1="250" y1="0" x2="250" y2="520" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 6" /> {/* 90°W */}
          <line x1="500" y1="0" x2="500" y2="520" stroke="#8B9CB5" strokeOpacity="0.2" /> {/* Prime Meridian 0° */}
          <line x1="750" y1="0" x2="750" y2="520" stroke="#8B9CB5" strokeOpacity="0.1" strokeDasharray="4 6" /> {/* 90°E */}

          {/* Stylized World Continent Outlines (Cartographic Vector Polygons) */}
          <g fill="#0A192F" stroke="#8B9CB5" strokeOpacity="0.3" strokeWidth="1">
            {/* North America */}
            <path d="M 120 70 L 220 50 L 310 90 L 290 140 L 230 180 L 200 240 L 170 210 L 120 150 Z" />
            {/* South America */}
            <path d="M 270 260 L 350 280 L 330 400 L 290 460 L 260 380 L 250 300 Z" />
            {/* Europe */}
            <path d="M 460 70 L 580 80 L 560 160 L 480 180 L 450 140 L 460 100 Z" />
            {/* Africa */}
            <path d="M 460 190 L 580 190 L 610 320 L 540 430 L 480 340 L 450 250 Z" />
            {/* Asia */}
            <path d="M 580 70 L 880 80 L 850 240 L 760 280 L 680 240 L 590 180 Z" />
            {/* Australia */}
            <path d="M 760 340 L 870 340 L 860 430 L 770 420 Z" />
            {/* Antarctica */}
            <path d="M 100 480 L 900 480 L 880 515 L 120 515 Z" />
          </g>

          {/* 7 Flagship Analog Site Pins & Scan Reticles */}
          {sites.map((site) => {
            const [cx, cy] = projectCoords(site.coordinates.lat, site.coordinates.lng);
            const isSelected = site.id === selectedSiteId;
            const isHovered = hoveredSite?.id === site.id;
            const score = site.suitabilityScores[activeActivity] ?? 0.5;
            const matchPercent = Math.round(score * 100);

            return (
              <g
                key={site.id}
                className="cursor-pointer transition-all"
                onClick={() => selectSite(site.id)}
                onMouseEnter={() => setHoveredSite(site)}
                onMouseLeave={() => setHoveredSite(null)}
              >
                {/* Outer Pulsing Reticle for Selected Site */}
                {isSelected && (
                  <>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="22"
                      fill="none"
                      stroke="#00D4AA"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                      className="animate-spin"
                      style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '8s' }}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="16"
                      fill="#00D4AA"
                      fillOpacity="0.15"
                      stroke="#00D4AA"
                      strokeWidth="1.5"
                    />
                    {/* Crosshair Lines */}
                    <line x1={cx - 28} y1={cy} x2={cx - 10} y2={cy} stroke="#00D4AA" strokeWidth="1" />
                    <line x1={cx + 10} y1={cy} x2={cx + 28} y2={cy} stroke="#00D4AA" strokeWidth="1" />
                    <line x1={cx} y1={cy - 28} x2={cx} y2={cy - 10} stroke="#00D4AA" strokeWidth="1" />
                    <line x1={cx} y1={cy + 10} x2={cx} y2={cy + 28} stroke="#00D4AA" strokeWidth="1" />
                  </>
                )}

                {/* Core Pin Center */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : isHovered ? 5 : 4}
                  fill={isSelected ? '#00D4AA' : '#1E90FF'}
                  stroke="#FFFFFF"
                  strokeWidth={isSelected ? 2 : 1}
                  filter="url(#glowEffect)"
                />

                {/* Site Label Readout */}
                <text
                  x={cx + (cx > 700 ? -12 : 12)}
                  y={cy - 10}
                  textAnchor={cx > 700 ? 'end' : 'start'}
                  className="font-headline font-bold text-[11px] fill-white pointer-events-none drop-shadow-md select-none"
                >
                  {site.shortName}
                </text>

                {/* Match Metric Badge */}
                <text
                  x={cx + (cx > 700 ? -12 : 12)}
                  y={cy + 4}
                  textAnchor={cx > 700 ? 'end' : 'start'}
                  className="font-mono text-[9px] fill-[#00D4AA] font-semibold pointer-events-none select-none"
                >
                  MATCH: {matchPercent}% · C={site.confidenceScores[activeActivity] ?? 0.85}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Cartographic Coordinates Legend Footer */}
      <div className="absolute bottom-3 left-4 z-10 flex items-center gap-4 text-[10px] font-mono text-[#8B9CB5]/80">
        <div>PROJECTION: EQUIRECTANGULAR WGS84</div>
        <div className="hidden md:block">SCALE 1:50,000,000</div>
        <div className="hidden sm:block">USGS 3DEP / COPERNICUS GLO-30</div>
      </div>
    </div>
  );
}
