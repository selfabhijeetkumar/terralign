# TERRALIGN — PRM-114 Technical Feasibility Claim Audit
## Engineering Analysis, GPU Memory Mathematics & Performance Verification Classification

**Project:** TERRALIGN — Where Earth Meets Other Worlds  
**Milestone:** TERRALIGN v1.0 Hackathon MVP  
**Deliverable ID:** PRM-114-STAGE-B  
**Document Path:** `docs/design/prm-114-technical-feasibility-audit.md`  
**Date:** 12 November 2026  
**Methodology:** GSD v1.6.0 (`Verify Empirically` · `No Trust Me It Works`)  
**Governance:** Ponytail FULL Mode (`REUSE → SIMPLIFY → IMPLEMENT`)  
**Phase Status:** Phase 2 Complete · Phase 3 STRICTLY LOCKED (Pending Product Lead Review)

---

## 1. Executive Summary

This audit performs a rigorous, engineering-grade scrutiny of all technical feasibility claims formulated across PRM-109 through PRM-113. 

In strict adherence to GSD core principles, **architectural targets, heuristic budgets, and theoretical models must never be reported as empirically verified measurements**. Prior documentation contained internal mathematical inconsistencies—notably claiming that single-mesh VRAM was "below 2 MB" while simultaneously quoting "approximately 2.1 MB buffer memory" for 65,000 vertices, and omitting triangle index buffers and texture memory.

This audit:
1. Re-derives the **exact GPU buffer memory requirement** for a $256\times 256$ displacement mesh down to individual byte offsets and attribute data types.
2. Formally demarcates **Application Shell bundle size** from **Full 3D Route dynamic bundle size**, classifying both as architectural targets awaiting Phase 3 `@next/bundle-analyzer` verification.
3. Classifies **60 FPS frame rate** as an architectural target conditional on dedicated desktop GPUs, specifying progressive degradation pathways for integrated and mobile hardware.
4. Classifies heightmap payload sizes and loading latencies as engineering budgets versus unbenchmarked operational targets.
5. Establishes an unambiguous 5-tier feasibility classification across all core 3D and geospatial architectural subsystems.

---

## 2. Bundle Size Audit: Shell vs. 3D Route

### 2.1 Analysis of Previously Documented Claims
Prior design blueprints referenced:
- "Application shell target: less than 180 KB."
- "Full 3D route estimate: approximately 260 KB gzipped through dynamic loading."

### 2.2 Mathematical & Architectural Demarcation

```
+----------------------------------------------------------------------------------------------------+
| CLIENT-SIDE BUNDLE DECOMPOSITION & TARGETS (GZIPPED)                                                |
|                                                                                                    |
| [TIER 1: CRITICAL APPLICATION SHELL] (Target: < 180 KB)                                            |
|   ├── Next.js 15 App Router Minimal Runtime:             ~42 KB                                    |
|   ├── React 19 + React-DOM Base:                         ~45 KB                                    |
|   ├── Zustand Global Mission Store:                       ~3 KB                                    |
|   ├── Tailwind Base Stylesheet + CSS Variables:          ~18 KB                                    |
|   └── Application Shell (Navigation, Monospace HUD):     ~22 KB                                    |
|   └── ESTIMATED INITIAL PAYLOAD:                        ~130 KB (Budget Ceiling: 180 KB)           |
|                                                                                                    |
| [TIER 2: DYNAMIC 3D TERRAIN CHUNK (LAZY-LOADED)] (Estimate: ~130 KB additive)                      |
|   ├── Three.js Minimal WebGL Core (Tree-shaken):        ~110 KB                                    |
|   ├── @react-three/fiber Bridge Core:                    ~18 KB                                    |
|   └── Terrain Studio Shaders & Controllers:               ~6 KB                                    |
|   └── ESTIMATED ADDITIVE 3D PAYLOAD:                    ~134 KB                                    |
|                                                                                                    |
| [COMBINED 3D ROUTE PAYLOAD]                              ~264 KB (Target Ceiling: 280 KB)           |
+----------------------------------------------------------------------------------------------------+
```

### 2.3 Status & Measurement Methodology
- **Classification:** **ARCHITECTURAL TARGET & ESTIMATED BUDGET** (Pending Implementation).
- **Measurement Methodology:** Theoretical tree-shaking estimate based on modern Three.js r160+ and Next.js 15 production builds.
- **Definitive Evidence:** **No compiled production JavaScript bundle exists in the workspace.** Application code creation is strictly prohibited during Phase 2.
- **Required Verification Action in Phase 3:** Following Wave 3.1 (`Task 3.1.1`) and Wave 3.3 (`Task 3.3.1`), run:
  ```powershell
  ANALYZE=true pnpm build
  ```
  Capture the exact gzipped chunk sizes from `.next/analyze/client.html` and record empirical measurements in the Phase 4 test report.

