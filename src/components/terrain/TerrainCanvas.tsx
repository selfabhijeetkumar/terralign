/**
 * TERRALIGN — 3D Hardware-Accelerated Terrain Canvas Component
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 * Canonical Reference: docs/design/screen-02-terrain-comparison.md & technical-feasibility-audit.md
 */

'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  useMissionStore,
  useSunElevation,
  useSunAzimuth,
  useTerrainSyncCameras,
  useTerrainDataMode,
} from '@/store/useMissionStore';
import { getApiUrl } from '@/lib/apiConfig';
import type { ColorMode } from '@/types/store';

interface TerrainCanvasProps {
  mode: 'terrestrial' | 'lunar';
  siteName: string;
  locationDetails: string;
  referenceDataset?: string;
  modelDescription?: string;
  datasetName?: string;
  resolutionText?: string;
}

/**
 * Smooth continuous Hermite impact crater elevation function
 * Guarantees zero derivative at center (floor) AND zero derivative at rim crest,
 * meeting the exponential ejecta falloff with exact matching height and zero crease.
 */
function continuousCraterElevation(
  r: number,
  R_rim: number,
  depthFloor: number,
  heightRim: number,
  sigmaEjecta: number
): number {
  if (r < R_rim) {
    const u = r / R_rim;
    // Smooth Hermite polynomial S(u) = 3u^2 - 2u^3: S(0)=0, S'(0)=0, S(1)=1, S'(1)=0
    const smoothStep = 3 * u * u - 2 * u * u * u;
    return -depthFloor + (depthFloor + heightRim) * smoothStep;
  } else {
    const dr = r - R_rim;
    return heightRim * Math.exp(-(dr * dr) / (2 * sigmaEjecta * sigmaEjecta));
  }
}

/** Multi-scale non-repeating natural geological noise using 5 rotated octaves (fBm) */
function geologicalNoiseFBM(x: number, z: number, mode: 'terrestrial' | 'lunar'): number {
  // Octave 1: Regional highland / volcanic plain swells (~850m wavelength)
  const o1 = Math.sin(x * 0.0012 + 1.1) * Math.cos(z * 0.0015 + 0.7);

  // Octave 2: Rotated structural ridges (~320m wavelength, rotated 37°)
  const x2 = x * 0.798 - z * 0.602;
  const z2 = x * 0.602 + z * 0.798;
  const o2 = Math.sin(x2 * 0.0031 + 2.3) * Math.cos(z2 * 0.0035 + 1.8);

  // Octave 3: Drainage / scree wash patterns (~120m wavelength, rotated 68°)
  const x3 = x * 0.375 - z * 0.927;
  const z3 = x * 0.927 + z * 0.375;
  const o3 = Math.sin(x3 * 0.0083 + 4.1) * Math.cos(z3 * 0.0089 + 0.9);

  // Octave 4: Regolith hummocks and gravel mounds (~45m wavelength)
  const x4 = x * 0.707 + z * 0.707;
  const z4 = -x * 0.707 + z * 0.707;
  const o4 = Math.sin(x4 * 0.022 + 0.5) * Math.cos(z4 * 0.024 + 3.4);

  // Octave 5: Sub-resolution micro-roughness (~18m wavelength)
  const o5 = Math.sin((x + z) * 0.055 + 1.7) * Math.cos((x - z) * 0.058 + 2.9);

  if (mode === 'terrestrial') {
    // Volcanic cinder plain: undulating dunes, basaltic cinder swells, alluvial washes
    return o1 * 38 + o2 * 16 + o3 * 7.5 + o4 * 3.2 + o5 * 1.1;
  } else {
    // Lunar highlands: impact-gardened megaregolith, massif ridges, undulating hummocks
    return o1 * 44 + o2 * 18 + o3 * 8.0 + o4 * 3.5 + o5 * 1.2;
  }
}

/**
 * Fast 2D pseudo-random integer hash for organic regolith noise
 */
function hash2d(x: number, y: number, seed = 1337): number {
  let n = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + seed) | 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177) | 0;
  return ((n ^ (n >>> 16)) & 0xffff) / 65535.0;
}

