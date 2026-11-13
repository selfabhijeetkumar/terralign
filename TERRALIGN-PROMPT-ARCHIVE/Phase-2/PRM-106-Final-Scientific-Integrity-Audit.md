# TERRALIGN — PRM-106
## FINAL SCIENTIFIC INTEGRITY, MATHEMATICAL CONSISTENCY & PROTOTYPE VERIFICATION

**Project:** TERRALIGN — Where Earth Meets Other Worlds  
**Phase:** Phase 2 — Final Quality Assurance  
**Prompt ID:** PRM-106  
**Version:** 1.0  
**Methodology:** GSD v1.6.0  
**Governance:** Ponytail FULL (REUSE → SIMPLIFY → IMPLEMENT)  
**Workspace:** C:\NASA SPACE HACKATHON

---

## 1. MISSION OBJECTIVE

Execute the final independent scientific and mathematical verification of TERRALIGN following the reported completion of PRM-105.

PRM-105 established the Prototype Data Integrity Register and audited four high-fidelity prototype screens.

PRM-106 must now investigate remaining inconsistencies and independently verify the actual repository contents rather than trusting previous completion reports.

The objective is to establish one scientifically consistent, mathematically reproducible and visually synchronized Phase 2 deliverable.

## 2. MANDATORY INITIALIZATION

Before execution:

1. Read PROJECT_RULES.md.
2. Read AI-CONTEXT.md.
3. Read HANDOFF.md.
4. Read .gsd/STATE.md.
5. Read .gsd/SPEC.md.
6. Read .gsd/ROADMAP.md.
7. Read .gsd/DECISIONS.md.
8. Review PRM-105 and its final audit report.
9. Inspect the existing prototype-data-register.md.
10. Inspect all four HTML prototypes, Markdown specifications and PNG assets.

Establish the actual repository state before modifying anything.

Do not assume that a previous report accurately reflects the current filesystem.

## 3. PRM-106 PROMPT ARCHIVAL

Archive this prompt verbatim:

TERRALIGN-PROMPT-ARCHIVE/Phase-2/PRM-106-Final-Scientific-Integrity-Audit.md

Update:

- PROMPT-INDEX.md
- PROMPT-CHANGELOG.md

Preserve all previous prompt records.

## 4. CRITICAL AUDIT A — CINDER LAKE COORDINATES

Previously documented coordinates:

35.3489° N, 111.5145° W

Previously documented elevation:

2,130 m.

Independently verify:

- Actual Cinder Lake Crater Field 1 location.
- Whether the coordinates represent the actual crater-field centroid.
- Geographic boundary.
- Elevation.
- Coordinate reference system.
- Source provenance.

Consult USGS Open-File Report 68-24, NASA CR-101740 and authoritative geographic datasets where available.

Do not assume that the previously documented coordinates are correct.

Record the verified result, source and uncertainty.

Update Screen 1 only after verification.

## 5. CRITICAL AUDIT B — PORTFOLIO COVERAGE: 78.4% VS 80%

PRM-105 documented:

| Candidate | Criteria | Reported contribution |
|---|---:|---:|
| Cinder Lake | 11/30 | 36.7% |
| Atacama | 8/30 | 26.7% |
| Svalbard | 5/30 | 15.0% |
| Total | 24/30 | 78.4% |

The arithmetic is inconsistent.

For 30 equally weighted criteria:

11/30 = 36.6667%

8/30 = 26.6667%

5/30 = 16.6667%

24/30 = 80.0000%

The reported 15.0% for 5/30 is incorrect.

Investigate the original 30-criterion matrix and actual site-to-criterion mappings.

Determine:

- Whether all contributions are mutually exclusive.
- Whether criteria overlap.
- Whether fractional weights exist.
- Whether all criteria have equal weight.
- Whether the 30 criteria are correctly defined.
- Whether the total coverage is genuinely 24 unique criteria.

Recalculate the entire portfolio from the original data.

Do not hardcode 78.4% or 80%.

The final percentage must be generated from the verified underlying matrix.

If the source data cannot establish a defensible value, label the result illustrative and unresolved.

## 6. CANDIDATE-SITE CONSISTENCY

Investigate the transition from Askja to Svalbard.

Previous research and reports referenced Askja, whereas PRM-105 uses Svalbard.

Determine:

- Why the candidate was replaced.
- Whether Svalbard is scientifically supported.
- Whether its source documentation exists.
- Whether the optimization matrix includes Svalbard.
- Whether Askja remains an active candidate.
- Whether all four screens use the same candidate list.

