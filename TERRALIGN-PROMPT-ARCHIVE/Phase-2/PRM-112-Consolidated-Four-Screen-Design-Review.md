---
prompt_id: "PRM-112"
phase: "Phase 2 — Final Design Review & Phase 3 Readiness"
title: "PRM-112: Consolidated Four-Screen Design Review, End-to-End User Journey & Phase 3 Readiness"
date: "2026-11-12"
parent_prompt: "PRM-110-112-MASTER"
roles: ["Principal Product Architect", "Senior UX/UI Designer", "Scientific Data Auditor", "Geospatial & 3D Technical Architect", "QA & Validation Engineer", "GSD Workflow Specialist"]
governance: "Ponytail FULL — REUSE → SIMPLIFY → IMPLEMENT"
---

# STAGE D — PRM-112: CONSOLIDATED FOUR-SCREEN DESIGN REVIEW

Conduct a comprehensive review of all four TERRALIGN screens:

1. Mission Command.
2. Terrain Studio.
3. Analog Reality Gap.
4. Mission Intelligence.

### A. Design Consistency

Verify:

- Shared typography and color tokens.
- Component consistency.
- Navigation and user journey.
- Interaction patterns.
- Scientific provenance.
- Data presentation.
- Loading and error states.
- Accessibility.
- Desktop, laptop, tablet, and mobile behaviour.

### B. End-to-End User Journey

Validate the intended journey:

Mission selection → Analog site selection → Terrain comparison → Reality Gap analysis → Mission Intelligence → Evidence-backed recommendation.

Identify navigation gaps, inconsistent data, redundant interactions, and broken transitions.

### C. Prototype Review

Inspect all four existing HTML and PNG prototypes.

Where browser-based visual inspection is available, perform an actual visual review.

If visual inspection is unavailable, explicitly state that it was not performed. Never claim visual verification based only on reading HTML.

### D. Technical Architecture Readiness

Review the existing Phase 3 architecture and its actual 4-wave / 12-task breakdown.

Do not invent or replace the original task breakdown.

Assess:

- Next.js application foundation.
- Design system and component architecture.
- Data and backend architecture.
- Scientific data provenance.
- Three.js / React Three Fiber integration.
- MapLibre fallback.
- State management.
- API design.
- Testing strategy.
- Performance and deployment considerations.

Identify dependencies and risks before implementation.

### E. Final Approval Register

Create a clear register with:

- Item.
- Current status.
- Evidence.
- Severity.
- Required action.
- Owner or approval requirement.
- Phase 3 impact.

Classify all remaining issues as:

- BLOCKER
- HIGH
- MEDIUM
- LOW
- ACCEPTED RISK

### Deliverable

`docs/design/prm-112-consolidated-design-review-and-phase-3-readiness.md`

Also create or update the consolidated issue and approval register.

