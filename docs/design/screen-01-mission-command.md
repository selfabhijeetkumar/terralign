# Screen 01 — Global Mission Command & Activity Selector

> **Screen ID**: `adc69ca301fe49f082dfe81de3eaa884`  
> **Stitch HTML**: [`docs/design/stitch/screen-01-mission-command.html`](file:///c:/NASA SPACE HACKATHON/docs/design/stitch/screen-01-mission-command.html)  
> **Stitch Screenshot**: [`docs/design/stitch/screen-01-mission-command.png`](file:///c:/NASA SPACE HACKATHON/docs/design/stitch/screen-01-mission-command.png)  
> **Resolution**: 2560 × 2048 (Optimized for High-Density Displays)  
> **Phase**: Phase 2 — Product Design & Architecture

---

## 1. User Goal & Operational Objective
The user (planetary scientist or mission planner) defines their exploration scope by selecting the target extraterrestrial body (Moon or Mars) and designating an operational activity (e.g. *Rover Terramechanics*). The platform filters global candidate analogs, highlighting verified flagship landscapes, their suitability scores, and data confidence.

---

## 2. Layout Structure & Wireframe Breakdown

```text
+----------------------------------------------------------------------------------------------------+
| TERRALIGN  "Where Earth Meets Other Worlds"      [Command]  Terrain Studio  Reality Gap  Portfolio |
+------------------------------------+---------------------------------------------------------------+
| MISSION CONFIGURATION              | CARTOGRAPHIC DISCOVERY MAP (MapLibre WebGL)                   |
|                                    |                                                               |
| [ MOON (Active) ] [ MARS ]         |   * Devon Island                                              |
|                                    |                        * Iceland                              |
| OPERATIONAL ACTIVITIES (9)         |   * Cinder Lake (SELECTED)                                    |
| 1. Rover Terramechanics (ACTIVE)   |   * Utah MDRS                                                 |
| 2. Low-Angle Lighting              |   * Hawaii                                                    |
| 3. EVA & Spacesuit Operations      |                               * Atacama                       |
| 4. Cryo Volatile Drilling          |                                                               |
| 5. Lava Tube Exploration           |                                        * McMurdo              |
| 6. Inverted Delta Science          |                                                               |
| 7. Hyper-Arid Astrobiology         +---------------------------------------------------------------+
| 8. Landing Hazard Detection        | CANDIDATE SUMMARY DRAWER (Cinder Lake Crater Field 1, AZ)     |
| 9. ISRU Regolith Sintering         | 35.3071°N, 111.5049°W | Elev: 2,050m | Basaltic Cinder        |
|                                    | Suitability: 96% (ILLUSTRATIVE) | Conf: C=0.91 (HIGH)          |
| [ Multi-Site Portfolio Link ]      | Ref: USGS Open-File Report 68-24 · NASA CR-101740             |
|                                    | [ Open Terrain Studio (CTA) ]  [ View Reality Gap ]           |
+------------------------------------+---------------------------------------------------------------+
| STATUS: Mission: Lunar Rover Mobility | Matched: 5 of 7 | Data Coverage: High | USGS Synced         |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Data Elements Required & Provenance Binding

| UI Element | Data Source | Field / Parameter | Provenance Tag & Classification |
|:---|:---|:---|:---|
| Planetary Target | Local Config | `bodyId: "moon" \| "mars"` | System Constant `[VERIFIED]` |
| Operational Activities | `.gsd/SPEC.md` | `activityId: "rover_terramechanics"` | 9 Canonical Activities `[VERIFIED]` |
| Analog Site Coordinates | USGS Astrogeology | `lat: 35.3071, lon: -111.5049` | USGS OFR 68-24 (Crater Field 1 Centroid) `[VERIFIED SOURCE DATA]` |
| Elevation & Setting | USGS 3DEP | `elev: 2050m (Floor; 2130m Hills), geology: "Basaltic cinder"` | USGS Fact Sheet 2020-3027 `[VERIFIED SOURCE DATA]` |
| Suitability Breakdown | Scoring Engine | $S(L, A) = 0.96$ | Continuous Compatibility Model `[ILLUSTRATIVE DEMO DATA]` |
| Metric Confidence | Data Coverage | $C(L, A) = 0.91$ (HIGH) | Literature Verified `[DERIVED FROM VERIFIED DATA]` |
| Provenance Citation | USGS / NASA PDS | `USGS OFR 68-24 / NASA CR-101740` | NASA PDS Astrogeology Node `[VERIFIED]` |

---

## 4. User Interaction & State Transitions

1. **Switch Body to MARS**:
   - Re-evaluates all 7 sites against Martian benchmarks.
   - Map smoothly re-centers with Martian analog weighting (Atacama and Utah MDRS become primary highlighted matches).
   - Theme accent shifts from celestial blue (`#1E90FF`) to warm Mars amber-orange (`#FF6B35`).
2. **Filter by Data Availability (DEM $\le 1\text{m}$)**:
   - Restricts site list to locations with high-resolution LiDAR (Cinder Lake, Hawaii). International sites with only $30\text{m}$ Copernicus data display dashed border badges indicating resolution limitations.
3. **Click Candidate Marker**:
   - Camera animates smoothly (ease-out-expo, $400\text{ms}$) to target coordinate.
   - Reticle locks with active coordinate readout in Space Mono.
   - Candidate summary drawer slides up from bottom dock.

---

## 5. Phase 3 Implementation Notes
- **Component Stack**: Next.js 15 Client Component (`MissionCommandView.tsx`), MapLibre GL (`@maplibre/maplibre-gl`), Tailwind CSS.
- **Map Vector Tiles**: Self-hosted or open-access dark basemap tiles (CartoDB Dark Matter or MapTiler Satellite Dark).
- **State Store**: Zustand store (`useMissionStore.ts`) tracking `{ targetBody, activeActivity, selectedSiteId, activeFilters }`.