Do not silently remove or replace a candidate.

Record the decision and rationale.

## 7. CRITICAL AUDIT C — SOLAR IRRADIANCE

Previously documented:

- Lunar TSI: 1361 W/m².
- Cinder Lake surface irradiance: approximately 1076 W/m².
- Claimed difference: +26.5%.
- Earth AM1.5 reference: 1000 W/m².
- Claimed difference: +36.1%.

Verify the original measurements and physical reference conditions.

Distinguish:

- Total Solar Irradiance.
- Direct Normal Irradiance.
- Global Horizontal Irradiance.
- Surface irradiance.
- Top-of-atmosphere irradiance.

Check solar geometry, Earth-Sun distance, atmospheric attenuation and measurement methodology.

Do not present physically incomparable measurements as equivalent.

Recalculate only when the underlying reference conditions support the comparison.

## 8. CRITICAL AUDIT D — RADIATION DOSIMETRY

Previously documented:

- Lunar radiation: approximately 380 mSv/year.
- Cinder Lake background: approximately 3.2 mSv/year.
- Terrestrial hourly value: approximately 0.37 μSv/hour.

Verify:

- NASA CRaTER source.
- Radiation type.
- Absorbed versus equivalent versus effective dose.
- Measurement period.
- Solar activity conditions.
- Shielding assumptions.
- Annualization methodology.
- Terrestrial measurement provenance.

Do not mix dose and dose-rate units.

Do not convert mGy into mSv without justified radiation weighting assumptions.

Clearly distinguish measured, modeled and annualized values.

## 9. CRITICAL AUDIT E — LUNAR PRESSURE

Previously documented:

- Cinder Lake pressure: 86.1 kPa.
- Lunar pressure: 10⁻¹⁰ Pa.
- Reported pressure gap: 100%.

Verify the scientific reference and whether it represents a universal lunar condition or an approximate exospheric engineering reference.

Check the terrestrial elevation and barometric assumptions.

Explicitly define the percentage denominator.

If a universal value is not defensible, label the value as an approximate engineering reference.

## 10. CRITICAL AUDIT F — THERMAL COMPARISON

Previously documented:

- Lunar PSR: approximately −233°C.
- Illuminated polar rim: approximately −53°C.
- Global equatorial subsolar maximum: approximately +123°C.
- Cinder Lake air temperature: −15°C to +32°C.

Verify NASA LRO Diviner references.

Distinguish:

- Surface temperature.
- Air temperature.
- Polar conditions.
- Equatorial conditions.
- Permanently shadowed terrain.
- Illuminated terrain.

Do not compare lunar surface temperature against terrestrial air temperature without explicit qualification.

Use equivalent measurement types where possible.

## 11. CRITICAL AUDIT G — TERRAIN DATASET PROVENANCE

### USGS 3DEP

Verify the actual Cinder Lake dataset:

- Product identifier.
- Tile availability.
- Geographic coverage.
- Acquisition date.
- Raster grid spacing.
- CRS.
- Vertical datum.
- Source URL.

Do not assume 1 m data exists for the exact site without checking.

### NASA LOLA

Verify LDEM_875S_5M:

- Product identifier.
- Coverage.
- Raster grid spacing.
- Interpolation methodology.
- Coordinate system.
- Physical laser footprint.
- Along-track spacing.
- Effective spatial resolution.

Keep raster grid spacing separate from actual measurement resolution.

The 5× ratio must only refer to the appropriate raster-grid comparison.

## 12. SCIENTIFIC DATA CLASSIFICATION

Retain the existing five-tier classification system:

1. VERIFIED SOURCE DATA
2. DERIVED FROM VERIFIED DATA
3. ILLUSTRATIVE DEMO DATA
4. UNVALIDATED HYPOTHESIS
5. UNCHARACTERIZED

Every significant numerical value must have:

- Source.
- Units.
- Formula where applicable.
- Reference conditions.
- Uncertainty.
- Classification.

Never label an illustrative value as empirically validated.

## 13. FOUR-SCREEN FINAL CONSISTENCY AUDIT

Audit and correct:

**Screen 01 — Mission Command Dashboard**

- Site coordinates.
- Site names.
- Elevation.
- Suitability score.
- Confidence indicators.
- Scientific citations.

**Screen 02 — Terrain Comparison Studio**

- DEM metadata.
- Grid spacing.
- Coordinate systems.
- Vertical datums.
- Solar lighting.
- Shadow simulation terminology.

**Screen 03 — Analog Reality Gap**

