/**
 * TERRALIGN 2.0 — COSMIC ASCENSION
 * Procedural 3D Cosmic Environment Engine
 *
 * Single shared WebGLRenderer rendering continuous 3D deep-space atmosphere:
 * - 3-depth starfield with GPU shader twinkle (zero per-frame CPU vertex updates)
 * - Baked procedural nebula texture with slow drift
 * - Procedural planetary horizon with atmospheric Rayleigh scattering rim
 * - Orbital arcs & geometry
 * - Cosmic dust layer
 * - Volumetric light ray planes
 * - Damped parallax driven by scroll and pointer
 * - Clean WebGL lifecycle & memory disposal
 */

import * as THREE from 'three';
import { createPrng } from './seededPrng';
import type { CosmicQualityTier, CosmicRouteProfileId } from './cosmicConfig';
import { ROUTE_PROFILES } from './cosmicConfig';

export class CosmicScene {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
  private starMaterials: THREE.ShaderMaterial[] = [];
  private dustMaterial: THREE.PointsMaterial | null = null;
  private nebulaMesh: THREE.Mesh | null = null;
  private planetGroup: THREE.Group = new THREE.Group();
  private orbitalGroup: THREE.Group = new THREE.Group();
  private lightRayGroup: THREE.Group = new THREE.Group();

  private isPaused: boolean = false;
  private isDestroyed: boolean = false;
  private currentTier: CosmicQualityTier = 'high';
  private currentProfileId: CosmicRouteProfileId = 'base';
  private time: number = 0;

  // Base camera position
  private targetCameraY: number = 0;
  private targetCameraX: number = 0;

  constructor() {
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
  }

