# TERRALIGN 2.0 — PHASE 1 FINAL SCIENTIFIC CONSISTENCY AUDIT
**Document Reference:** `TERRALIGN-GOV-AUD-2.0-001`  
**Audit Type:** Strict Read-Only Scientific & Geodetic Consistency Audit  
**Date:** November 15, 2026  
**Auditor:** Principal Software Architect, Planetary Geospatial Specialist & Geodetic QA Lead  
**Governing Standard:** GSD v1.6.0 · Ponytail FULL (REUSE → SIMPLIFY → IMPLEMENT)  
**Status:** **AUDIT COMPLETE — 4 AREAS INVESTIGATED — NO CODE MODIFIED**

---

## 1. EXECUTIVE AUDIT SUMMARY

Before proceeding to Phase 2 (Google Gemini AI Integration), a comprehensive, **strict read-only audit** was conducted across the codebase, UI layers, API endpoints, and scientific data providers.

This audit investigated four critical areas highlighted during manual verification:
1. **Global Telemetry Status:** Analysis of the `NASA · USGS / TELEMETRY LIVE` badge in `TopNavBar.tsx` and the distinction between provider ping connectivity versus actual elevation provenance.
2. **Scientific Grid Provenance:** Investigation of `/api/science/terrain`, `terrainGridProvider.ts`, and `TerrainCanvas.tsx` to verify whether returned grids are raw provider rasters, calibrated static models, or synthetic morphometric grids.
3. **Elevation Consistency for Cinder Lake:** Tracing the exact origin of $2,050\text{ m}$ (Mission Command, Portfolio) versus $2,022.09\text{ m}$ (Live Data Lab, `/api/science/elevation`), identifying their respective sources, datums, and geomorphic contexts.
4. **Vertical Datum Specification:** Inspecting the presentation of `NAVD88 / EGM96 Geoid` in `earthProvider.ts` and Live Data Lab to verify that orthogonal vertical datums are not conflated.

---

## 2. DETAILED FINDINGS & EVIDENCE

### 2.1 Investigation 1: Global Telemetry Status & Provenance Semantics

#### 2.1.1 Source Inspection
- **File:** `src/components/layout/TopNavBar.tsx` (Lines 200–205)
```tsx
{/* Dataset Scientific Provenance Status */}
<div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0A192F]/90 border border-[#8B9CB5]/25 text-[10px] font-mono text-[#8B9CB5] shadow-sm">
  <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
  <span className="text-white font-semibold">NASA · USGS</span>
  <span className="text-[#00D4AA] font-bold">TELEMETRY LIVE</span>
</div>
```
- **File:** `src/app/live-data/page.tsx` (Lines 290–315)
Consumes `/api/science/health`, querying actual round-trip latency to USGS and NASA PDS ODE:
- USGS OpenTopoData: ~450–600ms (`HEALTHY`)
- NASA PDS ODE LOLA: ~1100–1400ms (`HEALTHY`)
- NASA PDS ODE MOLA: ~1050–1350ms (`HEALTHY`)

#### 2.1.2 Empirical Findings
1. **Static vs Dynamic:** The `TopNavBar.tsx` badge is a static visual indicator. It does not subscribe to `/api/science/health` or poll endpoint statuses.
2. **Connectivity vs Provenance:** 
   - A live HTTP 200 response from an API provider indicates **service connectivity**, NOT necessarily that the elevation numbers returned are live pixel Extractions.
   - For **Earth**, queries to OpenTopoData (NED 10m) or USGS EPQS (1m LiDAR) perform live coordinate lookups and return `cacheStatus = 'LIVE DATA'` (or `CACHED DATA` on subsequent hits).
   - For **Moon (LRO LOLA)** and **Mars (MGS MOLA)**: The providers query NASA PDS ODE *exclusively for product metadata discovery* (e.g., product names `ldem_128_float`, `mega90n000cb.img`, XML labels, UTC observation timestamps). The elevation number itself is calculated from calibrated mathematical reference models (`calculateLunarElevationModel` and `calculateMarsElevationModel`) anchored to the IAU spherical datums ($R_{\text{ref}} = 1,737,400\text{ m}$ for the Moon; GMM-3 Areoid $R_{\text{ref}} = 3,396,190\text{ m}$ for Mars).
   - Consequently, the API correctly classifies Moon and Mars responses as `cacheStatus: 'STATIC REFERENCE'`, with live ODE metadata attached in the `quality` object.
