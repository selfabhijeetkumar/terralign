---
prompt_id: "PRM-110-112-MASTER"
phase: "Phase 2 — Final Design Review & Phase 3 Readiness"
title: "MASTER SEQUENTIAL EXECUTION PROMPT: PRM-109 REMEDIATION → PRM-110 → PRM-111 → PRM-112"
date: "2026-11-12"
roles: ["Principal Product Architect", "Senior UX/UI Designer", "Scientific Data Auditor", "Geospatial & 3D Technical Architect", "QA & Validation Engineer", "GSD Workflow Specialist"]
governance: "Ponytail FULL — REUSE → SIMPLIFY → IMPLEMENT"
execution_mode: "Strict Sequential Execution"
phase_3_status: "STRICTLY LOCKED — NO IMPLEMENTATION AUTHORIZATION"
---

# TERRALIGN — MASTER SEQUENTIAL EXECUTION PROMPT
## PRM-109 REMEDIATION → PRM-110 → PRM-111 → PRM-112
### Phase 2 Final Design Review & Phase 3 Readiness

**PROJECT:** TERRALIGN — Where Earth Meets Other Worlds  
**WORKSPACE:** `C:\NASA SPACE HACKATHON`  
**GOVERNANCE:** Ponytail FULL — REUSE → SIMPLIFY → IMPLEMENT  
**EXECUTION MODE:** Strict Sequential Execution  
**PHASE 3:** STRICTLY LOCKED — NO IMPLEMENTATION AUTHORIZATION

---

## 0. YOUR ROLE

Act as a coordinated team of:

- Principal Product Architect
- Senior UX/UI Designer
- Scientific Data Auditor
- Geospatial & 3D Technical Architect
- QA & Validation Engineer
- GSD Workflow / Project Governance Specialist

Your objective is to complete all remaining Phase 2 design-quality work and prepare TERRALIGN for Product Lead review.

Do not sacrifice scientific integrity, architectural quality, design consistency, or governance to save time.

## 1. MANDATORY PRE-EXECUTION CHECK

Before starting:

1. Read `PROJECT_RULES.md`, `SPEC.md`, `AI-CONTEXT.md`, `HANDOFF.md`, `.gsd/STATE.md`, and the existing Phase 2 documentation.
2. Inspect the existing PRM-108 and PRM-109 reports and archived prompts.
3. Verify the actual GSD version, configuration, state files, task registry, and project structure.
4. Identify the exact four existing screen prototypes and their corresponding specifications.
5. Establish the current source of truth for every major decision.

Do not assume that a report claiming completion proves that the underlying work is complete.

If an essential prerequisite is missing, stop and report the exact blocker instead of fabricating evidence.

## 2. STAGE A — PRM-109 REMEDIATION

Before PRM-110, independently audit PRM-109 and resolve the following issues.

### A. Phase Status Reconciliation

PRM-109 reports Phase 2 as complete, but Reality Gap and Mission Intelligence design reviews remain outstanding.

- Inspect the actual Phase 2 acceptance criteria.
- Reconcile the milestone status with the remaining work.
- Distinguish completed foundation work from outstanding design-review work.
- Update status only where authorized.
- Do not declare Phase 2 fully accepted until all required gates are satisfied.

### B. Scientific Integrity Audit

Independently verify the following:

- Suitability score S = 0.96 / 96%.
- Confidence C = 0.91 / 91%.
- Terramechanics = 96%.
- Geochemistry = 94%.
- Morphology = 92%.
- Cinder Lake coordinates: 35.3071°N, 111.5049°W.
- Base elevation: 2,050 m NAVD88.
- Earth DEM resolution: 1 m.
- Lunar DEM resolution: 5 m interpolated LOLA.

For every value:

1. Identify the original source.
2. Verify the source and the exact claim.
3. Inspect formulas, units, assumptions, and calculation methods.
4. Distinguish verified measurements, derived metrics, illustrative demo values, and unverified assumptions.
5. Preserve uncertainty and limitations.
6. Never label a demo value as scientifically validated.

