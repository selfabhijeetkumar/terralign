

# SPEC.md — TERRALIGN Product Specification

> **Status**: `BASELINE SPECIFICATION FINALIZED` (Audited, Reconciled & Verified)  
> **Maturity**: Baseline specification finalized; known expert-elicited assumptions documented; unvalidated hypotheses and open technical questions tracked; future empirical validation required.  
> **Challenge**: NASA Space Apps Challenge — "Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration"  
> **Brand**: TERRALIGN (*"Where Earth Meets Other Worlds"*)  
> **Methodology**: GSD v1.6.0 · **Governance**: Ponytail FULL Mode  
> **Last Updated**: 2026-11-11 23:35:00+05:30

---

## 1. Vision & Product Purpose

**TERRALIGN** is an advanced, evidence-backed planetary analog intelligence platform designed for planetary scientists, aerospace mission planners, rover mobility engineers, and astronaut field training teams.

Instead of treating Earth environments as crude, unqualified replicas of extraterrestrial bodies, TERRALIGN formalizes the **Non-Replica Law** and the **Analog Reality Gap (ARG)**. The platform enables users to discover, evaluate, and characterize Earth environments across **5 distinct dimensions of resemblance**, matching terrestrial sites specifically to defined mission operational activities (e.g., Artemis III lunar South Pole low-angle lighting rehearsals, Mars Sample Return drill caching, CLPS rover wheel terramechanics).

---

## 2. Core Functional Requirements (FR)

### FR-1: Mission-Specific Analog Suitability Engine
- The system MUST allow users to select a target celestial body (Moon or Mars) and a designated mission operational activity.
- The evaluation engine MUST support **9 distinct operational surface exploration activities** plus **1 cross-cutting portfolio framework** (10 total domains):
  1. Rover Terramechanics & Mobility
  2. Lunar South Pole Low-Angle Lighting
  3. Astronaut EVA & Spacesuit Operations
  4. Cryogenic Volatile & Permafrost Drilling
  5. Subsurface Lava Tube Exploration
  6. Planetary Inverted Delta & Fluvial Science
  7. Hyper-Arid Astrobiology & Life Detection
  8. Autonomous Landing Hazard Detection
  9. Space Resource ISRU & Regolith Sintering
  10. Multi-Site Rehearsal Portfolio Synthesis
- The system MUST evaluate candidate sites using a transparent, multi-attribute utility matrix based on measured ground-truth parameters with expert-elicited heuristic weights.
- The system MUST output an explainable score decomposed into:
  - Mineralogical Compatibility
  - Geomorphological Similarity
  - Environmental / Climate Parallels
  - Geotechnical / Terramechanical Fidelity
  - Operational / Logistical Accessibility

### FR-2: Flagship Analog Landscape Knowledge Base
- The platform MUST include verified, evidence-backed baseline profiles for at least 7 primary planetary analog landscapes:
  1. **Atacama Desert (Yungay/Maria Elena, Chile)**: Hyper-arid soil chemistry, trace perchlorates in bulk soil with peak caliche deposits ($0.03\text{--}0.6\text{ wt}\%$), endoliths.
  2. **McMurdo Dry Valleys (Antarctica)**: Dry cold desert, cryo-permafrost drilling, endolithic habitats.
  3. **Iceland Volcanic Highlands (Askja / Holuhraun)**: Basaltic volcanism, Apollo & Artemis astronaut field geology traverses.
  4. **Hawaii Volcanic Province (Mauna Kea / HI-SEAS)**: JSC Mars-1 weathered palagonite dust benchmark, basaltic lava tube exploration.
  5. **San Francisco Volcanic Field / Cinder Lake (AZ, USA)**: Dynamited 1967 Apollo crater fields, loose angular cinder rover mobility.
  6. **Utah Desert / San Rafael Swell (MDRS, USA)**: Inverted fluvial channels, Jurassic sandstone stratigraphy, hematite concretions.
  7. **Devon Island (HMP, Canadian High Arctic)**: Haughton impact crater, permafrost gullies, high-latitude navigation.
- Every property MUST display an authoritative provenance citation (NASA PDS, USGS, ESA, or peer-reviewed DOI).

