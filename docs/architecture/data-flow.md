# TERRALIGN Data Flow & State Lifecycle

> **Phase**: Phase 2 — Product Design & Architecture  
> **Status**: Approved Data Architecture

---

## 1. End-to-End Scientific Data Pipeline

```mermaid
flowchart LR
    subgraph RawData["1. Scientific Datasets"]
        USGS["USGS 3DEP Lidar (1m DEM)"]
        LOLA["NASA LRO LOLA (5m DEM)"]
        Lit["NASA/USGS Literature & Field DOIs"]
    end
    
    subgraph OfflinePrep["2. Preprocessing & Normalization"]
        Quantize["Quantize to 16-bit Grayscale PNG"]
        ParamExtract["Extract 30-Parameter Ground Truth"]
        EvidenceLink["Index Authoritative Citations & DOIs"]
    end
    
    subgraph Runtime["3. Client / API Runtime Engine"]
        ZustandStore["Zustand Mission Store"]
        ScoringCore["Continuous Compatibility Kernel f(v,t)"]
        ARGCalc["6-Axis Divergence Engine"]
        GreedySub["Greedy Submodular Set-Cover Optimizer"]
    end
    
    subgraph UI["4. High-Fidelity UI Presentation"]
        Screen1["Screen 1: Cartographic Map & Drawer"]
        Screen2["Screen 2: Three.js Dual 3D Lighting Studio"]
        Screen3["Screen 3: 6-Axis Reality Gap Diagnostics"]
        Screen4["Screen 4: 30-Parameter RVM Table"]
    end

    USGS --> Quantize
    LOLA --> Quantize
    Lit --> ParamExtract
    Lit --> EvidenceLink
    
    Quantize --> Screen2
    ParamExtract --> ScoringCore
    ParamExtract --> ARGCalc
    ParamExtract --> GreedySub
    EvidenceLink --> ZustandStore
    
    ScoringCore --> ZustandStore
    ARGCalc --> ZustandStore
    GreedySub --> ZustandStore
    
    ZustandStore --> Screen1
    ZustandStore --> Screen2
    ZustandStore --> Screen3
    ZustandStore --> Screen4
```

---

## 2. Zustand Client State Management Schema

The entire application state is governed by a lightweight, reactive Zustand store partitioned into four slices:

```typescript
interface TerralignAppState {
  // Mission Configuration Slice
  mission: {
    targetBody: "moon" | "mars";
    activeActivity: string; // e.g. "rover_terramechanics"
    filters: {
      geologyType?: string;
      geomorphology?: string;
      climateZone?: string;
      minResolutionMeters?: number;
    };
  };
  
  // Selection Slice
  selection: {
    selectedSiteId: string; // default: "cinder-lake"
    comparisonSiteIds: string[]; // for portfolio k=3
    activePlanetaryFeature: string; // default: "shackleton-rim"
  };
  
  // 3D Terrain Studio Slice
  terrain: {
    syncCameras: boolean;
    syncRotation: boolean;
    linkZoom: boolean;
    colorMode: "hypsometric" | "slope" | "aspect" | "raw";
    showHillshade: boolean;
    showContours: boolean;
    sunElevationDeg: number; // 0.0 to 5.0
    sunAzimuthDeg: number;   // 0 to 360
    cameraTransform: {
      position: [number, number, number];
      target: [number, number, number];
    };
  };
  
  // Portfolio Optimizer Slice
  portfolio: {
    targetK: 2 | 3;
    fidelityThreshold: number; // default: 0.70
    activeDomainFilter: "all" | "mechanical" | "optical" | "geochemical" | "environmental";
  };
  
  // Actions
  setTargetBody: (body: "moon" | "mars") => void;
  setActiveActivity: (activity: string) => void;
  selectSite: (siteId: string) => void;
  setSunLighting: (elevation: number, azimuth: number) => void;
  setPortfolioK: (k: 2 | 3) => void;
}
```