Specifically verify whether the claimed 5× DEM resolution disparity is a fair comparison, considering dataset processing, sampling, interpolation, and effective spatial resolution.

Do not change scientific constants or approved source data without authorization.

### C. Technical Feasibility Audit

Independently examine:

- Three.js / React Three Fiber feasibility.
- WebGL performance and GPU constraints.
- 60 FPS target assumptions.
- Initial bundle-size estimate of less than 180 KB gzipped.
- Heightmap size and loading estimates.
- VRAM estimates.
- Dynamic shadows and shader complexity.
- MapLibre 2.5D fallback.
- Mobile and desktop compatibility.

Classify each claim as:

- VERIFIED
- PARTIALLY VERIFIED
- ASSUMPTION
- UNVERIFIED
- NOT FEASIBLE

Do not present theoretical estimates as measured benchmarks.

### D. Terrain Studio Review

Verify the PRM-109 Screen 02 blueprint:

- Synchronized Earth/Moon terrain viewports.
- Cinder Lake and Shackleton Crater datasets.
- Shared camera synchronization.
- Low-angle solar illumination.
- Terrain elevation and slope telemetry.
- Resolution disparity disclosure.
- Accessibility and responsive behaviour.

Identify scientific or interaction issues before moving forward.

### E. Remediation Deliverables

Create:

`docs/design/prm-109-remediation-and-verification-report.md`

Include:

- Issue register.
- Evidence and source references.
- Severity and impact.
- Corrections performed.
- Corrections requiring approval.
- Remaining limitations.
- Updated readiness status.

Preserve existing approved artifacts. Do not silently rewrite historical reports.

After completing Stage A, proceed to PRM-110.

---

## 3. STAGE B — PRM-110: SCREEN 03 REALITY GAP

Perform a complete audit and design review of Screen 03 — Analog Reality Gap.

Inspect its existing HTML prototype, PNG, specification, scientific data, and design-system dependencies.

### Scientific Review

Evaluate the comparison between terrestrial analog environments and lunar/Martian conditions.

Cover, where supported by project sources:

- Illumination and solar geometry.
- Temperature and thermal conditions.
- Radiation exposure.
- Atmospheric pressure and composition.
- Gravity.
- Geology and regolith.
- Terrain morphology.
- Environmental conditions.
- Human and robotic operational implications.

For every comparison:

- Show units and reference conditions.
- Identify the source and dataset.
- Include uncertainty and limitations.
- Distinguish direct measurements from models and approximations.
- Never imply that Earth perfectly reproduces lunar or Martian conditions.

### Design Requirements

Create a premium, cinematic comparison experience consistent with:

- Obsidian Assembly's editorial minimalism.
- UNESCO Virtual Museum's guided spatial storytelling.
- TERRALIGN's existing Dark Space design system.
- The Planetary Flight Deck visual direction.

Define:

- Information hierarchy.
- Comparison visualizations.
- Interactive controls.
- Contextual scientific explanations.
- Source and provenance presentation.
- Responsive behaviour.
- Accessibility.
- Error, empty, and loading states.

Provide a complete screen blueprint and ASCII wireframe.

### Deliverable

`docs/design/prm-110-reality-gap-design-blueprint.md`

Include the scientific audit, design decisions, interactions, wireframe, source register, and unresolved issues.

Verify the deliverable before proceeding to PRM-111.

---

## 4. STAGE C — PRM-111: SCREEN 04 MISSION INTELLIGENCE

Perform a complete audit and design review of Screen 04 — Mission Intelligence / Portfolio Optimizer.

Inspect the existing prototype, specifications, scoring engine documentation, data models, and scientific integrity register.

### Intelligence & Algorithm Audit

Verify:

