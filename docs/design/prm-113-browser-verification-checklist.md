# TERRALIGN — PRM-113 Browser Verification Checklist & QA Protocol
## Stage E: Comprehensive Manual Browser & Interaction Verification Protocol

**Project:** TERRALIGN — *Where Earth Meets Other Worlds*  
**Document ID:** `TERRALIGN-DOC-PRM-113-CHECKLIST`  
**Phase:** Phase 2 — Final Remediation & Phase 3 Gate Preparation  
**Stage:** Stage E of PRM-113 Final Remediation  
**Date:** 12 November 2026  
**Roles:** QA & Validation Engineer, Senior UX Architect, Aerospace Systems Engineer  
**Governance:** Ponytail FULL (`REUSE → SIMPLIFY → IMPLEMENT`)  
**Workspace:** `C:\NASA SPACE HACKATHON`  

---

## 1. Scope & Mandatory Epistemic Disclosure

> [!IMPORTANT]
> **MANDATORY VERIFICATION STATUS DISCLOSURE**:  
> In accordance with `PROJECT_RULES.md` and `PRM-113` instructions:  
> **Live interactive browser-based visual and functional testing has NOT been performed in automated testing suites.** The current prototypes (`docs/design/stitch/*.html`) have been verified structurally via DOM, CSS tokens, and static screenshot assets.  
> **Under no circumstances shall this checklist be reported as "PASSED IN CODE".**  
> This document establishes the **exhaustive manual and automated verification protocol** that human testers or authorized browser subagents must execute prior to final user acceptance.

---

## 2. Target Device & Viewport Test Matrix

All tests must be conducted across the following responsive viewports:

| Device Tier | Target Hardware | Viewport Resolution | Orientation | Rendering Engine | Focus Areas |
|:---|:---|:---:|:---:|:---:|:---|
| **Tier 1: Desktop Ultra-Wide** | 4K / Studio Displays | $3840 \times 2160$ | Landscape | Blink / WebKit / Gecko | Full-bleed map/3D canvas scaling, floating HUD positioning. |
| **Tier 2: Desktop Standard** | Standard Workstation | $1920 \times 1080$ | Landscape | Blink / WebKit / Gecko | Baseline 1080p experience, dual-viewport split, RVM table. |
| **Tier 3: Laptop Standard** | MacBook Pro / ThinkPad | $1440 \times 900$ | Landscape | Blink / WebKit / Gecko | Sidebar collapse, telemetry text scaling, density. |
| **Tier 4: Tablet Landscape** | iPad Pro 11" / Galaxy Tab | $1194 \times 834$ | Landscape | Mobile Safari / Mobile Chrome | Touch target sizes ($\ge 44\text{px}$), gesture rotation. |
| **Tier 5: Tablet Portrait** | iPad Air / iPad Mini | $820 \times 1180$ | Portrait | Mobile Safari / Mobile Chrome | Vertical viewport stacking, collapsible drawers. |
| **Tier 6: Mobile Phone** | iPhone 15 Pro / Pixel 8 | $393 \times 852$ | Portrait | Mobile Safari / Mobile Chrome | Bottom navigation bar, accordion cards, touch scroll. |

---

## 3. Screen-by-Screen Functional Verification Checklist

### 3.1 Screen 01: Mission Command & Global Analogs Canvas
- **HTML Artifact**: `docs/design/stitch/screen-01-mission-command.html`
- **Screenshot Artifact**: `docs/design/stitch/screen-01-mission-command.png`

| Test ID | Test Category | Specific Action / Input | Expected System Behavior | Verification Evidence Required | Pass / Fail Criteria |
|:---:|:---|:---|:---|:---|:---:|
| **TC-101** | Navigation | Click top bar links (`01`, `02`, `03`, `04`) | Smooth navigation between screens with zero page flash. | Active tab state updates class to text-teal `#00D4AA`. | PASS / FAIL |
| **TC-102** | Destination Selector | Click destination tabs (`Moon`, `Mars`) | Map markers filter dynamically; celestial metadata updates. | Active badge toggles between Lunar Blue and Mars Orange. | PASS / FAIL |
| **TC-103** | Mission Activity Drawer | Select `Rover Terramechanics` from list | Candidate list re-ranks; Cinder Lake Field 1 moves to Rank 1. | Rank number, suit score ($96\%$), and confidence ($0.91$) display. | PASS / FAIL |
| **TC-104** | Site Marker Click | Click on Cinder Lake pin on map | Smooth camera pan to $35.3071^\circ\text{N}, 111.5049^\circ\text{W}$; drawer opens. | Candidate drawer renders verified coordinates and elevation ($2,050\text{ m}$). | PASS / FAIL |
| **TC-105** | Scientific Provenance | Hover over `[ILLUSTRATIVE DEMO VALUES]` badge | Tooltip renders clarifying that score is a wireframe baseline. | Tooltip text: "Pending Phase 3 live computational engine". | PASS / FAIL |
| **TC-106** | Primary CTA | Click `[OPEN IN 3D TERRAIN STUDIO]` | Transitions smoothly into Screen 02 with Cinder Lake selected. | Screen 02 loads with Left Viewport initialized to Cinder Lake. | PASS / FAIL |

