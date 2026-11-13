# TERRALIGN — PRM-113 Scientific Reconciliation Report
## Stage A: Lunar Surface & Polar Temperature Reconciliation

**Project:** TERRALIGN — *Where Earth Meets Other Worlds*  
**Document ID:** `TERRALIGN-DOC-PRM-113-TEMP`  
**Phase:** Phase 2 — Final Remediation & Phase 3 Gate Preparation  
**Stage:** Stage A of PRM-113 Final Remediation  
**Date:** 12 November 2026  
**Roles:** Senior Scientific Data Auditor, Planetary Geologist, Aerospace Systems Engineer  
**Governance:** Ponytail FULL (`REUSE → SIMPLIFY → IMPLEMENT`)  
**Workspace:** `C:\NASA SPACE HACKATHON`  

---

## 1. Executive Summary & Problem Statement

During the quality assurance audit preceding Phase 3 authorization, an apparent inconsistency was flagged regarding the lunar surface temperature in permanently shadowed regions (PSRs):
- **Value A (PRM-110, Section 2.1 & Screen 03 Prototype):** Approximately **$-233^\circ\text{C}$** ($40\text{ K}$).
- **Value B (PRM-112, Section 7 Scientific Claims & Research Doc 04):** Approximately **$-246^\circ\text{C}$** ($27\text{ K}$).

Rather than arbitrarily selecting one number or rewriting historical artifacts, this audit conducted an exhaustive cross-document trace across all Phase 1 and Phase 2 deliverables, audited the original NASA Lunar Reconnaissance Orbiter (LRO) Diviner Lunar Radiometer Experiment datasets, and resolved the discrepancy by establishing the precise physical, geographic, and temporal boundaries governing both values.

---

## 2. Occurrence Ledger Across Project Documentation

The table below catalogs every reference to lunar temperature values across the TERRALIGN repository:

| Document Path | Document Section / Line | Documented Value(s) | Citation / Stated Basis | Context & Usage |
|:---|:---|:---|:---|:---|
| `docs/research/04-earth-moon-mars-comparison.md` | Section 2, Line 19 | $-246^\circ\text{C}\text{ to }+121^\circ\text{C}$ | LRO Diviner / Planetary Fact Sheet | Global planetary extremes comparison (PSR record low vs equatorial noon peak). |
| `docs/design/final-scientific-integrity-register.md` | Audit Item `AUD-008` | PSR: $35\text{--}40\text{ K}$ ($-238^\circ\text{C}\text{ to }-233^\circ\text{C}$); Rim: $220\text{ K}$ ($-53^\circ\text{C}$); Eq: $396\text{ K}$ ($+123^\circ\text{C}$) | NASA LRO Diviner (Paige et al. 2010); NOAA NWS Flagstaff | Formal scientific register reconciling surface skin temperature vs terrestrial air temperature. |
| `docs/design/prototype-data-register.md` | Row 35 (Screen 3) | PSR: $-233^\circ\text{C}$ ($40\text{ K}$); Rim: $-53^\circ\text{C}$ ($220\text{ K}$); Eq: $+123^\circ\text{C}$ | LRO Diviner Radiometer PDS Archive | Screen 03 data integrity register for thermal boundary delta. |
| `docs/design/screen-03-analog-reality-gap.md` | Section 2 (Wireframe) & Section 3 | $-233^\circ\text{C}\text{ to }-53^\circ\text{C}$ polar ($+123^\circ\text{C}$ global eq max) | LRO Diviner Surface Radiometer | Screen 03 design specification for Cinder Lake $\rightarrow$ Shackleton Rim. |
| `docs/design/prm-110-reality-gap-design-blueprint.md` | Section 2.1 (Axis 3), Line 74 | $-246^\circ\text{C}\text{ to }-233^\circ\text{C}$ ($27\text{ K to }40\text{ K}$) | LRO Diviner (Paige et al. 2010 *Science*) | Detailed scientific audit disclosing both polar extremes. |
| `docs/design/prm-112-consolidated-design-review-and-phase-3-readiness.md` | Section 7 (Claims Summary) | $-246^\circ\text{C}$ in PSRs to $-53^\circ\text{C}$ on sunlit rims | LRO Diviner (Paige et al. 2010) | Synthesis table of environmental claims. |
| `.gsd/DECISIONS.md` | Decision `DEC-013` | $-233^\circ\text{C}\text{ to }-53^\circ\text{C}$ polar, $+123^\circ\text{C}$ equatorial | LRO Diviner / Paige et al. 2010 | Formal architectural decision ledger. |