  public init(canvas: HTMLCanvasElement, width: number, height: number, tier: CosmicQualityTier, profileId: CosmicRouteProfileId): boolean {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        stencil: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tier === 'high' ? 1.75 : tier === 'medium' ? 1.5 : 1.25));
      this.renderer.setClearColor(0x050811, 0);

      this.currentTier = tier;
      this.currentProfileId = profileId;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.buildScene();
      return true;
    } catch (err) {
      console.warn('[COSMIC ASCENSION] WebGL initialization failed; falling back to CSS:', err);
      return false;
    }
  }

  private buildScene(): void {
    const prng = createPrng(42);
    const profile = ROUTE_PROFILES[this.currentProfileId] || ROUTE_PROFILES.base;

    // Star budget per tier
    const starCounts = this.currentTier === 'high' ? [5000, 2500, 1000] : this.currentTier === 'medium' ? [2500, 1000, 300] : [1000, 500, 0];
    const dustCount = this.currentTier === 'high' ? 450 : this.currentTier === 'medium' ? 180 : 30;

    // 1. Three-depth starfield
    const depthRanges = [
      { minZ: -1200, maxZ: -600, size: 1.2, speed: 0.5 }, // Far
      { minZ: -600, maxZ: -200, size: 1.8, speed: 0.8 },  // Mid
      { minZ: -200, maxZ: 20, size: 2.6, speed: 1.2 },    // Near
    ];

    depthRanges.forEach((range, idx) => {
      const count = Math.round(starCounts[idx] * profile.starDensityMultiplier);
      if (count <= 0) return;
      const stars = this.createStarLayer(count, range.minZ, range.maxZ, range.size, range.speed, prng);
      this.scene.add(stars);
    });

    // 2. Procedural Baked Nebula
    this.nebulaMesh = this.createNebula(prng, profile);
    if (this.nebulaMesh) {
      this.scene.add(this.nebulaMesh);
    }

    // 3. Planet / Horizon with Atmospheric Rim
    this.createPlanetSystem(profile, prng);
    this.scene.add(this.planetGroup);

    // 4. Orbital Geometry
    if (profile.orbitDensity > 0) {
      this.createOrbitalRings(profile.orbitDensity, prng);
      this.scene.add(this.orbitalGroup);
    }

    // 5. Cosmic Dust Layer
    if (dustCount > 0) {
      const dust = this.createCosmicDust(dustCount, prng);
      this.scene.add(dust);
    }

    // 6. Volumetric Light Ray Planes
    if (profile.lightRays && this.currentTier !== 'low') {
      this.createLightRays(prng);
      this.scene.add(this.lightRayGroup);
    }
  }

  private createStarLayer(count: number, minZ: number, maxZ: number, baseSize: number, speed: number, prng: () => number): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinkleParams = new Float32Array(count * 2); // speed, phase

    // Color palettes: 80% cool white-cyan, 15% electric blue, 5% warm amber
    for (let i = 0; i < count; i++) {
      const x = (prng() - 0.5) * 1400;
      const y = (prng() - 0.5) * 900;
      const z = minZ + prng() * (maxZ - minZ);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const temp = prng();
      if (temp > 0.95) {
        // Warm amber star
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.72;
        colors[i * 3 + 2] = 0.35;
      } else if (temp > 0.8) {
        // Lunar blue star
        colors[i * 3] = 0.25;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 1.0;
      } else {
        // Cool crisp white-cyan star
        colors[i * 3] = 0.85;
        colors[i * 3 + 1] = 0.96;
        colors[i * 3 + 2] = 1.0;
      }

      sizes[i] = baseSize * (0.6 + prng() * 0.8);
      twinkleParams[i * 2] = speed * (0.8 + prng() * 0.6);
      twinkleParams[i * 2 + 1] = prng() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('twinkle', new THREE.BufferAttribute(twinkleParams, 2));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec2 twinkle;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;

        void main() {
          vColor = color;
          float t = uTime * twinkle.x + twinkle.y;
          float factor = 0.65 + 0.35 * sin(t);
          vAlpha = factor;

          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * factor * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float radial = smoothstep(0.5, 0.0, dist);
          gl_FragColor = vec4(vColor, vAlpha * radial);
        }
      `,
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    this.starMaterials.push(material);
    return new THREE.Points(geometry, material);
  }

  private createNebula(prng: () => number, profile: typeof ROUTE_PROFILES.base): THREE.Mesh | null {
    // Bake soft procedural nebula into a 256x256 offscreen canvas
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, size, size);

    // Multi-center radial soft clouds
    const colors = [
      'rgba(0, 212, 170, 0.12)',  // Cyan
      'rgba(30, 144, 255, 0.15)', // Blue
      'rgba(147, 51, 234, 0.08)', // Minor violet accent
    ];

    colors.forEach((c) => {
      const cx = size * (0.3 + prng() * 0.4);
      const cy = size * (0.3 + prng() * 0.4);
      const r = size * (0.4 + prng() * 0.3);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, c);
      grad.addColorStop(0.6, c.replace(/[\d.]+\)$/, '0.04)'));
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const geo = new THREE.PlaneGeometry(900, 600);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.65 * (1 - profile.readabilityDim),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 40, -450);
    return mesh;
  }

  private createPlanetSystem(profile: typeof ROUTE_PROFILES.base, prng: () => number): void {
    if (!profile.planetVisibility) return;

    // Curved horizon atmosphere arc at bottom-right viewport
    const radius = 180;
    const geometry = new THREE.SphereGeometry(radius, 48, 24);

    // Atmospheric rim shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(profile.palette.primary) },
        uRimColor: { value: new THREE.Color(profile.palette.secondary) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uRimColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          fresnel = pow(fresnel, 3.2);

          vec3 col = mix(uColor, uRimColor, fresnel * 0.7);
          gl_FragColor = vec4(col, fresnel * 0.45);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(220, -180, -280);
    this.planetGroup.add(planet);

    // Distant small body (Moon or Mars)
    const smallGeo = new THREE.SphereGeometry(18, 24, 16);
    const smallColor = profile.planetType === 'mars' ? 0xff6b35 : 0xcbd5e1;
    const smallMat = new THREE.MeshBasicMaterial({
      color: smallColor,
      transparent: true,
      opacity: 0.45,
    });
    const smallBody = new THREE.Mesh(smallGeo, smallMat);
    smallBody.position.set(-160, 90, -320);
    this.planetGroup.add(smallBody);
  }

  private createOrbitalRings(count: number, prng: () => number): void {
    const material = new THREE.LineBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
    });

    for (let c = 0; c < count; c++) {
      const radiusX = 140 + c * 80 + prng() * 30;
      const radiusY = radiusX * (0.35 + prng() * 0.15);
      const points: THREE.Vector3[] = [];
      const segments = 64;

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radiusX, Math.sin(theta) * radiusY, -300 - c * 50));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const ring = new THREE.LineLoop(geo, material);
      ring.rotation.x = 0.8 + prng() * 0.4;
      ring.rotation.z = (prng() - 0.5) * 0.6;
      this.orbitalGroup.add(ring);
    }
  }

  private createCosmicDust(count: number, prng: () => number): THREE.Points {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (prng() - 0.5) * 700;
      positions[i * 3 + 1] = (prng() - 0.5) * 500;
      positions[i * 3 + 2] = -150 + (prng() - 0.5) * 200;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.dustMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.8,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    return new THREE.Points(geo, this.dustMaterial);
  }

  private createLightRays(prng: () => number): void {
    const geo = new THREE.PlaneGeometry(600, 180);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00d4aa,
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 2; i++) {
      const ray = new THREE.Mesh(geo, mat);
      ray.position.set(-100 + i * 150, 60 - i * 40, -350);
      ray.rotation.z = -0.45 + (prng() - 0.5) * 0.2;
      this.lightRayGroup.add(ray);
    }
  }

  public render(dt: number, scrollProgress: number, pointerX: number, pointerY: number): void {
    if (this.isPaused || this.isDestroyed || !this.renderer) return;

    this.time += dt;

    // Update star twinkling
    for (const mat of this.starMaterials) {
      mat.uniforms.uTime.value = this.time;
    }

    // Nebula slow drift
    if (this.nebulaMesh) {
      this.nebulaMesh.position.x = Math.sin(this.time * 0.05) * 25;
      this.nebulaMesh.rotation.z = this.time * 0.008;
    }

    // Slow orbital rotation
    this.orbitalGroup.rotation.z = this.time * 0.012;

    // Camera damped parallax
    this.targetCameraY = -scrollProgress * 40 + pointerY * 8;
    this.targetCameraX = pointerX * 12;

    this.camera.position.x += (this.targetCameraX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetCameraY - this.camera.position.y) * 0.05;
    this.camera.lookAt(0, 0, -300);

    this.renderer.render(this.scene, this.camera);
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
  }

  public setProfile(profileId: CosmicRouteProfileId): void {
    if (this.currentProfileId === profileId) return;
    this.currentProfileId = profileId;
    // Tear down dynamic meshes and rebuild for route profile
    this.clearMeshGroup(this.planetGroup);
    this.clearMeshGroup(this.orbitalGroup);
    this.clearMeshGroup(this.lightRayGroup);

    const prng = createPrng(profileId.length * 17);
    const profile = ROUTE_PROFILES[profileId] || ROUTE_PROFILES.base;

    this.createPlanetSystem(profile, prng);
    if (profile.orbitDensity > 0) {
      this.createOrbitalRings(profile.orbitDensity, prng);
    }
    if (profile.lightRays && this.currentTier !== 'low') {
      this.createLightRays(prng);
    }
  }

  public resize(width: number, height: number): void {
    if (!this.renderer || width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private clearMeshGroup(group: THREE.Group): void {
    while (group.children.length > 0) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    this.isPaused = true;

    // Dispose star materials
    for (const mat of this.starMaterials) {
      mat.dispose();
    }
    this.starMaterials = [];

    // Dispose dust
    if (this.dustMaterial) {
      this.dustMaterial.dispose();
      this.dustMaterial = null;
    }

    // Dispose groups
    this.clearMeshGroup(this.planetGroup);
    this.clearMeshGroup(this.orbitalGroup);
    this.clearMeshGroup(this.lightRayGroup);

    // Clear and dispose all scene objects
    while (this.scene.children.length > 0) {
      const obj = this.scene.children[0] as THREE.Mesh;
      this.scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else {
          obj.material.dispose();
        }
      }
    }

    // Dispose renderer and force hardware WebGL context release
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      const dom = this.renderer.domElement;
      if (dom && dom.parentElement) {
        // Clear canvas dimensions to release backing store buffer
        dom.width = 1;
        dom.height = 1;
      }
      this.renderer = null;
    }
  }
}
