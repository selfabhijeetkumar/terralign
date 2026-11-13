# TERRALIGN — Product Lead Scope Authorization Request
## Phase 3, Wave 3.1, Task 3.1.3: Mission State Management (`useMissionStore.ts`)

**Project:** TERRALIGN — Where Earth Meets Other Worlds  
**Workspace:** `C:\NASA SPACE HACKATHON`  
**Milestone:** TERRALIGN v1.0 Hackathon MVP  
**Phase:** Phase 3 — Wave 3.1 (Foundation & Layout)  
**Task ID:** Task 3.1.3 — Mission State Management (`useMissionStore.ts`)  
**Document ID:** `TERRALIGN-GOV-AUTH-REQ-3.1.3`  
**Document Path:** `docs/governance/task-3.1.3-authorization-request.md`  
**Date:** 13 November 2026  
**Methodology:** GSD v1.6.0 (`Plan Before Build` · `State Is Sacred` · `Verify Empirically`)  
**Governance:** Ponytail FULL Mode (`REUSE → SIMPLIFY → IMPLEMENT`)  
**Task 3.1.2 Status:** `RECOMMENDED FOR CLOSURE` (Verified with non-blocking warnings documented)  
**Authorization Status:** **PENDING PRODUCT LEAD WRITTEN APPROVAL**  
**Implementation Lock:** **STRICTLY LOCKED · ZERO CODE PERMITTED PRIOR TO SIGN-OFF**

---

## 1. Task Objective

To establish the unified, reactive client-side mission state management architecture for TERRALIGN by implementing `src/store/useMissionStore.ts` and associated TypeScript definitions (`src/types/store.ts`).

This store governs reactive state synchronization across the four core screens:
1. Screen 01: Global Mission Command (target planetary body, 9 surface tasks, scientific filters).
2. Screen 02: Dual-View 3D Terrain Studio (synchronized camera orientation, sun elevation $0.0^\circ\text{--}5.0^\circ$, azimuth, contour/hillshade overlays).
3. Screen 03: Analog Reality Gap (active analog-target pair, selected gap axis, simulator offset adjustments).
4. Screen 04: Multi-Site Portfolio Optimizer ($k \in \{2, 3\}$ rehearsal size, active domain filter, RVM selection).

---

## 2. Exact Implementation Scope & Planned Files

