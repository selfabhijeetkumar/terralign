# TERRALIGN — Cinematic Design Overhaul
## Phase 2: Design Gap Matrix

**Authorization:** `TERRALIGN-GOV-AUTH-003`  
**Audit Basis:** Phase 1 read-only inspection (complete, 14 November 2026)  
**Branch:** `master` @ `b9f39f8`

---

## Current State vs Target State

### SHELL & NAVIGATION

| Element | Current State | Gap | Target State |
|---------|--------------|-----|--------------|
| `Shell.tsx` layout | Flex column, TopNavBar + main | Adequate structure | Keep structure; add cinematic depth layer below nav |
| `TopNavBar` brand | Pulsing teal dot + "TERRALIGN" wordmark | Generic HUD | Refined logotype; remove ping animation; cleaner separator |
| `TopNavBar` nav links | Small text, underline-active, icon+label | Functional but dense | Cleaner tab style; subtle glow on active; reduce visual noise |
| `TopNavBar` right section | 3 icon buttons + Export + Launch CTA | Cluttered | Simplify to status indicator + Export + focused CTA |
| `globals.css` | Minimal base styles, glass-panel utility | No depth tokens, no motion defaults | Add `prefers-reduced-motion` base, depth layering, smooth focus rings |

### SCREEN 01 — MISSION COMMAND (`/`)

| Element | Current State | Gap | Target State |
|---------|--------------|-----|--------------|
| Background | `#050811` flat dark | No spatial depth | Star field particle background (CSS-only, no Three.js) |
| **Globe** | **ABSENT** | **Critical: no planetary Earth presence** | **Interactive Three.js Earth globe — dominant hero element** |
| Map (DiscoveryMap) | SVG equirectangular, stylized continent outlines | 2D flat, minimal cartographic quality | Transform map into secondary discovery layer under globe; OR replace map region with globe + keep map as supplementary panel |
| Activity Selector | Left sidebar, 9 activities, text list | Functional, minimal visual weight | Elevated cards, mission-category grouping, cleaner active state |
| Candidate Summary Drawer | Bottom dock, telemetry metrics | Adequate | Refine typography, spacing, metric display precision |
| HUD overlays | Several absolute-positioned panels | Some redundancy | Consolidate; keep TARGET LOCK + coordinates; remove redundant items |

### SCREEN 02 — TERRAIN STUDIO (`/terrain`)

| Element | Current State | Gap | Target State |
|---------|--------------|-----|--------------|
| Dual viewport header | Teal label + site names | Small, low contrast | Cinematic header with site elevation badge |
| `TerrainCanvas` HUD | Absolute overlays (site label, sun elev, scale) | Fine-grained, dense | Subtle: retain data, reduce opacity when not interacting |
| `TerrainControls` | Right panel | Not yet seen fully | Review; ensure refined styling matches screen tone |
| Background | `#050811` | Adequate | Retain; add vignette gradient at viewport edges |

### SCREEN 03 — REALITY GAP (`/reality-gap`)

| Element | Current State | Gap | Target State |
|---------|--------------|-----|--------------|
| Header section | "SCREEN 03 // ARG DIAGNOSTIC" breadcrumb | Standard | Cinematic large-type intro; retain all functional elements |
| ARG metric card | Large number + badge + formula | Visually heavy border | Cleaner card, elevated shadow, formula in monospace block |
| 6-axis grid | 3-col grid, cards with progress bars | Adequate | Retain grid; refine card shadow, hover state, progress bar glow |
| Compensation table | Standard table | Minimal visual treatment | Zebra striping + status pill glow on hover |
| Navigation footer | ← prev / → next | Small text | Keep; slightly larger target area |

### SCREEN 04 — PORTFOLIO OPTIMIZER (`/portfolio`)

| Element | Current State | Gap | Target State |
|---------|--------------|-----|--------------|
| Header | Standard h1 + breadcrumb | Same pattern | Cinematic intro with coverage percentage hero |
| Portfolio site cards | Grid cards | Not yet fully seen | Elevated, site-identity color accent |
| RVM table | Full 30-row table | Dense, monospace | Retain all data; refine row hover, status pill glow |
| Coverage metric | 78.3% displayed | Adequate | Hero-size metric; animated progress ring |

---

## Critical Gaps Summary

### P0 — Must Fix (Breaking Visual Promise)
1. **No Earth globe on Mission Command** — This is the primary cinematic promise of the prompt
2. **Flat `#050811` background on all screens** — Zero depth, no spatial atmosphere

### P1 — High Impact
3. **TopNavBar visual density** — Too many elements competing; needs hierarchy
4. **Activity Selector styling** — Plain list items need card elevation
5. **Screen-to-screen tone inconsistency** — Each screen has slightly different spacing, font sizes

### P2 — Polish
6. **Canvas HUD opacity** — Overlays always at full opacity; should fade when idle
7. **Responsive breakpoint refinement** — Mobile experience needs spacing review
8. **Missing `prefers-reduced-motion`** — No `globals.css` rule for animation reduction
9. **Focus ring inconsistency** — Some elements use `ring-accent-terrestrial`, some custom

---

## Technical Constraints Confirmed

| Constraint | Status |
|-----------|--------|
| Direct Three.js only (no @react-three/fiber) | Confirmed — React 19 incompatibility |
| No GSAP | Confirmed — not installed |
| No external tile services | Confirmed — SVG map is offline |
| Zustand 5.x for all state | Confirmed |
| Tailwind 3.4 (not v4) | Confirmed |
| Next.js 15 App Router | Confirmed |
| `next.config.ts` is minimal | Confirmed — no special flags |
| View Transitions API | NOT enabled — skip |
| Budget: < 180 kB First Load JS | Enforced (terrain ~264 kB allowed) |
| No WebGL context sharing across routes | Each route creates its own renderer — consistent with current TerrainCanvas pattern |

---

## Implementation Priority Order

1. `globals.css` — Add motion preferences, depth tokens, focus ring standard
2. `tailwind.config.ts` — Add depth shadow tokens, star-field animation keyframe
3. `Shell.tsx` — Add cinematic depth layer (star-field CSS)
4. `TopNavBar.tsx` — Simplify; refine brand + nav + right section
5. `src/components/globe/EarthGlobe.tsx` — New: Three.js Earth globe (sphere + atmosphere rim + site markers)
6. `MissionCommandView.tsx` — Integrate globe as hero; reposition map as secondary
7. `ActivitySelector.tsx` — Card-elevated activity items
8. `CandidateSummaryDrawer.tsx` — Refine drawer styling
9. `TerrainStudioView.tsx` — Cinematic header; vignette on canvases
10. `RealityGapView.tsx` — Cinematic header; refine cards/table
11. `PortfolioOptimizerView.tsx` — Hero coverage metric; refine table
12. Before/after screenshots at 4 viewports for all 4 screens

