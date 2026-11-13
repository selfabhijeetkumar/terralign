---
prompt_id: "PRM-102"
phase: "Phase 1"
title: "TERRALIGN — Phase 1 Independent Verification & Review Corrections"
version: "1.0"
date: "2026-11-11T23:12:46+05:30"
ai_model: "Gemini 3.8 Flash"
purpose: "Independent quality review, scientific claim verification, dataset access check, and documentation correction before Phase 2 approval."
status: "Executed"
file_path: "TERRALIGN-PROMPT-ARCHIVE/Phase-1/PRM-102-Phase-1-Independent-Verification.md"
---

# TERRALIGN — PHASE 1 INDEPENDENT VERIFICATION & REVIEW CORRECTIONS

## Objective

Perform an independent quality review of the completed TERRALIGN Phase 1 work before requesting product-lead approval for Phase 2.

This is a verification and documentation-correction task only.

Do not start Phase 2.

Ponytail FULL mode and GSD methodology remain mandatory.

## 1. Archive this verification prompt

Save this exact prompt as:

`TERRALIGN-PROMPT-ARCHIVE/Phase-1/PRM-102-Phase-1-Independent-Verification.md`

Assign:
- Prompt ID: PRM-102
- Version: 1.0
- Phase: Phase 1
- Model: Gemini 3.8 Flash
- Status: Executed only after this verification task finishes.

Update PROMPT-INDEX.md and PROMPT-CHANGELOG.md without overwriting previous records.

## 2. Inspect actual Phase 1 deliverables

Read all 12 research documents under `docs/research/`.

Inspect:
- `.gsd/SPEC.md`
- `.gsd/ROADMAP.md`
- `.gsd/STATE.md`
- `.gsd/DECISIONS.md`
- `PROJECT_RULES.md`
- `AI-CONTEXT.md`
- `HANDOFF.md`
- The complete Phase 0 and Phase 1 prompt archive.
- PROMPT-INDEX.md
- PROMPT-CHANGELOG.md

Do not rely on the previous execution summary alone.

Verify that documents exist, contain substantive content, have consistent terminology and support their conclusions.

## 3. Scientific evidence audit

Create an evidence ledger for significant scientific claims.

For each claim record:
- Claim.
- Source title.
- Author or organization.
- DOI or official URL.
- What the source actually supports.
- Any limitations or caveats.
- Verification status.

Pay special attention to:
- Atacama perchlorate concentrations.
- Atacama microbial and endolithic claims.
- McMurdo Dry Valleys.
- Icelandic volcanic environments.
- Hawaii and JSC Mars-1 analog claims.
- Cinder Lake lunar analog claims.
- Utah and Devon Island analog claims.
- Planetary physical comparison parameters.

Do not let a citation support a broader claim than the source actually establishes.

Correct inaccurate wording only when evidence supports the correction. Record substantive changes.

## 4. Verify the existing analog platforms

Independently evaluate:
- USGS Terrestrial Analogs Data Portal (TADP).
- USGS Planetary Aeolian Analog Database (PAAD).
- NASA Planetary Analog Explorer.
- NASA Analog Missions resources.
- Europlanet Planetary Field Analogues, if relevant.

Answer:

1. What capabilities already exist?
2. What data and discovery functions do they provide?
3. Where does TERRALIGN overlap?
4. What specific gap does TERRALIGN address?
5. Which proposed differentiators are actually defensible?

Do not claim that TERRALIGN is the first or only analog platform.

Position the differentiation around verified mission-specific workflows, measurable comparisons, explainability and documented analog limitations.

## 5. Dataset and access verification

Inspect every dataset recommendation.

Pay special attention to:
- NASA Planetary Data System.
- LOLA.
- LROC NAC.
- MRO HiRISE and CRISM.
- USGS 3DEP.
- Copernicus GLO-30 and GLO-90.
- ESA PSA.

Check:
- Actual dataset coverage.
- Official access method.
- Format.
- License and eligibility.
- Processing requirements.
- Geographic limitations.
- Suitability for the proposed use case.

Distinguish API access, web visualization, catalog search and downloadable data.

Do not describe USGS 3DEP as a global elevation dataset.

Recheck current Copernicus GLO-30 service eligibility and distinguish it from GLO-90 access.

## 6. Mathematical and scoring framework audit

