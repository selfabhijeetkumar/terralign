/**
 * TERRALIGN 2.0 — COSMIC ASCENSION
 * Celestial Dragon Cursor Engine (Canvas2D Procedural Mesh & Kinematics)
 *
 * Implements a dimensional, articulated celestial creature following pointer:
 * - 32 constrained spine segments with traveling wave undulation & tapering volume
 * - Faceted 3D-shaded wedge skull, brow ridge, swept-back celestial horns & glowing eye
 * - Dynamic translucent energy wings with spars, bank foreshortening & flight spreading
 * - Tapered delayed tail with fine celestial fin
 * - Particle pool emitting soft luminous stardust wake
 * - Safe fail-open native cursor fallback on text/inputs, touch, and reduced motion
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { COSMIC_CONFIG } from '@/lib/cosmic/cosmicConfig';
import { useCosmicStore } from '@/store/useCosmicStore';

interface SpineSegment {
  x: number;
  y: number;
  angle: number;
  width: number;
  length: number;
}

export default function CelestialDragonCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!COSMIC_CONFIG.enableDragon) return;

    // Check environment support
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const hoverSupport = window.matchMedia('(hover: hover)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!finePointer || !hoverSupport || reducedMotion) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDestroyed = false;
    let isVisible = false;
    let isActive = false;
    let currentDpr = Math.min(window.devicePixelRatio || 1, 2);

    // Resize canvas
    const resizeCanvas = () => {
      currentDpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * currentDpr;
      canvas.height = window.innerHeight * currentDpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Kinematic model
    const SEGMENT_COUNT = 32;
    const segments: SpineSegment[] = [];

    // Pointer target
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let headX = targetX;
    let headY = targetY;
    let headAngle = 0;
    let headBank = 0;
    let currentSpeed = 0;
    let lastMoveTime = performance.now();
    let isPressed = false;
    let pressPulseTime = 0;
    let cursorState: 'normal' | 'interactive' | 'text' | 'drag' = 'normal';
    let dragonAlpha = 0;

    // Initialize segments
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      // Tapering width from 13px at neck down to 1.2px at tail tip
      const t = i / (SEGMENT_COUNT - 1);
      const width = i === 0 ? 10 : (1 - t) * 13 + 1.2;
      const length = 5.2 - t * 2.0;
      segments.push({
        x: targetX - i * 5,
        y: targetY,
        angle: 0,
        width,
        length,
      });
    }

    // Particle pool for stardust wake (160 particles)
    const MAX_PARTICLES = 160;
    const particlePool = {
      x: new Float32Array(MAX_PARTICLES),
      y: new Float32Array(MAX_PARTICLES),
      vx: new Float32Array(MAX_PARTICLES),
      vy: new Float32Array(MAX_PARTICLES),
      life: new Float32Array(MAX_PARTICLES),
      maxLife: new Float32Array(MAX_PARTICLES),
      size: new Float32Array(MAX_PARTICLES),
      r: new Float32Array(MAX_PARTICLES),
      g: new Float32Array(MAX_PARTICLES),
      b: new Float32Array(MAX_PARTICLES),
      alpha: new Float32Array(MAX_PARTICLES),
      count: 0,
    };

    const emitParticle = (x: number, y: number, r: number, g: number, b: number, size: number) => {
      let idx = -1;
      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (particlePool.life[i] <= 0) {
          idx = i;
          break;
        }
      }
      if (idx === -1) idx = Math.floor(Math.random() * MAX_PARTICLES);

      particlePool.x[idx] = x;
      particlePool.y[idx] = y;
      particlePool.vx[idx] = (Math.random() - 0.5) * 18;
      particlePool.vy[idx] = (Math.random() - 0.5) * 18;
      particlePool.life[idx] = 1.0;
      particlePool.maxLife[idx] = 0.4 + Math.random() * 0.5;
      particlePool.size[idx] = size;
      particlePool.r[idx] = r;
      particlePool.g[idx] = g;
      particlePool.b[idx] = b;
      particlePool.alpha[idx] = 0.8;
    };

    // Passive pointer listeners
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        // Immediately disable dragon and restore native cursor on touch
        document.documentElement.classList.remove('cc-on');
        isVisible = false;
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;
      lastMoveTime = performance.now();

      if (!isActive) {
        isActive = true;
        document.documentElement.classList.add('cc-on');
      }
      isVisible = true;

      // Check element under pointer via event target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isTextInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.closest('[data-cursor="text"]') ||
          target.closest('[data-cursor="native"]');

        if (isTextInput) {
          cursorState = 'text';
          return;
        }

        const isInteractive =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[data-cursor="interactive"]');

        cursorState = isInteractive ? 'interactive' : 'normal';
      }
    };

    const onPointerDown = () => {
      isPressed = true;
      pressPulseTime = performance.now();
      // Particle burst on press (8 particles)
      for (let p = 0; p < 8; p++) {
        emitParticle(headX, headY, 0, 212, 170, 3.5);
      }
    };

    const onPointerUp = () => {
      isPressed = false;
    };

    const onPointerLeave = () => {
      isVisible = false;
      document.documentElement.classList.remove('cc-on');
    };

    const onPointerEnter = () => {
      if (isActive) {
        isVisible = true;
        document.documentElement.classList.add('cc-on');
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('mouseleave', onPointerLeave);
    document.addEventListener('mouseenter', onPointerEnter);

    // Animation ticker loop
    let animationId = 0;
    let lastFrame = performance.now();

    const render = (now: number) => {
      if (isDestroyed) return;
      const dt = Math.min(0.04, (now - lastFrame) / 1000);
      lastFrame = now;

      ctx.save();
      ctx.scale(currentDpr, currentDpr);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Handle visibility fade
      const shouldShow = isVisible && cursorState !== 'text';
      if (shouldShow && dragonAlpha < 1.0) {
        dragonAlpha = Math.min(1.0, dragonAlpha + dt * 8.0);
      } else if (!shouldShow && dragonAlpha > 0.0) {
        dragonAlpha = Math.max(0.0, dragonAlpha - dt * 8.0);
      }

      if (dragonAlpha <= 0.01) {
        ctx.restore();
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.globalAlpha = dragonAlpha;

      // Kinematic update
      const dx = targetX - headX;
      const dy = targetY - headY;
      const dist = Math.hypot(dx, dy);
      currentSpeed = dist / (dt || 0.016);

      // Smooth head movement toward target (50ms time constant)
      const followRate = Math.min(1.0, dt * 22.0);
      headX += dx * followRate;
      headY += dy * followRate;

      // Compute heading with hysteresis
      if (dist > 1.5) {
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - headAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        headAngle += angleDiff * Math.min(1.0, dt * 18.0);

        // Banking from angular rate
        headBank = Math.max(-0.6, Math.min(0.6, angleDiff * 3.5));
      } else {
        headBank *= 0.9;
      }

      // Constrain spine segments (follow the leader)
      segments[0].x = headX - Math.cos(headAngle) * segments[0].length;
      segments[0].y = headY - Math.sin(headAngle) * segments[0].length;
      segments[0].angle = headAngle;

      const waveSpeed = Math.min(12, 3 + currentSpeed * 0.015);
      const waveAmp = Math.min(1.8, 0.4 + currentSpeed * 0.003);

      for (let i = 1; i < SEGMENT_COUNT; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        // Undulation wave
        const wave = Math.sin(now * 0.006 * waveSpeed - i * 0.28) * waveAmp;

        const segDx = prev.x - curr.x;
        const segDy = prev.y - curr.y;
        curr.angle = Math.atan2(segDy, segDx) + wave * 0.08;

        curr.x = prev.x - Math.cos(curr.angle) * curr.length;
        curr.y = prev.y - Math.sin(curr.angle) * curr.length;
      }

      // Emit particles from tail tip and wing tips
      if (currentSpeed > 30 && Math.random() > 0.4) {
        const tail = segments[SEGMENT_COUNT - 1];
        emitParticle(tail.x, tail.y, 0, 212, 170, 2.2);
        if (currentSpeed > 150) {
          emitParticle(tail.x, tail.y, 30, 144, 255, 1.8);
        }
      }

      // Update & render particles
      for (let i = 0; i < MAX_PARTICLES; i++) {
        if (particlePool.life[i] <= 0) continue;

        // Advance particle lifecycle
        const maxL = particlePool.maxLife[i] > 0.05 ? particlePool.maxLife[i] : 0.5;
        particlePool.life[i] -= dt / maxL;

        // If life expired during this step, immediately clamp to 0 and skip rendering
        if (particlePool.life[i] <= 0) {
          particlePool.life[i] = 0;
          continue;
        }

        particlePool.x[i] += particlePool.vx[i] * dt;
        particlePool.y[i] += particlePool.vy[i] * dt;

        // Validate coordinates
        const px = particlePool.x[i];
        const py = particlePool.y[i];
        if (!Number.isFinite(px) || !Number.isFinite(py)) {
          particlePool.life[i] = 0;
          continue;
        }

        const pAlpha = Math.max(0, Math.min(1, particlePool.life[i] * 0.7));
        const pSize = particlePool.size[i] * particlePool.life[i];

        // Strict radius validation: must be finite, non-NaN, and strictly positive
        if (!Number.isFinite(pSize) || pSize <= 0.01) {
          continue;
        }

        try {
          ctx.beginPath();
          ctx.arc(px, py, pSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${particlePool.r[i]}, ${particlePool.g[i]}, ${particlePool.b[i]}, ${pAlpha})`;
          ctx.fill();
        } catch {
          // Guard against any unforeseen canvas driver failure
          particlePool.life[i] = 0;
        }
      }

      // ── 1. Render Spine Body Segments (tail to neck) ──
      for (let i = SEGMENT_COUNT - 1; i >= 1; i--) {
        const seg = segments[i];
        const next = segments[i - 1];
        const t = i / SEGMENT_COUNT;

        // Color transition: cool cyan (#00D4AA) near head -> lunar blue (#1E90FF) -> faint amber at tip
        let r = 0;
        let g = 212;
        let b = 170;
        if (t > 0.85) {
          r = 255;
          g = 184;
          b = 0;
        } else if (t > 0.45) {
          r = 30;
          g = 144;
          b = 255;
        }

        const alpha = Math.max(0.2, (1 - t * 0.75) * 0.85);

        // Perpendicular offset for body width
        const nx = -Math.sin(seg.angle);
        const ny = Math.cos(seg.angle);
        const halfW = seg.width * 0.5;

        // Paired facets (light side top, shadow side bottom)
        ctx.beginPath();
        ctx.moveTo(seg.x + nx * halfW, seg.y + ny * halfW);
        ctx.lineTo(next.x + nx * halfW * 0.95, next.y + ny * halfW * 0.95);
        ctx.lineTo(next.x, next.y);
        ctx.lineTo(seg.x, seg.y);
        ctx.fillStyle = `rgba(${r + 40}, ${g + 30}, ${b + 30}, ${alpha})`;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(next.x, next.y);
        ctx.lineTo(next.x - nx * halfW * 0.95, next.y - ny * halfW * 0.95);
        ctx.lineTo(seg.x - nx * halfW, seg.y - ny * halfW);
        ctx.fillStyle = `rgba(${r * 0.7}, ${g * 0.7}, ${b * 0.7}, ${alpha * 0.85})`;
        ctx.fill();

        // Central glowing spine ridge
        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = `rgba(248, 250, 252, ${alpha * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // ── 2. Render Distinct Wings / Energy Fins (attached at segment 4) ──
      const wingRoot = segments[4];
      if (wingRoot) {
        const wingSpread = cursorState === 'interactive' ? 1.2 : Math.min(1.0, 0.4 + currentSpeed * 0.003);
        const wingBank = Math.cos(headBank);
        const wingSpan = 38 * wingSpread;

        const leftAngle = wingRoot.angle + Math.PI * 0.55 + headBank * 0.5;
        const rightAngle = wingRoot.angle - Math.PI * 0.55 + headBank * 0.5;

        // Left wing
        const lTipX = wingRoot.x + Math.cos(leftAngle) * wingSpan * wingBank;
        const lTipY = wingRoot.y + Math.sin(leftAngle) * wingSpan;
        const lMidX = wingRoot.x + Math.cos(leftAngle + 0.3) * (wingSpan * 0.6);
        const lMidY = wingRoot.y + Math.sin(leftAngle + 0.3) * (wingSpan * 0.6);

        ctx.beginPath();
        ctx.moveTo(wingRoot.x, wingRoot.y);
        ctx.lineTo(lTipX, lTipY);
        ctx.lineTo(lMidX, lMidY);
        ctx.lineTo(segments[7].x, segments[7].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 212, 170, 0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 212, 170, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Right wing
        const rTipX = wingRoot.x + Math.cos(rightAngle) * wingSpan * wingBank;
        const rTipY = wingRoot.y + Math.sin(rightAngle) * wingSpan;
        const rMidX = wingRoot.x + Math.cos(rightAngle - 0.3) * (wingSpan * 0.6);
        const rMidY = wingRoot.y + Math.sin(rightAngle - 0.3) * (wingSpan * 0.6);

        ctx.beginPath();
        ctx.moveTo(wingRoot.x, wingRoot.y);
        ctx.lineTo(rTipX, rTipY);
        ctx.lineTo(rMidX, rMidY);
        ctx.lineTo(segments[7].x, segments[7].y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(30, 144, 255, 0.18)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(30, 144, 255, 0.65)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // ── 3. Render Faceted 3D Wedge Head (snout, horns, brow, jaw, eye) ──
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(headAngle);

      // Head dimensions: 32px long, 16px wide
      const headLen = 32;
      const headWidth = 14;

      // Upper faceted skull (lighted top)
      ctx.beginPath();
      ctx.moveTo(headLen * 0.45, 0); // Snout tip (hotspot click point)
      ctx.lineTo(0, -headWidth * 0.5); // Upper brow
      ctx.lineTo(-headLen * 0.5, -headWidth * 0.4); // Skull base
      ctx.lineTo(-headLen * 0.2, 0); // Midline ridge
      ctx.closePath();
      ctx.fillStyle = 'rgba(240, 253, 250, 0.88)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 212, 170, 0.8)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Lower faceted jaw (shaded underside)
      ctx.beginPath();
      ctx.moveTo(headLen * 0.45, 0);
      ctx.lineTo(-headLen * 0.2, 0);
      ctx.lineTo(-headLen * 0.5, headWidth * 0.35);
      ctx.lineTo(0, headWidth * 0.45);
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 150, 125, 0.82)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 212, 170, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Swept-back celestial horns / crest
      ctx.beginPath();
      ctx.moveTo(-headLen * 0.2, -headWidth * 0.35);
      ctx.quadraticCurveTo(-headLen * 0.8, -headWidth * 0.8, -headLen * 1.1, -headWidth * 0.6);
      ctx.quadraticCurveTo(-headLen * 0.7, -headWidth * 0.3, -headLen * 0.4, -headWidth * 0.15);
      ctx.fillStyle = 'rgba(255, 184, 0, 0.75)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.9)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Glowing celestial eye (specular cyan glint)
      const eyeX = headLen * 0.05;
      const eyeY = -headWidth * 0.18;
      if (Number.isFinite(eyeX) && Number.isFinite(eyeY)) {
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 170, 0.6)';
        ctx.fill();
      }

      // Interactive ring pulse on hover/interactive
      if (cursorState === 'interactive') {
        const pulse = Math.sin(now * 0.008) * 3;
        const ringR = Math.max(1, 24 + pulse);
        if (Number.isFinite(ringR) && ringR > 0.1) {
          ctx.beginPath();
          ctx.arc(0, 0, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 212, 170, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      ctx.restore();

      // ── 4. Precise Pointer Hotspot ──
      if (Number.isFinite(targetX) && Number.isFinite(targetY)) {
        ctx.beginPath();
        ctx.arc(targetX, targetY, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(targetX, targetY, 4.0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 212, 170, 0.7)';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(animationId);
      document.documentElement.classList.remove('cc-on');
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onPointerLeave);
      document.removeEventListener('mouseenter', onPointerEnter);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999]"
      aria-hidden="true"
      role="presentation"
    />
  );
}