3. **Epistemic Risk:** Displaying `TELEMETRY LIVE` persistently in the global roof bar across all screens (including Mission Command, Reality Gap, and Portfolio, which operate on static curated analog profiles and RVM matrices) risks misleading non-technical users into assuming extraterrestrial elevation data is streaming live from orbital spacecraft instruments.

---

### 2.2 Investigation 2: Scientific Grid Provenance & "Scientific Grid" Mode

#### 2.2.1 Source Inspection
- **File:** `src/app/api/science/terrain/route.ts` (Lines 1–100)
- **File:** `src/lib/science/providers/terrainGridProvider.ts` (Lines 57–147)
- **File:** `src/components/terrain/TerrainCanvas.tsx` (Lines 773–830, 871–885, 912–916)
- **File:** `src/components/terrain/TerrainControls.tsx` (Lines 54–91)

#### 2.2.2 Empirical Findings
1. **Grid Generation Pipeline:**
   - In `terrainGridProvider.ts`, `generateTerrainGrid` receives `centerLat`, `centerLng`, `gridSize` (default $64$), and `spanMeters` (default $2,000\text{ m}$ or $3,400\text{ m}$).
   - It performs a **single point query** at `(centerLat, centerLng)` to establish `centerElevation`.
   - It then populates the $N \times N$ matrix ($64 \times 64 = 4,096$ values) using synthetic procedural equations representing characteristic geomorphology:
     - **Earth (Cinder Lake):** Superimposes two blast crater depressions, a cinder cone mound, and basalt surface roughness onto `centerElevation`:
       $$\Delta z = -18 e^{-(3.5 r_1)^2} - 14 e^{-(4.2 r_2)^2} + 32 e^{-(2.8 r_3)^2} + \text{roughness}(u, v)$$
     - **Moon (Shackleton):** Superimposes rim wall ridges, interior bowl depression, micro-craters, and regolith noise onto `centerElevation`:
       $$\Delta z = \text{rimRidge}(r) + \text{bowlDepth}(r) + \text{microCrater}(u, v) + \text{regolithNoise}(u, v)$$
     - **Mars (Jezero):** Superimposes a hyperbolic tangent delta scarp, river channel depression, and yardang ripples onto `centerElevation`:
       $$\Delta z = 42 \tanh(3(n_x + 0.2\sin(3n_y))) - 16 e^{-(5 y_c)^2} - 24 e^{-(5 r_{\text{crater}})^2} + \text{ripples}(u, v)$$
2. **Three.js Consumption in `TerrainCanvas.tsx`:**
   - When `dataMode === 'scientific_grid'`, `TerrainCanvas.tsx` fetches this $64 \times 64$ matrix and bilinearly interpolates it across the Three.js mesh's $192 \times 192$ vertices ($36,864$ vertices).
3. **Evidence Inconsistency in UI Labels:**
   - In `TerrainControls.tsx` (Line 89), the label claims:
     `Real NxN gridded elevation matrix retrieved via USGS 3DEP & NASA LOLA ODE APIs.`
   - In `TerrainCanvas.tsx` (Line 882), it labels the model:
     `Real Scientific Elevation Grid (Three.js WebGL)`
   - In `TerrainCanvas.tsx` (Line 914), it displays the watermark:
     `REAL SCIENTIFIC ELEVATION GRID (USGS 3DEP / NASA LOLA ODE)`
   - In `terrainGridProvider.ts` (Line 62, 70), `result.cacheStatus` is stamped `LIVE DATA` for Earth.
