# TERRALIGN API Contracts (Next.js Route Handlers)

> **Phase**: Phase 2 — Product Design & Architecture  
> **Status**: Approved Route Specification  
> **Protocol**: HTTPS / RESTful JSON / Next.js Server Actions

---

## 1. Route Inventory Overview

| Endpoint | Method | Purpose | Response Type |
|:---|:---:|:---|:---:|
| `/api/analogs` | `GET` | Retrieve filtered analog site catalog | `AnalogSiteSummary[]` |
| `/api/analogs/[id]` | `GET` | Retrieve complete ground-truth profile for a site | `AnalogSiteDetail` |
| `/api/suitability` | `POST` | Calculate suitability score $S(L, A)$ and confidence $C$ | `SuitabilityResult` |
| `/api/reality-gap` | `POST` | Compute 6-axis ARG metrics and compensation protocols | `RealityGapResult` |
| `/api/portfolio` | `POST` | Optimize candidate portfolio ($k \in \{2, 3\}$) against RVM | `PortfolioResult` |
| `/api/terrain/[siteId]` | `GET` | Stream quantized elevation heightmap tile | `image/png` |

---

## 2. Detailed Contract Specifications

### 2.1 `GET /api/analogs`
- **Query Parameters**:
  - `body`: `"moon"` | `"mars"` (optional)
  - `activity`: e.g. `"rover_terramechanics"` (optional)
  - `minConfidence`: float `0.0` to `1.0` (optional)
- **Response Example**:
```json
{
  "total": 7,
  "matched": 5,
  "sites": [
    {
      "id": "cinder-lake",
      "name": "Cinder Lake Crater Field",
      "region": "San Francisco Volcanic Field, AZ, USA",
      "coordinates": { "latitude": 35.3489, "longitude": -111.5145 },
      "elevationMeters": 2130,
      "primaryGeology": "Basaltic Cinder",
      "suitabilityScore": 0.96,
      "confidenceScore": 0.91,
      "confidenceTier": "HIGH",
      "provenance": {
        "agency": "USGS Astrogeology / NASA Apollo",
        "doi": "10.5066/P9XYZ890"
      }
    }
  ]
}
```

### 2.2 `POST /api/suitability`
- **Request Body**:
```json
{
  "siteId": "cinder-lake",
  "activityId": "rover_terramechanics"
}
```
- **Response Example**:
```json
{
  "siteId": "cinder-lake",
  "activityId": "rover_terramechanics",
  "suitabilityScore": 0.96,
  "confidenceScore": 0.91,
  "uncertaintyBounds": {
    "minScore": 0.88,
    "maxScore": 0.98,
    "spread": 0.10
  },
  "dimensionBreakdown": {
    "geological": 0.94,
    "geomorphological": 0.92,
    "environmental": 0.78,
    "operational": 0.89,
    "missionSpecific": 0.96
  },
  "uncharacterizedParameters": []
}
```

### 2.3 `POST /api/reality-gap`
- **Request Body**:
```json
{
  "siteId": "cinder-lake",
  "targetBody": "moon"
}
```
- **Response Example**:
```json
{
  "siteId": "cinder-lake",
  "targetBody": "moon",
  "compositeArg": 0.72,
  "divergenceTier": "HIGH_DIVERGENCE",
  "axes": [
    {
      "key": "gravity",
      "earthValue": "9.81 m/s²",
      "planetaryValue": "1.62 m/s²",
      "divergencePercent": 83.5,
      "confidence": "EXACT",
      "source": "Physical Constant",
      "mitigationEquipment": "NASA JSC ARGOS offloading harness"
    },
    {
      "key": "pressure",
      "earthValue": "86.1 kPa",
      "planetaryValue": "0 Pa",
      "divergencePercent": 100.0,
      "confidence": "HIGH",
      "source": "NOAA Standard Atmosphere",
      "mitigationEquipment": "Thermal-Vacuum Chamber A (TVAC)"
    }
  ]
}
```

### 2.4 `POST /api/portfolio`
- **Request Body**:
```json
{
  "targetK": 3,
  "fidelityThreshold": 0.70,
  "activeDomain": "all"
}
```
- **Response Example**:
```json
{
  "targetK": 3,
  "empiricalCoveragePercent": 78.4,
  "hypothesisTargetPercent": 90.0,
  "coverageDeltaPercent": -11.6,
  "status": "PROPOSED_RESEARCH_TARGET_UNVALIDATED",
  "portfolio": [
    { "siteId": "cinder-lake", "role": "Crater Morphology & Terramechanics", "uniqueContributionPercent": 36.7 },
    { "siteId": "askja-holuhraun", "role": "Basaltic Volcanism & Field Geology", "uniqueContributionPercent": 26.7 },
    { "siteId": "atacama-yungay", "role": "Hyper-Aridity & Soil Chemistry", "uniqueContributionPercent": 15.0 }
  ],
  "requirementsSummary": {
    "total": 30,
    "covered": 23,
    "partial": 3,
    "inescapableGaps": 4
  }
}
```