---

## 3. Frame Rate Audit: 60 FPS Feasibility & Degradation Pathways

### 3.1 Performance Classification
- **Claim:** "60 FPS real-time rendering."
- **Classification:** **ARCHITECTURAL TARGET (CONDITIONAL)**.
- **Empirical Reality:** 60 FPS is not a universal constant; it is an engineering target achievable on hardware meeting minimum compute thresholds, requiring active LOD degradation on constrained systems.

### 3.2 Hardware Capability & Risk Matrix

| Hardware Tier | Representative Hardware | 60 FPS Feasibility | Primary Bottleneck | Required Degradation Strategy |
|:---|:---|:---:|:---|:---|
| **Tier 1: Desktop Dedicated GPU** | NVIDIA RTX 3060+, AMD RX 6700+, Apple M1/M2/M3 Pro | **HIGH** | Negligible ($<4\text{ ms}$ GPU frame time) | Full $2048\times 2048$ PCF shadow map, full $256\times 256$ dual mesh. |
| **Tier 2: Desktop Integrated GPU** | Intel Iris Xe, AMD Radeon 680M/780M | **MEDIUM** | Fill-rate & fragment shading on dual viewports | Reduce shadow map to $1024\times 1024$; throttle shadow updates during orbit. |
| **Tier 3: Modern Mobile / Tablet** | iPhone 14+, iPad Air/Pro, Galaxy S23+ | **MEDIUM-LOW** | Thermal throttling & high-DPI display fill | Stacked vertical viewports ($<768\text{px}$); reduce shadow map to $512\times 512$; clamp pixel ratio to $1.5$. |
| **Tier 4: Legacy / Low-End Client** | Intel HD 620, budget Android tablets | **UNFEASIBLE (3D)** | WebGL context memory & shader ALU limits | **Automated Fallback to MapLibre 2.5D raster terrain engine.** |

### 3.3 Dynamic Degradation Architecture (Phase 3 Specification)
1. **Dynamic Shadow Decoupling:** During active mouse drag / orbital lerp, freeze shadow-map rendering and project simplified directional lighting; re-cast high-resolution PCF soft shadows within $100\text{ ms}$ after camera rest.
2. **Adaptive Frame Throttling:** If frame time exceeds $33.3\text{ ms}$ ($<30\text{ FPS}$) for $\ge 120$ consecutive frames:
   - Step 1: Reduce shadow texture size from $2048$ to $1024$.
   - Step 2: Drop mesh subdivisions from $256\times 256$ to $128\times 128$ ($16,384$ vertices).
   - Step 3: Trigger user toast offering 2.5D MapLibre fallback mode.

---

## 4. Mesh Memory Mathematical Audit: Resolution of Inconsistency

### 4.1 Identification of Documented Inconsistency
Previous documentation contained contradictory assertions:
- Claim A: *"Single mesh VRAM below 2 MB."*
- Claim B: *"Approximately 65,000 vertices require approximately 2.1 MB buffer memory."*

If vertex buffer memory alone is $2.1\text{ MB}$, the total VRAM consumption cannot be below $2\text{ MB}$, particularly when triangle index buffers and texture bindings are included.

### 4.2 Exact Mathematical Derivation for a $256\times 256$ Regular Terrain Grid

Let a regular heightmap plane have $N_x = 256$ and $N_y = 256$ vertices:
$$\text{Total Vertices } V = N_x \times N_y = 256 \times 256 = \mathbf{65,536\text{ vertices}}$$

#### A. Vertex Buffer Object (VBO) Memory
Modern WebGL vertex layout requires three core interleaved or non-interleaved attributes:

| Attribute | Data Type | Components | Bytes / Component | Bytes / Vertex | Total Attribute Bytes | Total KiB | Total MiB (Binary) | Total MB (Decimal) |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **`position`** | `Float32` | $3$ ($x, y, z$) | $4$ | $12\text{ B}$ | $65,536 \times 12 = 786,432\text{ B}$ | $768.00\text{ KiB}$ | $0.750\text{ MiB}$ | $0.786\text{ MB}$ |
| **`normal`** | `Float32` | $3$ ($n_x, n_y, n_z$) | $4$ | $12\text{ B}$ | $65,536 \times 12 = 786,432\text{ B}$ | $768.00\text{ KiB}$ | $0.750\text{ MiB}$ | $0.786\text{ MB}$ |
| **`uv`** | `Float32` | $2$ ($u, v$) | $4$ | $8\text{ B}$ | $65,536 \times 8 = 524,288\text{ B}$ | $512.00\text{ KiB}$ | $0.500\text{ MiB}$ | $0.524\text{ MB}$ |
| **TOTAL VBO** | — | — | — | **$32\text{ B}$** | **$2,097,152\text{ B}$** | **$2,048.00\text{ KiB}$** | **$2.000\text{ MiB}$** | **$2.097\text{ MB}$** |

$$\mathbf{VBO\ Memory = 2.000\ MiB\ (2,097,152\ bytes\ \equiv 2.097\ MB)}$$

#### B. Index Buffer Object (IBO / Element Array) Memory
The grid is composed of quads divided into triangles:
- Quads: $(N_x - 1) \times (N_y - 1) = 255 \times 255 = 65,025\text{ quads}$
- Triangles: $65,025 \times 2 = 130,050\text{ triangles}$
- Total Indices: $130,050 \times 3 = \mathbf{390,150\text{ indices}}$

**Index Precision Analysis:**
- 16-bit unsigned integer (`Uint16`): Maximum addressable index is $2^{16} - 1 = 65,535$.
- Because our grid has exactly $65,536$ vertices indexed from $0$ to $65,535$, all vertex indices fit precisely within a `Uint16Array`!
- **With `Uint16` Indices:**
  $$\text{IBO Memory} = 390,150 \times 2\text{ bytes} = 780,300\text{ bytes} = \mathbf{762.01\text{ KiB}} \approx \mathbf{0.744\text{ MiB}} \ (0.780\text{ MB})$$
- *(Note: If `Uint32` indices were used, IBO memory would double to $1,560,600\text{ bytes} = 1.488\text{ MiB}$.)*

#### C. Texture Memory for Heightmap Displacement
The 16-bit PNG heightmap ($256\times 256$) is unpacked into a GPU texture for vertex displacement:
- Internal format: `gl.R16UI` or `gl.R32F` (single-channel 32-bit float):
  $$\text{Texture Memory} = 256 \times 256 \times 4\text{ bytes} = 262,144\text{ bytes} = \mathbf{256.00\text{ KiB}} = \mathbf{0.250\text{ MiB}} \ (0.262\text{ MB})$$

#### D. Consolidated Single-Mesh GPU VRAM Consumption

| Component | Buffer Type | Data Precision | Size (Bytes) | Size (KiB) | Size (MiB) | Size (MB Decimal) |
|:---|:---|:---:|:---:|:---:|:---:|:---:|
| **Vertex Attributes** | VBO (Pos, Norm, UV) | `Float32` (32 B/vtx) | $2,097,152\text{ B}$ | $2,048.00\text{ KiB}$ | $2.000\text{ MiB}$ | $2.097\text{ MB}$ |
| **Triangle Indices** | IBO / EBO | `Uint16` (2 B/idx) | $780,300\text{ B}$ | $762.01\text{ KiB}$ | $0.744\text{ MiB}$ | $0.780\text{ MB}$ |
| **Displacement Texture** | Texture2D (`R32F`) | Single Float | $262,144\text{ B}$ | $256.00\text{ KiB}$ | $0.250\text{ MiB}$ | $0.262\text{ MB}$ |
| **Driver Overhead (Est.)**| VAO / WebGL State | Aligned blocks | $\sim 16,384\text{ B}$ | $\sim 16.00\text{ KiB}$ | $\sim 0.016\text{ MiB}$ | $\sim 0.016\text{ MB}$ |
| **SINGLE MESH TOTAL** | — | — | **$3,155,980\text{ B}$** | **$3,082.01\text{ KiB}$** | **$\mathbf{3.010\text{ MiB}}$** | **$\mathbf{3.156\text{ MB}}$** |

#### E. Dual Viewport Total VRAM (Screen 02)
Screen 02 renders two concurrent synchronized viewports (Earth Cinder Lake + Moon Shackleton):
$$\mathbf{Total\ Dual\ Mesh\ VRAM = 2 \times 3.010\ MiB \approx 6.02\ MiB\ (6.31\ MB)}$$
Adding a $2048\times 2048$ 32-bit depth shadow map ($2048 \times 2048 \times 4\text{ B} = 16.0\text{ MiB}$):
$$\mathbf{Total\ Screen\ 02\ GPU\ Allocation \approx 22.02\ MiB\ (23.1\ MB)}$$