- Suitability scoring.
- Confidence and data coverage.
- Parameter weights.
- Normalization.
- Penalty functions.
- Ranking logic.
- Candidate selection.
- Portfolio optimization.
- Risk and uncertainty.
- Sensitivity analysis.
- Trade-off explanations.

Do not invent algorithms, weights, formulas, scores, or performance claims.

If an algorithm is only specified but not implemented, clearly identify it as a planned capability.

### Design Requirements

Design a premium Mission Intelligence experience that communicates:

- Why a location is recommended.
- Which parameters drive its ranking.
- What evidence supports the recommendation.
- What data is missing.
- Where uncertainty exists.
- How changing mission priorities affects the ranking.
- Why alternative sites may be preferable.

Include:

- Ranking and comparison views.
- Explainable scoring.
- Sensitivity controls.
- Risk and uncertainty visualization.
- Evidence and provenance panels.
- Portfolio selection workflow.
- Responsive and accessible states.

Provide a complete screen blueprint and ASCII wireframe.

### Deliverable

`docs/design/prm-111-mission-intelligence-design-blueprint.md`

Verify the deliverable before proceeding to PRM-112.

---

## 5. STAGE D — PRM-112: CONSOLIDATED FOUR-SCREEN DESIGN REVIEW

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

---

## 6. CROSS-STAGE CORRECTION PROTOCOL

After each stage:

1. Verify the output against its requirements.
2. Record errors and inconsistencies.
3. Identify the authoritative source.
4. Resolve issues only when the correction is within authorized scope.
5. Re-verify the correction.
6. Carry unresolved issues into the next stage.

Do not simply defer known critical issues to the final report.

Do not silently modify approved prototypes, scientific constants, project rules, or historical records.

When a change requires Product Lead approval, document the proposed change and its consequences, then leave it untouched.

## 7. GSD & GOVERNANCE REQUIREMENTS

Use the existing GSD workflow and its actual installed version.

- Inspect GSD configuration before using commands.
- Preserve existing state and task formats.
- Follow the project's established naming conventions.
- Keep STATE.md, HANDOFF.md, and AI-CONTEXT.md consistent.
- Maintain the prompt index and changelog.
- Archive the executed prompts verbatim.
- Never skip GSD steps merely to save time.
- Never invent task completion or approval.

If the existing GSD workflow has a formatting or state inconsistency, document it and propose a safe correction rather than bypassing the workflow.

## 8. STRICT PHASE 3 RESTRICTIONS

This entire execution is DESIGN REVIEW AND DOCUMENTATION ONLY.

Absolutely do not:

- Create a Next.js scaffold.
- Install dependencies.
- Write application implementation code.
- Create database migrations.
- Start backend implementation.
- Modify approved HTML or PNG prototypes.
- Change scientific constants without approval.
- Create Git commits.
- Unlock Phase 3.
- Claim Product Lead approval.
- Start Phase 4 or Phase 5.
- Execute PRM-113 or any future prompt.

Phase 3 remains LOCKED until explicit Product Lead authorization.

## 9. FINAL EXECUTION REPORT

Execute in this exact order:

1. PRM-109 remediation.
2. PRM-110 Reality Gap.
3. PRM-111 Mission Intelligence.
4. PRM-112 consolidated review.

Do not pause between stages unless a genuine blocker, missing permission, destructive action, or essential prerequisite requires user intervention.

At the end, provide:

- Individual reports for all four stages.
- Consolidated execution summary.
- Complete issue and approval register.
- List of verified and unverified scientific claims.
- Technical feasibility findings.
- Final Phase 3 readiness assessment.
- Exact remaining actions before Phase 3.
- Confirmation that no Phase 3 implementation occurred.

Update the prompt archive, index, changelog, and project handoff records as appropriate.

### FINAL STOP CONDITION

STOP after PRM-112.

Do not start Phase 3 automatically, even if all design reviews pass.

Wait for the Product Lead to review the complete deliverables and explicitly authorize the next phase.

**The objective is to finish Phase 2 correctly, not merely to mark it complete.**

