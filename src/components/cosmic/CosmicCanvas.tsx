/**
 * TERRALIGN 2.0 — COSMIC ASCENSION
 * Persistent Cosmic Environment Component
 *
 * Mounted once at the root application shell.
 * - Server-deterministic CSS fallback layer renders immediately (no black flash, no CLS)
 * - Three.js WebGL canvas loads lazily after idle/first-paint
 * - Fixed inset-0 viewport with height 100lvh / 100vh fallback
 * - Passive scroll tracking without React re-renders
 * - HARD CONTEXT BUDGET COMPLIANCE: Releases WebGL context completely on /terrain route,
 *   retaining CSS fallback so active WebGL contexts never exceed 2.
 * - Restores WebGL renderer smoothly on leaving /terrain.
 * - Safe fail-open error boundaries
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { CosmicScene } from '@/lib/cosmic/CosmicScene';
import { COSMIC_CONFIG, getProfileForPathname } from '@/lib/cosmic/cosmicConfig';
import { useCosmicStore } from '@/store/useCosmicStore';

export default function CosmicCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CosmicScene | null>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [webglActive, setWebglActive] = useState(false);
  const pathname = usePathname();

  // Scroll and pointer mutable state
  const scrollProgressRef = useRef<number>(0);
  const pointerXRef = useRef<number>(0);
  const pointerYRef = useRef<number>(0);

  const destroyWebgl = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (sceneRef.current) {
      sceneRef.current.destroy();
      sceneRef.current = null;
    }
    setWebglActive(false);
  }, []);

  const startRenderLoop = useCallback((scene: CosmicScene) => {
    const reducedMotion = useCosmicStore.getState().reducedMotion;
    if (reducedMotion) {
      scene.render(0.016, 0, 0, 0);
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const hidden = document.hidden;
      const heavy = useCosmicStore.getState().heavyCanvasActive;

      if (!hidden && !heavy && sceneRef.current) {
        sceneRef.current.render(dt, scrollProgressRef.current, pointerXRef.current, pointerYRef.current);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  const initWebgl = useCallback(() => {
    if (!canvasRef.current || !COSMIC_CONFIG.enableCosmos) return;

    // Strict WebGL context budget: Do not initialize WebGL on /terrain where 2 heavy terrain canvases run
    if (pathname === '/terrain') {
      destroyWebgl();
      return;
    }

    if (sceneRef.current) return; // Already active

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const width = window.innerWidth;

    const initialTier =
      COSMIC_CONFIG.devQualityOverride ||
      (reducedMotion
        ? 'low'
        : width >= 1280 && finePointer
        ? 'high'
        : width >= 768
        ? 'medium'
        : 'low');

    useCosmicStore.getState().setQualityTier(initialTier);
    useCosmicStore.getState().setReducedMotion(reducedMotion);
    useCosmicStore.getState().setFinePointer(finePointer);

    const profileId = getProfileForPathname(pathname);
    useCosmicStore.getState().setProfileId(profileId);

    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new CosmicScene();
    const success = scene.init(canvasRef.current, w, h, initialTier, profileId);

    if (success) {
      sceneRef.current = scene;
      setWebglActive(true);
      startRenderLoop(scene);
    }
  }, [pathname, destroyWebgl, startRenderLoop]);

  // Handle route change and WebGL context lifecycle
  useEffect(() => {
    const isTerrain = pathname === '/terrain';
    const profileId = getProfileForPathname(pathname);
    useCosmicStore.getState().setProfileId(profileId);
    useCosmicStore.getState().setHeavyCanvasActive(isTerrain);

    if (isTerrain) {
      // Release WebGL context on /terrain so Terrain Studio gets 100% GPU resources & context budget <= 2
      destroyWebgl();
    } else {
      // On non-terrain routes, ensure WebGL is active or restored
      if (!sceneRef.current) {
        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => void }).requestIdleCallback(initWebgl, { timeout: 300 });
        } else {
          setTimeout(initWebgl, 100);
        }
      } else {
        sceneRef.current.setProfile(profileId);
      }
    }
  }, [pathname, initWebgl, destroyWebgl]);

  // Global listeners for scroll, mouse, and resize
  useEffect(() => {
    const mainEl = document.getElementById('main-content');
    const updateScroll = () => {
      if (!mainEl) return;
      const maxScroll = Math.max(1, mainEl.scrollHeight - mainEl.clientHeight);
      scrollProgressRef.current = Math.min(1, Math.max(0, mainEl.scrollTop / maxScroll));
      useCosmicStore.getState().setScrollMetrics(mainEl.scrollTop, mainEl.scrollHeight);
    };

    if (mainEl) {
      mainEl.addEventListener('scroll', updateScroll, { passive: true });
    }

    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onPointerMove = (e: MouseEvent) => {
      if (!finePointer || reducedMotion) return;
      pointerXRef.current = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerYRef.current = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    if (finePointer && !reducedMotion) {
      window.addEventListener('mousemove', onPointerMove, { passive: true });
    }

    const onResize = () => {
      if (sceneRef.current) {
        sceneRef.current.resize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (mainEl) mainEl.removeEventListener('scroll', updateScroll);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      destroyWebgl();
    };
  }, [destroyWebgl]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-[100vh] h-[100lvh] pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
      role="presentation"
    >
      {/* ── 1. Deterministic CSS Fallback Layer (always present beneath canvas) ── */}
      <div
        className="absolute inset-0 bg-[#050811] starfield-bg opacity-75 transition-opacity duration-700"
        style={{ opacity: webglActive ? 0.35 : 0.8 }}
      />

      {/* ── 2. Cinematic Depth Vignette ── */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* ── 3. Three.js Procedural Cosmic Canvas ── */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          webglActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
