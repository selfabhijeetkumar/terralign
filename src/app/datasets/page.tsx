/**
 * TERRALIGN 2.0 — Personal Dataset Upload & Planetary Intelligence Suite
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * 
 * Provides secure geospatial dataset upload, client-safe parsing,
 * spatial trajectory visualization, elevation transect analysis,
 * and multi-model AI planetary analog synthesis.
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { UserDataset, UserDatasetRecord } from '@/types/dataset';
import { getSampleDataset } from '@/lib/datasets/samples';
import { getApiUrl } from '@/lib/apiConfig';
import type { AIComparisonResult, AIModelResponse, AIProviderId } from '@/types/ai';

export default function DatasetsWorkspacePage() {
  const [dataset, setDataset] = useState<UserDataset | null>(() => getSampleDataset('cinderLake'));
  const [hoveredRecord, setHoveredRecord] = useState<UserDatasetRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync active dataset to window for AI Research Assistant
  useEffect(() => {
    if (typeof window !== 'undefined' && dataset) {
      (window as any).__TERRALIGN_DATASET__ = dataset;
      window.dispatchEvent(new CustomEvent('terralign:dataset-changed', { detail: dataset }));
    }
  }, [dataset]);

  // AI Synthesis State
  const [aiMode, setAiMode] = useState<AIProviderId>('dual');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [singleAiResult, setSingleAiResult] = useState<AIModelResponse | null>(null);
  const [dualAiResult, setDualAiResult] = useState<AIComparisonResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setSingleAiResult(null);
    setDualAiResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(getApiUrl('/api/datasets/upload'), {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setDataset(data.dataset);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing uploaded file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const loadSample = (sampleKey: 'apollo15' | 'cinderLake' | 'perseverance') => {
    setUploadError(null);
    setSingleAiResult(null);
    setDualAiResult(null);
    setDataset(getSampleDataset(sampleKey));
  };

  const runAISynthesis = async () => {
    if (!dataset || isSynthesizing) return;

    setIsSynthesizing(true);
    setSingleAiResult(null);
    setDualAiResult(null);

    const promptText = `Analyze user-uploaded planetary traverse dataset "${dataset.filename}".
- Detected records: ${dataset.records.length}
- Spatial bounding box: Lat [${dataset.bounds.minLat} to ${dataset.bounds.maxLat}], Lng [${dataset.bounds.minLng} to ${dataset.bounds.maxLng}]
- Topographic elevation span: ${dataset.elevation.spanMeters}m (Min: ${dataset.elevation.minMeters}m, Max: ${dataset.elevation.maxMeters}m)
- Inferred Planetary Body: ${dataset.planetaryBody.toUpperCase()}
Evaluate this trajectory using Bekker-Wong terramechanics equations. Recommend the best matching Earth analog site from the TERRALIGN catalog, compute wheel slip risk on slopes, and identify unaddressed environmental reality gaps.`;

    try {
      const res = await fetch(getApiUrl('/api/ai/query'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          mode: aiMode,
          context: {
            body: dataset.planetaryBody === 'unspecified' ? 'earth' : dataset.planetaryBody,
            locationName: dataset.filename,
            coordinates: { lat: dataset.bounds.centerLat, lng: dataset.bounds.centerLng },
            elevationMeters: dataset.elevation.meanMeters,
            datasetContext: {
              filename: dataset.filename,
              rowCount: dataset.records.length,
              elevationRange: { min: dataset.elevation.minMeters, max: dataset.elevation.maxMeters },
              spatialBounds: dataset.bounds,
              completenessScore: dataset.quality.completenessScore,
            },
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (aiMode === 'dual') {
          setDualAiResult(json.data as AIComparisonResult);
        } else {
          setSingleAiResult(json.data as AIModelResponse);
        }
      }
    } catch {
      // Handled gracefully
    } finally {
      setIsSynthesizing(false);
    }
  };

  const exportDossierJSON = () => {
    if (!dataset) return;
    const exportData = {
      datasetMetadata: {
        id: dataset.id,
        filename: dataset.filename,
        fileSizeBytes: dataset.fileSizeBytes,
        uploadedAt: dataset.uploadedAt,
        bounds: dataset.bounds,
        elevation: dataset.elevation,
        quality: dataset.quality,
        epistemicClassification: dataset.epistemicClassification,
      },
      records: dataset.records,
      aiSynthesis: dualAiResult || singleAiResult || null,
      platformProvenance: 'TERRALIGN 2.0 Planetary Exploration Platform',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TERRALIGN_DATASET_${dataset.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-transparent text-white overflow-y-auto">
      {/* ── Top Ambient Glowing Banner ─────────────────────────────── */}
      <div className="relative border-b border-white/10 bg-gradient-to-b from-[#0A192F]/60 via-[#050811]/90 to-[#050811] px-4 sm:px-8 py-7 select-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00D4AA]/60 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D4AA] animate-pulse shadow-[0_0_10px_#00D4AA]" />
              <span className="text-[11px] font-mono tracking-widest text-[#00D4AA] uppercase font-bold">
                TERRALIGN 2.0 · USER INTELLIGENCE WORKSPACE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-headline font-bold uppercase tracking-wider text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Personal Dataset Upload & AI Synthesis
            </h1>
            <p className="text-xs sm:text-sm text-[#8B9CB5] font-sans max-w-2xl leading-relaxed">
              Upload custom CSV or GeoJSON field telemetry. Inspect spatial trajectories,
              topographic elevation profiles, and stress-test data through Google Gemini and GroqCloud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-[10px] font-mono tracking-wider text-amber-300">
              CLASSIFICATION: USER PROVIDED DATA
            </div>
            <button
              onClick={exportDossierJSON}
              disabled={!dataset}
              className="px-3.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono font-semibold transition-all hover:border-[#00D4AA]/40 disabled:opacity-40 flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Export Dossier (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-8 flex-1">
        {/* ── Section 1: Upload Dropzone & Sample Buttons ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Dropzone */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 space-y-4 luminous-surface-prominent shine-card">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-headline font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                Dataset Upload Pipeline
              </h2>
              <span className="text-[10px] font-mono text-[#8B9CB5]">
                Max 5 MB · CSV · TSV · JSON · GeoJSON · XLSX · GeoTIFF
              </span>
            </div>

            <label className="border-2 border-dashed border-white/20 hover:border-[#00D4AA]/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-black/20 hover:bg-[#00D4AA]/5 group">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.tsv,.json,.geojson,.xlsx,.tif,.tiff,text/csv,application/json,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,image/tiff"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00D4AA] group-hover:scale-110 transition-transform shadow-inner">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 3V14M10 3L6 7M10 3L14 7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 13V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V13" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mt-3 text-sm font-medium text-white group-hover:text-[#00D4AA] transition-colors">
                {isUploading ? 'Validating and Parsing Dataset...' : 'Click to Upload or Drag and Drop Geospatial Telemetry'}
              </div>
              <p className="text-[11px] font-mono text-[#8B9CB5] mt-1">
                Supported formats: CSV, TSV, JSON, GeoJSON, Excel (.xlsx), and GeoTIFF (.tif, .tiff)
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                {['CSV', 'TSV', 'JSON', 'GeoJSON', 'XLSX', 'GeoTIFF'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-[#8B9CB5] group-hover:border-[#00D4AA]/30 group-hover:text-white transition-colors"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </label>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <span>⚠</span>
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Preset Sample Datasets */}
          <div className="p-6 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/5 flex flex-col justify-between space-y-4 luminous-surface-prominent shine-card">
            <div>
              <h2 className="text-sm font-headline font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                Curated Authentic Samples
              </h2>
              <p className="text-[11px] text-[#8B9CB5] font-sans mt-1">
                Instant test datasets calibrated from real NASA & USGS field trials.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => loadSample('cinderLake')}
                className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#00D4AA]/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-headline font-bold text-white group-hover:text-[#00D4AA] transition-colors">
                    USGS Cinder Lake Field 1
                  </div>
                  <div className="text-[10px] font-mono text-[#8B9CB5]">
                    Apollo penetrometer & traction log (1967)
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  EARTH
                </span>
              </button>

              <button
                onClick={() => loadSample('apollo15')}
                className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#38BDF8]/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-headline font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                    Apollo 15 LRV Traverse
                  </div>
                  <div className="text-[10px] font-mono text-[#8B9CB5]">
                    Hadley-Apennine rover telemetry (1971)
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  MOON
                </span>
              </button>

              <button
                onClick={() => loadSample('perseverance')}
                className="w-full text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-amber-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-headline font-bold text-white group-hover:text-amber-400 transition-colors">
                    Perseverance Rover Jezero
                  </div>
                  <div className="text-[10px] font-mono text-[#8B9CB5]">
                    Delta front waypoint elevation log (2023)
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  MARS
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Section 2: Active Dataset Telemetry HUD ──────────────── */}
        {dataset && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Record Completeness */}
              <div className="p-5 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-lg ring-1 ring-white/5 shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase">Valid Records</div>
                <div className="text-3xl font-headline font-bold text-white mt-1.5 flex items-baseline gap-2">
                  {dataset.records.length}
                  <span className="text-xs text-[#8B9CB5] font-mono font-normal">
                    / {dataset.quality.totalRows} rows
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#00D4AA] mt-2 flex items-center justify-between">
                  <span>Quality Score:</span>
                  <span className="font-bold">{dataset.quality.completenessScore}%</span>
                </div>
              </div>

              {/* Card 2: Spatial Bounds */}
              <div className="p-5 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-lg ring-1 ring-white/5 shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase">Spatial Extent</div>
                <div className="text-sm font-mono font-bold text-white mt-2 space-y-0.5">
                  <div>LAT: {dataset.bounds.minLat.toFixed(4)}° to {dataset.bounds.maxLat.toFixed(4)}°</div>
                  <div>LNG: {dataset.bounds.minLng.toFixed(4)}° to {dataset.bounds.maxLng.toFixed(4)}°</div>
                </div>
                <div className="text-[11px] font-mono text-[#38BDF8] mt-2">
                  Body: <span className="font-bold uppercase">{dataset.planetaryBody}</span>
                </div>
              </div>

              {/* Card 3: Topographic Elevation */}
              <div className="p-5 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-lg ring-1 ring-white/5 shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase">Elevation Range</div>
                <div className="text-3xl font-headline font-bold text-white mt-1.5 flex items-baseline gap-1">
                  {dataset.elevation.spanMeters.toFixed(1)}
                  <span className="text-xs text-[#00D4AA] font-mono">m span</span>
                </div>
                <div className="text-[11px] font-mono text-[#8B9CB5] mt-2">
                  Min: {dataset.elevation.minMeters}m · Max: {dataset.elevation.maxMeters}m
                </div>
              </div>

              {/* Card 4: Sensor Channels */}
              <div className="p-5 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-lg ring-1 ring-white/5 shine-card">
                <div className="text-[11px] font-mono text-[#8B9CB5] uppercase">Detected Channels</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
                    Lat / Lng
                  </span>
                  {dataset.columns.elevationCol && (
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-mono">
                      Elevation
                    </span>
                  )}
                  {dataset.columns.slipCol && (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono">
                      Slip Ratio
                    </span>
                  )}
                  {dataset.columns.penetrometerCol && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono">
                      Penetrometer
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-mono text-[#8B9CB5] mt-2 truncate" title={dataset.filename}>
                  {dataset.filename}
                </div>
              </div>
            </div>

            {/* GeoTIFF Raster Specifications Card if GeoTIFF */}
            {dataset.rasterMetadata && (
              <div className="p-4 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-sky-500/30 text-xs font-mono flex flex-wrap items-center justify-between gap-3 shadow-lg shine-card">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
                  <span className="text-white font-bold">GeoTIFF Raster Specifications:</span>
                  <span className="text-[#38BDF8]">{dataset.rasterMetadata.width} × {dataset.rasterMetadata.height} px</span>
                </div>
                <div className="flex items-center gap-4 text-[#8B9CB5]">
                  <span>CRS: <strong className="text-white">{dataset.rasterMetadata.crs}</strong></span>
                  <span>NoData: <strong className="text-white">{dataset.rasterMetadata.noDataValue ?? 'None'}</strong></span>
                  <span>Units: <strong className="text-white">{dataset.rasterMetadata.elevationUnits}</strong></span>
                </div>
              </div>
            )}

            {/* XLSX Multi-Sheet Selector if multiple sheets */}
            {dataset.availableSheets && dataset.availableSheets.length > 1 && (
              <div className="p-3.5 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 text-xs font-mono flex items-center justify-between">
                <span className="text-[#8B9CB5]">Workbook Sheets ({dataset.availableSheets.length}):</span>
                <div className="flex items-center gap-1.5">
                  {dataset.availableSheets.map((s) => (
                    <span
                      key={s}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        dataset.activeSheet === s
                          ? 'bg-[#00D4AA] text-[#050811]'
                          : 'bg-white/5 text-[#8B9CB5]'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Section 3: Interactive Visualizations ─────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 2D Trajectory Map (SVG) */}
              <div className="p-6 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4 shine-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-headline font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                    2D Spatial Trajectory & Waypoint Scatter
                  </h3>
                  {hoveredRecord && (
                    <span className="text-[10px] font-mono text-[#00D4AA]">
                      {hoveredRecord.id}: Lat {hoveredRecord.lat.toFixed(4)}°, Lng {hoveredRecord.lng.toFixed(4)}°
                    </span>
                  )}
                </div>

                <div className="relative aspect-[16/10] bg-black/40 rounded-xl border border-white/10 p-4 overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 300">
                    <defs>
                      <linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00D4AA" />
                        <stop offset="100%" stopColor="#38BDF8" />
                      </linearGradient>
                    </defs>

                    {/* Grid Background */}
                    <line x1="50" y1="50" x2="450" y2="50" stroke="#8B9CB5" strokeOpacity="0.1" />
                    <line x1="50" y1="150" x2="450" y2="150" stroke="#8B9CB5" strokeOpacity="0.1" />
                    <line x1="50" y1="250" x2="450" y2="250" stroke="#8B9CB5" strokeOpacity="0.1" />
                    <line x1="150" y1="30" x2="150" y2="270" stroke="#8B9CB5" strokeOpacity="0.1" />
                    <line x1="250" y1="30" x2="250" y2="270" stroke="#8B9CB5" strokeOpacity="0.1" />
                    <line x1="350" y1="30" x2="350" y2="270" stroke="#8B9CB5" strokeOpacity="0.1" />

                    {/* Connect Waypoints Line */}
                    {dataset.records.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="url(#trajGrad)"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        points={dataset.records
                          .map((r) => {
                            const latNorm =
                              dataset.bounds.maxLat === dataset.bounds.minLat
                                ? 0.5
                                : (r.lat - dataset.bounds.minLat) / (dataset.bounds.maxLat - dataset.bounds.minLat);
                            const lngNorm =
                              dataset.bounds.maxLng === dataset.bounds.minLng
                                ? 0.5
                                : (r.lng - dataset.bounds.minLng) / (dataset.bounds.maxLng - dataset.bounds.minLng);
                            const x = 50 + lngNorm * 400;
                            const y = 260 - latNorm * 220;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {/* Waypoint Circles */}
                    {dataset.records.map((r, idx) => {
                      const latNorm =
                        dataset.bounds.maxLat === dataset.bounds.minLat
                          ? 0.5
                          : (r.lat - dataset.bounds.minLat) / (dataset.bounds.maxLat - dataset.bounds.minLat);
                      const lngNorm =
                        dataset.bounds.maxLng === dataset.bounds.minLng
                          ? 0.5
                          : (r.lng - dataset.bounds.minLng) / (dataset.bounds.maxLng - dataset.bounds.minLng);
                      const cx = 50 + lngNorm * 400;
                      const cy = 260 - latNorm * 220;
                      const isHovered = hoveredRecord?.id === r.id;

                      return (
                        <g
                          key={r.id}
                          className="cursor-pointer transition-transform"
                          onMouseEnter={() => setHoveredRecord(r)}
                          onMouseLeave={() => setHoveredRecord(null)}
                        >
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 8 : 5}
                            fill={idx === 0 ? '#00D4AA' : idx === dataset.records.length - 1 ? '#EF4444' : '#38BDF8'}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={cx}
                            y={cy - 10}
                            fill="#8B9CB5"
                            fontSize="8"
                            fontFamily="monospace"
                            textAnchor="middle"
                          >
                            WP{idx + 1}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Elevation Transect Profile (SVG) */}
              <div className="p-6 rounded-2xl bg-[#0A192F]/80 backdrop-blur-xl border border-white/10 shadow-xl space-y-4 shine-card">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-headline font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                    Topographic Elevation Transect Profile
                  </h3>
                  <span className="text-[10px] font-mono text-[#8B9CB5]">
                    Span: {dataset.elevation.spanMeters}m
                  </span>
                </div>

                <div className="relative aspect-[16/10] bg-black/40 rounded-xl border border-white/10 p-4 overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 300">
                    <defs>
                      <linearGradient id="elevArea" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area Polygon */}
                    {dataset.records.length > 1 && (
                      <polygon
                        fill="url(#elevArea)"
                        points={
                          `50,260 ` +
                          dataset.records
                            .map((r, i) => {
                              const x = 50 + (i / (dataset.records.length - 1)) * 400;
                              const elev = r.elevation ?? dataset.elevation.meanMeters;
                              const elevNorm =
                                dataset.elevation.spanMeters > 0
                                  ? (elev - dataset.elevation.minMeters) / dataset.elevation.spanMeters
                                  : 0.5;
                              const y = 240 - elevNorm * 180;
                              return `${x},${y}`;
                            })
                            .join(' ') +
                          ` 450,260`
                        }
                      />
                    )}

                    {/* Polyline */}
                    {dataset.records.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#38BDF8"
                        strokeWidth="2.5"
                        points={dataset.records
                          .map((r, i) => {
                            const x = 50 + (i / (dataset.records.length - 1)) * 400;
                            const elev = r.elevation ?? dataset.elevation.meanMeters;
                            const elevNorm =
                              dataset.elevation.spanMeters > 0
                                ? (elev - dataset.elevation.minMeters) / dataset.elevation.spanMeters
                                : 0.5;
                            const y = 240 - elevNorm * 180;
                            return `${x},${y}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {/* Data Points on Profile */}
                    {dataset.records.map((r, i) => {
                      const x = 50 + (i / (dataset.records.length - 1)) * 400;
                      const elev = r.elevation ?? dataset.elevation.meanMeters;
                      const elevNorm =
                        dataset.elevation.spanMeters > 0
                          ? (elev - dataset.elevation.minMeters) / dataset.elevation.spanMeters
                          : 0.5;
                      const y = 240 - elevNorm * 180;
                      return (
                        <circle
                          key={r.id}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#00D4AA"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>

            {/* ── Section 4: AI Planetary Analog Intelligence Panel ──── */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0A192F] to-[#050811] border border-[#00D4AA]/30 shadow-2xl space-y-6 ring-1 ring-[#00D4AA]/20 shine-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00D4AA] animate-pulse" />
                    <h3 className="text-base font-headline font-bold uppercase tracking-wider text-white">
                      AI Planetary Analog Intelligence & Terramechanics Synthesis
                    </h3>
                  </div>
                  <p className="text-xs text-[#8B9CB5]">
                    Evaluates custom dataset against canonical planetary terrain models and Bekker-Wong mechanics.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Engine Selector */}
                  <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                    <button
                      onClick={() => setAiMode('dual')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        aiMode === 'dual'
                          ? 'bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] text-[#050811]'
                          : 'text-[#8B9CB5]'
                      }`}
                    >
                      Dual Consensus
                    </button>
                    <button
                      onClick={() => setAiMode('gemini')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        aiMode === 'gemini' ? 'bg-[#1E90FF] text-white' : 'text-[#8B9CB5]'
                      }`}
                    >
                      Gemini
                    </button>
                    <button
                      onClick={() => setAiMode('groq')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        aiMode === 'groq' ? 'bg-white text-[#050811]' : 'text-[#8B9CB5]'
                      }`}
                    >
                      Groq
                    </button>
                  </div>

                  {/* Run Synthesis Button */}
                  <button
                    onClick={runAISynthesis}
                    disabled={isSynthesizing}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00D4AA] to-[#00F2C3] hover:brightness-110 disabled:opacity-50 text-[#050811] font-headline font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-[0_0_16px_rgba(0,212,170,0.35)]"
                  >
                    {isSynthesizing ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-[#050811] border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        <span>Run AI Planetary Synthesis</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Synthesis Results Display */}
              {dualAiResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[#00D4AA]/10 via-[#1E90FF]/10 to-transparent border border-[#00D4AA]/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-[#8B9CB5] uppercase">
                        Gemini + Groq Dual Alignment
                      </div>
                      <div className="text-2xl font-headline font-bold text-white flex items-baseline gap-2">
                        {dualAiResult.consensusScore}%
                        <span className="text-xs text-[#00D4AA] font-mono font-normal">
                          Consensus Confidence
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[#8B9CB5]">
                      Processing: {dualAiResult.processingTimeMs}ms
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-xs font-mono text-[#00D4AA] uppercase font-bold">
                        Consensus Terramechanics Findings:
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                        {dualAiResult.consensusPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#00D4AA] mt-1">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                      <div className="text-xs font-mono text-[#38BDF8] uppercase font-bold">
                        Divergence & Stress-Test Nuance:
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
                        {dualAiResult.divergencePoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-[#38BDF8] mt-1">•</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#00D4AA]/5 border border-[#00D4AA]/25 text-xs text-[#E2E8F0] leading-relaxed">
                    {dualAiResult.synthesisRecommendation}
                  </div>
                </div>
              )}

              {singleAiResult && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
                    <span className="text-[#00D4AA] font-bold">{singleAiResult.modelName}</span>
                    <span className="text-[#8B9CB5]">
                      Confidence: {singleAiResult.confidenceScore}% · {singleAiResult.processingTimeMs}ms
                    </span>
                  </div>
                  <div className="prose prose-invert prose-xs text-[#CBD5E1] whitespace-pre-line leading-relaxed">
                    {singleAiResult.content}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#8B9CB5]">
                <span>EPISTEMIC LABEL: [USER PROVIDED DATA — AI SYNTHESIS — NOT PEER-REVIEWED]</span>
                <span>TERRALIGN 2.0 PROTOCOL</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
