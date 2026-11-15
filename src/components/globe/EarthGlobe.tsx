/**
 * TERRALIGN — Photorealistic 3D Earth Planetary Environment
 * Standards: GSD v1.6.0 · Ponytail FULL (REUSE -> SIMPLIFY -> IMPLEMENT)
 *
 * Visual Craft:
 * - NASA Blue Marble 2048x1024 Albedo Map (Public Domain)
 * - NASA Specular Ocean Reflectance Map
 * - NASA Cloud Layer with Differential Orbital Rotation
 * - Atmospheric Fresnel Rayleigh Scattering Shell
 * - 7 Flagship Analog Sites with Real WGS84 Coordinates
 * - Smooth Camera Slerp / Glide to Selected Site
 * - Raycaster Pointer Interaction for Marker Hover and Lock
 * - Graceful Fallback for WebGL / Reduced-Motion
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { getAllAnalogs, getAnalogById } from '@/lib/analogs';
import { useSelectedSiteId, useMissionStore } from '@/store/useMissionStore';
import type { AnalogSite } from '@/types/analogs';

interface EarthGlobeProps {
  className?: string;
  interactive?: boolean;
  onSiteClick?: (site: AnalogSite) => void;
  showAllMarkers?: boolean;
  cameraDistance?: number;
}

const GLOBE_RADIUS = 2.8;

/** Convert WGS84 latitude/longitude to 3D Cartesian coordinates on sphere */
export function wgs84ToCartesian(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export function EarthGlobe({
  className,
  interactive = true,
  onSiteClick,
  showAllMarkers = true,
  cameraDistance = 7.8,
}: EarthGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const markerMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const frameRef = useRef<number>(0);

  const selectedSiteId = useSelectedSiteId();
  const selectSite = useMissionStore((s) => s.selectSite);
  const sites = getAllAnalogs();

  // Target camera orientation for smooth navigation
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, cameraDistance));
  const currentCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, cameraDistance));
  const isTransitioningRef = useRef<boolean>(false);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Fly camera to the active site coordinates
  const flyToSite = useCallback((siteId: string) => {
    const site = getAnalogById(siteId);
    if (!site) {
      targetCamPosRef.current.set(0, 1.2, cameraDistance);
      isTransitioningRef.current = true;
      return;
    }
    const sitePos = wgs84ToCartesian(site.coordinates.lat, site.coordinates.lng, GLOBE_RADIUS);
    // Camera sits along the normal from the site, backed out to inspection distance
    const inspectDist = 5.4;
    targetCamPosRef.current.copy(sitePos.clone().normalize().multiplyScalar(inspectDist));
    isTransitioningRef.current = true;
  }, [cameraDistance]);

  useEffect(() => {
    if (selectedSiteId) {
      flyToSite(selectedSiteId);
    }
  }, [selectedSiteId, flyToSite]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.copy(currentCamPosRef.current);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 2. Hardware WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Cinematic Directional Sunlight & Deep Space Rim Lighting
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.4);
    sunLight.position.set(12, 6, 10);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0a192f, 0.45);
    scene.add(ambientLight);

    // Deep space cold rim light
    const coldRimLight = new THREE.DirectionalLight(0x1e90ff, 0.8);
    coldRimLight.position.set(-10, -4, -8);
    scene.add(coldRimLight);

    // 4. Globe Parent Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 5. Texture Loading (NASA Public Domain)
    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('/textures/planets/earth_atmos.jpg');
    const specMap = textureLoader.load('/textures/planets/earth_specular.jpg');
    const cloudMap = textureLoader.load('/textures/planets/earth_clouds.png');

    earthMap.colorSpace = THREE.SRGBColorSpace;

    // 6. Earth Mesh
    const earthGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthMap,
      specularMap: specMap,
      specular: new THREE.Color(0x224466),
      shininess: 18,
      bumpScale: 0.05,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    globeGroup.add(earthMesh);

    // 7. Atmospheric Cloud Layer
    const cloudGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudMap,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      roughness: 1,
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    globeGroup.add(cloudMesh);
    cloudsMeshRef.current = cloudMesh;

    // 8. Atmospheric Glow Shell (Fresnel Rayleigh Scattering simulation)
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 48, 48);
    const atmosMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.05, 0.65, 0.95, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosMesh);

    // 9. Analog Site Markers — Precision Aerospace Targeting Reticles
    if (showAllMarkers) {
      markerMeshesRef.current.clear();
      sites.forEach((site) => {
        const sitePos = wgs84ToCartesian(site.coordinates.lat, site.coordinates.lng, GLOBE_RADIUS + 0.015);

        const markerContainer = new THREE.Group();
        markerContainer.position.copy(sitePos);
        markerContainer.lookAt(sitePos.clone().multiplyScalar(2));

        const isSel = site.id === selectedSiteId;
        const colorHex = isSel ? 0x00d4aa : 0x1e90ff;

        // Central targeting dot (refined, small radius 0.022)
        const pinGeo = new THREE.SphereGeometry(0.022, 16, 16);
        const pinMat = new THREE.MeshBasicMaterial({ color: colorHex });
        const pinMesh = new THREE.Mesh(pinGeo, pinMat);
        pinMesh.name = site.id;
        markerContainer.add(pinMesh);

        // Precision optical reticle ring
        const ringGeo = new THREE.RingGeometry(0.042, 0.052, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: isSel ? 0.9 : 0.4,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.name = `${site.id}-ring`;
        markerContainer.add(ringMesh);

        // Crosshair reticle tick marks
        const tickMat = new THREE.MeshBasicMaterial({
          color: colorHex,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: isSel ? 0.8 : 0.35,
        });
        const tickGeoH = new THREE.PlaneGeometry(0.028, 0.006);
        const tickGeoV = new THREE.PlaneGeometry(0.006, 0.028);

        const tickL = new THREE.Mesh(tickGeoH, tickMat);
        tickL.position.x = -0.068;
        markerContainer.add(tickL);

        const tickR = new THREE.Mesh(tickGeoH, tickMat);
        tickR.position.x = 0.068;
        markerContainer.add(tickR);

        const tickT = new THREE.Mesh(tickGeoV, tickMat);
        tickT.position.y = 0.068;
        markerContainer.add(tickT);

        const tickB = new THREE.Mesh(tickGeoV, tickMat);
        tickB.position.y = -0.068;
        markerContainer.add(tickB);

        // Targeted aerospace corner brackets for active inspected site
        if (isSel) {
          const reticleGeo = new THREE.RingGeometry(0.09, 0.104, 4, 1);
          const reticleMat = new THREE.MeshBasicMaterial({
            color: 0x00d4aa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
          });
          const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
          reticleMesh.rotation.z = Math.PI / 4;
          markerContainer.add(reticleMesh);
        }

        globeGroup.add(markerContainer);
        markerMeshesRef.current.set(site.id, markerContainer);
      });
    }

    // 10. Interactive Mouse / Touch Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDragging = true;
      isTransitioningRef.current = false; // User manual drag overrides camera fly-to
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && globeGroupRef.current) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        globeGroupRef.current.rotation.y += dx * 0.005;
        globeGroupRef.current.rotation.x = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, globeGroupRef.current.rotation.x + dy * 0.005)
        );
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasClick = Math.abs(e.clientX - prevMouseX) < 4 && Math.abs(e.clientY - prevMouseY) < 4;
      isDragging = false;

      if (wasClick && interactive) {
        // Raycast against site markers
        raycaster.setFromCamera(mouse, camera);
        const markerMeshes: THREE.Object3D[] = [];
        markerMeshesRef.current.forEach((grp) => {
          grp.children.forEach((c) => markerMeshes.push(c));
        });

        const intersects = raycaster.intersectObjects(markerMeshes, true);
        if (intersects.length > 0) {
          const hitName = intersects[0].object.name.replace('-ring', '');
          const clickedSite = getAnalogById(hitName);
          if (clickedSite) {
            selectSite(clickedSite.id);
            if (onSiteClick) onSiteClick(clickedSite);
          }
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // 11. Render Animation Loop (60 FPS with Damped Slerp)
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slow planetary rotation when idle and not reduced-motion
      if (!isDragging && !prefersReducedMotion && globeGroupRef.current && !isTransitioningRef.current) {
        globeGroupRef.current.rotation.y += 0.00045;
      }

      // Differential cloud drift
      if (cloudsMeshRef.current && !prefersReducedMotion) {
        cloudsMeshRef.current.rotation.y += 0.0007;
      }

      // Smooth camera interpolation toward target
      if (isTransitioningRef.current && cameraRef.current) {
        currentCamPosRef.current.lerp(targetCamPosRef.current, 0.05);
        cameraRef.current.position.copy(currentCamPosRef.current);
        cameraRef.current.lookAt(0, 0, 0);

        if (currentCamPosRef.current.distanceTo(targetCamPosRef.current) < 0.05) {
          isTransitioningRef.current = false;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', handleResize);

      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
      cloudGeo.dispose();
      cloudMat.dispose();
      atmosGeo.dispose();
      atmosMat.dispose();
    };
  }, [sites, showAllMarkers, interactive, prefersReducedMotion, selectedSiteId, selectSite, onSiteClick, cameraDistance]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full cursor-grab active:cursor-grabbing select-none relative ${className ?? ''}`}
      aria-label="Interactive 3D Earth Planetary Environment"
      role="region"
    />
  );
}