---

## 3. Investigation of Scientific Datasets & Sensor Physics

The primary authoritative source for lunar surface temperatures is the **Diviner Lunar Radiometer Experiment** aboard NASA's Lunar Reconnaissance Orbiter (LRO), in continuous orbit since July 2009.

### 3.1 Primary Literature Sources
1. **Paige et al. (2010)**: *"Diviner Lunar Radiometer Experiment: Global Lunar Temperatures and Volatile Cold Traps,"* *Science*, Vol. 330, Iss. 6003, pp. 479–482. DOI: `10.1126/science.1187726`.
2. **Vasavada et al. (2012)**: *"Lunar equatorial surface temperatures and regolith properties from LRO Diviner Radiometer measurements,"* *J. Geophys. Res.*, 117, E00H18. DOI: `10.1029/2011JE003987`.
3. **Williams et al. (2017)**: *"The global surface temperatures of the Moon as measured by the Diviner Lunar Radiometer Experiment,"* *Icarus*, 283, pp. 300–325. DOI: `10.1016/j.icarus.2016.08.012`.

### 3.2 Geographic & Physical Origin of the Discrepancy

Our physical analysis reveals that **both $-233^\circ\text{C}$ ($40\text{ K}$) and $-246^\circ\text{C}$ ($27\text{ K}$) are empirically verified measurements from the Diviner radiometer**, but they describe **two distinct geographic environments and operational contexts**:

```
+--------------------------------------------------------------------------------------------------+
| LUNAR POLAR THERMAL REGIMES MEASURED BY LRO DIVINER (PAIGE ET AL. 2010)                          |
|                                                                                                  |
| [1. GLOBAL ABSOLUTE MINIMUM: -246°C / 26–27 K]                                                   |
|   ├── Location: HERMITE CRATER FLOOR, Lunar North Polar Region (86.0°N, 89.9°W)                  |
|   ├── Observation: Winter solstice nighttime bolometric brightness temperature                   |
|   ├── Context: Deepest, coldest topographic cold trap on the Moon (colder than Pluto)            |
|   └── Nature: Scientific benchmark for absolute solar system surface cold traps                  |
|                                                                                                  |
| [2. ARTEMIS LANDING TARGET MINIMUM: -238°C to -233°C / 35–40 K]                                  |
|   ├── Location: SHACKLETON CRATER INTERIOR / FAUSTINI / SHOEMAKER (Lunar South Pole, 89.9°S)     |
|   ├── Observation: Mean winter minimum surface skin temperature in Artemis III exploration zones |
|   ├── Context: Floor of craters immediately adjacent to candidate Artemis III ridge landing sites |
|   └── Nature: Operational engineering baseline for rover and spacesuit design                    |
|                                                                                                  |
| [3. ILLUMINATED POLAR RIM PEAK: -53°C / ~220 K]                                                  |
|   ├── Location: Shackleton Crater Rim / Connecting Ridge (Grazing low-angle solar incidence)    |
|   └── Delta: ΔT across ridge-to-floor traverse spans ~180 K over a distance of < 5 km            |
|                                                                                                  |
| [4. GLOBAL EQUATORIAL NOON MAXIMUM: +121°C to +123°C / 394–396 K]                                |
|   └── Location: Lunar Subsolar Point (Equator, solar noon, direct normal incidence AM0)          |
+--------------------------------------------------------------------------------------------------+
```

### 3.3 Radiometric vs Kinetic Temperature Definitions
- **Radiometric Brightness Temperature ($T_B$)**: Diviner measures thermal radiance across 7 infrared channels (Channels 3 to 9: $7.8\ \mu\text{m}$ to $400\ \mu\text{m}$). The values $26\text{--}27\text{ K}$ and $40\text{ K}$ represent **bolometric surface brightness temperatures** of the uppermost optical skin depth ($\le 1\text{ mm}$ of porous regolith).
- **Subsurface Kinetic Temperature ($T_{\text{sub}}$)**: At depths $\ge 1\text{ meter}$, the extreme diurnal surface fluctuations are completely damped by the ultra-low thermal conductivity of lunar regolith in vacuum ($k \approx 10^{-3}\text{ to }10^{-2}\text{ W m}^{-1}\text{ K}^{-1}$). In polar PSRs, subsurface temperatures stabilize at approximately **$40\text{ to }50\text{ K}$**.
- **Terrestrial Temperature Basis**: Terrestrial measurements cited for Cinder Lake ($-15^\circ\text{C}$ to $+38^\circ\text{C}$) are **meteorological air temperatures at $1.5\text{ m}$ height**, whereas ground surface skin temperatures for dark basaltic cinder span **$-20^\circ\text{C}$ to $+55^\circ\text{C}$**.