### 2.1 Planned Source Files
1. [`src/types/store.ts`](file:///c:/NASA SPACE HACKATHON/src/types/store.ts):
   - Strict TypeScript interfaces for `TerralignAppState`, `MissionSlice`, `SelectionSlice`, `TerrainSlice`, and `PortfolioSlice`.
   - Domain union types: `TargetBody ('moon' | 'mars')`, `ColorMode ('hypsometric' | 'slope' | 'aspect' | 'raw')`, `DomainFilter ('all' | 'mechanical' | 'optical' | 'geochemical' | 'environmental')`.
2. [`src/store/useMissionStore.ts`](file:///c:/NASA SPACE HACKATHON/src/store/useMissionStore.ts):
   - Centralized Zustand store created with `create<TerralignAppState>()`.
   - Granular atomic action dispatchers (`setTargetBody`, `setActiveActivity`, `selectSite`, `setSunLighting`, `setCameraTransform`, `setPortfolioK`).
   - Clean selector hooks to ensure zero unnecessary re-renders across 60 FPS WebGL viewports.

### 2.2 Proposed Dependency Addition & Justification
- **Package:** `zustand` (version `^5.0.3`)
- **Package Manager Command:** `pnpm add zustand`
- **Bundle Impact:** $\approx 1.1\text{ KB}$ minified and gzipped (zero sub-dependencies).
- **Ponytail FULL Evaluation & Architecture Justification:**
  - *Standard Context Evaluation:* Standard React Context triggers full subtree re-renders across all consumers on any state update. In Wave 3.3, real-time lighting adjustments ($0.0^\circ\text{--}5.0^\circ$ at 60 Hz) would cause severe render thrashing in the dual WebGL canvas and UI components.
  - *Zustand Selection:* Formally specified in canonical architecture (`docs/architecture/data-flow.md` and `docs/architecture/system-architecture.md`). Zustand provides slice-level subscriptions without wrapping the application in context providers, maintaining Next.js 15 App Router server-client boundaries cleanly.
  - *Budget Headroom:* Adding $1.1\text{ KB}$ to the current measured wire payload of $109.17\text{ KB}$ results in $\approx 110.27\text{ KB}$, preserving a robust **$69.73\text{ KB}\ (38.74\%)$** safety margin under the $< 180\text{ KB}$ First Load JS ceiling.

---

## 3. Detailed Acceptance Criteria

1. **State Shape Compliance:** Matches the canonical Phase 2 architecture in `docs/architecture/data-flow.md` (Section 2) with zero omissions.
2. **Type Safety:** Strict TypeScript compilation with `pnpm exec tsc --noEmit` exiting with code 0 (zero `any`, zero warnings).
3. **Production Build:** `pnpm build` succeeds with zero errors, generating all 7 static pages with First Load JS $< 112\text{ kB}$ (well within $< 180\text{ KB}$).
4. **Selective Reactivity:** Components subscribing to `state.terrain.sunElevationDeg` re-render during sun adjustments without causing re-renders in `TopNavBar` or `CandidateSummaryDrawer`.
5. **Initial State Integrity:** Default values match canonical science:
   - `targetBody`: `"moon"`
   - `activeActivity`: `"rover_terramechanics"`
   - `selectedSiteId`: `"cinder-lake"`
   - `activePlanetaryFeature`: `"shackleton-rim"`
   - `sunElevationDeg`: `2.3`
   - `targetK`: `3`
   - `fidelityThreshold`: `0.70`

---

## 4. Verification Strategy

1. **Static Analysis:** Strict TypeScript check (`pnpm exec tsc --noEmit`).
2. **Hermetic Compilation:** Production Next.js build (`pnpm build`).
3. **Slice Isolation Test:** Verification of atomic state mutators via unit test script or isolated verification runner.
4. **Bundle Verification:** Direct byte measurement of client chunks using `GZipStream` to confirm wire payload remains $< 112\text{ kB}$.

---

## 5. Explicit Scope Boundaries & Gated Exclusions

The following activities are **STRICTLY PROHIBITED** under Task 3.1.3:
- Wave 3.2 cartographic components (`MapLibre GL`, `CandidateSummaryDrawer`).
- Wave 3.3 3D WebGL canvases (`Three.js`, `@react-three/fiber`, heightmap shaders).
- Wave 3.4 submodular algorithm computation or PDF/dossier export.
- Remote database connections or Supabase client initialization.
- Backend API route creation (`/api/analogs`, `/api/suitability`).

---

## 6. Risks, Mitigations & Rollback Protocol

| Risk Identified | Severity | Proposed Mitigation Strategy |
|:---|:---:|:---|
| **SSR Hydration Mismatch:** Server and client reading disparate default state. | Low | Initialize store with deterministic static literals matching default route props. |
| **State Bloat:** Storing raw raster/elevation mesh data in Zustand. | High | Prohibited by design. Large binary datasets reside in GPU memory / TypedArrays outside the React state tree. |
| **Bundle Regressions:** Adding unexpected helper libraries (`immer`, `middleware`). | Medium | Strict vanilla Zustand store; zero middleware or extra dependencies installed. |

### Rollback Protocol:
If Task 3.1.3 execution encounters unresolvable errors or bundle regressions:
1. Remove `zustand` via `pnpm remove zustand`.
2. Delete `src/store/useMissionStore.ts` and `src/types/store.ts`.
3. Re-verify clean baseline state with `pnpm exec tsc --noEmit` and `pnpm build`.

---

## 7. Required Governance Documentation Updates Upon Completion

Upon successful execution and verification of Task 3.1.3:
1. Update `.gsd/STATE.md` (mark Wave 3.1 complete, advance position to Wave 3.2).
2. Update `.gsd/ROADMAP.md` (mark Task 3.1.3 complete).
3. Record `[DEC-016]` in `.gsd/DECISIONS.md`.
4. Update `HANDOFF.md` and `AI-CONTEXT.md`.
5. Author `docs/governance/task-3.1.3-execution-report.md`.

---

## 8. Governance Mandates & No-Implied-Approval Declaration

1. **Scope Exclusivity:** This authorization request covers **ONLY Task 3.1.3**.
2. **Pre-Execution Lock:** Task 3.1.3 implementation cannot begin before explicit written Product Lead approval is received.
3. **Subsequent Waves Locked:** Wave 3.2 (Task 3.2.1) and Wave 3.3 (Task 3.3.1) remain strictly locked. All subsequent tasks require their own applicable scope authorizations.
4. **No Implied Approval:** No implied approval is granted by preparing or presenting this document.

---

## 9. Formal Product Lead Authorization Statement Template

*(To be reviewed, signed, and issued by Product Lead Abhijeet Kumar prior to execution)*

```text
================================================================================
TERRALIGN — FORMAL SCOPE AUTHORIZATION: WAVE 3.1, TASK 3.1.3
================================================================================

"I, Abhijeet Kumar, acting as the authorized Product Lead for TERRALIGN,
have reviewed the Task 3.1.2 Final Verification and Closure Report and the
Task 3.1.3 Architecture Readiness Assessment.

I hereby formally authorize the execution of Wave 3.1, Task 3.1.3:
  - Scope: Implementation of src/store/useMissionStore.ts and src/types/store.ts
  - Approved Dependency: zustand (^5.0.3)
  - Authorized Branch: master
  - Stop Condition: Task 3.1.3 implementation and verification ONLY.
    Wave 3.2 remains strictly locked pending separate review."

Authorized by: Abhijeet Kumar, Product Lead
Date: [ AUTHORIZATION DATE ]
Signature Reference: [ PRODUCT LEAD CONFIRMATION ]
================================================================================
```

---

*Document prepared by the TERRALIGN Engineering & Architecture Team.*  
*Status: Awaiting Product Lead Sign-Off · Implementation Prohibited Prior to Approval*
