# TERRALIGN Geospatial Processing Pipeline

> **Phase**: Phase 2 — Product Design & Architecture  
> **Status**: Approved Processing Specification  
> **Toolchain**: Python / GDAL / Rasterio (Offline) + WebGL / Shaders (Client)

---

## 1. Topographic Data Pipeline Architecture

```mermaid
flowchart TD
    subgraph Ingestion["1. Raw Raster Ingestion"]
        USGS["USGS 3DEP Cloud Optimized GeoTIFF (COG)"]
        LOLA["NASA PDS LOLA Polar GeoTIFF (5m / 20m)"]
        Copernicus["Copernicus DEM GLO-30 / GLO-90"]
    end
    
    subgraph Preprocessing["2. Python GDAL Pipeline (scripts/prep_heightmaps.py)"]
        Clip["Reproject to UTM / Polar Stereographic & Clip ROI"]
        Filter["Bilateral Smoothing Filter (Preserve Crater Rims)"]
        Normalize["Normalize Elevation to 16-bit Dynamic Range"]
        ExportPNG["Export 16-bit Grayscale PNG Tile (<250 KB)"]
        MetaExtract["Calculate Slope, Aspect, Roughness RMS"]
    end
    
    subgraph ClientRendering["3. Three.js / WebGL Vertex Displacement"]
        TextureLoad["Load PNG via THREE.TextureLoader()"]
        VertexShader["Vertex Shader: Displace Plane Geometry (256x256)"]
        ShadowMap["Directional Light Shadow Mapping at 0°-5° Sun Angle"]
        Hypsometric["Fragment Shader: Apply Hypsometric Elevation Ramp"]
    end

    USGS --> Clip
    LOLA --> Clip
    Copernicus --> Clip
    
    Clip --> Filter --> Normalize --> ExportPNG
    Normalize --> MetaExtract
    
    ExportPNG --> TextureLoad --> VertexShader --> ShadowMap --> Hypsometric
```

---

## 2. Quantized Heightmap Specification

To guarantee $<2.0\text{s}$ load times and steady $60\text{ FPS}$ rendering without streaming gigabyte GeoTIFFs:
1. **Format**: 16-bit Grayscale PNG (`uint16`).
2. **Resolution**: $256 \times 256$ pixels (1 pixel = $1.0\text{m}$ for USGS, $5.0\text{m}$ for LOLA).
3. **Payload Size**: $180\text{ KB}\text{--}240\text{ KB}$ per tile (compressed).
4. **Elevation Mapping**:
   $$z(u, v) = z_{\min} + \left( \frac{\text{pixel\_value}(u, v)}{65535} \right) \cdot (z_{\max} - z_{\min})$$
   Where $z_{\min}$ and $z_{\max}$ are embedded in tile metadata JSON.

---

## 3. Directional Shadow Simulation Shader
On the lunar South Pole viewport, shadows are rendered via standard Three.js directional PCF soft shadow maps with zero ambient fill light (`ambientIntensity = 0.02`), accurately capturing the optical challenge of non-diffuse vacuum shadow traversal.