4. **Audit Assessment:**
   - The grid is **NOT a direct raster DEM downloaded from USGS 3DEP or NASA LOLA ODE**.
   - It is a **calibrated synthetic morphometric elevation matrix anchored to a single live or static provider elevation datum**.
   - Calling it a "Real Scientific Elevation Grid retrieved via USGS 3DEP & NASA LOLA ODE APIs" is a clear overstatement of data provenance.

---

### 2.3 Investigation 3: Cinder Lake Elevation Consistency ($2,050\text{ m}$ vs $2,022.09\text{ m}$)

#### 2.3.1 Source Inspection
- **File:** `data/analogs.json` (Lines 8–13)
  ```json
  "coordinates": { "lat": 35.3071, "lng": -111.5049 },
  "elevationMeters": 2050,
  "elevationDescription": "2,050m crater floor basin; surrounding volcanic cinder hills rise to 2,130m"
  ```
- **File:** `src/lib/science/providers/earthProvider.ts` (Lines 25–32, 153–173)
  `cinder_lake: { elev: 2022.09, dataset: 'usgs_ned_10m' }`
- **File:** `src/components/discovery/MissionCommandView.tsx` (Line 232): `Elev {site.elevationMeters}m` $\rightarrow$ displays **Elev 2050m**
- **File:** `src/components/portfolio/PortfolioOptimizerView.tsx` (Line 362): `Elevation: {item.site?.elevationMeters}m` $\rightarrow$ displays **Elevation: 2050m**
- **File:** `src/app/live-data/page.tsx` (Line 484): Displays `pointData.elevationMeters` $\rightarrow$ displays **2022.09 m**

#### 2.3.2 Empirical Elevation Query Tracing
To identify whether these values represent different references or a defect, direct live queries were executed against both official elevation APIs at coordinate $(35.3071^\circ\text{N}, -111.5049^\circ\text{W})$:

1. **Direct USGS 3DEP 1m LiDAR (National Map EPQS):**
   ```powershell
   GET https://epqs.nationalmap.gov/v1/json?x=-111.5049&y=35.3071&units=Meters&wkid=4326
   ```
   **Result:**
   ```json
   {
     "location": { "x": -111.5049, "y": 35.3071 },
     "value": "2019.630737305",
     "rasterId": 143181,
     "resolution": 1
   }
   ```
   $\rightarrow$ Exact 1m LiDAR ground elevation: **2,019.63 m** (NAVD88).

2. **Direct OpenTopoData USGS NED 10m:**
   ```powershell
   GET https://api.opentopodata.org/v1/ned10m?locations=35.3071,-111.5049
   ```
   **Result:**
   ```json
   {
     "results": [
       {
         "dataset": "ned10m",
         "elevation": 2022.0908203125,
         "location": { "lat": 35.3071, "lng": -111.5049 }
       }
     ],
     "status": "OK"
   }
   ```
   $\rightarrow$ Exact NED 10m interpolated elevation: **2,022.09 m**.

3. **Cinder Lake Field Guide Literature Baseline (`analogs.json`):**
   - Source: USGS Astrogeology Open-File Report 68-24 (*Lunar Crater Field Simulation at Cinder Lake, Arizona*) & Schaber (2005, USGS OFR 2005-1190).
   - Value: **2,050 m** ($6,725\text{ ft}$).
   - Meaning: Nominal mean topographic elevation of the crater field floor complex, with surrounding volcanic cinder terrain rising to $2,130\text{ m}$.

#### 2.3.3 Audit Assessment & Resolution
- The two numbers do **NOT represent a mathematical defect or corruption**:
  - **$2,050\text{ m}$** is the **nominal regional geomorphic baseline elevation** of the Cinder Lake crater floor complex cited in NASA/USGS analog literature.
  - **$2,022.09\text{ m}$** is the **exact, real 10m DEM point raster elevation** returned by USGS NED for the specific coordinate point $(35.3071^\circ\text{N}, -111.5049^\circ\text{W})$ (and $2,019.63\text{ m}$ on 1m LiDAR).