### FR-3: The Analog Reality Gap (ARG) Quantification
- For every analog match, the system MUST compute and render a quantified 6-axis **Analog Reality Gap Index**:
  1. Gravity Disparity ($1.0g$ vs $0.166g$/$0.38g$)
  2. Atmospheric Pressure Delta ($101.3\text{ kPa}$ vs vacuum / $0.6\text{ kPa}$)
  3. Temperature Boundary Delta ($\Delta T$)
  4. Solar Irradiance Variance ($1000\text{ W/m}^2$ vs $1361\text{ W/m}^2$ / $590\text{ W/m}^2$)
  5. Surface Radiation Flux ($<3\text{ mSv/yr}$ vs $60\text{--}300\text{ mSv/yr}$)
  6. Regolith Morphology & Abrasiveness (weathered smooth vs jagged unweathered glass)
- The system MUST provide actionable engineering compensation recommendations for each gap (e.g., gravity offloading harness, vacuum chamber testing, high dynamic range imaging).

### FR-4: Interactive 3D Terrain & Extreme Lunar Lighting Simulator
- The platform MUST render hardware-accelerated 3D elevation terrain meshes derived from official USGS 3DEP nationwide elevation data (high-resolution lidar for CONUS, Hawaii, and U.S. Territories; 5-meter IfSAR for Alaska; strictly U.S. domestic coverage only) and Copernicus DEM GLO-30/GLO-90 (for international sites), alongside NASA LRO LOLA DEMs.
- The 3D viewer MUST feature an interactive **Lunar South Pole Sun Position Slider** ($0^\circ\text{ to }5^\circ$ elevation above horizon), casting real-time raytraced shadows across the terrain.
- The viewer MUST include an atmospheric contrast toggle to demonstrate the absence of diffuse Rayleigh scattering in lunar vacuum.

### FR-5: Multi-Site Rehearsal Portfolio Generator (Proposed Research Target)
- The system MUST offer an optimization algorithm that recommends a complementary portfolio of 2 to 3 terrestrial sites targeting $>90\%$ of mission validation requirements (formulated as a combinatorial set-cover optimization hypothesis to be empirically validated against a formal requirements verification matrix).

### FR-6: Candidate Discovery & Novelty Classifier
- The system MUST allow users to filter global environmental layers (slope, elevation, aridity index, volcanic history) to surface unexplored candidate analog regions outside standard historical testing grounds.

### FR-7: Mission Dossier Export
- The system MUST generate a structured, print-ready digital Mission Planning Dossier containing site coordinates, suitability breakdowns, reality gap briefings, and bibliography DOIs.

---

## 3. Non-Functional & Quality Requirements (NFR)

1. **Performance**: Initial WebGL 3D terrain canvas must load and render within target $<2.0\text{ seconds}$ on baseline hardware; 3D view targeted for stable $60\text{ FPS}$ (Architectural Target).
2. **Design Language**: Space-grade, cinematic dark mode UI. Deep-space color palette (`#050811`, `#0A192F`, `#00D4AA`). Typography using Space Grotesk (headlines) and Space Mono (data/metrics). Strictly zero purple gradients or generic SaaS templates.
3. **Data Integrity & Provenance**: Zero fabricated metrics. If a parameter lacks ground truth, it must be explicitly labeled *Uncharacterized / Missing Data* and lower the Metric Confidence Score ($C$).
4. **Security & Privacy**: Zero hardcoded secrets, tokens, or credentials in repository files or client-side bundles. Environment variables managed strictly through Git-ignored `.env` files.
5. **Portability**: All code, documentation, and metadata must function seamlessly across Windows and POSIX environments and remain IDE-independent (Antigravity, Cursor, VS Code).

---

## 4. Non-Goals (Out of Scope for Hackathon MVP)

- ❌ Real-time live tasking of commercial high-resolution satellites.
- ❌ Multiplayer WebXR / Virtual Reality headset simulation.
- ❌ Direct upload of gigabyte-scale raw proprietary GeoTIFF rasters in the web UI.
- ❌ Real-world physical logistics booking or travel purchasing.

---

## 5. Success Criteria & Verification Gates

- [x] **Gate 1**: Comprehensive scientific research series compiled, audited, and cited (`docs/research/01` to `12`).
- [x] **Gate 2**: 7 flagship analog sites characterized with coordinates, geological setting, and NASA/USGS citations.
- [x] **Gate 3**: Quantified Analog Reality Gap equations and penalty models established.
- [x] **Gate 4**: Technical feasibility confirmed (Next.js 15, Three.js/R3F, MapLibre, Python/GDAL, Supabase).
- [x] **Gate 5**: Baseline specification marked `BASELINE FINALIZED` with documented assumptions and open questions tracked to unlock Phase 2 architecture and design.