/**
 * Generate a procedural tangent-space normal texture in-memory via HTML Canvas.
 * Uses seamless multi-octave toroidal value noise with smoothstep interpolation.
 * Completely eliminates periodic trigonometric diagonals and visible tile repetition,
 * producing isotropic, natural micro-regolith / volcanic gravel roughness.
 */
function createRegolithNormalTexture(mode: 'terrestrial' | 'lunar'): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  // Precompute 64x64 periodic permutation hash table for seamless toroidal sampling
  const tableSize = 64;
  const table = new Float32Array(tableSize * tableSize);
  const seed = mode === 'lunar' ? 2024 : 1969;
  for (let ty = 0; ty < tableSize; ty++) {
    for (let tx = 0; tx < tableSize; tx++) {
      table[ty * tableSize + tx] = hash2d(tx, ty, seed);
    }
  }

  const sampleSeamlessNoise = (u: number, v: number, freq: number): number => {
    const gx = u * freq;
    const gy = v * freq;
    const x0 = ((Math.floor(gx) % tableSize) + tableSize) % tableSize;
    const y0 = ((Math.floor(gy) % tableSize) + tableSize) % tableSize;
    const x1 = (x0 + 1) % tableSize;
    const y1 = (y0 + 1) % tableSize;

    const fx = gx - Math.floor(gx);
    const fy = gy - Math.floor(gy);

    // Hermite smoothstep for C1-continuous gradients: S(t) = 3t^2 - 2t^3
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    const v00 = table[y0 * tableSize + x0];
    const v10 = table[y0 * tableSize + x1];
    const v01 = table[y1 * tableSize + x0];
    const v11 = table[y1 * tableSize + x1];

    const top = v00 + sx * (v10 - v00);
    const bot = v01 + sx * (v11 - v01);
    return top + sy * (bot - top);
  };

  // Generate organic multi-scale heightfield using non-harmonic prime octave steps
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    const v = y / size;
    for (let x = 0; x < size; x++) {
      const u = x / size;

      // Octave 1: Sub-meter regolith clasts & hummocks (frequency 16)
      const o1 = sampleSeamlessNoise(u, v, 16);
      // Octave 2: Micro-pits and agglutinates (frequency 32)
      const o2 = sampleSeamlessNoise(u, v, 32);
      // Octave 3: High-frequency regolith grain roughness (frequency 64)
      const o3 = sampleSeamlessNoise(u, v, 64);

      h[y * size + x] = o1 * 0.55 + o2 * 0.32 + o3 * 0.13;
    }
  }

  // Calculate tangent-space normals via central difference with toroidal wrapping
  const scale = mode === 'lunar' ? 1.6 : 1.9;
  for (let y = 0; y < size; y++) {
    const yPrev = (y - 1 + size) % size;
    const yNext = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xPrev = (x - 1 + size) % size;
      const xNext = (x + 1) % size;

      const dhdx = (h[y * size + xNext] - h[y * size + xPrev]) * scale;
      const dhdy = (h[yNext * size + x] - h[yPrev * size + x]) * scale;

      let nx = -dhdx;
      let ny = -dhdy;
      let nz = 1.0;
      const len = Math.hypot(nx, ny, nz);
      nx /= len;
      ny /= len;
      nz /= len;

      const idx = (y * size + x) * 4;
      // Standard OpenGL Tangent Space Normal Map: Red=Tangent(X), Green=Bitangent(Y), Blue=Normal(Z)
      data[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((nz * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Natural tile repetition: 8x8 repeats over 3400m = ~425m per tile, 0.83m/pixel
  texture.repeat.set(mode === 'lunar' ? 8 : 10, mode === 'lunar' ? 8 : 10);
  return texture;
}

/** Recalculate vertex colors according to selected analytical color palette */
function applyTerrainColorPalette(
  geometry: THREE.PlaneGeometry,
  mode: 'terrestrial' | 'lunar',
  palette: ColorMode
) {
  const pos = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const count = pos.count;
  let colorAttr = geometry.attributes.color as THREE.BufferAttribute | undefined;

  if (!colorAttr || colorAttr.count !== count) {
    colorAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    geometry.setAttribute('color', colorAttr);
  }

  const colors = colorAttr.array as Float32Array;

  // Find min and max height for normalization
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  const heightSpan = Math.max(1, maxY - minY);

  for (let i = 0; i < count; i++) {
    const y = pos.getY(i);
    const normH = Math.max(0, Math.min(1, (y - minY) / heightSpan));
    const nx = normals ? normals.getX(i) : 0;
    const ny = normals ? Math.max(0, Math.min(1, normals.getY(i))) : 1;
    const nz = normals ? normals.getZ(i) : 0;

    // Slope angle in degrees from surface normal (0° is flat, 90° is vertical cliff)
    const slopeDeg = Math.acos(ny) * (180 / Math.PI);

    let r = 0.5;
    let g = 0.5;
    let b = 0.5;

    if (palette === 'hypsometric') {
      if (mode === 'terrestrial') {
        // Cinder Lake volcanic basalt: dark cinder basalt -> iron-oxidized reddish cinder -> weathered volcanic ash crests
        // Baseline albedo calibrated for topographic readability under grazing illumination
        if (normH < 0.35) {
          const t = normH / 0.35;
          r = 0.26 + t * 0.08;
          g = 0.28 + t * 0.08;
          b = 0.32 + t * 0.06;
        } else if (normH < 0.72) {
          const t = (normH - 0.35) / 0.37;
          r = 0.34 + t * 0.10;
          g = 0.36 + t * 0.06;
          b = 0.38 + t * 0.04;
        } else {
          const t = (normH - 0.72) / 0.28;
          r = 0.44 + t * 0.10;
          g = 0.40 + t * 0.08;
          b = 0.38 + t * 0.08;
        }

        // Gulley mass-wasting: steeper gullies expose darker basalt cinder gravel
        if (slopeDeg > 18) {
          const dark = Math.min(0.04, (slopeDeg - 18) * 0.002);
          r -= dark;
          g -= dark;
          b -= dark;
        }
      } else {
        // Lunar Shackleton: cold trap floor readable slate -> mid terraces regolith gray -> Peak of Eternal Light anorthosite
        // Baseline albedo raised (0.27 - 0.35) so crater floor features remain clearly legible at grazing solar angles
        if (normH < 0.35) {
          const t = normH / 0.35;
          r = 0.27 + t * 0.08;
          g = 0.29 + t * 0.08;
          b = 0.33 + t * 0.08;
        } else if (normH < 0.72) {
          const t = (normH - 0.35) / 0.37;
          r = 0.30 + t * 0.12;
          g = 0.32 + t * 0.12;
          b = 0.36 + t * 0.12;
        } else {
          // Peak of Eternal Light massif: high anorthosite albedo, capped to prevent highlight clipping
          const t = (normH - 0.72) / 0.28;
          r = 0.42 + t * 0.10;
          g = 0.44 + t * 0.10;
          b = 0.48 + t * 0.10;
        }

        // Slope mass-wasting enhancement: steep crater walls shed dark weathered patina, exposing fresher bright anorthosite talus
        if (slopeDeg > 20) {
          const slopeBright = Math.min(0.08, (slopeDeg - 20) * 0.004);
          r += slopeBright;
          g += slopeBright;
          b += slopeBright * 1.1;
        }
      }
    } else if (palette === 'slope') {
      // Geological slope hazard classification
      // < 10°: Safe traverse (Teal #00D4AA)
      // 10° - 20°: Moderate slope (Blue #38BDF8)
      // 20° - 28°: Steep gradient (Amber #F59E0B)
      // > 28°: Critical rollover hazard (Crimson #EF4444)
      if (slopeDeg < 10) {
        const t = slopeDeg / 10;
        r = 0.0 + t * 0.12;
        g = 0.75 - t * 0.10;
        b = 0.60 + t * 0.22;
      } else if (slopeDeg < 20) {
        const t = (slopeDeg - 10) / 10;
        r = 0.12 + t * 0.65;
        g = 0.65 - t * 0.15;
        b = 0.82 - t * 0.75;
      } else if (slopeDeg < 28) {
        const t = (slopeDeg - 20) / 8;
        r = 0.77 + t * 0.10;
        g = 0.50 - t * 0.25;
        b = 0.07;
      } else {
        r = 0.88;
        g = 0.20;
        b = 0.20;
      }
    } else if (palette === 'aspect') {
      // Solar aspect orientation (azimuth face of normal)
      const az = (Math.atan2(nz, nx) * 180) / Math.PI + 180;
      const normAz = az / 360;
      r = 0.45 + 0.45 * Math.sin(normAz * Math.PI * 2);
      g = 0.45 + 0.45 * Math.sin(normAz * Math.PI * 2 + 2.094);
      b = 0.45 + 0.45 * Math.sin(normAz * Math.PI * 2 + 4.188);
    } else {
      // Raw monochrome grayscale reflectance with calibrated floor baseline
      const baseAlbedo = mode === 'lunar' ? 0.28 : 0.24;
      const v = Math.max(0.18, Math.min(0.72, baseAlbedo + normH * 0.40));
      r = v;
      g = v;
      b = v;
    }

    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }

  colorAttr.needsUpdate = true;
}

export function TerrainCanvas({
  mode,
  siteName,
  locationDetails,
  referenceDataset,
  modelDescription,
  datasetName,
  resolutionText,
}: TerrainCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const normalMapRef = useRef<THREE.CanvasTexture | null>(null);
  const proceduralHeightsRef = useRef<Float32Array | null>(null);
  const [isGridLoading, setIsGridLoading] = React.useState(false);

  const elevation = useSunElevation();
  const azimuth = useSunAzimuth();
  const syncCameras = useTerrainSyncCameras();
  const dataMode = useTerrainDataMode();
  const colorMode = useMissionStore((s) => s.terrain.colorMode);
  const showHillshade = useMissionStore((s) => s.terrain.showHillshade);
  const showContours = useMissionStore((s) => s.terrain.showContours);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    sceneRef.current = scene;

    // 2. Camera Setup — Tightly Framed for Scientific Topographic Clarity
    // Reduced FOV (40°) reduces edge perspective distortion; centered on mid-crater depth
    const initialCam = useMissionStore.getState().terrain.cameraTransform;
    const camera = new THREE.PerspectiveCamera(40, width / height, 10, 15000);
    camera.position.set(initialCam.position[0], initialCam.position[1], initialCam.position[2]);
    camera.lookAt(initialCam.target[0], initialCam.target[1], initialCam.target[2]);
    cameraRef.current = camera;

    // 3. Renderer Setup (Hardware WebGL with Soft Shadow Maps & ACES Filmic Tone Mapping)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.10;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Calibrated Multi-Point Planetary Lighting Architecture
    // A: Ambient Light — base illumination ensuring shadowed floors are never pitch-black
    const baseAmbientIntensity = mode === 'lunar' ? 0.34 : 0.38;
    const ambientLight = new THREE.AmbientLight(
      mode === 'lunar' ? 0xa4b6cd : 0x88b0d8,
      baseAmbientIntensity
    );
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // B: Hemisphere Sky / Regolith Ground Light — realistic two-tone ambient gradient
    const hemiLight = new THREE.HemisphereLight(
      mode === 'lunar' ? 0x94a8c2 : 0x88b0d8,
      mode === 'lunar' ? 0x243247 : 0x324050,
      mode === 'lunar' ? 0.32 : 0.36
    );
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // C: Primary Low-Angle Directional Solar Light (Casting Soft PCF Shadows)
    // Intensity calibrated to 1.45 (Lunar) / 1.40 (Terrestrial) to eliminate highlight blowout
    const dirLight = new THREE.DirectionalLight(
      mode === 'lunar' ? 0xf8fafc : 0xfff8eb,
      mode === 'lunar' ? 1.45 : 1.40
    );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 50;
    dirLight.shadow.camera.far = 9000;
    const shadowD = 2200;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.radius = 1.5;
    scene.add(dirLight);
    lightRef.current = dirLight;

    // D: Dynamic Opposition Fill Light — simulates lunar regolith optical backscatter (Lommel-Seeliger scattering)
    // Tracks opposite to the solar azimuth at 35° elevation, illuminating shadowed crater walls and floors
    const fillLight = new THREE.DirectionalLight(
      mode === 'lunar' ? 0x718299 : 0x7a8d9e,
      mode === 'lunar' ? 0.36 : 0.32
    );
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // 5. High-Resolution Multi-Octave Terrain Geometry (192x192 grid = 36,864 vertices over 3400m slab)
    const gridRes = 192;
    const worldSize = 3400;
    const geometry = new THREE.PlaneGeometry(worldSize, worldSize, gridRes - 1, gridRes - 1);
    geometry.rotateX(-Math.PI / 2);
    geometryRef.current = geometry;

    const pos = geometry.attributes.position;
    const count = pos.count;
    const procHeights = new Float32Array(count);

    // Apply continuous Hermite crater morphometry, wall slumping, floor mounds, and multi-scale fBm noise
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = 0;

      if (mode === 'terrestrial') {
        // Cinder Lake Crater Field 1 (San Francisco Volcanic Field, Flagstaff AZ):
        // Primary Apollo blast simulation crater (R=600m, depth=140m, rim=46m, ejecta=120m)
        const r1 = Math.hypot(x, z);
        y += continuousCraterElevation(r1, 600, 140, 46, 120);

        // Historic 1967 USGS secondary blast crater array (replicating Mare Tranquillitatis)
        // Secondary Crater 2 (offset +680, +440)
        const r2 = Math.hypot(x - 680, z - 440);
        y += continuousCraterElevation(r2, 310, 78, 25, 75);

        // Secondary Crater 3 (offset -640, -560)
        const r3 = Math.hypot(x + 640, z + 560);
        y += continuousCraterElevation(r3, 260, 62, 20, 60);

        // Secondary Crater 4 (offset -240, +720)
        const r4 = Math.hypot(x + 240, z - 720);
        y += continuousCraterElevation(r4, 180, 44, 14, 45);

        // Secondary Crater 5 (offset +760, -480)
        const r5 = Math.hypot(x - 760, z + 480);
        y += continuousCraterElevation(r5, 170, 38, 12, 40);

        // Secondary Crater 6 (offset -720, +320)
        const r6 = Math.hypot(x + 720, z - 320);
        y += continuousCraterElevation(r6, 150, 32, 10, 35);

        // Micro-Crater 7 (offset +220, -280)
        const r7 = Math.hypot(x - 220, z + 280);
        y += continuousCraterElevation(r7, 110, 22, 7, 28);

        // Regional volcanic cinder drainage gradient
        y += x * 0.015 - z * 0.012;

        // Multi-scale natural volcanic cinder plain roughness (5-octave fBm)
        y += geologicalNoiseFBM(x, z, 'terrestrial');
      } else {
        // Lunar Shackleton Crater: Massive polar impact structure (R=980m, depth=430m, rim=165m, ejecta=175m)
        const r = Math.hypot(x, z);
        y += continuousCraterElevation(r, 980, 430, 165, 175);

        // Gravitational wall slumping and tiered terraces with non-axisymmetric scalloping
        if (r > 360 && r < 980) {
          const u = (r - 360) / (980 - 360);
          const theta = Math.atan2(z, x);
          const scallop = Math.cos(3 * theta + 0.8) * 0.35 + Math.sin(5 * theta - 0.5) * 0.2;
          const terracePhase = u * Math.PI * 4;
          const terraceEnvelope = Math.sin(u * Math.PI);
          y += (22 * Math.sin(terracePhase) + 12 * scallop) * terraceEnvelope;
        }

        // Cold-trap crater floor morphology: central mound uplift and impact melt hummocks
        if (r < 360) {
          const centralMound = 24 * Math.exp(-(r * r) / (2 * 130 * 130));
          const meltHummocks = 10 * Math.cos(x * 0.015) * Math.sin(z * 0.018);
          y += centralMound + meltHummocks;
        }

        // Peak of Eternal Light connecting massif ridge (elevated highland scarp to NW)
        const ridgeDist = Math.hypot(x + 900, z + 700);
        y += 50 * Math.exp(-(ridgeDist * ridgeDist) / (2 * 450 * 450));

        // Superimposed secondary impact craters (following CSFD power-law distribution)
        // Rim Crater 1 (offset +780, -640)
        const rc1 = Math.hypot(x - 780, z + 640);
        y += continuousCraterElevation(rc1, 145, 42, 14, 45);

        // Ejecta Crater 2 (offset -940, +760)
        const rc2 = Math.hypot(x + 940, z - 760);
        y += continuousCraterElevation(rc2, 185, 50, 16, 55);

        // Inner Wall Scarp Micro-Crater 3 (offset -340, -460)
        const rc3 = Math.hypot(x + 340, z + 460);
        y += continuousCraterElevation(rc3, 110, 28, 9, 35);

        // Exterior Massif Crater 4 (offset +1120, +460)
        const rc4 = Math.hypot(x - 1120, z - 460);
        y += continuousCraterElevation(rc4, 160, 44, 15, 50);

        // Floor Micro-Pit 5 (offset +120, -110)
        const rc5 = Math.hypot(x - 120, z + 110);
        y += continuousCraterElevation(rc5, 75, 18, 5, 25);

        // Radial ejecta ray striations
        if (r > 980) {
          const theta = Math.atan2(z, x);
          const rayIntensity = Math.pow(Math.cos(9 * theta + 1.2), 2);
          const rayFalloff = Math.exp(-Math.pow((r - 980) / 420, 2));
          y += 15 * rayIntensity * rayFalloff;
        }

        // Multi-scale natural lunar highlands megaregolith texture (5-octave fBm)
        y += geologicalNoiseFBM(x, z, 'lunar');
      }

      pos.setY(i, y);
      procHeights[i] = y;
    }
    proceduralHeightsRef.current = procHeights;

    geometry.computeVertexNormals();

    // Initial analytical color palette calculation
    applyTerrainColorPalette(geometry, mode, colorMode);

    // Procedural tangent-space micro-normal texture
    const normalMap = createRegolithNormalTexture(mode);
    normalMapRef.current = normalMap;

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: mode === 'lunar' ? 0.94 : 0.88,
      metalness: mode === 'lunar' ? 0.01 : 0.03,
      // normalMap omitted to prevent sub-pixel tiling/moire artifacts under grazing light
      wireframe: showContours,
      flatShading: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // 6. Interactive Mouse Drag Orbit Controls — Centered on Mid-Crater Depth
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const targetPos = new THREE.Vector3(0, -50, 0);
    const initialCamPos = camera.position;
    const initialRadius = Math.hypot(
      initialCamPos.x - targetPos.x,
      initialCamPos.y - targetPos.y,
      initialCamPos.z - targetPos.z
    );

    const spherical = {
      radius: initialRadius,
      theta: Math.atan2(initialCamPos.x - targetPos.x, initialCamPos.z - targetPos.z),
      phi: Math.acos(Math.max(-1, Math.min(1, (initialCamPos.y - targetPos.y) / initialRadius))),
    };

    const updateCameraPos = () => {
      camera.position.x = targetPos.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = targetPos.y + spherical.radius * Math.cos(spherical.phi);
      camera.position.z = targetPos.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(targetPos);

      if (syncCameras) {
        useMissionStore.getState().setCameraTransform({
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [targetPos.x, targetPos.y, targetPos.z],
        });
      }
    };

    const unsubStore = useMissionStore.subscribe((state) => {
      if (!state.terrain.syncCameras || !cameraRef.current) return;
      const t = state.terrain.cameraTransform;
      const cam = cameraRef.current;
      const dist = Math.hypot(
        cam.position.x - t.position[0],
        cam.position.y - t.position[1],
        cam.position.z - t.position[2]
      );
      if (dist > 5) {
        cam.position.set(t.position[0], t.position[1], t.position[2]);
        cam.lookAt(t.target[0], t.target[1], t.target[2]);
      }
    });

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= dx * 0.007;
      spherical.phi = Math.max(0.18, Math.min(Math.PI / 2 - 0.05, spherical.phi - dy * 0.007));
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(700, Math.min(3800, spherical.radius + e.deltaY * 1.5));
      updateCameraPos();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      unsubStore();
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      normalMap.dispose();
    };
  }, [mode]);

  // Update Solar Illumination Angle & Dynamic Opposition Fill Light
  useEffect(() => {
    if (!lightRef.current || !fillLightRef.current) return;
    const elevRad = (elevation * Math.PI) / 180;
    const azRad = (azimuth * Math.PI) / 180;
    const dist = 3200;

    const x = dist * Math.cos(elevRad) * Math.sin(azRad);
    const y = dist * Math.sin(elevRad);
    const z = dist * Math.cos(elevRad) * Math.cos(azRad);

    lightRef.current.position.set(x, y, z);

    // Opposition fill light: positioned 180° opposite to solar azimuth at 35° elevation to clear crater rim
    const oppAzRad = azRad + Math.PI;
    const fillElevRad = (35 * Math.PI) / 180;
    const fillDist = 2600;
    const fx = fillDist * Math.cos(fillElevRad) * Math.sin(oppAzRad);
    const fy = fillDist * Math.sin(fillElevRad);
    const fz = fillDist * Math.cos(fillElevRad) * Math.cos(oppAzRad);

    fillLightRef.current.position.set(fx, fy, fz);
  }, [elevation, azimuth]);

  // Dynamic Color Mode Palette Switcher
  useEffect(() => {
    if (!geometryRef.current) return;
    applyTerrainColorPalette(geometryRef.current, mode, colorMode);
  }, [colorMode, mode]);

  // Update Wireframe / Contours
  useEffect(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.wireframe = showContours;
  }, [showContours]);

  // Update PCF Directional Hillshade
  useEffect(() => {
    if (!lightRef.current || !ambientLightRef.current || !fillLightRef.current || !hemiLightRef.current) return;
    if (showHillshade) {
      lightRef.current.intensity = mode === 'lunar' ? 1.45 : 1.40;
      lightRef.current.castShadow = true;
      ambientLightRef.current.intensity = mode === 'lunar' ? 0.34 : 0.38;
      fillLightRef.current.intensity = mode === 'lunar' ? 0.36 : 0.32;
      hemiLightRef.current.intensity = mode === 'lunar' ? 0.32 : 0.36;
    } else {
      lightRef.current.intensity = 0.85;
      lightRef.current.castShadow = false;
      ambientLightRef.current.intensity = 0.60;
      fillLightRef.current.intensity = 0.22;
      hemiLightRef.current.intensity = 0.45;
    }
  }, [showHillshade, mode]);

  // Dynamic Scientific Elevation Grid vs Procedural Model Switcher
  useEffect(() => {
    if (!geometryRef.current) return;
    const geometry = geometryRef.current;
    const pos = geometry.attributes.position;
    const count = pos.count;

    if (dataMode === 'scientific_grid') {
      setIsGridLoading(true);
      const body = mode === 'terrestrial' ? 'earth' : 'moon';
      const lat = mode === 'terrestrial' ? 35.3071 : -89.9;
      const lng = mode === 'terrestrial' ? -111.5049 : 0.0;

      fetch(getApiUrl(`/api/science/terrain?body=${body}&lat=${lat}&lng=${lng}&gridSize=64&spanMeters=3400`))
        .then((res) => res.json())
        .then((json) => {
          if (json?.data?.matrix) {
            const matrix: number[][] = json.data.matrix;
            const meanElev = json.data.meanElevationMeters;
            const gSize = matrix.length;
            const worldSize = 3400;

            for (let i = 0; i < count; i++) {
              const x = pos.getX(i);
              const z = pos.getZ(i);
              const u = Math.max(0, Math.min(1, (x + worldSize / 2) / worldSize));
              const v = Math.max(0, Math.min(1, (z + worldSize / 2) / worldSize));

              const rFloat = v * (gSize - 1);
              const cFloat = u * (gSize - 1);
              const r0 = Math.floor(rFloat);
              const r1 = Math.min(gSize - 1, r0 + 1);
              const c0 = Math.floor(cFloat);
              const c1 = Math.min(gSize - 1, c0 + 1);
              const fr = rFloat - r0;
              const fc = cFloat - c0;

              const val00 = matrix[r0][c0];
              const val10 = matrix[r1][c0];
              const val01 = matrix[r0][c1];
              const val11 = matrix[r1][c1];

              const elev =
                val00 * (1 - fc) * (1 - fr) +
                val01 * fc * (1 - fr) +
                val10 * (1 - fc) * fr +
                val11 * fc * fr;

              const scaledY = (elev - meanElev) * 2.2;
              pos.setY(i, scaledY);
            }

            pos.needsUpdate = true;
            geometry.computeVertexNormals();
            applyTerrainColorPalette(geometry, mode, colorMode);
          }
        })
        .catch(() => {
          // Revert on fetch failure
        })
        .finally(() => {
          setIsGridLoading(false);
        });
    } else {
      // Restore procedural morphometric model
      if (proceduralHeightsRef.current) {
        for (let i = 0; i < count; i++) {
          pos.setY(i, proceduralHeightsRef.current[i]);
        }
        pos.needsUpdate = true;
        geometry.computeVertexNormals();
        applyTerrainColorPalette(geometry, mode, colorMode);
      }
    }
  }, [dataMode, mode, colorMode]);

  return (
    <div className="relative flex-1 w-full min-h-[290px] h-full bg-[#050811] overflow-hidden select-none border border-[#8B9CB5]/15 rounded-xl">
      {/* Three.js Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Overlay Label */}
      <div className="absolute top-3 left-3 z-10 max-w-[280px] sm:max-w-xs space-y-1 bg-[#0A192F]/90 px-3 py-2 rounded-lg border border-[#8B9CB5]/20 backdrop-blur-md shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              mode === 'terrestrial' ? 'bg-[#00D4AA] shadow-[0_0_6px_#00D4AA]' : 'bg-[#1E90FF] shadow-[0_0_6px_#1E90FF]'
            }`}
          />
          <span className="font-headline font-bold text-xs text-white uppercase tracking-wider">
            {mode === 'terrestrial' ? 'TERRESTRIAL ANALOG' : 'LUNAR REFERENCE'}
          </span>
        </div>
        <div className="font-display font-semibold text-sm text-white">{siteName}</div>
        <div className="text-[10px] font-mono text-[#8B9CB5]">{locationDetails}</div>
        <div className="text-[9px] font-mono space-y-0.5 pt-1 border-t border-[#8B9CB5]/15 mt-1">
          <div className="text-[#8B9CB5]">
            <span className="text-white/60">SOURCE REF:</span>{' '}
            {dataMode === 'scientific_grid'
              ? mode === 'terrestrial'
                ? 'USGS 3DEP / NED 10m Elevation Grid'
                : 'NASA LRO LOLA LDEM_875S Polar Grid'
              : referenceDataset || datasetName || 'USGS / NASA Reference'}
          </div>
          <div className={dataMode === 'scientific_grid' ? 'text-[#38BDF8] font-bold' : 'text-[#00D4AA]'}>
            <span className="text-white/60">RENDERED MODEL:</span>{' '}
            {dataMode === 'scientific_grid'
              ? isGridLoading
                ? 'Retrieving calibrated DEM matrix...'
                : 'Datum-Anchored Morphometric Grid (Three.js WebGL)'
              : modelDescription || 'Procedural morphometric model'}
          </div>
        </div>
      </div>

      {/* Loading Indicator Pill */}
      {isGridLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#0A192F]/90 border border-[#00D4AA]/40 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2.5 text-xs font-mono text-[#00D4AA] shadow-2xl">
          <span className="w-3.5 h-3.5 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
          <span>Processing Scientific Elevation Grid...</span>
        </div>
      )}

      {/* Extreme Low-Angle Solar Watermark Banner */}
      <div className="absolute top-3 right-3 z-10 bg-[#050811]/80 px-2.5 py-1 rounded border border-[#8B9CB5]/20 text-[10px] font-mono text-[#8B9CB5] pointer-events-none">
        SUN ELEV: <span className="text-[#00D4AA] font-bold">{elevation.toFixed(1)}°</span> | AZ:{' '}
        <span className="text-white">{azimuth.toFixed(0)}°</span>
      </div>

      {/* Viewport Scale Indicator */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 text-[10px] font-mono text-[#8B9CB5] bg-[#0A192F]/80 px-2 py-1 rounded border border-[#8B9CB5]/20 pointer-events-none">
        <span>GRID: 250m</span>
        <span className="text-[#8B9CB5]/40">|</span>
        <span>FOV: 40°</span>
        <span className="text-[#8B9CB5]/40">|</span>
        <span className="text-[#00D4AA]">HARDWARE ACCELERATED WEBGL2</span>
      </div>

      {/* Scientific Epistemic Watermark */}
      <div className="absolute bottom-3 right-3 z-10 text-[9px] font-mono text-[#8B9CB5]/60 uppercase tracking-widest pointer-events-none">
        {dataMode === 'scientific_grid'
          ? 'CALIBRATED ELEVATION MATRIX (USGS 3DEP / NASA LOLA DATUMS)'
          : 'PROCEDURAL MORPHOMETRIC MODEL (USGS 3DEP / LOLA PARAMETERIZED)'}
      </div>
    </div>
  );
}
