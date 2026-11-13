---
prompt_id: PRM-105
phase: Phase 2
version: "1.0"
date: "2026-11-12T00:09:13+05:30"
model: "Gemini 3.8 Flash"
author: User
type: "Focused Prototype Data Integrity & Scientific Label Audit Prompt"
status: In Execution
character_count: 5742
---

# TERRALIGN — PRM-105
# PHASE 2 PROTOTYPE DATA INTEGRITY & SCIENTIFIC LABEL AUDIT

Project: TERRALIGN  
Phase: Phase 2 — Final Design Quality Review  
Prompt ID: PRM-105  
Version: 1.0  
Model: Gemini 3.8 Flash  
Governance: Ponytail FULL  
Methodology: GSD v1.6.0

## 1. OBJECTIVE

Perform a focused scientific data-integrity audit of the four completed Stitch-generated TERRALIGN screen prototypes.

The Phase 2 design and architecture work is complete.

This task is limited to verifying displayed values, correcting unsupported labels, improving data provenance, and ensuring that design mockups do not misrepresent illustrative values as verified scientific results.

Do not repeat Phase 1 or rebuild the design system.

Do not start Phase 3.

## 2. ARCHIVE THIS PROMPT

Save the exact prompt as:

`TERRALIGN-PROMPT-ARCHIVE/Phase-2/PRM-105-Prototype-Data-Integrity-Audit.md`

Update:
- PROMPT-INDEX.md
- PROMPT-CHANGELOG.md

Preserve all previous prompt versions.

## 3. INSPECT THE FOUR SCREEN PROTOTYPES

Inspect the actual HTML files, corresponding PNG screenshots and relevant screen specifications:

- `docs/design/stitch/screen-01-mission-command.html`
- `docs/design/stitch/screen-02-terrain-comparison.html`
- `docs/design/stitch/screen-03-analog-reality-gap.html`
- `docs/design/stitch/screen-04-portfolio-optimizer.html`

Also inspect:
- `docs/design/`
- `docs/architecture/`
- `docs/research/`
- `.gsd/SPEC.md`
- `.gsd/DECISIONS.md`

Do not rely on the PRM-104 report alone.

## 4. SCREEN 1 — MISSION COMMAND

Review the displayed:
- Suitability score S = 0.96.
- Metric Confidence C = 0.91.
- Seven candidate analog locations.
- Cinder Lake location information.
- Apollo and USGS provenance badges.

For each displayed scientific value:

1. Identify the underlying parameter observations.
2. Identify the source dataset or publication.
3. Verify the calculation formula.
4. Verify the weight configuration, if applicable.
5. Verify measurement coverage and confidence.
6. Verify the displayed location and coordinates.

If these values are illustrative mock data, label them clearly:

`ILLUSTRATIVE DEMO VALUE — NOT SCIENTIFICALLY VALIDATED`

Do not show mock values as actual research results.

Provenance badges must refer to actual source records rather than decorative institutional labels.

## 5. SCREEN 2 — TERRAIN COMPARISON STUDIO

The design report describes:

- Cinder Lake: 1 m USGS 3DEP LiDAR.
- Shackleton Crater: 5 m NASA LRO LOLA DEM.
- A 5x spatial resolution disparity.
- A low-angle lighting slider.

Verify the exact source data.

### USGS 3DEP

Identify:
- Exact product.
- Tile ID.
- Coverage boundary.
- Collection date.
- Ground resolution.
- Coordinate reference system.
- Vertical datum.
- Source metadata.
- Availability for the actual Cinder Lake location.

Do not infer 1 m site coverage merely because USGS offers 1 m products elsewhere.

### NASA LOLA

Identify:
- Exact PDS dataset identifier.
- Product name.
- DEM grid spacing.
- Effective spatial resolution.
- Vertical accuracy.
- Processing level.
- Relevant Shackleton crater coverage.
- Data limitations.

Keep these concepts separate:
- Grid spacing.
- Horizontal resolution.
- Vertical accuracy.
- Surface roughness scale.

Do not confuse a 5 m roughness scale or a measurement accuracy with a 5 m DEM pixel size.

Only retain the 5x resolution disparity if both source products support it using comparable resolution definitions.

Otherwise correct the comparison or mark it illustrative.

### Lighting

Verify the meaning of:
- Solar elevation.
- Solar azimuth.
- Local coordinate reference.
- Crater orientation.
- Shadow visualization method.

Do not call a shadow simulation ray-traced unless the implementation actually uses ray tracing.

## 6. SCREEN 3 — ANALOG REALITY GAP

Review every displayed value:

- ARG = 0.72.
- Gravity gap = 83.5%.
- Pressure gap = 100%.
- Thermal range expansion = 218°C.
- Solar irradiance increase = 26.5%.
- Radiation flux factor greater than 100x.
- Regolith cohesion comparison.

For each parameter document:

1. Exact Earth reference value.
2. Exact lunar or Martian reference value.
3. Source publication or dataset.
4. Reference location.
5. Measurement date or scenario.
6. Unit.
7. Formula.
8. Normalization denominator.
9. Calculation result.
10. Uncertainty and caveat.

Pay particular attention to percentages and ratios.

A percentage gap is meaningless without an explicitly defined reference denominator.

Radiation comparisons must specify the radiation type, location, shielding assumptions and exposure scenario.

Thermal comparison must specify location, local time or thermal scenario, measurement basis and reference conditions.

Solar irradiance comparison must specify the solar distance, incidence geometry and atmospheric assumptions.

Regolith cohesion must compare equivalent physical parameters and measurement methods.

### ARG composite score