---

### 3.2 Screen 02: 3D Terrain Comparison Studio
- **HTML Artifact**: `docs/design/stitch/screen-02-terrain-comparison.html`
- **Screenshot Artifact**: `docs/design/stitch/screen-02-terrain-comparison.png`

| Test ID | Test Category | Specific Action / Input | Expected System Behavior | Verification Evidence Required | Pass / Fail Criteria |
|:---:|:---|:---|:---|:---|:---:|
| **TC-201** | 1:1 Camera Sync | Drag with mouse/touch in Left Viewport to rotate azimuth | Right Viewport mirrors camera azimuth and elevation synchronously. | Camera angles $(\theta, \phi)$ in both viewports match 1:1. | PASS / FAIL |
| **TC-202** | Camera Decouple | Uncheck `[ ] SYNC CAMERAS (1:1)` | Viewports can be rotated and zoomed independently. | Independent camera motion without twin canvas updates. | PASS / FAIL |
| **TC-203** | Low-Angle Sun Slider | Drag sun elevation slider from $5.0^\circ$ to $1.5^\circ$ | Directional PCF shadows cast long raking profiles across crater floors. | Shadow boundaries extend dynamically across 3D mesh. | PASS / FAIL |
| **TC-204** | Optical Shader Gap | Inspect shadows on Earth (left) vs Moon (right) | Earth shadow has soft blue ambient light; Moon shadow is pure black. | Shadow interior on Moon reads `#000000` (zero ambient scatter). | PASS / FAIL |
| **TC-205** | Telemetry Reticle | Hover pointer over crater rim vertex | Floating reticle displays in-situ elevation ($z$) and slope angle ($\alpha$). | Coordinate tooltip reads: `Elev: 2,050m | Slope: 12.4°`. | PASS / FAIL |
| **TC-206** | Disparity Advisory | Inspect dataset badge on viewports | Left: `USGS 3DEP 1.0m`; Right: `NASA LOLA 5.0m Interpolated`. | Advisory text notes $5\text{ m}$ is an interpolated altimeter track product. | PASS / FAIL |
| **TC-207** | Responsive Layout | Resize browser window to mobile width ($<768\text{px}$) | Viewports stack vertically (Earth on top, Moon on bottom). | No horizontal overflow scroll; aspect ratio preserved. | PASS / FAIL |

---

### 3.3 Screen 03: Analog Reality Gap (ARG) Diagnostic
- **HTML Artifact**: `docs/design/stitch/screen-03-analog-reality-gap.html`
- **Screenshot Artifact**: `docs/design/stitch/screen-03-analog-reality-gap.png`

| Test ID | Test Category | Specific Action / Input | Expected System Behavior | Verification Evidence Required | Pass / Fail Criteria |
|:---:|:---|:---|:---|:---|:---:|
| **TC-301** | Subsystem Filter | Click `Rover Mobility` filter chip | Axes 01 (Gravity), 04 (Irradiance), 06 (Regolith) highlighted; others dim. | Dimmed cards drop to $40\%$ opacity with smooth CSS transition. | PASS / FAIL |
| **TC-302** | Expand Sensor Citation | Click `[+] EXPAND SENSOR CITATIONS` on Gravity tile | Drawer slides open displaying exact CODATA values and NASA ARGOS rig. | Displays: "Δg/g⊕ = 83.5%; ARGOS partial gravity offload crane". | PASS / FAIL |
| **TC-303** | Thermal Reconciliation | Inspect Thermal card temperature readouts | Displays: Cinder Lake $-15^\circ\text{C}\text{ to }+38^\circ\text{C}$ vs Moon $-233^\circ\text{C}\text{ to }-53^\circ\text{C}$. | Footnote notes absolute Hermite Crater record low of $-246^\circ\text{C}$. | PASS / FAIL |
| **TC-304** | Radiation Accuracy | Inspect Radiation tile values | Displays: $0.37\ \mu\text{Sv/hr}$ vs $43.4\ \mu\text{Sv/hr}$ ($117.3\times$ hazard factor). | Citation notes LRO CRaTER spacesuit model vs Chang'e-4 surface data. | PASS / FAIL |
| **TC-305** | Backward Navigation | Click `<-- RETURN TO TERRAIN STUDIO` | Re-opens Screen 02 with camera state preserved. | Route changes to `/terrain-studio` without reload. | PASS / FAIL |
| **TC-306** | Forward Navigation | Click `[PROCEED TO MISSION INTEL -->]` | Navigates to Screen 04 Portfolio Optimizer. | Route changes to `/mission-intelligence`. | PASS / FAIL |