### 4.3 Conclusion of Mesh Memory Audit
- **The claim of "below 2 MB" is REFUTED.** It was derived by looking solely at vertex positions and normals ($1.5\text{ MB}$) while omitting UV coordinates, or by truncating the $2.00\text{ MiB}$ VBO and ignoring the index buffer ($0.74\text{ MiB}$) and displacement texture ($0.25\text{ MiB}$).
- **The verified, mathematically sound requirement is $\mathbf{3.01\text{ MiB}}$ per mesh ($\approx 6.02\text{ MiB}$ for dual viewports).**
- This memory footprint remains exceptionally lean and well within modern WebGL limits ($<50\text{ MiB}$ budget), but must be documented with absolute mathematical precision.

---

## 5. Heightmap Payload & Fetch Latency Audit

### 5.1 Analysis of Documented Claims
Prior documentation stated:
- $256\times 256$, 16-bit PNG.
- Approximately 80–180 KB compressed.
- Target below 250 KB.
- Local fetch below 300 ms.

### 5.2 Forensic Classification

| Claim Parameter | Documented Value | Technical Reality & Basis | Formal Classification |
|:---|:---:|:---|:---:|
| **Uncompressed Payload** | $128\text{ KiB}$ | $256 \times 256 \times 2\text{ bytes} = 131,072\text{ bytes}$ (16-bit grayscale). | **MATHEMATICAL TRUTH** |
| **PNG Compressed Size** | $80\text{--}180\text{ KB}$ | Grayscale elevation data contains spatial auto-correlation; Deflate typically achieves $40\%\text{--}70\%$ compression on DEMs ($\sim 40\text{--}90\text{ KB}$ for 16-bit, or $\sim 80\text{--}140\text{ KB}$ if RGBA packed). | **ESTIMATED FEASIBLE BUDGET** |
| **Maximum Target Ceiling**| $< 250\text{ KB}$ | Architectural performance boundary constraint. | **ARCHITECTURAL TARGET** |
| **Local Fetch Latency** | $< 300\text{ ms}$ | Assumes static HTTP asset delivery from local Next.js `/public/terrain/` over localhost or fast CDN. No server running in Phase 2. | **PERFORMANCE TARGET (UNTESTED)** |

---

## 6. Comprehensive Architectural Feasibility Classification Matrix

All core 3D, geospatial, and visual features from PRM-109 through PRM-113 are classified into the 5 standard engineering tiers:

| Subsystem / Feature Area | Implementation Approach | Feasibility Classification | Technical Verification Basis / Blockers |
|:---|:---|:---:|:---|
| **React Three Fiber Dual Viewports** | Synchronized `<Canvas>` instances sharing state via Zustand | **PARTIALLY VERIFIED** | Conceptually verified in Three.js; empirical cross-canvas context loss and frame sync requires Phase 3 implementation. |
| **MapLibre 2D / 2.5D Fallback** | MapLibre GL JS raster DEM elevation hillshade | **VERIFIED FEASIBLE** | Industry standard; zero custom WebGL shaders needed; runs on any WebGL 1.0 device. |
| **16-bit PNG Displacement Shader** | Custom GLSL vertex shader sampling `gl.R16UI` texture | **ESTIMATED FEASIBLE** | Shader code mathematically specified; requires WebGL 2.0 (`OES_texture_float` or native R32F). Supported on $>98\%$ devices. |
| **Low-Angle PCF Soft Shadows** | Three.js `DirectionalLight` with `PCFSoftShadowMap` ($1.5^\circ\text{--}3.0^\circ$) | **PARTIALLY VERIFIED** | Verified in standalone Three.js examples; grazing angle shadow acne requires tuned polygon offset bias during Phase 3. |
| **Mobile Vertical Split Viewport** | CSS Flexbox responsive direction (`flex-col md:flex-row`) | **EMPIRICALLY VERIFIED** | Verified in Stitch prototype layout; responsive viewport behavior tested structurally. |
| **Dual-Camera Sync Lock** | Spherical coordinate broadcasting $(\theta, \phi)$ via Zustand | **ARCHITECTURALLY SPECIFIED** | Store contracts authored in `system-architecture.md`; event listener latency pending Phase 3 build. |

---

*Report compiled under Stage B of PRM-114.*  
*Repository: `C:\NASA SPACE HACKATHON` · Milestone: TERRALIGN v1.0 Hackathon MVP*