- Gravity.
- Pressure.
- Solar irradiance.
- Radiation.
- Thermal conditions.
- Regolith cohesion.
- Composite ARG score.

**Screen 04 — Portfolio Optimizer**

- 30 evaluation criteria.
- Candidate sites.
- Coverage calculations.
- Unique and overlapping criteria.
- Marginal contributions.
- Total portfolio coverage.

All four screens must use synchronized data and terminology.

## 14. FINAL SCIENTIFIC INTEGRITY REGISTER

Create or update:

docs/design/final-scientific-integrity-register.md

Include:

| Field | Description |
|---|---|
| Audit ID | Unique identifier |
| Screen | Related prototype |
| Scientific claim | Exact claim |
| Previous value | Existing value |
| Verified value | Correct value, if established |
| Source | Authoritative reference |
| Formula | Calculation |
| Units | Physical units |
| Classification | Five-tier classification |
| Uncertainty | Known limitations |
| Action | Retain / Correct / Relabel / Remove |
| Status | PASS / NEEDS CORRECTION / NOT VERIFIED / BLOCKED |

## 15. HTML, MARKDOWN AND PNG SYNCHRONIZATION

Update the four existing HTML prototypes and corresponding Markdown specifications.

Preserve the existing TERRALIGN design system:

- Background: #050811
- Navy: #0A192F
- Cards: #112240
- Teal: #00D4AA
- Lunar Blue: #1E90FF
- Mars Orange: #FF6B35
- Space Grotesk.
- Inter.
- Space Mono.

Do not unnecessarily redesign the screens.

If screenshots can be genuinely regenerated through the available rendering workflow, regenerate them.

Otherwise preserve the original PNGs and explicitly report that they were not refreshed.

Never claim that Stitch exports were regenerated if only local HTML was modified.

## 16. GOVERNANCE AND CONTINUITY

Update where necessary:

- HANDOFF.md
- AI-CONTEXT.md
- .gsd/STATE.md
- .gsd/DECISIONS.md
- prototype-data-register.md
- final-scientific-integrity-register.md

Create a new sequential ADR only when a new architectural decision is justified.

Preserve existing decisions.

## 17. GIT AND SECURITY SAFETY

Inspect:

git rev-parse --show-toplevel

git branch --show-current

git status --short --untracked-files=all

git remote -v

Perform a safe secrets scan.

STRICTLY DO NOT:

- Stage files.
- Run git add.
- Create commits.
- Configure remotes.
- Push changes.

## 18. FINAL QUALITY GATES

Before completion verify:

1. Coordinates have defensible provenance.
2. Portfolio arithmetic is reproducible.
3. Candidate-site selection is synchronized.
4. Askja/Svalbard replacement is explained.
5. Solar irradiance comparisons are physically qualified.
6. Radiation quantities are correctly classified.
7. Pressure references are qualified.
8. Thermal comparisons distinguish surface and air temperatures.
9. USGS 3DEP metadata is verified.
10. LOLA metadata is verified.
11. All four HTML screens are consistent.
12. All four Markdown specifications are consistent.
13. PNG status is accurately reported.
14. Scientific classifications are applied.
15. Continuity files are synchronized.
16. Git safety requirements are respected.

## 19. FINAL DELIVERABLE

Produce:

TERRALIGN — PRM-106 Final Scientific Integrity & Mathematical Consistency Audit Report

Include:

1. Executive Summary.
2. Prompt archival status.
3. Cinder Lake coordinate verification.
4. Portfolio mathematical verification.
5. Candidate-site review.
6. Solar irradiance audit.
7. Radiation audit.
8. Lunar pressure audit.
9. Thermal audit.
10. USGS 3DEP verification.
11. LOLA verification.
12. Four-screen consistency results.
13. Scientific integrity register.
14. HTML correction results.
15. PNG synchronization status.
16. Source bibliography.
17. Remaining uncertainties.
18. Governance and Git status.
19. Updated handoff.
20. Phase 2 final readiness decision.

For every correction, show the previous value, verified evidence, corrected value and final status.

## 20. STRICT STOP CONDITION

This prompt authorizes ONLY Phase 2 scientific verification and prototype correction.

Do not:

- Start Phase 3.
- Create Next.js application code.
- Install dependencies.
- Create database schemas.
- Implement APIs.
- Implement backend scoring engines.
- Deploy services.
- Stage or commit Git changes.
- Push to GitHub.

Complete the audit, update the documentation, verify the changes and STOP.

Await explicit Product-Lead approval before Phase 3.

END OF PRM-106.

