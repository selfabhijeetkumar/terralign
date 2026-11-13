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
  useSunLighting,
  useTerrainSync,
} from '@/store/useMissionStore';
import type { ColorMode } from '@/types/store';

interface TerrainCanvasProps {
  mode: 'terrestrial' | 'lunar';
  siteName: string;
  locationDetails: string;
  datasetName: string;
  resolutionText: string;
}

export function TerrainCanvas({
  mode,
  siteName,
  locationDetails,
  datasetName,
  resolutionText,
}: TerrainCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const lightRef = useRef<THREE.DirectionalLight | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  const { elevation, azimuth } = useSunLighting();
  const { syncCameras } = useTerrainSync();
  const colorMode = useMissionStore((s) => s.terrain.colorMode);
  const showHillshade = useMissionStore((s) => s.terrain.showHillshade);
  const showContours = useMissionStore((s) => s.terrain.showContours);

  // Global camera transform from store
  const globalCam = useMissionStore((s) => s.terrain.cameraTransform);
  const setCamTransform = useMissionStore((s) => s.setCameraTransform);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050811);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 10, 15000);
    camera.position.set(globalCam.position[0], globalCam.position[1], globalCam.position[2]);
    camera.lookAt(globalCam.target[0], globalCam.target[1], globalCam.target[2]);
    cameraRef.current = camera;

    // 3. Renderer Setup (Hardware WebGL with Soft Shadow Maps)
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting: Extreme Low-Angle Directional Solar Light + Ambient
    // Lunar vacuum has near-zero ambient; Terrestrial has atmospheric diffuse ambient
    const ambientIntensity = mode === 'lunar' ? 0.04 : 0.25;
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, mode === 'lunar' ? 3.0 : 2.2);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 50;
    dirLight.shadow.camera.far = 8000;
    const shadowD = 2000;
    dirLight.shadow.camera.left = -shadowD;
    dirLight.shadow.camera.right = shadowD;
    dirLight.shadow.camera.top = shadowD;
    dirLight.shadow.camera.bottom = -shadowD;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    lightRef.current = dirLight;

    // 5. Procedural Terrain Geometry (128x128 grid = 16,641 vertices)
    const gridRes = 128;
    const worldSize = 3000;
    const geometry = new THREE.PlaneGeometry(worldSize, worldSize, gridRes - 1, gridRes - 1);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    // Apply crater height profiles
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      let y = 0;

      if (mode === 'terrestrial') {
        // Cinder Lake Crater Field 1: Multiple blasted craters across undulating cinder plain
        // Main Apollo blast crater at center
        const r1 = Math.sqrt(x * x + z * z);
        const R1 = 500;
        if (r1 < R1) {
          y -= 140 * (1 - (r1 / R1) * (r1 / R1));
        } else {
          y += 50 * Math.exp(-Math.pow((r1 - R1) / 120, 2));
        }

        // Secondary crater 1
        const r2 = Math.sqrt((x - 650) * (x - 650) + (z - 400) * (z - 400));
        const R2 = 300;
        if (r2 < R2) {
          y -= 80 * (1 - (r2 / R2) * (r2 / R2));
        } else {
          y += 30 * Math.exp(-Math.pow((r2 - R2) / 80, 2));
        }

        // Secondary crater 2
        const r3 = Math.sqrt((x + 600) * (x + 600) + (z + 550) * (z + 550));
        const R3 = 250;
        if (r3 < R3) {
          y -= 60 * (1 - (r3 / R3) * (r3 / R3));
        }

        // High cinder hills on boundary
        y += 80 * Math.sin(x / 400) * Math.cos(z / 400);
      } else {
        // Lunar Shackleton Crater: Massive deep crater rim (21km scale) with steep 28° slope
        const r = Math.sqrt(x * x + z * z);
        const R = 850;
        if (r < R) {
          // Deep parabolic floor plunging into permanently shadowed cold trap
          y -= 420 * Math.pow(1 - (r / R) * (r / R), 1.2);
        } else {
          // Sharp illuminated crater rim crest
          y += 180 * Math.exp(-Math.pow((r - R) / 180, 2));
        }
        // Micro-roughness
        y += 25 * Math.sin(x / 80) * Math.cos(z / 80);
      }

      pos.setY(i, y);

      // Default vertex colors (hypsometric)
      const normY = (y + 400) / 600;
      colors[i * 3] = mode === 'lunar' ? 0.15 + normY * 0.7 : 0.05 + normY * 0.2;
      colors[i * 3 + 1] = mode === 'lunar' ? 0.2 + normY * 0.7 : 0.4 + normY * 0.5;
      colors[i * 3 + 2] = mode === 'lunar' ? 0.3 + normY * 0.7 : 0.3 + normY * 0.4;
    }

    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: mode === 'lunar' ? 0.95 : 0.85,
      metalness: 0.1,
      wireframe: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // 6. Interactive Mouse Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = {
      radius: Math.sqrt(
        camera.position.x ** 2 + camera.position.y ** 2 + camera.position.z ** 2
      ),
      theta: Math.atan2(camera.position.x, camera.position.z),
      phi: Math.acos(camera.position.y / 2900),
    };

    const updateCameraPos = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);

      if (syncCameras) {
        setCamTransform({
          position: [camera.position.x, camera.position.y, camera.position.z],
          target: [0, 0, 0],
        });
      }
    };

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

      spherical.theta -= dx * 0.008;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - dy * 0.008));
      updateCameraPos();
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(800, Math.min(5000, spherical.radius + e.deltaY * 1.5));
      updateCameraPos();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 7. Animation Loop (60 FPS)
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
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
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [mode]);

  // Update Solar Illumination Angle
  useEffect(() => {
    if (!lightRef.current) return;
    const elevRad = (elevation * Math.PI) / 180;
    const azRad = (azimuth * Math.PI) / 180;
    const dist = 3000;

    const x = dist * Math.cos(elevRad) * Math.sin(azRad);
    const y = dist * Math.sin(elevRad);
    const z = dist * Math.cos(elevRad) * Math.cos(azRad);

    lightRef.current.position.set(x, y, z);
  }, [elevation, azimuth]);

  // Update Wireframe / Contours / Colors
  useEffect(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.wireframe = showContours;
  }, [showContours]);

  return (
    <div className="relative flex-1 w-full h-full bg-[#050811] overflow-hidden select-none border border-[#8B9CB5]/15 rounded-xl">
      {/* Three.js Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Overlay Label */}
      <div className="absolute top-3 left-3 z-10 space-y-1 bg-[#0A192F]/90 px-3 py-2 rounded-lg border border-[#8B9CB5]/20 backdrop-blur-md shadow-lg pointer-events-none">
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
        <div className="text-[9px] font-mono text-[#00D4AA]">
          {datasetName} · <span className="text-white">{resolutionText}</span>
        </div>
      </div>

      {/* Extreme Low-Angle Solar Watermark Banner */}
      <div className="absolute top-3 right-3 z-10 bg-[#050811]/80 px-2.5 py-1 rounded border border-[#8B9CB5]/20 text-[10px] font-mono text-[#8B9CB5] pointer-events-none">
        SUN ELEV: <span className="text-[#00D4AA] font-bold">{elevation.toFixed(1)}°</span> | AZ:{' '}
        <span className="text-white">{azimuth.toFixed(0)}°</span>
      </div>

      {/* Viewport Scale Indicator */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 text-[10px] font-mono text-[#8B9CB5] bg-[#0A192F]/80 px-2 py-1 rounded border border-[#8B9CB5]/20 pointer-events-none">
        <span>GRID: 250m</span>
        <span className="text-[#8B9CB5]/40">|</span>
        <span>FOV: 45°</span>
        <span className="text-[#8B9CB5]/40">|</span>
        <span className="text-[#00D4AA]">60 FPS WEBGL</span>
      </div>

      {/* Scientific Epistemic Watermark */}
      <div className="absolute bottom-3 right-3 z-10 text-[9px] font-mono text-[#8B9CB5]/50 uppercase tracking-widest pointer-events-none">
        ILLUSTRATIVE DESIGN PREVIEW
      </div>
    </div>
  );
}
