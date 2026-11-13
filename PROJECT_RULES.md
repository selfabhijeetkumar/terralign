<!-- GSD Project Profile: TERRALIGN / Planetary Analog Intelligence -->
# PROJECT_RULES.md — TERRALIGN Canonical Project & Architecture Rules

> **Single Source of Truth** for the TERRALIGN platform.  
> Governs all AI models, IDE environments (Antigravity, Cursor, VS Code), and human contributors.  
> Integrates the **Get Shit Done (GSD v1.6.0)** development methodology and **Ponytail (FULL Mode)** engineering governance.

---

## 1. TERRALIGN Mission & Non-Negotiable Identity

- **Platform Name**: TERRALIGN (TERRA + ALIGN)
- **Brand Tagline**: *"Where Earth Meets Other Worlds."*
- **Problem Statement**: *"Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration."* (NASA Space Apps Challenge)
- **Target Audience**: Planetary scientists, mission planners, geological researchers, rover mobility engineers, EVA/astronaut training teams.

### What TERRALIGN IS:
- A scientifically rigorous, evidence-backed planetary analog intelligence platform.
- An explainable system evaluating terrestrial environments for specific lunar and Martian mission rehearsals.
- A high-fidelity 3D exploration and comparison tool emphasizing terrain, geomorphology, lighting, and regolith interaction.
- A provenance-preserving framework attributing every claim to authoritative planetary datasets (NASA PDS, USGS, ESA).

### What TERRALIGN IS NOT:
- ❌ NOT a generic AI chatbot or conversational wrapper.
- ❌ NOT a superficial tourism map or gallery of Earth landmarks.
- ❌ NOT a simplistic Earth-versus-Mars slider without underlying data.
- ❌ NOT an opaque AI-generated score without data provenance or uncertainty boundaries.
- ❌ NOT a tool that represents any Earth location as an exact copy of the Moon or Mars.

---

## 2. Scientific Integrity & The Analog Reality Gap

1. **The Non-Replica Law**: No terrestrial location is an exact replica of extraterrestrial bodies. All analogies are partial, domain-specific, and bounded.
2. **Resemblance vs. Suitability**:
   - *Geological / Mineralogical resemblance* (composition, basaltic volcanism, evaporites).
   - *Geomorphological resemblance* (dunes, lava tubes, cratering, gullies).
   - *Environmental resemblance* (hyper-aridity, thermal extremes, UV flux).
   - *Operational usefulness* (rover mobility, sensor testing, logistics).
   - *Mission-specific suitability* (relevance to a designated science or operational task).
   *High resemblance does not automatically confer mission suitability.*
3. **The Analog Reality Gap**: TERRALIGN must explicitly present the reality gap for every site:
   - Gravity disparity (Earth $1.0g$, Moon $0.166g$, Mars $0.38g$).
   - Atmosphere & pressure (Earth $101.3\text{ kPa}$, Mars $\sim 0.61\text{ kPa}$, Moon vacuum).
   - Radiation flux & magnetic shielding (Earth magnetosphere vs. unprotected lunar/Martian surfaces).
   - Weathering & regolith mechanics (aqueous/biological weathering on Earth vs. impact/space weathering on the Moon).
4. **Uncertainty & Negative Evidence**: Distinguish between lack of measurement and negative evidence. Never fabricate data points.

---

## 3. Ponytail Engineering Governance (FULL Mode)

**Core Paradigm: REUSE → SIMPLIFY → IMPLEMENT**

Every task, component, and architectural addition must be vetted through the **Ponytail Decision Ladder**:
1. **Does this need to exist at all?** (YAGNI — reject speculative abstractions and feature creep).
2. **Already in this codebase?** (Audit and reuse existing components, utilities, and types).
3. **Standard library does it?** (Native language features over external dependencies).
4. **Native platform feature does it?** (HTML5, CSS Grid/Flexbox, browser APIs over wrapper packages).
5. **Installed dependency does it?** (Exploit Three.js, React, Tailwind, GDAL capabilities before adding libraries).
6. **Can it be done in one line?** (Avoid ceremony, sprawling hierarchies, and premature microservices).
7. **Only then:** Write the absolute minimal implementation that satisfies requirements.