Verify:
- Six-axis formula.
- Normalization method.
- Axis weights.
- Treatment of missing data.
- Uncertainty bounds.
- Interpretation thresholds.

If ARG = 0.72 has not been scientifically calculated using defined inputs and a documented method, mark it:

`ILLUSTRATIVE ARG INDEX — NOT VALIDATED`

Do not imply it is a certified engineering or physical measurement.

Compensation protocols must remain labelled:

`ENGINEERING PROPOSAL — NOT A VALIDATED SIMULATION`

## 7. SCREEN 4 — PORTFOLIO OPTIMIZER

This screen displays:

- 30 NASA Artemis surface requirements.
- 78.4% empirical coverage.
- Cinder Lake: 36.7%.
- Askja: 26.7%.
- Atacama: 15.0%.
- Four physics-related coverage gaps.

These claims require strict verification.

### Requirement traceability

The previous research identifies NASA SP-2016-6105 as a Systems Engineering Handbook.

Do not describe this handbook by itself as an authoritative 30-item Artemis surface requirements baseline.

Inspect all 30 entries.

For each item provide:
- Unique requirement or criterion ID.
- Exact wording.
- Source organization.
- Document identifier and revision.
- Source section or page.
- Whether it is an official requirement or a TERRALIGN-defined evaluation criterion.
- Supporting evidence.
- Applicable mission activity.
- Validation status.

Use actual authoritative documents where relevant.

NASA-STD-3001 may inform human-system and crew performance criteria, but do not assume it establishes rover, geology or every surface exploration criterion.

If the exact public requirement cannot be traced, relabel it as:

`TERRALIGN-DEFINED MISSION EVALUATION CRITERION`

Clearly cite any NASA source that informed its formulation.

### Portfolio coverage

The previous PRM-103 work explicitly classified the greater-than-90% portfolio target as an unvalidated hypothesis.

Do not contradict that decision.

Verify whether 78.4% is:
- Computed from a real requirements matrix.
- Computed from curated research records.
- Generated from manually assigned design values.
- Purely illustrative Stitch content.

If the underlying 30 criteria, site observations and optimization calculations are not reproducible, remove the term `EMPIRICAL COVERAGE`.

Replace it with:

`ILLUSTRATIVE PORTFOLIO SCENARIO — NOT EMPIRICALLY VALIDATED`

Do not show 36.7%, 26.7% and 15.0% as measured coverage without evidence.

Explain whether overlapping candidate-site capabilities are double-counted.

The future optimization must be evaluated using the documented budget-constrained maximum coverage framework.

## 8. BUILD A PROTOTYPE DATA REGISTER

Create:

`docs/design/prototype-data-register.md`

Include every significant numeric value displayed in the four screens.

Use this structure:

| Field | Description |
|---|---|
| Screen | Screen ID |
| Displayed Value | Exact value shown |
| Parameter | What it represents |
| Classification | Verified / Derived / Illustrative / Unverified |
| Source | DOI or direct official URL |
| Formula | Calculation used |
| Units | Measurement units |
| Confidence | Evidence quality |
| Caveat | Known limitation |
| Action | Retain / Relabel / Remove |

Every displayed value must have an explicit classification.

Never use a fabricated value as a verified real-world measurement.

## 9. DESIGN CORRECTIONS

Preserve the existing:
- TERRALIGN Dark Space design system.
- Typography.
- Color identity.
- Four-screen information architecture.
- Core interaction design.
- Overall visual quality.

Do not redesign everything.

Make only the minimum changes needed to ensure scientific honesty.

Where values are illustrative, use a consistent visible data-status label.

Recommended labels:

- VERIFIED SOURCE DATA
- DERIVED FROM VERIFIED DATA
- ILLUSTRATIVE DEMO DATA
- UNVALIDATED HYPOTHESIS
- UNCHARACTERIZED
- SOURCE NOT VERIFIED

Update the relevant HTML references and their corresponding PNG screenshots.

If Stitch MCP supports the necessary update/export workflow, use the existing integration.

Otherwise inspect the available export capabilities and report limitations rather than claiming an export succeeded.

## 10. UPDATE PROJECT CONTINUITY

Update:
- `HANDOFF.md`
- `AI-CONTEXT.md`
- `.gsd/STATE.md`
- `.gsd/DECISIONS.md` if a significant new decision is introduced.
- Relevant design documentation.

Add the prototype data-integrity review to the Phase 2 handoff.

Preserve all Phase 1 scientific decisions.

## 11. GIT SAFETY

Run:

```powershell
git status --short --untracked-files=all
git branch --show-current
git remote -v
```

Do not stage, commit, configure a remote or push.

Do not expose secrets.

Initial baseline commit remains subject to separate user approval.

## 12. FINAL REPORT

Report:

1. PRM-105 archive status.
2. Screen 1 data audit.
3. Screen 2 data audit.
4. Screen 3 data audit.
5. Screen 4 requirements traceability.
6. Portfolio coverage validation.
7. Prototype data register.
8. HTML and PNG corrections.
9. Source references used.
10. Remaining unverified values.
11. Git status.
12. Updated handoff.
13. Phase 3 readiness assessment.

Use PASS, NEEDS CORRECTION, NOT VERIFIED or BLOCKED for individual findings.

## 13. STRICT STOP

Do not:
- Scaffold Next.js.
- Write application source code.
- Install packages.
- Create a production database.
- Implement the scientific engines.
- Start Phase 3.
- Commit or push.
- Claim unvalidated data is verified.

Complete only the prototype integrity review and stop.

Wait for explicit product-lead approval before Phase 3.

END OF PRM-105.

