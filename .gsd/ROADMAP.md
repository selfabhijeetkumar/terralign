---
milestone: "TERRALIGN v1.0 Hackathon MVP"
version: "1.0.0"
updated: "2026-11-12T01:35:00+05:30"
---

# TERRALIGN Project Roadmap

> **Milestone Progress:** 60.0% Complete (3 of 5 Phases Complete: Phase 0, Phase 1, Phase 2)  
> **Phase 2 Status:** ✅ Complete, Audited & Verified (Stitch Prototypes, Specs & Architecture Finalized)  
> **Active Position:** Phase 2 → Phase 3 Approval Gate (Awaiting Product-Lead Authorization)  
> **Methodology:** GSD v1.6.0 · **Governance:** Ponytail FULL Mode

---

## Must-Haves (from SPEC.md)

- [x] **FR-1**: Mission-Specific Analog Suitability Engine (9 Operational Activities + 1 Portfolio Framework).
- [x] **FR-2**: Flagship Analog Landscape Knowledge Base (7 verified global sites with NASA/USGS DOIs).
- [x] **FR-3**: Quantified 6-Axis Analog Reality Gap (ARG) Panel & Compensation Guide.
- [x] **FR-4 Design**: Interactive 3D Terrain & Extreme Lunar Lighting Simulator (Design & Component Contract Finalized).
- [x] **FR-5 Design**: Multi-Site Rehearsal Portfolio Generator (Combinatorial Set-Cover Design & RVM Finalized).
- [x] **FR-6 Design**: Candidate Discovery & Novelty Classifier (Cartographic Map & Filter Design Finalized).
- [x] **FR-7 Design**: Digital Mission Planning Dossier Export (Export Contract Finalized).

---

## Phase Breakdown

### Phase 0: Environment & Project Intelligence Audit
- **Status:** ✅ Complete
- **Objective:** Discover environment capabilities, verify toolchain (Stitch, Supabase, Context7, CodeRabbit), activate Ponytail FULL mode, initialize Git, and establish permanent Prompt Archive.
- **Key Deliverables:**
  - `TERRALIGN-PHASE0-AUDIT.md` (26 KB environment inventory).
  - Git repository initialized with comprehensive multi-stack `.gitignore`.
  - CodeRabbit plugin installed and verified.
  - `TERRALIGN-PROMPT-ARCHIVE/` established with `PRM-001` through `PRM-006` archived verbatim.

---

### Phase 1: Research, Specification & Problem Definition
- **Status:** ✅ Complete & Independently Verified
- **Objective:** Evidence-backed scientific research, comparative planetary physics, dataset feasibility, competitive differentiation, finalized baseline product specification, and independent quality review.
- **Depends on:** Phase 0
- **Key Deliverables:**
  - `docs/research/` 12-document comprehensive research series (audited, cited & reconciled).
  - Evidence ledger verifying all 7 analog sites against primary NASA/USGS literature.
  - Domain count aligned to 9 operational activities + 1 portfolio framework (10 total domains).
  - `.gsd/SPEC.md` marked `BASELINE FINALIZED` with documented assumptions.
  - `.gsd/ROADMAP.md`, `.gsd/STATE.md`, `.gsd/DECISIONS.md`.
  - `PROJECT_RULES.md`, `AI-CONTEXT.md`, `HANDOFF.md` IDE-independent continuity framework.
  - Verbatim archival of Phase 1 prompts (`PRM-101`, `PRM-102`, and `PRM-103`).

---

### Phase 2: Product Design, Architecture & Stitch Prototyping
- **Status:** ✅ Complete & Verified
- **Objective:** Establish the visual design system via Stitch MCP, generate high-fidelity UI screens, define Three.js 3D terrain component contracts, and formalize Next.js application architecture.
- **Depends on:** Phase 1
- **Key Deliverables:**
  - Stitch Project `projects/6700412806043990148` & Design System `assets/14949629949320429238` ("TERRALIGN Dark Space").
  - 4 High-fidelity generated screens with verified HTML code and PNG screenshots in `docs/design/stitch/`.
  - `docs/design/` (8 design documents covering design system, IA, user journeys, 4 screen specs, and WCAG AA guidelines).
  - `docs/architecture/` (10 architecture documents covering system, components, data flow, ERD, API contracts, geospatial pipeline, scientific engine, security, performance, and Phase 3 plan).
  - Decisions `DEC-009`, `DEC-010`, `DEC-011` recorded in `.gsd/DECISIONS.md`.
  - Verbatim archival of `PRM-104` in `TERRALIGN-PROMPT-ARCHIVE/Phase-2/`.
- **Next Gate:** Product-Lead Review and Explicit Approval before Phase 3.

---

### Phase 3: Application Development & Geospatial Engine
- **Status:** 🟡 In Progress (Wave 3.1 Task 3.1.1 Scaffold Authorized by Product Lead Abhijeet Kumar)
- **Objective:** Build the functional Next.js 15 application, Three.js/R3F hardware-accelerated terrain canvas, MapLibre 2D spatial view, suitability calculation API, and export engine.
- **Depends on:** Phase 2
- **Key Plans:**
  - Plan 3.1: Next.js 15 Scaffold, Tailwind Theming, and Core Layout.
  - Plan 3.2: 7 Flagship Analog Site Database & Filter Engine (`/api/analogs`).
  - Plan 3.3: Interactive 3D Terrain & Lunar South Pole Lighting Canvas (R3F).
  - Plan 3.4: Analog Reality Gap (ARG) Panel & Portfolio Optimizer.

---

### Phase 4: Testing, Optimization, Final Validation & Presentation
- **Status:** ⬜ Planned
- **Objective:** Empirical testing, WebGL $60\text{ FPS}$ frame profiling, CodeRabbit automated code review, documentation sync, and live hackathon demonstration rehearsal.
- **Depends on:** Phase 3
- **Key Plans:**
  - Plan 4.1: Automated Component & API Verification Tests.
  - Plan 4.2: CodeRabbit Automated Code Quality & Security Audit.
  - Plan 4.3: Live 3-Minute Demo Video & Pitch Deck Assets.