### Non-Negotiable Protections:
Simplification **must never** compromise:
- Scientific validity and mathematical accuracy.
- Data provenance and attribution.
- Security and credential protection.
- Reproducibility and deterministic algorithms.
- Validation, test coverage, and error boundaries.

---

## 4. Prompt Archive & Auditability Rules

1. **Permanent Archive Root**: `TERRALIGN-PROMPT-ARCHIVE/`
2. **Verbatim Preservation**: Every execution prompt must be preserved exactly in markdown with full YAML frontmatter metadata (`prompt_id`, `phase`, `title`, `version`, `date`, `ai_model`, `purpose`, `status`, `file_path`).
3. **Changelog & Index Synchrony**: Every prompt addition or revision must immediately update `PROMPT-INDEX.md` and `PROMPT-CHANGELOG.md`.
4. **Zero Fabrication**: Never invent or approximate missing prompts. A missing prompt must be flagged as `Pending User Input`.
5. **Zero Credentials**: Never store API keys, access tokens, passwords, or personal credentials in prompt archives or logs.

---

## 5. IDE-Independent Portability Protocol

The project must run identically across **Antigravity, Cursor, VS Code, or CLI**, regardless of the underlying LLM provider.

### Root Continuity Hierarchy:
```text
C:\NASA SPACE HACKATHON\
├── PROJECT_RULES.md          # Canonical rules & governing standards
├── AI-CONTEXT.md             # Vendor-neutral codebase summary & architecture
├── HANDOFF.md                # Real-time state, blockers & exact next action
├── TERRALIGN-PROMPT-ARCHIVE/ # Immutable prompt engineering record
└── .gsd/
    ├── SPEC.md               # Product requirements & scientific specs
    ├── ROADMAP.md            # Phase sequence, dependencies & milestones
    ├── STATE.md              # Granular session execution memory
    └── DECISIONS.md          # Architectural and scientific decision ledger
```

### Onboarding Protocol for Any New IDE / Agent:
Before modifying any code, the agent MUST read:
`PROJECT_RULES.md` → `AI-CONTEXT.md` → `HANDOFF.md` → `.gsd/STATE.md` → `.gsd/ROADMAP.md` → `.gsd/SPEC.md` → `.gsd/DECISIONS.md`.

---

## 6. GSD Core Protocol (Get Shit Done v1.6.0)

**SPEC → PLAN → EXECUTE → VERIFY → COMMIT**

1. **SPEC**: Requirements defined in `.gsd/SPEC.md`. Must reach `FINALIZED` before implementation begins (**Planning Lock**).
2. **PLAN**: Phases decomposed in `.gsd/ROADMAP.md` into 2-3 task `PLAN.md` files with verification criteria.
3. **EXECUTE**: Implementation with atomic commits per task.
4. **VERIFY**: Empirical proof required for all completed work.
5. **COMMIT**: Format `type(scope): description`.

### Empirical Proof Requirements:
Every change requires proof. Never accept "it should work":
- **API Endpoint**: `curl` / HTTP response code and output.
- **UI Component**: Rendered screenshot or interactive artifact verification.
- **Build / Compile**: Zero-exit command output.
- **Test**: Automated test runner logs.
- **Scientific Computation**: Verified numerical results against benchmark reference data.

---

## 7. Shell & Git Safety Discipline

1. **One command per invocation**: Never chain commands with `&&` or `||` (Windows PowerShell compatibility).
2. **Confirm commit landing**: Always verify with `git log -1 --oneline` after committing.
3. **No Empty Commits**: Never use `--allow-empty`.
4. **Explicit User Approval**: Never stage files (`git add`), create commits (`git commit`), configure remotes (`git remote add`), or push code without explicit user permission.
5. **Working Tree Cleanliness**: Respect `.gitignore` rules (Node modules, build directories, virtual environments, secrets).

---

## 8. Security & Credentials Policy

1. **Zero Hardcoded Secrets**: API keys (Stitch, Gemini, Supabase), tokens, and passwords must reside solely in environment files (`.env`) that are strictly ignored by Git.
2. **Sanitization**: Logs, reports, and error messages must mask sensitive variables.
3. **Dependency Auditing**: Every installed third-party package must be evaluated for vulnerabilities and licensing compliance.
