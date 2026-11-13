# TERRALIGN Component Architecture

> **Phase**: Phase 2 — Product Design & Architecture  
> **Status**: Approved Component Specification  
> **Target Framework**: React 19 / Next.js 15 App Router

---

## 1. Component Tree & Hierarchy

The component hierarchy is decomposed into four functional layers: Layout Shell, View Containers, Scientific Feature Modules, and UI Primitives.

```mermaid
graph TD
    Root["App Root Layout (app/layout.tsx)"] --> Shell["ApplicationShell (components/layout/Shell.tsx)"]
    Shell --> TopBar["TopNavBar (components/layout/TopNavBar.tsx)"]
    Shell --> ViewRouter{"Active View Route"}
    
    ViewRouter --> V1["MissionCommandView (app/page.tsx)"]
    ViewRouter --> V2["TerrainStudioView (app/terrain/page.tsx)"]
    ViewRouter --> V3["RealityGapView (app/reality-gap/page.tsx)"]
    ViewRouter --> V4["PortfolioOptimizerView (app/portfolio/page.tsx)"]
    
    V1 --> BodyToggle["BodyToggleCard"]
    V1 --> ActivityList["MissionActivityList"]
    V1 --> MapCanvas["CartographicMap (MapLibre)"]
    V1 --> SiteDrawer["CandidateSummaryDrawer"]
    
    V2 --> DualCanvas["DualTerrainCanvas (R3F)"]
    DualCanvas --> EarthViewport["EarthAnalogCanvas"]
    DualCanvas --> LunarViewport["PlanetaryTargetCanvas"]
    V2 --> TerrainControls["TerrainControlsSidebar"]
    TerrainControls --> LightingSlider["LowAngleLightingSlider"]
    TerrainControls --> AzimuthDial["SunAzimuthDial"]
    TerrainControls --> AttributeCard["TerrainAttributeCard"]
    
    V3 --> ARGHeader["ARGCompositeHeader"]
    V3 --> ARGGrid["ARGDiagnosticGrid (3x2)"]
    ARGGrid --> ARGAxisCard["ARGAxisCard (Gravity, Atmos, etc.)"]
    V3 --> CompMatrix["SimulatorCompensationTable"]
    
    V4 --> PortfolioSummary["PortfolioSummaryCard"]
    V4 --> SiteContribList["SiteContributionList"]
    V4 --> RVMTable["RequirementsMatrixTable"]
    V4 --> GapClassification["InescapableGapAlert"]
```

---

## 2. Component Contract & Interface Inventory

### 2.1 Viewport Components
- **`DualTerrainCanvas`**:
  - `props`: `{ earthSiteId: string, planetaryFeatureId: string, sunElevation: number, sunAzimuth: number, syncCameras: boolean }`
  - `emits`: `onCameraChange(cameraState: CameraTransform)`
- **`TerrainControlsSidebar`**:
  - `props`: `{ activeLayers: TerrainLayerConfig, lightingState: LightingConfig, attributes: TerrainAttributes }`
  - `emits`: `onLightingChange(elevation: number, azimuth: number)`, `onLayerToggle(layer: string)`

### 2.2 Scientific Assessment Components
- **`ARGAxisCard`**:
  - `props`: `{ axisKey: ARGAxisKey, earthValue: PhysicalValue, planetaryValue: PhysicalValue, divergence: number, confidence: ConfidenceLevel, caveat?: string }`
- **`RequirementsMatrixTable`**:
  - `props`: `{ requirements: MissionRequirement[], selectedSiteIds: string[], threshold: number, activeDomainFilter: string }`
  - `emits`: `onThresholdChange(theta: number)`, `onSiteToggle(siteId: string)`

### 2.3 Shared UI Primitives
- **`ConfidenceBadge`**: Color-coded pill (`EXACT`, `HIGH`, `MODERATE`, `LOW`, `UNCHARACTERIZED`).
- **`DivergenceBar`**: Gradient progress bar ($0\%$ to $100\%$) indicating physical reality gap.
- **`MonospaceMetric`**: Accessible container rendering values in Space Mono with physical unit suffixes.
- **`ProvenanceTooltip`**: Clickable tooltip displaying dataset name, acquiring instrument, and DOI.