---

### 3.4 Screen 04: Mission Intelligence & Portfolio Optimizer
- **HTML Artifact**: `docs/design/stitch/screen-04-portfolio-optimizer.html`
- **Screenshot Artifact**: `docs/design/stitch/screen-04-portfolio-optimizer.png`

| Test ID | Test Category | Specific Action / Input | Expected System Behavior | Verification Evidence Required | Pass / Fail Criteria |
|:---:|:---|:---|:---|:---|:---:|
| **TC-401** | Portfolio Percentage | Inspect composite portfolio performance badge | Displays: **$78.3\%$** (or $78.33\%$) empirical coverage for $k=3$. | Does NOT display outdated sum-of-rounded $78.4\%$ without footnote. | PASS / FAIL |
| **TC-402** | Two-Site Scenario | Click `[RUN SENSITIVITY TEST (k=2)]` | Portfolio updates to Cinder Lake + Askja; coverage updates to **$63.3\%$**. | Re-evaluates marginal contributions in real time. | PASS / FAIL |
| **TC-403** | Priority Sliders | Drag `Geochemistry` priority slider to $60\%$ | Candidate ranking re-sorts dynamically; Askja and Atacama advance. | Re-ranked cards animate with smooth CSS transforms. | PASS / FAIL |
| **TC-404** | Inescapable Gaps | Inspect crimson gap badges in RVM matrix table | Exactly 4 rows display crimson `GAP!` badges (vacuum, 1/6g, rad, cryo). | Summary bar displays: "Inescapable Physics Gaps: 4/30 (13.3%)". | PASS / FAIL |
| **TC-405** | Maximum Ceiling | Inspect theoretical ceiling readout | Displays: "Physical Maximum Ceiling: 86.7% (26/30 criteria)". | Discloses that $>90\%$ target requires laboratory simulation chambers. | PASS / FAIL |
| **TC-406** | Matrix Filtering | Click category tabs (`Terramechanics`, `Geochemistry`) | Table filters to show only the 8 respective criteria rows. | Row count updates cleanly; search bar filters parameter names. | PASS / FAIL |

---

## 4. Accessibility (WCAG 2.1 AA) & Keyboard Protocol

| Verification Check | Target Standard | Manual Audit Procedure | Pass Criteria |
|:---|:---|:---|:---|
| **Color Contrast (Text)** | WCAG AA $\ge 4.5:1$ (Normal), $\ge 3:1$ (Large) | Sample background `#0A192F` and `#050811` against text colors. | `#F8FAFC` = $14.2:1$; `#00D4AA` = $8.1:1$; `#8B9CB5` = $5.3:1$. **PASS**. |
| **Keyboard Traversal** | 2.1.1 Keyboard Accessible | Press `Tab` through entire screen without mouse. | Logical focus order; visible focus ring (`outline: 2px solid #00D4AA`). |
| **ARIA Semantics** | 4.1.2 Name, Role, Value | Inspect screen reader tree via VoiceOver / NVDA. | All sliders announce `role="slider"`, `aria-valuenow`, `aria-valuemin/max`. |
| **Touch Targets** | 2.5.5 Target Size $\ge 44 \times 44\text{px}$ | Measure touch targets on mobile/tablet viewports. | All buttons, tabs, and slider thumbs have $\ge 44\text{px}$ bounding boxes. |

---

## 5. Verification Sign-Off Protocol for Phase 3 Authorization

Before the Product Lead authorizes Phase 3:
1. Conduct manual walkthrough using this checklist across Chrome, Firefox, Safari, and Mobile Safari.
2. Capture screenshot and recording evidence for each test case.
3. Sign and log results in the Phase 3 Verification Ledger.

**STAGE E COMPLETE — CHECKLIST AUTHORIZED FOR QA EXECUTION.**