Inspect the five dimensions of resemblance and the six-axis Analog Reality Gap framework.

Verify that:
- Definitions are explicit.
- Axes and dimensions are not mixed.
- Scoring variables are measurable or clearly marked as qualitative.
- Missing values are handled explicitly.
- Confidence is not confused with similarity.
- Proposed weights are justified or identified as assumptions.
- No formula is represented as scientifically validated without validation evidence.

Explain how the scoring framework could be validated.

## 7. Mission suitability matrix consistency

The previous report states that 11 operational domains were evaluated.

However, its summary visibly lists only 10 domains.

Inspect the actual research document and:
- Count the actual domains.
- Identify any missing domain.
- Correct the summary or underlying document.
- Ensure the mission activity matrix is consistent throughout.

Do not invent an eleventh activity just to match the reported number.

## 8. Technical feasibility claims

The previous report mentioned:
- Less than 200 KB per terrain tile.
- 60 FPS rendering.
- Sub-millisecond local response.
- Low-angle solar lighting at 0–5 degrees.

Classify each claim as one of:

A. Demonstrated and measured.
B. Supported by an actual prototype or benchmark.
C. Research-backed architectural target.
D. Assumption requiring future testing.

No application code has been written during Phase 1.

Therefore, do not label runtime performance as verified unless actual executable evidence exists.

Identify:
- Target hardware.
- Expected terrain resolution.
- Tile dimensions.
- Rendering workload.
- Measurement methodology.
- Future performance acceptance criteria.

Also verify the proposed Three.js/R3F and MapLibre architecture against the actual requirements.

Do not change technology choices without a documented reason.

## 9. Git and repository integrity audit

Run:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git status --short --untracked-files=all
git status --porcelain=v1 --ignored
git ls-files
git ls-files --others --exclude-standard
```

Check whether these files are visible to Git:

- PROJECT_RULES.md
- AI-CONTEXT.md
- HANDOFF.md
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- .gsd/STATE.md
- .gsd/DECISIONS.md
- docs/research/
- TERRALIGN-PROMPT-ARCHIVE/

Inspect `.gitignore` for accidental exclusion of essential project documents.

If necessary, use `git check-ignore -v` on the relevant paths.

Do not stage, commit, configure a remote or push.

Report exactly which files are:
- Tracked.
- Untracked.
- Ignored.

Never expose secrets.

## 10. IDE portability test

Inspect the continuity documents.

Determine whether a new AI assistant in VS Code could realistically identify:
- Current phase.
- Completed work.
- Pending work.
- Approved decisions.
- Unresolved blockers.
- Exact next action.
- Relevant source documents.
- Prompt archive references.

Do not claim 100% automatic portability.

Explain any manual setup still required, such as extensions, model availability, credentials, dependencies and local integrations.

## 11. Correct documentation

Repair confirmed factual errors, inconsistencies and unsupported wording.

Preserve historical prompt files.

Document substantive changes in PROMPT-CHANGELOG.md.

Update:
- `.gsd/STATE.md`
- `HANDOFF.md`
- `AI-CONTEXT.md`
- `.gsd/DECISIONS.md` where necessary.
- Relevant research documents.

The current state must clearly say:

Phase 1 research: Reported complete.

Independent verification: In progress / complete, based on actual findings.

Product-lead approval: Pending.

Phase 2: Not started.

Next action: Review verification findings and obtain explicit user approval.

## 12. Final verification report

Produce:

1. Executive review.
2. Verified research documents.
3. Scientific claim audit.
4. Competitor and differentiation audit.
5. Dataset access and licensing audit.
6. Scoring framework audit.
7. Mission domain count verification.
8. Performance claim classification.
9. Git visibility report.
10. IDE portability assessment.
11. Corrections performed.
12. Unresolved issues.
13. Phase 2 readiness assessment.

Use PASS, NEEDS CORRECTION and NOT VERIFIED accurately.

Cite the exact files, sections and evidence supporting conclusions.

## STRICT STOP CONDITIONS

- Do not create application code.
- Do not scaffold Next.js.
- Do not install dependencies.
- Do not invoke Stitch.
- Do not generate UI screens.
- Do not begin Phase 2.
- Do not commit or push.
- Do not configure a GitHub remote.
- Do not mark unresolved quality gates as passed.

Finish the independent verification and stop.

Wait for explicit product-lead approval before Phase 2.
