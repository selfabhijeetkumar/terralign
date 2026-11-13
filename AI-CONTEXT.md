

# AI-CONTEXT.md — Vendor-Neutral Project Context for TERRALIGN

> **Target Audience**: AI Coding Assistants, LLM Agents (Gemini, Claude, GPT, DeepSeek), and Engineers across any IDE (Antigravity, Cursor, VS Code).  
> **Last Verified**: 2026-11-13 23:22:00+05:30  
> **Repository Path**: `C:\NASA SPACE HACKATHON`  
> **Project Status**: Phase 1 & 2 Complete · Git Baseline Commit (`adcc017`) Recorded · Phase 3 Wave 3.1 Tasks 3.1.1 & 3.1.2 COMPLETE & VERIFIED (ApplicationShell + TopNavBar + 4-Screen Viewport Routing, 106 kB First Load JS) · Task 3.1.3 Scope Gated

---

## 1. Project Purpose & Scope

- **Project**: TERRALIGN
- **Category**: Planetary Analog Intelligence Platform
- **Challenge Statement**: *"Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration"* (NASA Space Apps Challenge)
- **Tagline**: *"Where Earth Meets Other Worlds."*
- **Primary Goal**: Enable planetary scientists, mission planners, and engineers to discover, evaluate, and characterize Earth environments as operational and scientific analogs for lunar and Martian exploration missions.
- **Key Differentiator**: Moving beyond simplistic visual resemblance or generic maps to provide **mission-specific analog characterization across 10 evaluation domains**, transparent **Analog Reality Gap** quantification, multi-site portfolio optimization, and scientifically grounded 3D terrain exploration with low-angle lunar solar illumination simulation.

---

## 2. Current Technology Stack & Environment

| Layer | Technology | Status / Version | Notes |
|:---|:---|:---|:---|
| **OS / Shell** | Windows / PowerShell 5.1+ | Verified | Strict single-command shell discipline; no `&&` or `\|\|`. |
| **Runtime (Node)** | Node.js v24.14.0 / npm 11.21.0 / pnpm 9.12.2 | System Verified | Core runtime for upcoming Next.js frontend. |
| **Runtime (Python)** | Python 3.13.15 / pip 26.2.1 | System Verified | For scientific data pipelines, GDAL/raster processing. |
| **Version Control** | Git (`master` branch) | Initialized | Clean working tree; comprehensive `.gitignore` configured. |
| **Methodology** | GSD v1.6.0 (Get Shit Done) | Fully Installed | In `.agent/workflows`, `.agents/skills`, `.agents/agents`, `.gsd`. |
| **Engineering Governance**| Ponytail (FULL Mode) | Activated | `REUSE → SIMPLIFY → IMPLEMENT`. Minimal complete code. |
| **Code Review** | CodeRabbit | Installed Plugin | Automated PR and uncommitted change review. |
| **Design System Tool** | Stitch MCP | Verified Active | 4 high-fidelity screen designs generated, HTML & PNG exported. |
| **Documentation Tool** | Context7 MCP | Configured & Ready | Fetches up-to-date documentation for libraries/frameworks. |
| **Database & Auth Tool**| Supabase MCP | Configured (Dev) | Available for PostGIS spatial data and Edge Functions. |
| **API Proxy** | `gemini-web2api/` | Present | Local OpenAI-compatible gateway for Gemini models. |

---

## 3. Repository Architecture & Layout

```text
C:\NASA SPACE HACKATHON\
├── .agent/workflows/         # GSD workflow definitions (/map, /plan, /execute, /verify)
├── .agents/
│   ├── agents/               # GSD subagent definitions (gsd-executor, gsd-planner, etc.)
│   └── skills/               # GSD skill library (token-budget, empirical-validation, etc.)
├── .gemini/                  # Gemini project configuration and mission control
├── .git/                     # Git version control metadata
├── .gsd/
│   ├── SPEC.md               # Product requirements marked BASELINE FINALIZED
│   ├── ROADMAP.md            # Execution milestones, phases, and dependencies
│   ├── STATE.md              # Active project execution state and wave tracking
│   ├── DECISIONS.md          # Formal architecture & scientific decision ledger
│   ├── templates/            # GSD markdown templates (PLAN, SUMMARY, VERIFICATION)
│   └── examples/             # Workflow guidance and reference examples
├── adapters/                 # Model adapters (GEMINI.md)
├── docs/
│   ├── research/             # Evidence-backed Phase 1 scientific findings (12 docs)
│   ├── design/               # Phase 2 UI/UX design specs, IA, wireframes, data registers & Stitch exports
│   │   ├── prototype-data-register.md        # PRM-105 prototype data register
│   │   ├── final-scientific-integrity-register.md # PRM-106 mathematical & physical reconciliation ledger
│   │   └── stitch/           # 4 Screen HTML files and high-res PNG screenshots
│   └── architecture/         # Phase 2 technical architecture specifications (10 docs)
├── gemini-web2api/           # Local Python API gateway utility
├── scripts/                  # Codebase search and validation scripts
├── TERRALIGN-PROMPT-ARCHIVE/ # Permanent, verbatim prompt registry (Phase-0 to Phase-4)
├── .gitignore                # Multi-stack ignore rules (Node, Python, secrets, OS)
├── AI-CONTEXT.md             # This file (vendor-neutral orientation guide)
├── HANDOFF.md                # Real-time state transfer and next action pointer
├── GSD-STYLE.md              # Conventions for executable plans and XML tags
├── model_capabilities.yaml   # Guidance for matching tasks to LLM reasoning tiers
├── PROJECT_RULES.md          # Canonical project rules, mission identity, and constraints
└── VERSION                   # System version (GSD 1.6.0)
```

