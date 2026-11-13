# 05 — Scientific Datasets: Terrestrial, Lunar, and Martian Catalog

> **Module**: TERRALIGN Research Series · Document 05  
> **Challenge**: Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration  
> **Status**: Verified Dataset Architecture — Audited & Corrected (Consistency Pass)  
> **Target Repositories**: NASA PDS, USGS, ESA PSA, Copernicus Open Access Hub

---

## 1. Master Planetary & Terrestrial Dataset Inventory

| Dataset Name | Primary Provider | Official Geographic Coverage & Limitations | Spatial Resolution | Data Format | Official Access Method | Licensing & User Eligibility | Application in TERRALIGN |
|:---|:---|:---|:---:|:---:|:---|:---|:---|
| **LRO LOLA Global DEM (LDEM)** | NASA PDS Geosciences Node | Global Lunar ($90^\circ\text{S to }90^\circ\text{N}$) | $5\text{ m/px}$ (Polar) to $118\text{ m/px}$ (Equator) | GeoTIFF / PDS3/4 IMG | PDS ODE REST API / Direct HTTPS Download | Public Domain (NASA open data) | Lunar South Pole topographic baseline and terrain slope profiling. |
| **LROC NAC Polar Mosaics** | NASA / ASU / PDS | Lunar Polar Regions ($>80^\circ\text{S}$) | $0.5\text{--}1.0\text{ m/px}$ | Cloud-Optimized GeoTIFF (COG) | REST WMTS / LROC Web Portal Download | Public Domain (NASA/ASU) | High-resolution micro-crater texture and boulder counting comparison. |
| **MRO HiRISE DTMs** | NASA / Univ of Arizona / PDS | **Targeted Mars sites only** ($<3\%$ total planetary surface coverage; Jezero, Gale, etc.) | $1.0\text{ m/px}$ elevation, $0.25\text{ m/px}$ orthophoto | IMG / GeoTIFF | HiRISE PDS Archive / USGS Astrogeology Download | Public Domain (NASA/JPL/UA) | Mars surface roughness, yardang structure, and inverted channel comparison. |
| **MRO CRISM Targeted Spectral Mosaics** | NASA / JHU-APL / PDS | **Targeted Mars sites only** ($362\text{--}3920\text{ nm}$) | $18\text{--}36\text{ m/px}$ | ENVI / PDS3 | PDS Geosciences ODE API Download | Public Domain (NASA) | Mineralogical matching: phyllosilicates, hydrated sulfates, iron oxides. |
| **USGS 3DEP (3D Elevation Program)** | United States Geological Survey | **United States Sovereign Territory ONLY**: High-resolution airborne lidar across CONUS, Hawaii, and U.S. Territories (PR, USVI, Guam, CNMI, AS); airborne IfSAR radar ($5\text{ m}$) across Alaska. **Strictly NOT a global dataset.** | $1.0\text{ m}$ (LiDAR) to $5\text{ m}$ (IfSAR) | Cloud-Optimized GeoTIFF / LAZ point cloud | USGS The National Map API / AWS S3 Open Data | Public Domain (US Federal Government) | Micro-topography for US analog sites (Cinder Lake, San Rafael Swell, Mojave, Hawaii Mauna Kea); slope and roughness calculations. |
| **Copernicus DEM (GLO-90)** | European Space Agency (ESA) | Global Terrestrial ($90^\circ\text{S to }90^\circ\text{N}$) | $90\text{ m/px}$ ($3\text{ arc-seconds}$) | GeoTIFF (COG) | AWS S3 Open Data / CDSE Portal Download | **Full, Free & Open Worldwide** (Licence COP-DEM-GLO-90-F) | Global elevation basemap for international analog candidate reconnaissance. |
| **Copernicus DEM (GLO-30 Public)** | European Space Agency (ESA) | Global Terrestrial (**with specific national security tile exclusions withheld**) | $30\text{ m/px}$ ($1\text{ arc-second}$) | GeoTIFF (COG) | AWS S3 Open Data / OpenTopography API | Free for public use with attribution; **restricted tiles withheld**. | High-resolution elevation for international analog sites (Atacama, Iceland, High Arctic). |
| **ASTER Global Emissivity Dataset (GED)** | NASA JPL / METI | Global Terrestrial ($83^\circ\text{N to }83^\circ\text{S}$) | $100\text{ m/px}$ ($5\text{ TIR bands}$) | HDF5 / GeoTIFF | NASA Earthdata Cloud API / Download | Public Domain (NASA/METI) | Thermal inertia and surface emissivity baseline comparison to Mars THEMIS. |
| **NASA Moon Trek & Mars Trek WMS/WMTS** | NASA Solar System Treks Project (JPL) | Global Lunar & Martian | Multi-resolution pyramid tiles | PNG / JPEG / GeoTIFF tiles | Standard OGC WMS/WMTS REST tile endpoints | Public Domain (NASA/JPL-Caltech) | Streaming 3D globe visualization and multi-mission layer overlays. |
| **USGS Astropedia Planetary GIS Catalog** | USGS Astrogeology Science Center | Moon, Mars, Mercury, Asteroids | Variable ($1\text{ m to }10\text{ km}$) | GeoTIFF, Shapefiles, GeoJSON | Astropedia Search Portal / Direct Download | Public Domain (USGS) | Standardized planetary geological maps and cartographic boundaries. |

---

## 2. Ingestion & Pre-processing Boundaries

To ensure reliable, deterministic operation in the TERRALIGN platform:

1. **Precise Geographic Scoping of USGS 3DEP**:
   - Official Reference: *USGS Fact Sheet 2020-3027 ("3D Elevation Program")*.
   - USGS 3DEP provides nationwide 3D elevation data for the **Conterminous United States (CONUS), Hawaii, and U.S. Territories** via high-resolution airborne lidar (Quality Level 2 or better, $\le 1.0\text{ m}$ DEMs), and for **Alaska** via airborne Interferometric Synthetic Aperture Radar (IfSAR, Quality Level 5, $5.0\text{ m}$ DEMs) due to persistent cloud cover.
   - **Crucial Architectural Rule**: USGS 3DEP cannot be queried for international analog landscapes (Atacama Desert in Chile, Askja/Holuhraun in Iceland, Devon Island in Canada, McMurdo Dry Valleys in Antarctica). International sites must consume Copernicus GLO-30 Public / GLO-90, ArcticDEM (for High Arctic), or REMA (Reference Elevation Model of Antarctica).
2. **Copernicus DEM Licensing & Access Terms**:
   - **GLO-90**: Completely open, free, and unrestricted worldwide under the *Licence for COP-DEM-GLO-90-F Global 90m Full, Free & Open*.
   - **GLO-30 Public**: Available to the general public via AWS Open Data and OpenTopography, but with a small subset of tiles withheld due to commercial intellectual property rights (IPR) and national security restrictions. Full unrestricted global GLO-30 access requires verified research status under the Copernicus Contributing Missions (CCM) program.
3. **Targeted Coverage of Mars High-Resolution Data**:
   - MRO HiRISE DTMs ($1.0\text{ m/px}$) cover $<3\%$ of the Martian surface. They are targeted strictly to high-priority science regions (Jezero Crater, Gale Crater, Eberswalde delta, Mawrth Vallis). TERRALIGN matches terrestrial analogs only against targeted Mars sites where high-resolution ground truth exists.
