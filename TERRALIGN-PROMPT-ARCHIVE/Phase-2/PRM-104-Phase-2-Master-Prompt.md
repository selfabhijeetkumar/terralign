---
prompt_id: PRM-104
phase: Phase 2
version: "1.0"
date: "2026-11-11T23:41:53+05:30"
model: "Gemini 3.8 Flash"
thinking_level: High
author: User
type: "Full Master Prompt — Phase 2 Product Design, Stitch Prototyping & Technical Architecture"
status: In Execution
character_count: 16842
---

# TERRALIGN — PRM-104
# PHASE 2 MASTER EXECUTION PROMPT
## Product Design, Stitch Prototyping & Technical Architecture

**Project:** TERRALIGN  
**Tagline:** Where Earth Meets Other Worlds.  
**Hackathon:** NASA Space Hackathon  
**Workspace:** `C:\NASA SPACE HACKATHON`  
**Phase:** Phase 2 — Product Design & Architecture  
**Prompt ID:** PRM-104  
**Version:** 1.0  
**AI Model:** Gemini 3.8 Flash  
**Thinking Level:** High  
**Methodology:** GSD v1.6.0  
**Engineering Governance:** Ponytail FULL

---

# 1. FORMAL PHASE 2 AUTHORIZATION

The product lead has explicitly approved Phase 1 and authorized Phase 2.

Record this approval in the project state and handoff documents.

Phase 1 research, independent verification and the final documentation consistency pass have been reported complete.

Relevant baseline documents:

- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`
- `.gsd/STATE.md`
- `.gsd/DECISIONS.md`
- `PROJECT_RULES.md`
- `AI-CONTEXT.md`
- `HANDOFF.md`
- `docs/research/`
- `TERRALIGN-PROMPT-ARCHIVE/`

Read these documents before starting.

Do not repeat Phase 1 research unnecessarily.

Do not silently modify finalized scientific requirements. Any proposed specification change must be documented with its rationale.

**Phase 2 objective:** Convert the validated Phase 1 product specification into a coherent design system, high-fidelity interactive design references, user experience flows and an implementation-ready technical architecture.

This is a design and architecture phase.

It is NOT the application development phase.

# 2. PONYTAIL FULL — MANDATORY

Ponytail FULL mode is already active.

Continue following:

**REUSE → SIMPLIFY → IMPLEMENT**

Mandatory principles:

- Apply YAGNI.
- Inspect before changing.
- Reuse existing tools and infrastructure.
- Avoid unnecessary dependencies.
- Prefer the smallest complete solution.
- Verify all completed work.
- Do not make unsupported technical or scientific claims.
- Report completed work, skipped work and remaining risks.

Never sacrifice scientific validity, data provenance, uncertainty handling, security or accessibility for visual simplicity.

Do not reinstall or reactivate Ponytail.

# 3. PROMPT ARCHIVE — FIRST ACTION

Archive this exact complete prompt before Phase 2 execution.

Destination:

`TERRALIGN-PROMPT-ARCHIVE/Phase-2/PRM-104-Phase-2-Master-Prompt.md`

Metadata:

- ID: PRM-104
- Phase: Phase 2
- Version: 1.0
- Model: Gemini 3.8 Flash
- Status: Approved for execution, then Executed after successful completion.

Update:

- `PROMPT-INDEX.md`
- `PROMPT-CHANGELOG.md`

Preserve all previous prompt files and versions.

Future Phase 2 sub-prompts must receive separate prompt IDs and must be archived before execution.

Do not claim a prompt was executed merely because it was archived.

# 4. CURRENT REPOSITORY AND GIT PREFLIGHT

The previous Phase 1 reports indicate:

- Branch: `master`
- Commits: 0
- Staged files: 0
- Remotes: 0
- Approximately 130 untracked files visible to Git.
- No secrets detected in the previous scan.

Recheck the actual current repository state:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git status --short --untracked-files=all
git remote -v
```

Review `.gitignore` and identify any essential documents being ignored.

Perform a safe secrets scan without displaying secret values.

**Important authorization boundary:**

Phase 2 is approved, but this does NOT authorize an initial Git commit.

Do not stage, commit, configure a remote or push without separate explicit user approval.

If a baseline commit is recommended, present:
1. Proposed file list.
2. Excluded files.
3. Secret-scan results.
4. Any uncertain files.

Wait for approval before committing.

Phase 2 documentation and design work may continue without an unauthorized commit.

# 5. PHASE 1 PRODUCT FOUNDATION — DO NOT CHANGE THE CORE IDENTITY

TERRALIGN's problem statement:

**Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration.**