---

## 4. Canonical Reconciliation & Data Classification

To eliminate ambiguity across all future Phase 3 application components and UI readouts, TERRALIGN adopts the following canonical standard:

### 4.1 Canonical Reference Standards

| Environmental Context | Canonical Value(s) | Temperature in Kelvin | Epistemic Classification | Literature Citation | Usage in TERRALIGN Platform |
|:---|:---:|:---:|:---:|:---|:---|
| **Artemis South Pole Landing Envelope (Operational)** | **$-233^\circ\text{C}\text{ to }-53^\circ\text{C}$** | **$40\text{ K to }220\text{ K}$** | `[VERIFIED SOURCE DATA]` | Paige et al. (2010); Williams et al. (2017) | **Primary Benchmark for Screen 02 & Screen 03.** Represents the operational thermal traverse from illuminated Shackleton rim to interior PSR floor. |
| **Lunar Global Extreme Cold Record (Scientific Baseline)** | **$-246^\circ\text{C}$** (Range $-247^\circ\text{C}\text{ to }-246^\circ\text{C}$) | **$26\text{ K to }27\text{ K}$** | `[VERIFIED SOURCE DATA]` | Paige et al. (2010), Hermite Crater Floor | **Extreme Planetary Baseline.** Used when discussing the theoretical maximum thermal limits of the Moon. |
| **Lunar Global Equatorial Extreme (Solar Noon)** | **$+121^\circ\text{C}\text{ to }+123^\circ\text{C}$** | **$394\text{ K to }396\text{ K}$** | `[VERIFIED SOURCE DATA]` | Vasavada et al. (2012) | **Planetary Reference Datum.** Used to contrast polar landing conditions with equatorial subsolar extremes. |
| **Cinder Lake Analog Baseline (Terrestrial)** | **Air: $-15^\circ\text{C}\text{ to }+38^\circ\text{C}$**<br>**Basalt Skin: $-20^\circ\text{C}\text{ to }+55^\circ\text{C}$** | **$258\text{ K to }311\text{ K}$**<br>($253\text{ K to }328\text{ K}$) | `[VERIFIED SOURCE DATA]` | NOAA NWS Flagstaff Station Data; MODIS Land Surface Temp | **Terrestrial Comparison Baseline.** Explicitly specifies air temperature vs dark volcanic ground skin temperature. |

### 4.2 Explicit Rule for UI Presentation
1. When displaying the **Artemis South Pole Mission Context (Screen 03 Reality Gap)**, the canonical values are:
   $$\text{Lunar Polar Traverse Envelope: } -233^\circ\text{C} \text{ (PSR Floor, } 40\text{ K)} \text{ to } -53^\circ\text{C} \text{ (Sunlit Rim, } 220\text{ K)}$$
2. In contextual tooltips and technical documentation, the global Hermite Crater minimum shall be stated as:  
   *"Absolute lunar record cold trap is $-246^\circ\text{C}$ ($27\text{ K}$) in Hermite Crater (North Pole); Artemis South Pole landing sites in Shackleton/Faustini reach $-233^\circ\text{C}$ ($40\text{ K}$)."*

---

## 5. Audit Conclusion & Sign-Off

- **Discrepancy Root Cause:** Hermite Crater global record cold trap ($-246^\circ\text{C} / 27\text{ K}$) vs Shackleton/Faustini South Pole landing site PSR floor ($-233^\circ\text{C} / 40\text{ K}$).
- **Status:** **FULLY RECONCILED & DOCUMENTED**.
- **Action for Phase 3 Codebase:** When creating `data/analogs.json` and `data/destinations.json`, configure both `polar_psr_min_c: -233` (operational) and `global_min_c: -246` (record extreme) with explicit descriptive labels.