- **The Discrepancy Cause:** The application presents $2,050\text{ m}$ on Mission Command and Portfolio as `"Elev 2050m"`, while Live Data Lab presents $2,022.09\text{ m}$ as `"Topographic Elevation"`. Without clarifying context, a user perceives this as an internal discrepancy of $27.91\text{ m}$.

---

### 2.4 Investigation 4: Vertical Datum Check (NAVD88 vs EGM96 Geoid)

#### 2.4.1 Source Inspection
- **File:** `src/lib/science/providers/earthProvider.ts` (Line 268)
  ```ts
  quality: {
    datumReference: 'NAVD88 / EGM96 Geoid',
    uncertaintyMeters: epistemicStatus === 'LIVE DATA' ? 0.8 : 3.5,
  }
  ```
- **File:** `src/lib/science/datasets.ts` (Lines 79, 94)
  - `usgs_ned_10m`: `units: 'Meters above sea level'`
  - `nasa_srtm_30m`: `units: 'Meters (EGM96 geoid)'`
- **File:** `src/app/live-data/page.tsx` (Line 509):
  `Datum: {pointData.quality.datumReference}` $\rightarrow$ Renders `"Datum: NAVD88 / EGM96 Geoid"`

#### 2.4.2 Geodetic Analysis
1. **NAVD88 (North American Vertical Datum of 1988):**
   - The official orthometric vertical datum of the National Spatial Reference System (NSRS) for the United States.
   - Referenced to the primary tidal benchmark at Father Point / Rimouski, Quebec.
   - Derived from differential spirit leveling adjusted across the North American continent.
2. **EGM96 (Earth Gravitational Model 1996):**
   - A global spherical harmonic gravitational potential model developed jointly by NIMA, NASA GSFC, and Ohio State University (complete to degree and order 360).
   - Serves as the global zero-elevation reference geoid for WGS84 and NASA SRTM.
3. **The Problem:**
   - NAVD88 and EGM96 are **distinct vertical reference surfaces**.
   - In North America, the vertical separation between the NAVD88 zero surface and the EGM96 geoid is non-zero, ranging from **$-1.5\text{ m}$ to $+2.0\text{ m}$** depending on geographic location and local gravity anomalies.
   - Displaying `"NAVD88 / EGM96 Geoid"` as a combined string implies they are identical or interchangeable synonyms.
   - Furthermore, when querying non-US analog sites (e.g. Askja in Iceland, Atacama in Chile), NAVD88 has zero legal or physical validity. Those elevations are referenced to the global EGM96 geoid.

---

## 3. SUMMARY OF AFFECTED CODE ARTIFACTS

| Area | File Path | Lines | Finding Summary |
|---|---|---|---|
| **1. Global Status** | `src/components/layout/TopNavBar.tsx` | 200–205 | `TELEMETRY LIVE` badge is static; does not distinguish live endpoint health from static reference data. |
| **2. Grid Provenance** | `src/components/terrain/TerrainControls.tsx` | 89 | Text claims grid is retrieved via USGS 3DEP & NASA LOLA APIs; it is actually a center-anchored synthetic grid. |
| **2. Grid Provenance** | `src/components/terrain/TerrainCanvas.tsx` | 882, 914 | Text claims `Real Scientific Elevation Grid (USGS 3DEP / NASA LOLA ODE)`. |
| **2. Grid Provenance** | `src/lib/science/providers/terrainGridProvider.ts` | 62, 70 | Grid `cacheStatus` inherits `LIVE DATA` from center point, masking synthetic grid generation. |
| **3. Elevation** | `data/analogs.json` vs `earthProvider.ts` | 12 vs 29 | $2,050\text{ m}$ (nominal basin baseline from literature) vs $2,022.09\text{ m}$ (NED 10m coordinate point elevation). |
| **4. Vertical Datum** | `src/lib/science/providers/earthProvider.ts` | 268 | Hardcodes `'NAVD88 / EGM96 Geoid'` conflating two distinct vertical reference systems. |

