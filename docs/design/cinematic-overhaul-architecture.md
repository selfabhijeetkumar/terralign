# TERRALIGN — Cinematic Design Overhaul
## Phase 3: Design Architecture Document

**Authorization:** `TERRALIGN-GOV-AUTH-003`  
**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind 3.4 · Three.js 0.187 · Zustand 5.x

---

## 1. Design Language: "Deep Space Instrument"

**Principle:** Every visual element is a precision instrument reading. Dark restraint, high contrast, sparse composition. No decorative glows, no gratuitous animations. When something pulses, it carries meaning.

**Reference synthesis:**
- `structured.money` → confident hierarchy, editorial wordmark
- `obsidianassembly.com` → dark restraint, negative space
- `museum.unesco.org` → spatial storytelling, guided discovery

**Anti-patterns to eliminate:**
- Pulsing animations on static decorative elements
- Cluttered icon clusters in nav
- Generic glassmorphism without purpose
- Overloaded HUD overlays at full opacity at all times

---

## 2. Color & Typography (Existing Tokens — Preserved)

All existing Tailwind tokens are retained. No new colors added.

```
space-bg:        #050811  (void)
space-surface:   #0A192F  (panel surface)
space-elevated:  #112240  (raised element)
space-border:    rgba(139,156,181,0.15)

accent-terrestrial: #00D4AA  (primary brand / Earth)
accent-lunar:       #1E90FF  (lunar context)
accent-martian:     #FF6B35  (Mars context)

text-primary:   #F8FAFC
text-secondary: #CBD5E1
text-muted:     #8B9CB5
```

**Typography refinements:**
- Display headings: `font-display` (Space Grotesk), tighten tracking to `-0.03em`
- Body: `font-sans` (Inter), consistent `text-sm` (14px) baseline
- Telemetry: `font-mono` (Space Mono), `tabular-nums` always on

---

## 3. Earth Globe Architecture

### Approach
Single `EarthGlobe` component using direct Three.js. Per-route instantiation (no shared renderer — matches existing TerrainCanvas pattern).

### Scene Design
```
Scene:
  - AmbientLight (0.15 intensity, cold white)
  - PointLight (sun position, right-top, 1.2 intensity)

Earth Sphere:
  - SphereGeometry(2.5, 64, 64)  — radius 2.5, smooth
  - MeshStandardMaterial — procedural vertex colors (ocean blue, land mass teal-grey)
  - Slow auto-rotation: 0.0008 rad/frame around Y axis

Atmosphere Rim:
  - SphereGeometry(2.62, 32, 32)
  - MeshBasicMaterial, transparent, side=BackSide
  - Color: #1E90FF at 0.08 opacity — subtle blue atmospheric glow

Site Markers:
  - 7 analog site positions projected via WGS84 → 3D sphere surface
  - Selected: SphereGeometry(0.06), accent-terrestrial glow
  - Others: SphereGeometry(0.04), accent-lunar dim
```

### WGS84 → Sphere Conversion
```ts
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}
```

### Fallback Strategy
If WebGL context creation fails, render a static SVG Earth placeholder with the site markers at their equirectangular positions (reuses DiscoveryMap SVG shell).

### Reduced-Motion Strategy
If `prefers-reduced-motion: reduce`, auto-rotation stops (`animationId` not requested). Globe renders static, interactive drag still works.

### Canvas Events
Globe container: `pointer-events: auto` — drag to rotate, no zoom on mission command (intentional simplicity).

---

## 4. Mission Command Layout Architecture

**Before (current):**
```
[TopNavBar - full width]
[main]
  [ActivitySelector | DiscoveryMap(SVG)]
  [CandidateSummaryDrawer]
```

**After (target):**
```
[TopNavBar - full width, refined]
[main - position:relative, starfield bg]
  [Globe - left 40%, hero height 100%]
  [Discovery Panel - right 60%]
    [ActivitySelector - compact]
    [Site Detail Panel - replaces SVG map on desktop]
  [CandidateSummaryDrawer - bottom dock, refined]
```

> Note: SVG map is kept for mobile (<lg) where globe takes full width. On desktop the globe IS the primary spatial interface.

---

## 5. Navigation Architecture

**TopNavBar refinements (non-breaking):**
- Remove `animate-ping` outer ring on brand dot (decorative, no meaning)
- Brand dot → static, slightly larger, no ping
- Nav tabs: remove `border-b-2` active indicator → use background highlight pill instead
- Icon cluster (3 buttons) → merge into single "SIGNAL" status dot
- Export button → keep (functional)
- Launch CTA → keep (functional), refine shadow

---

## 6. Star Field Background

CSS-only, no Three.js. `globals.css` keyframe:

```css
@keyframes starDrift {
  from { transform: translateY(0); }
  to   { transform: translateY(-4px); }
}
```

Implemented via `radial-gradient` stipple pattern at 0.03 opacity — invisible in low-motion mode.

---

## 7. Reduced-Motion & WebGL Failure

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Globe: wraps Three.js init in `try/catch`. On failure, renders `<GlobeFallback />` SVG component.

---

## 8. Implementation Sequence

| Step | File(s) | Action |
|------|---------|--------|
| 1 | `globals.css` | Add reduced-motion base, star-field keyframe, depth utility |
| 2 | `tailwind.config.ts` | Add `starfield` animation token |
| 3 | `TopNavBar.tsx` | Refine brand, nav, right section |
| 4 | `Shell.tsx` | Add starfield background layer |
| 5 | `EarthGlobe.tsx` (NEW) | Three.js globe + markers + fallback |
| 6 | `MissionCommandView.tsx` | Integrate globe; restructure layout |
| 7 | `ActivitySelector.tsx` | Elevated card items |
| 8 | `CandidateSummaryDrawer.tsx` | Refined styling |
| 9 | `TerrainStudioView.tsx` | Cinematic header + vignette |
| 10 | `RealityGapView.tsx` | Cinematic header + card/table refinements |
| 11 | `PortfolioOptimizerView.tsx` | Hero metric + table refinements |
| 12 | Verify: `pnpm build` exit 0 |  |
| 13 | Screenshots: before/after 4 viewports |  |

---

## 9. Bundle Budget Check

New additions:
- `EarthGlobe.tsx` — Three.js already installed; new scene adds ~0 kB (no new deps)
- CSS additions in `globals.css` — negligible

Expected impact: `/` page may increase by ~2–5 kB (additional Three.js scene init). Terrain page unchanged. All pages remain within budget.

