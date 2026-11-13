# 03 — Mission-Specific Analog Suitability Matrix

> **Module**: TERRALIGN Research Series · Document 03  
> **Challenge**: Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration  
> **Status**: Verified Operational Framework — Audited & Corrected  
> **Mission Baselines**: NASA Artemis III/IV (Lunar South Pole), Mars Sample Return (MSR), ExoMars / Rosalind Franklin  
> **Domain Count Alignment**: **9 Operational Surface Activities + 1 Multi-Site Portfolio Framework = 10 Total Domains**

---

## 1. The Multi-Criteria Suitability Concept

In classical analog research, a location is often given an unqualified score (e.g., "Site X is 85% Mars-like"). In real mission engineering, this is meaningless and dangerous. A site may be **95% suitable for rover terramechanics testing** while being **0% suitable for cryogenic volatile preservation**.

TERRALIGN introduces an **activity-driven suitability matrix**:

$$S_{\text{mission}}(L) = \sum_{k=1}^{n} w_k \cdot \mu_k(L, A)$$

Where:
- $L$ is the terrestrial analog landscape.
- $A$ is the specific operational activity.
- $\mu_k(L, A) \in [0, 1]$ is the measurable fidelity score for parameter $k$.
- $w_k$ is the normalized mission-criticality weight ($\sum w_k = 1$, determined via expert-elicited heuristics).
- $R_{\text{gap}}(L, A)$ is the explicit **Reality Gap Penalty**.

---

## 2. Characterized Mission Evaluation Domains (10 Domains)

The evaluation matrix formally characterizes **9 distinct surface exploration activities** plus **1 integrated portfolio synthesis framework**:

| # | Mission Domain | Domain Classification | Primary Site Requirements | Optimal Terrestrial Analog(s) | Key Fidelity Metrics | Reality Gap & Limitations |
|:---:|:---|:---:|:---|:---|:---|:---|
| **1** | **Rover Terramechanics & Mobility** | *Operational Surface Activity* | Loose angular substrate, slope angles $10\text{--}25^\circ$, boulder obstacles, low cohesion. | **San Francisco Volcanic Field (Cinder Lake, AZ)**; **Iceland Highlands (Lambahraun)** | Wheel sinkage ($z$), cone penetration resistance ($q_c$), drawbar pull, slip ratio. | Earth gravity ($1.0g$ vs $0.166g$/$0.38g$) artificially increases wheel traction and ground compaction. |
| **2** | **Lunar South Pole Low-Angle Lighting** | *Operational Surface Activity* | High topographic relief, micro-scale roughness, extreme contrast, zero atmospheric diffuse scatter. | **Iceland Askja Caldera rim**; **Mauna Kea summit cinder slopes** | Slope aspect, shadow persistence ratio, forward-scatter albedo. | Rayleigh scattering by Earth atmosphere fills shadows with diffuse blue light; Moon has zero diffuse light. |
| **3** | **Astronaut EVA & Spacesuit Operations** | *Operational Surface Activity* | Rugged traverses, isolated topography, thermal stress, steep crater ascents. | **Devon Island (HMP, High Arctic)**; **Hawaii (HI-SEAS)**; **Askja, Iceland** | Met-rate energy expenditure ($\text{W}$), glove dexterity fatigue, heart rate elevation. | Spacesuit weighs $6\times$ more on Earth; requires neutral buoyancy or partial gravity offloading harnesses. |
| **4** | **Cryogenic Volatile & Permafrost Drilling** | *Operational Surface Activity* | Subsurface ice stability, desiccating thermal regime, dry overlying permafrost. | **McMurdo Dry Valleys (University Valley, Antarctica)** | Ground ice depth ($10\text{--}30\text{ cm}$), sublimation rate, ice-cemented shear strength. | Atmospheric pressure ($101\text{ kPa}$) prevents direct ice sublimation compared to Martian ambient ($600\text{ Pa}$). |
| **5** | **Subsurface Lava Tube Exploration** | *Operational Surface Activity* | Basaltic volcanic conduits, skylight roof collapse, basalt ceiling stability. | **Hawaii (Kaumana / Mauna Loa)**; **Undara (Australia)**; **Lava Beds (CA)** | Cave diameter ($5\text{--}20\text{ m}$), rock mass rating (RMR), LiDAR reflectivity. | Terrestrial lava tubes are $\sim 10\times$ smaller than lunar tubes due to Earth's higher gravity during lava drainback. |
| **6** | **Planetary Inverted Delta & Fluvial Science** | *Operational Surface Activity* | Sinuous sandstone channel bodies, mudstone floodplains, clay/sulfate stratigraphy. | **San Rafael Swell (Hanksville, UT)**; **Ebro Basin (Spain)** | Channel curvature, grain size distribution, clay-to-sand ratio, hematite concretions. | Earth vegetation and biogenic soil horizons must be filtered out of spectral and drone imaging. |
| **7** | **Hyper-Arid Astrobiology & Life Detection** | *Operational Surface Activity* | Trace organic carbon ($<10\text{ ppm}$), perchlorates, hygroscopic salts, UV flux. | **Atacama Desert (Yungay / Maria Elena South, Chile)** | Organic detection threshold ($\text{ppb}$), perchlorate concentration ($\text{wt}\%$), water activity ($a_w < 0.6$). | Air-fall microbes and biological contamination require extreme clean-room protocol handling on Earth. |
| **8** | **Autonomous Landing Hazard Detection** | *Operational Surface Activity* | High-density boulder fields ($>1\text{ m}$), cratered surfaces, slope hazards ($>15^\circ$). | **Cinder Lake Crater Field (AZ)**; **Devon Island Haughton Crater** | Cumulative crater size-frequency distribution ($CSFD$), boulder spatial density ($C_f$). | Earth vegetation and rapid weathering blur sharp crater rims and degrade ejecta blankets over short timescales. |
| **9** | **Space Resource ISRU & Regolith Sintering** | *Operational Surface Activity* | Basaltic glass, anorthosite, ilmenite content, low organic matter, angular grains. | **Stillwater Complex (MT)**; **Mauna Kea basaltic tephra** | Glass-to-crystal ratio, $\text{TiO}_2\text{ wt}\%$, grain size distribution ($D_{50} \sim 70\ \mu\text{m}$). | Terrestrial basalts contain hydrated alteration phases (smectite, zeolites) absent in pristine lunar anorthosites. |
| **10** | **Multi-Site Rehearsal Portfolio Synthesis** | *Cross-Cutting Portfolio Framework* | Synthesis across multiple sites covering mobility, science, and isolation testing gates. | **Utah MDRS + Cinder Lake + Atacama** | Integrated mission validation index across disparate environment testing gates. | Inter-site logistics, transport costs, and weather seasonality across hemispheres. |

---

## 3. Explainable Suitability Scoring Model

TERRALIGN classifies every analog candidate into four transparent tiers:

1. **Optimal Analog ($\mathbf{S \ge 0.85}$)**: The site offers high-fidelity physical, chemical, or operational equivalence for the tested subsystem, with well-quantified, manageable reality gap offsets.
2. **Partial / Constrained Analog ($\mathbf{0.60 \le S < 0.85}$)**: The site is valid for specific test objectives (e.g., rover suspension clearance), but fails in others (e.g., atmospheric humidity obscures sensor testing).
3. **Unsuitable for Target Objective ($\mathbf{S < 0.60}$)**: The site possesses environmental contradictions (e.g., heavy vegetation, clay mudstick, moisture) that introduce invalidating artifacts into the hardware test.
4. **Insufficiently Characterized**: Ground-truth datasets or remote sensing coverage are incomplete. The system flags this as a candidate site requiring field validation rather than an empirical score.