The product aims to help researchers discover, compare and evaluate Earth environments as analogs for specific lunar and Martian exploration activities.

Core scientific principles:

1. Non-Replica Law: No terrestrial environment is an exact replica of the Moon or Mars.
2. Analog Reality Gap (ARG): Explain the physical divergence between Earth analog conditions and the target planetary environment.
3. Mission-specific suitability: A site must be evaluated against a defined activity.
4. Evidence provenance: Users must be able to trace claims to their sources.
5. Uncertainty awareness: Missing or weak data must be visible.

Keep these five resemblance dimensions distinct:

- Geological.
- Geomorphological.
- Environmental.
- Operational.
- Mission-specific.

Keep the six ARG axes distinct:

- Gravity.
- Pressure.
- Thermal.
- Solar irradiance.
- Radiation.
- Regolith cohesion.

The proposed missing-data score of 0.5 remains an unvalidated heuristic.

The proposed portfolio coverage above 90% remains a research hypothesis, not a proven capability.

Never present these assumptions as established scientific facts.

# 6. PHASE 2 EXECUTION STRATEGY

Execute in this order:

1. Inspect the Phase 1 specification and current repository.
2. Archive PRM-104.
3. Record Phase 2 approval and current state.
4. Define design principles and visual identity.
5. Use Stitch MCP to generate the four core screen designs.
6. Review and refine the screen designs.
7. Define user journeys and interaction states.
8. Define technical architecture and component contracts.
9. Define conceptual data models and API contracts.
10. Define the Phase 3 implementation plan.
11. Verify all documentation and design artifacts.
12. Update handoff and stop before Phase 3.

Use GSD planning and verification capabilities where relevant.

Delegate independent design, architecture and verification tasks only when useful.

Do not create duplicate planning documents.

# 7. OFFICIAL TERRALIGN DESIGN SYSTEM

Use the Phase 1 design direction as the starting point, not an excuse to generate generic UI.

Previously proposed design identity:

| Property | Starting direction |
|---|---|
| Theme | Dark |
| Primary accent | `#00D4AA` |
| Headline font | Space Grotesk |
| Body font | Inter |
| Data/label font | Space Mono |
| Corner style | Compact, consistent roundness |

Evaluate the colors and typography for:
- Accessibility.
- Scientific readability.
- Strong visual hierarchy.
- Data visualization clarity.
- Long-duration research use.
- Desktop and tablet responsiveness.

You may refine secondary colors and surface tones with justification.

Visual direction:

- Premium cinematic scientific interface.
- Space-inspired dark environment.
- Geological and terrain-inspired visual details.
- Clear typography.
- Restrained motion.
- Strong contrast.
- Meaningful 3D visualization.
- High information clarity.

Avoid:

- Purple gradients.
- Generic AI dashboard templates.
- Excessive KPI cards.
- Fake metrics.
- Fake ratings or reviews.
- Decorative 3D without scientific purpose.
- Unnecessary glow effects.
- Emoji-based navigation.
- Excessive rounded pill buttons.
- Cursor-following animations.
- Distracting scroll animations.
- Unnecessary visual clutter.

The interface should look like a credible planetary research and mission-planning product, not a generic SaaS admin panel.

# 8. STITCH MCP — MANDATORY DESIGN TOOL

The environment previously reported Stitch MCP as configured.

Explicitly use **Stitch MCP** for visual design generation.

Before invoking it:

1. Inspect the available Stitch MCP capabilities.
2. Confirm the available design-generation workflow.
3. Confirm what output formats and export operations are supported.
4. Reuse existing project context and approved design requirements.
5. Do not invent unsupported MCP operations.

Use Stitch to create four separate, high-fidelity screen designs.

Do not generate all screens as one generic dashboard.

Each screen must have its own purpose, hierarchy, layout and interactions.

If Stitch MCP is unavailable or fails:
- Report the actual problem.
- Do not pretend screen generation succeeded.
- Do not silently switch to a different tool.
- Preserve completed documentation.
- Ask the user how to proceed if the blocker cannot be resolved.

# 9. FOUR CORE PRODUCT SCREENS

## SCREEN 1 — GLOBAL MISSION COMMAND & ACTIVITY SELECTOR

Purpose:

The user begins by defining the target planetary body and exploration objective.

The screen should allow the user to:

- Select Moon or Mars.
- Select a mission activity.
- Explore relevant terrestrial analog candidates.
- Apply geological, geomorphological or environmental filters.
- Inspect candidate site summaries.
- View available source data and characterization status.
- Open a candidate's detailed assessment.

Potential mission activities include:

- Rover terramechanics and mobility.
- Lunar South Pole low-angle lighting.
- EVA and spacesuit operations.
- Cryogenic volatile and permafrost drilling.
- Lava tube exploration.
- Inverted delta and fluvial science.
- Hyper-arid astrobiology and life detection.
- Landing hazard detection.
- ISRU and regolith sintering.

The cross-cutting multi-site portfolio framework must remain distinct from an individual operational mission activity.

Design priorities:

- A clear mission selection experience.
- A visually compelling geographic discovery interface.
- A useful candidate comparison area.
- Scientific information without dashboard overload.
- Clear indication of data availability and quality.

Do not invent site suitability scores or claim complete global coverage.

## SCREEN 2 — DUAL-VIEW 3D TERRAIN & EXTREME LUNAR LIGHTING COMPARISON STUDIO

Purpose:

Allow researchers to visually compare a selected Earth analog terrain with a corresponding lunar or Martian reference area.

Design two synchronized terrain views:

- Selected terrestrial analog.
- Selected planetary reference terrain.

Provide conceptual controls for:

- View synchronization.
- Terrain perspective.
- Elevation and slope layers.
- Selected terrain attributes.
- Direction and elevation of sunlight.
- Low-angle lunar lighting scenarios.

The previously proposed 0–5 degree sunlight range may be shown as a configurable research scenario when appropriate.

Display:
- Source dataset.
- Data resolution.
- Terrain units.
- Geographic or planetary coordinates.
- Data quality.
- Missing information.
- Measurement limitations.

Use scientific topography visualization rather than decorative 3D landscapes.

If real terrain data is not yet integrated, use clearly labeled illustrative design content.

Do not represent illustrative values or meshes as measured scientific data.

## SCREEN 3 — ANALOG REALITY GAP (ARG) DIAGNOSTIC & SIMULATOR COMPENSATION PANEL

Purpose:

Explain where the selected Earth analog differs from the target Moon or Mars environment.

Display the six documented ARG dimensions:

1. Gravity.
2. Pressure.
3. Thermal conditions.
4. Solar irradiance.
5. Radiation.
6. Regolith cohesion.

For each dimension, show:

- Earth analog condition.
- Planetary reference condition, where supported.
- Difference or divergence.
- Source.
- Units.
- Confidence or measurement quality.
- Missing information.
- Scientific caveats.

Distinguish carefully between measured values and qualitative characterization.

The simulator compensation panel is a proposed engineering-support concept.

It may present possible experimental compensation parameters, but it must not imply that actual physics simulation or validated compensation already exists.

Separate:
- Evidence-backed physical difference.
- Proposed experiment adjustment.
- Future simulation capability.
- Unvalidated assumption.

Do not present a single unexplained ARG percentage as a complete scientific answer.

## SCREEN 4 — MULTI-SITE REHEARSAL PORTFOLIO OPTIMIZER

Purpose:

Allow users to compare a small portfolio of terrestrial analog locations against a defined set of mission requirements.

The Phase 1 hypothesis considers a budget-constrained portfolio with up to three candidate sites.

Design for:

- Mission requirements.
- Candidate sites.
- Site-to-requirement coverage matrix.
- Complementary capabilities.
- Overlapping capabilities.
- Uncharacterized requirements.
- Data confidence.
- Missing data.
- Operational constraints.
- Budget or site-count constraints.

Show why a particular combination might provide broader testing coverage.

Do not claim that a 2–3 site portfolio achieves more than 90% coverage.

That figure remains unvalidated.

Use transparent coverage and gap visualizations.

Clearly separate measured coverage from proposed optimization outputs.

# 10. UX AND INTERACTION SPECIFICATION

After generating the screen designs, define the main end-to-end journey:

1. User opens TERRALIGN.
2. Selects Moon or Mars.
3. Chooses a mission objective.
4. Discovers terrestrial analog candidates.
5. Opens a candidate site.
6. Reviews evidence and site characterization.
7. Compares Earth and planetary terrain.
8. Inspects the Analog Reality Gap.
9. Reviews uncertainty and data confidence.
10. Compares multiple sites if appropriate.
11. Produces a research-oriented result or report.

Specify:
- Primary navigation.
- Screen transitions.
- Selection behavior.
- Filters.
- Contextual actions.
- Loading states.
- Empty states.
- Error states.
- Insufficient-data states.
- Low-confidence states.
- Responsive behavior.

Do not design only the happy path.

Design scientifically honest fallback states when datasets are missing or inaccessible.

# 11. DESIGN SYSTEM AND OUTPUT DOCUMENTATION

Create or update:

```text
docs/
└── design/
    ├── design-system.md
    ├── information-architecture.md
    ├── user-flows.md
    ├── screen-01-mission-command.md
    ├── screen-02-terrain-comparison.md
    ├── screen-03-analog-reality-gap.md
    ├── screen-04-portfolio-optimizer.md
    ├── accessibility-and-responsive-guidelines.md
    └── stitch/
```

Store Stitch references or exported design artifacts in the `stitch/` directory only when the actual MCP supports exporting them.

Do not create fake design files or claim an export succeeded when only a design preview was generated.

For each screen document:
- User goal.
- Main layout.
- Components.
- Data required.
- User interactions.
- States.
- Navigation.
- Accessibility.
- Scientific information constraints.
- Phase 3 implementation notes.

# 12. TECHNICAL ARCHITECTURE DESIGN

Use the Phase 1 research as the starting point.

Previously evaluated technologies include:

**Frontend**
- Next.js 15.
- React.
- TypeScript.
- Tailwind CSS.

**3D and geospatial**
- Three.js.
- React Three Fiber.
- MapLibre GL.

**Data and backend**
- PostgreSQL.
- PostGIS.
- Supabase.

Do not assume every technology must be selected.

Assess the simplest architecture that can meet the approved requirements.

Use Context7 and official documentation to check current APIs and compatibility when relevant.

## Architecture layers to define

### A. Presentation layer
- Application shell.
- Screen routing.
- Design system.
- Interactive maps.
- Terrain visualization.
- Scientific comparison components.

### B. Data layer
- Analog site catalog.
- Mission activity catalog.
- Planetary reference data.
- Dataset metadata.
- Source provenance.
- Terrain assets.
- Parameter observations.

### C. Scientific processing layer
- Data normalization.
- Units and coordinate reference systems.
- Terrain-derived metrics.
- Deterministic suitability evaluation.
- ARG calculations.
- Missing-data handling.
- Confidence and uncertainty.

### D. Evidence layer
- Source records.
- Dataset versions.
- Citations.
- Licensing.
- Measurement dates.
- Validation status.

### E. AI assistance layer
AI may support:
- Evidence summarization.
- Metadata interpretation.
- Research explanations.
- Report drafting.

AI must not invent scientific measurements or replace deterministic calculations.

### F. Security layer
- Server-side credential handling.
- Input validation.
- API authorization.
- Supabase RLS where appropriate.
- Source licensing compliance.
- Secure configuration.

# 13. CONCEPTUAL DATA AND API CONTRACTS

Define the conceptual entities and relationships.

Potential entities:

- AnalogSite.
- PlanetaryBody.
- MissionActivity.
- TerrainDataset.
- DatasetSource.
- ParameterDefinition.
- ParameterObservation.
- PlanetaryReference.
- SuitabilityAssessment.
- RealityGapAssessment.
- EvidenceRecord.
- PortfolioSelection.

For each entity, document:
- Purpose.
- Key attributes.
- Relationships.
- Data provenance.
- Validation requirements.

Define conceptual API contracts for:
- Analog site discovery.
- Site details.
- Mission activity selection.
- Terrain data retrieval.
- Suitability assessment.
- ARG assessment.
- Portfolio comparison.

Specify request and response examples only when the contract is sufficiently defined.

Do not create a production database, migrations or executable API implementation during Phase 2.

# 14. TECHNICAL ARCHITECTURE DOCUMENTATION

Create or update:

```text
docs/
└── architecture/
    ├── system-architecture.md
    ├── component-architecture.md
    ├── data-flow.md
    ├── conceptual-data-model.md
    ├── api-contracts.md
    ├── geospatial-processing-pipeline.md
    ├── scientific-assessment-engine.md
    ├── security-architecture.md
    ├── performance-and-scalability.md
    └── phase-3-implementation-plan.md
```

Use existing project conventions if equivalent files already exist.

Provide diagrams where useful:
- System context.
- Component relationships.
- Data flow.
- User workflow.
- Scientific assessment pipeline.

Use Mermaid diagrams in Markdown when appropriate.

Document architectural decisions in `.gsd/DECISIONS.md`.

Do not implement the diagrams as application code.

# 15. PHASE 3 IMPLEMENTATION CONTRACT

Define exactly what Phase 3 is expected to build.

For each feature specify:

- User outcome.
- Functional requirement.
- Design reference.
- Required components.
- Required data.
- Scientific logic.
- API dependency.
- Acceptance criteria.
- Tests.
- Known risks.

Prioritize the smallest complete, scientifically meaningful MVP.

Separate:

- Essential MVP.
- High-value differentiators.
- Future scope.

Do not add speculative enterprise functionality.

