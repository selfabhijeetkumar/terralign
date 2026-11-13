# Screen 02 — Dual-View 3D Terrain & Extreme Lunar Lighting Comparison Studio

> **Screen ID**: `da519656f65640a78bf29562ac18d266`  
> **Stitch HTML**: [`docs/design/stitch/screen-02-terrain-comparison.html`](file:///c:/NASA SPACE HACKATHON/docs/design/stitch/screen-02-terrain-comparison.html)  
> **Stitch Screenshot**: [`docs/design/stitch/screen-02-terrain-comparison.png`](file:///c:/NASA SPACE HACKATHON/docs/design/stitch/screen-02-terrain-comparison.png)  
> **Resolution**: 2560 × 2926 (Dual Viewport Architecture)  
> **Phase**: Phase 2 — Product Design & Architecture

---

## 1. User Goal & Operational Objective
Allows exploration teams to visually and geometrically compare a selected terrestrial analog terrain (e.g. Cinder Lake crater field) with a planetary target region (e.g. Lunar South Pole Shackleton Crater rim) in synchronized 3D space under simulated extreme low-angle solar illumination ($0^\circ\text{--}5^\circ$).

---

## 2. Layout Structure & Wireframe Breakdown

```text
+----------------------------------------------------------------------------------------------------+
| TERRALIGN  "Where Earth Meets Other Worlds"      Mission Command  [Terrain Studio]  Reality Gap ... |
+-------------------------------------------------------------------+--------------------------------+
| DUAL SYNCHRONIZED 3D TERRAIN VIEWPORTS (80% width)                | TERRAIN CONTROLS (20% sidebar) |
| [ SYNCHRONIZED CAMERAS · LOCK 1:1 SCALE ]                         |                                |
|                                                                   | VIEW SYNCHRONIZATION           |
| TERRESTRIAL ANALOG                | LUNAR REFERENCE               | [x] Sync Camera                |
| Cinder Lake Crater Field 1, AZ    | Shackleton Crater Rim (South) | [x] Sync Azimuth               |
| 35.3071°N, 111.5049°W | Elev 2050m| 89.9000°S, 0.0000°E (Selenogr)| [x] Link 1:1 Zoom              |
| USGS 3DEP LiDAR (1.0m Grid)       | NASA LRO LOLA (5.0m Polar DEM)|                                |
|                                   |                               | TERRAIN LAYERS                 |
| [3D Basaltic Cinder Terrain Mesh] | [3D Regolith Surface Mesh]    | Color: [Hypsometric Elevation] |
| Long raking shadows cast at 2.3°  | Sharp pitch-black shadows     | [x] Hillshade  [ ] Contours    |
|                                   |                               |                                |
| [500m Scale] [FOV 45°]            | [500m Scale] [Sun Azimuth 135°| SOLAR ILLUMINATION             |
|                                   |                               | Sun Elevation: [ 2.3° ]        |
| * Watermark:                      | * Watermark:                  | 0.0° ---[O]---------------- 5° |
|   ILLUSTRATIVE DESIGN PREVIEW     |   ILLUSTRATIVE DESIGN PREVIEW | Sun Azimuth Dial: [ 135° SE ]  |
|                                                                   |                                |
|                                                                   | TERRAIN ATTRIBUTES (ILLUSTR.)  |
|                                                                   | Mean Slope: 12.4° [ILLUSTR.]   |
|                                                                   | RMS Roughness: 0.34m [ILLUSTR.]|
|                                                                   | Crater Density: 4.2 / km²      |
|                                                                   |                                |
|                                                                   | DATA RESOLUTION ADVISORY       |
|                                                                   | [Earth: 1m] [Lunar: 5m] (5x Δ) |
+-------------------------------------------------------------------+--------------------------------+
| PROVENANCE: Earth: USGS 3DEP (FS 2020-3027) · Lunar: NASA GSFC LOLA · Node: ASTRO_GEO_AZ          |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. Topographic Data Sources & Disparity Handling

| Viewport | Primary Dataset | Spatial Resolution & Datum | Vertical Accuracy | Geographic / Selenographic Scope |
|:---|:---|:---:|:---:|:---|
| **Terrestrial (Left)** | USGS 3DEP Lidar | $1.0\text{ m}$ horizontal grid spacing (NAVD88) | $\pm 0.15\text{ m}$ RMSE | Nationwide U.S. Only (CONUS/HI/AK) |
| **Lunar (Right)** | NASA LRO LOLA (`LDEM_875S_5M`) | $5.0\text{ m}$ interpolated polar grid spacing | $\pm 1.0\text{ m}$ orbital radial | Polar Region ($87.5^\circ\text{--}90^\circ\text{ S}$) |

### Resolution Disparity Advisory
Earth LiDAR provides $1.0\text{ m}$ horizontal grid spacing, while polar LOLA provides $5.0\text{ m}$ interpolated grid spacing (effective laser shot spacing is $\sim 57\text{ m}$ along-track). Comparing grid cell dimensions yields a $5\times$ disparity. Direct vertex-to-vertex mesh comparison requires bilateral spatial downsampling of the Earth mesh or kriging interpolation on the lunar raster. The UI explicitly alerts users to this disparity via an advisory badge.

---

## 4. Extreme Low-Angle Lighting Simulation Physics

- **Solar Elevation ($\theta_\odot$)**: Calibrated from $0.0^\circ$ to $5.0^\circ$ above the local tangent plane, reproducing the Artemis III landing site conditions at the lunar South Pole.
- **Directional Shadow Mapping (PCF Shadow Maps, Not Ray-Traced)**: Directional light vector:
  $$\vec{L} = \begin{pmatrix} \cos\theta_\odot \cos\phi_\odot \\ \sin\theta_\odot \\ \cos\theta_\odot \sin\phi_\odot \end{pmatrix}$$
  Shadows are generated via Three.js hardware-accelerated Percentage-Closer Filtering (PCF) shadow maps, not offline ray tracing.
- **Vacuum Light Behavior**: On the lunar viewport, diffuse atmospheric scattering is zero (Rayleigh scattering off). Shadows are pitch black ($RGB = 0, 0, 0$) except for secondary terrain bouncing, creating high optical contrast and deceptive crater rim visual depth.

---

## 5. Phase 3 Implementation Notes
- **3D Canvas**: Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`).
- **Terrain Displacement**: Custom vertex shader displacing a high-density plane geometry ($256 \times 256$ vertices) using 16-bit grayscale PNG heightmaps ($<250\text{ KB}$ per tile).
- **Synchronized Camera**: Shared Zustand orbit controller state broadcasting camera spherical coordinates $(\rho, \theta, \phi)$ to both canvas instances on `onChange`.