---

## 4. UNRESOLVED RISKS & RECOMMENDATIONS

### Risk 1: Epistemic Misrepresentation of Live Extraterrestrial Data
- **Risk:** External reviewers, judges, or planetary scientists inspecting the UI could flag the application for claiming "live telemetry" for Moon and Mars elevations when the orbital altimeters are historical (LRO LOLA and MGS MOLA) and the elevation numbers are computed from reference models.
- **Remediation Recommendation:**
  1. In `TopNavBar.tsx`, relabel the global status to **`PROVIDERS CONNECTED`** or **`SCIENTIFIC TELEMETRY ACTIVE`** rather than claiming global elevation telemetry is live.
  2. Keep the live health latency indicators on `/live-data` where they genuinely represent endpoint connectivity.

### Risk 2: Mislabeling Synthetic Grids as Live NASA/USGS DEM Rasters
- **Risk:** Labeling procedural morphometric matrices as "Real Scientific Elevation Grids retrieved via USGS 3DEP & NASA LOLA ODE APIs" directly violates scientific truth in advertising.
- **Remediation Recommendation:**
  1. In `TerrainControls.tsx`, update description to:  
     `"Calibrated morphometric elevation matrix anchored to USGS/NASA datum references."`
  2. In `TerrainCanvas.tsx`, update model description to:  
     `"Datum-Anchored Morphometric Grid (Three.js WebGL)"` and watermark to  
     `"CALIBRATED ELEVATION MATRIX (USGS 3DEP / NASA LOLA DATUMS)"`.
  3. In `terrainGridProvider.ts`, stamp grid `cacheStatus` as `'CALIBRATED MODEL'` or `'STATIC REFERENCE'` rather than `'LIVE DATA'`.

### Risk 3: Unexplained Cinder Lake Discrepancy ($2050\text{ m}$ vs $2022.09\text{ m}$)
- **Risk:** Users comparing Mission Command and Live Data Lab perceive an unresolved mathematical inconsistency.
- **Remediation Recommendation:**
  1. In `analogs.json`, retain $2,050\text{ m}$ as the nominal site elevation (as approved in PRM-109 and PRM-114).
  2. In Mission Command and Candidate Summary Drawer, clarify the label:  
     `"Elev: 2,050m (Nominal Basin Baseline)"` with tooltip: `"USGS OFR 68-24. Point DEM at 35.3071°N, 111.5049°W evaluates to 2,022.09m (NED 10m) / 2,019.63m (3DEP 1m LiDAR)."`
  3. In Live Data Lab, add a caption to preset Cinder Lake:  
     `"Target Floor Point: 2,022.09m (NED 10m) · Basin Complex Nominal: 2,050m"`.

### Risk 4: Vertical Datum Conflation
- **Risk:** Presenting NAVD88 and EGM96 as interchangeable vertical datums is technically invalid.
- **Remediation Recommendation:**
  In `earthProvider.ts`, assign the datum dynamically:
  ```ts
  const datum = (datasetId === 'usgs_ned_10m' || datasetId === 'usgs_3dep_1m')
    ? 'NAVD88 (North American Vertical Datum 1988)'
    : 'EGM96 Geoid (Earth Gravitational Model 1996)';
  ```

---

## 5. AUDIT CONCLUSION & GATE STATUS

1. **Strict Read-Only Enforcement:** Zero application files, datasets, or test suites were modified during this audit.
2. **Repository State:** Working tree remains intact with 79 files preserved and 0 commits.
3. **Phase Gate Status:** **PHASE 2 IS ON HOLD** pending Product Owner review of this audit report and approval of the recommended scientific provenance and label precision refinements.

---
*Report published as official governance artifact in `docs/governance/` and Antigravity Brain.*