# 16. VISUAL QUALITY AND ACCESSIBILITY VERIFICATION

Independently review all four generated screens.

Check:

- Visual consistency.
- Typography.
- Spacing.
- Information hierarchy.
- Navigation clarity.
- Data readability.
- Scientific credibility.
- Responsive behavior.
- Color contrast.
- Keyboard accessibility.
- Focus states.
- Error and empty states.
- Consistency with the TERRALIGN identity.

Use WCAG 2.2 AA as a design target where applicable.

Do not mark accessibility as passed without an actual assessment.

Use user-centered design rather than adding visual effects just to look impressive.

# 17. IDE-INDEPENDENT CONTINUITY

This is a permanent project rule.

The project must remain resumable if Antigravity model quota is exhausted or the team moves to VS Code, Cursor or another compatible IDE.

Maintain:

- `PROJECT_RULES.md`
- `AI-CONTEXT.md`
- `HANDOFF.md`
- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`
- `.gsd/STATE.md`
- `.gsd/DECISIONS.md`

At the end of Phase 2:

1. Update the current phase and status.
2. Record completed screen designs.
3. Record architecture decisions and unresolved choices.
4. Record the exact Phase 3 next action.
5. Reference every relevant prompt ID.
6. Record manual environment setup needs.
7. Confirm Git status.
8. Preserve historical prompt versions.

A new AI assistant must be able to resume from repository documents without requiring the old Antigravity chat history.

# 18. REQUIRED PHASE 2 DELIVERABLES

Phase 2 is expected to produce:

**Product Design**
- Approved design system.
- Four high-fidelity screen references.
- Information architecture.
- User journeys.
- Component inventory.
- Responsive and accessibility guidelines.

**Architecture**
- System architecture.
- Component architecture.
- Data flow.
- Conceptual data model.
- API contracts.
- Geospatial processing design.
- Scientific engine design.
- Security and performance considerations.

**Phase 3 Readiness**
- Implementation backlog.
- Acceptance criteria.
- Technical dependencies.
- Data requirements.
- Test strategy.
- Unresolved decisions.
- Recommended implementation sequence.

**Project Continuity**
- Updated prompt archive.
- Updated index and changelog.
- Updated GSD documents.
- Updated AI-CONTEXT.md.
- Updated HANDOFF.md.
- Updated project state.

# 19. STRICTLY PROHIBITED DURING PHASE 2

Do not:

- Scaffold a Next.js application.
- Write application source code.
- Install dependencies.
- Create a Supabase production project.
- Create database migrations.
- Implement the scientific engine.
- Implement working application APIs.
- Deploy the product.
- Push code to GitHub.
- Commit without explicit approval.
- Claim benchmark performance without measurement.
- Use fabricated scientific data.
- Claim Stitch export succeeded without verifying it.

Stitch-generated design artifacts and reference exports are allowed as Phase 2 deliverables.

Actual product implementation belongs to Phase 3.

# 20. FINAL VERIFICATION AND REPORT

Before declaring Phase 2 complete, independently verify:

1. PRM-104 is archived exactly.
2. All four screen designs exist or their actual generation blockers are reported.
3. Design system documentation exists.
4. User journeys are documented.
5. Architecture is coherent and technically justified.
6. Conceptual data and API contracts are documented.
7. Scientific requirements from Phase 1 remain intact.
8. Performance figures are not misrepresented as measured.
9. Accessibility claims are supported by actual checks.
10. Phase 3 implementation requirements are actionable.
11. IDE handoff documentation is updated.
12. Git safety requirements remain satisfied.

Provide a final report with:

- Executive summary.
- Prompt archive status.
- Design system.
- Four screen generation results.
- Screen-by-screen review.
- User flow.
- Architecture recommendation.
- Data and API contracts.
- Phase 3 implementation plan.
- Accessibility review.
- Risks and unresolved decisions.
- Git status.
- Updated handoff and state.
- Phase 3 readiness assessment.

For each major deliverable use:

- PASS.
- NEEDS CORRECTION.
- NOT VERIFIED.
- BLOCKED.

Do not claim completion without evidence.

# 21. FINAL STOP CONDITION

Phase 2 is authorized.

Complete the design and architecture deliverables.

Do not start Phase 3 implementation.

At completion:

- Update all continuity documents.
- Update the prompt archive.
- Present the final Phase 2 report.
- Explain any remaining decisions.
- Wait for explicit product-lead approval before starting Phase 3.

**TERRALIGN's goal is a scientifically credible, visually exceptional and technically implementable planetary analog intelligence platform. Every screen and architectural decision must serve that objective.**

END OF PRM-104.