---

## 4. Scientific Assumptions & Core Limitations

1. **Non-Replica Principle**: No location on Earth replicates lunar or Martian environments in their entirety. Earth has $1.0g$ gravity, a dense atmosphere ($101.3\text{ kPa}$), a global magnetic field, and active biological/hydrological weathering.
2. **5-Dimensional Evaluation**:
   - *Geological Resemblance* (lithology, mineralogy, basaltic rock chemistry).
   - *Geomorphological Resemblance* (impact craters, dunes, yardangs, lava tubes, inverted channels).
   - *Environmental Resemblance* (hyper-aridity, UV flux, temperature cycling, permafrost).
   - *Operational Utility* (rover trafficability, communications latency testing, spacesuit ergonomics).
   - *Mission-Specific Suitability* (weighted fitness for a designated science or testing goal).
3. **10 Characterized Mission Evaluation Domains**:
   - 9 Operational Surface Exploration Activities (Rover Terramechanics, Low-Angle Lighting, Astronaut EVA, Cryogenic Drilling, Lava Tubes, Inverted Deltas, Astrobiological Life Detection, Landing Hazards, ISRU Sintering).
   - 1 Cross-Cutting Portfolio Synthesis Framework (Multi-Site Rehearsal Portfolio Generator).
4. **Data Provenance & Boundaries**:
   - High-resolution elevation data via USGS 3DEP is **nationwide across the United States only** (lidar for CONUS, Hawaii, and U.S. Territories; 5-meter IfSAR for Alaska; strictly U.S. domestic coverage only, NOT global).
   - Global terrestrial reconnaissance relies on Copernicus GLO-90 (open) or GLO-30 Public (with regional exclusions).
   - High-resolution Mars HiRISE DTMs cover $<3\%$ of Mars (targeted, not continuous).
5. **Research Targets vs. Empirical Capabilities**:
   - Multi-site portfolio $>90\%$ coverage is an **architectural research target / hypothesis**, to be validated via combinatorial set-cover optimization against formal NASA requirements verification matrices.
   - Missing-data neutral 0.5 scoring is an **unvalidated heuristic assumption** with documented regression-to-the-median bias, bounded by Metric Confidence Score $C(L,A)$ and sensitivity intervals $[S_{\min}, S_{\max}]$.

---

## 5. Portability & Manual Setup Prerequisites

Portability is universal at the repository documentation level, but requires manual setup for local execution runtimes:
1. **Repository Documents**: 100% portable across any OS, Git client, and IDE (Antigravity, Cursor, VS Code, Zed).
2. **Local Runtimes**: Node.js v20+/v24+ and Python 3.10+ must be installed on host system PATH.
3. **Git Remote**: Local Git repo is initialized on `master`; Git remote must be added manually (`git remote add origin <URL>`).
4. **Secrets & MCP Configuration**: API tokens (`STITCH_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) and MCP configurations (`mcp.json`) are host-specific and Git-ignored.
5. **Cold-Start Runbook**: Follow the detailed cold-start checklist in [`HANDOFF.md`](file:///c:/NASA SPACE HACKATHON/HANDOFF.md) when resuming in a fresh IDE or machine.

---

## 6. Instructions for an Onboarding AI Assistant

When resuming or continuing work on this codebase in ANY environment:

1. **Read Sequence**:
   - Step 1: Read [`PROJECT_RULES.md`](file:///c:/NASA SPACE HACKATHON/PROJECT_RULES.md) (governing principles).
   - Step 2: Read [`AI-CONTEXT.md`](file:///c:/NASA SPACE HACKATHON/AI-CONTEXT.md) (this file).
   - Step 3: Read [`HANDOFF.md`](file:///c:/NASA SPACE HACKATHON/HANDOFF.md) (current position & exact next task).
   - Step 4: Read [`.gsd/STATE.md`](file:///c:/NASA SPACE HACKATHON/.gsd/STATE.md) and [`.gsd/ROADMAP.md`](file:///c:/NASA SPACE HACKATHON/.gsd/ROADMAP.md).
2. **Check Current Gate**: Phase 1 complete; Phase 2 (Design, Architecture & PRM-105 Data Integrity Audit) complete; Phase 3 requires explicit Product-Lead approval before execution. Do NOT write application code or install packages until approved.
3. **Check Git Status**: Run `git status` to verify working tree hygiene.
4. **Follow Shell Discipline**: Issue only one shell command per tool call; never chain with `&&` or `||`.
5. **Empirical Verification**: Run the verification command for every completed task and document output before claiming completion.
