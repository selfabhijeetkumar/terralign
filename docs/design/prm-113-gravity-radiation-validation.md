# TERRALIGN — PRM-113 Technical Validation Report
## Stage C: Gravity Terramechanics & Radiation Claim Engineering Validation

**Project:** TERRALIGN — *Where Earth Meets Other Worlds*  
**Document ID:** `TERRALIGN-DOC-PRM-113-GRAV-RAD`  
**Phase:** Phase 2 — Final Remediation & Phase 3 Gate Preparation  
**Stage:** Stage C of PRM-113 Final Remediation  
**Date:** 12 November 2026  
**Roles:** Aerospace Systems Engineer, Planetary Geologist, Mathematical Modelling Specialist, Senior Scientific Data Auditor  
**Governance:** Ponytail FULL (`REUSE → SIMPLIFY → IMPLEMENT`)  
**Workspace:** `C:\NASA SPACE HACKATHON`  

---

## 1. Executive Summary & Validation Scope

This report rigorously audits two critical operational physics claims documented in `PRM-110`, `PRM-112`, and `final-scientific-integrity-register.md`:
1. **The Gravity & Drawbar Pull Claim**: Re-examines the assertion that an $83.5\%$ gravitational reduction directly yields an "$\approx 83\%$ reduction in drawbar pull", evaluating the claim against Bekker-Wong terramechanics.
2. **The Radiation Comparison Claim**: Validates the comparability of terrestrial dose rates at Cinder Lake ($0.37\ \mu\text{Sv/hr}$), LRO CRaTER measurements ($43.4\ \mu\text{Sv/hr}$), and Chang'e-4 in-situ surface data ($57.1\ \mu\text{Sv/hr}$), determining the validity of the $117.3\times$ multiplier and annualized projections.

---

## 2. Gravity & Rover Drawbar Pull Validation

### 2.1 The Over-Simplification in Existing Documentation
In `PRM-110` (Section 2.1, Line 57) and `PRM-112`, documentation stated:
> *"Reduced normal force reduces maximum drawbar pull by ~83%."*

**Engineering Finding**: **This statement is an over-simplified approximation.** While the vehicle weight (normal force $W = mg$) drops by exactly $83.46\%$, **drawbar pull ($DP$) does NOT scale linearly with gravity.**

### 2.2 Bekker-Wong Terramechanics Formulation
In terramechanics (Bekker 1956, Wong 2008, Heiken et al. *Lunar Sourcebook* Section 9), the net drawbar pull developed by a rover wheel is the difference between gross tractive soil thrust ($H$) and total motion resistance ($R$):

$$DP = H - R$$

#### 1. Gross Soil Thrust ($H$):
Governed by the Mohr-Coulomb soil failure criterion integrated over the tire contact patch area $A$:
$$H = A \cdot c + W \cdot \tan\phi = A \cdot c + (m \cdot g) \cdot \tan\phi$$
Where:
- $c$: Regolith cohesion ($0.1\text{ to }3.0\text{ kPa}$ on Moon).
- $\phi$: Internal soil friction angle ($38^\circ\text{ to }50^\circ$ for lunar regolith).
- $W = m \cdot g$: Normal load on the driving wheel.

**Crucial Observation**: The cohesive term $A \cdot c$ is **independent of gravitational acceleration $g$**. For a cohesive or semi-cohesive soil, as $g \rightarrow 0$, $A \cdot c$ remains non-zero. Only the frictional term $W \tan\phi$ scales with $g$.

#### 2. Motion Compaction Resistance ($R_c$):
Compaction resistance arises from wheel sinkage $z_0$ into porous regolith:
$$R_c = \frac{b}{n + 1} \left( \frac{k_c}{b} + k_\phi \right) z_0^{n+1}$$
Where sinkage depth $z_0$ under normal wheel load $W$ is:
$$z_0 = \left( \frac{3 W}{(3 - n) b (k_c/b + k_\phi) \sqrt{D}} \right)^{\frac{2}{2n + 1}}$$
For typical lunar regolith where pressure-sinkage exponent $n \approx 1$:
$$R_c \propto W^{\frac{2n + 2}{2n + 1}} = W^{4/3} = (m \cdot g)^{1.33}$$

### 2.3 Physical Consequence of Reduced Gravity on Rover Mobility
Because motion resistance $R_c$ scales super-linearly with weight ($W^{1.33}$), **a rover on the Moon sinks significantly less into the regolith than it does on Earth!**
- Less sinkage means **drastically reduced compaction resistance ($R_c$)**.
- During Apollo 15, 16, and 17, LRV wheel sinkage was only $1.0\text{ to }3.0\text{ cm}$ in undisturbed inter-crater mare regolith (Costes et al., NASA TR R-393, "Apollo 15 Mobility Evaluation").
- The dimensionless **drawbar pull coefficient** ($\mu_{DP} = DP / W$) on the Moon was measured between **$0.35$ and $0.55$**, comparable to or even higher than on terrestrial testbeds because reduced sinkage reduced motion resistance!

### 2.4 Remediation & Scientific Reclassification
- **The Physical Truth**: The **normal load** drops by $83.46\%$ ($1.622 / 9.807$). The **absolute pull force in Newtons** drops, but the vehicle's capability to climb slopes and overcome soil resistance relative to its weight ($\mu_{DP}$) remains high.
- **Approved Correction for UI and Documentation**:
  > *"Terrestrial gravity ($9.81\text{ m/s}^2$) exerts $6\times$ higher normal force than lunar gravity ($1.62\text{ m/s}^2$). While wheel normal load drops by $83.5\%$, net drawbar pull must be computed via Bekker-Wong terramechanics because reduced lunar sinkage simultaneously reduces wheel motion resistance ($R_c \propto W^{1.33}$)."*
- **Epistemic Classification**:
  - Gravity acceleration ratio: **`[VERIFIED SOURCE DATA]`** ($83.46\%$).
  - Drawbar pull impact: **`[DERIVED FROM VERIFIED DATA]`** (Bekker-Wong Terramechanics Model).

---

## 3. Radiation Exposure & Dosimetry Validation

### 3.1 Dataset Inventory & Measurement Regimes

The three radiation numbers cited across TERRALIGN represent distinct, verified measurement environments:

| Dataset / Location | Platform / Instrument | Shielding Condition | Measured Dose Rate | Annualized Projection | Literature Reference |
|:---|:---|:---|:---:|:---:|:---|
| **Cinder Lake, AZ (Earth)** | Ground level ($2,050\text{ m}$) / Environmental Survey | Shielded by Earth magnetosphere & $\approx 800\text{ g/cm}^2$ atmospheric column | **$0.37\ \mu\text{Sv/hr}$** | **$3.24\text{ mSv/yr}$** | EPA / NCRP Report No. 160 (Terrestrial gamma + cosmogenic muons) |
| **LRO CRaTER (Moon)** | Orbital ($50\text{ km}$) / Silicon detectors with TEP | Unshielded surface model behind $0.22\text{ g/cm}^2$ spacesuit garment | **$43.4\ \mu\text{Sv/hr}$** | **$380\text{ mSv/yr}$** | Schwadron et al. (2014, 2018 *Space Weather*), Solar Cycle 24 Deep Minimum |
| **Chang'e-4 LND (Moon)** | Far-side surface / Semiconductor active telescope | Lunar surface far side; $2\pi$ planetary shielding; unshielded lander deck | **$57.1 \pm 10.4\ \mu\text{Sv/hr}$** | **$500.2\text{ mSv/yr}$** | Zhang et al. (2020 *Science Advances*, eaaz2574), January 2019 in-situ |

### 3.2 Mathematical Verification of the $117.3\times$ Multiplier
$$\text{CRaTER vs Cinder Lake Ratio} = \frac{43.4\ \mu\text{Sv/hr}}{0.37\ \mu\text{Sv/hr}} = \mathbf{117.297... \approx 117.3\times}$$
$$\text{Chang'e-4 vs Cinder Lake Ratio} = \frac{57.1\ \mu\text{Sv/hr}}{0.37\ \mu\text{Sv/hr}} = \mathbf{154.324... \approx 154.3\times}$$

**Verification Finding**: The $117.3\times$ multiplier is **mathematically exact** when comparing the **LRO CRaTER spacesuit model** to the Cinder Lake baseline. When compared against the in-situ surface measurements of Chang'e-4 LND, the multiplier increases to **$154.3\times$**.

### 3.3 Physical Comparability & Sensor Differences
1. **Absorbed Dose ($\text{Gy}$) vs Dose Equivalent ($\text{Sv}$)**:
   - Silicon sensors directly measure absorbed energy in silicon ($Gy_{\text{Si}}$).
   - In lunar space radiation, Galactic Cosmic Rays (GCR) contain energetic heavy ions (HZE ions, such as iron $^{56}\text{Fe}$).
   - To compute biological damage (Sieverts, $\text{Sv}$), physicists multiply absorbed dose by the radiation quality factor $Q$:
     $$H = \int Q(L) \cdot D(L) \cdot dL$$
   - In the Chang'e-4 LND data (Zhang et al. 2020), the average quality factor on the lunar surface was empirically measured as:
     $$Q_{\text{surface}} = 4.32 \pm 0.66$$
     This accounts for the conversion from absorbed dose in silicon ($13.2\ \mu\text{Gy/hr}$) to dose equivalent in water/tissue ($57.1\ \mu\text{Sv/hr}$).
2. **Geometric Shielding ($2\pi$ vs $4\pi$)**:
   - In deep space transit (e.g. Apollo translunar coast), a spacecraft is exposed to $4\pi$ steradians of cosmic rays.
   - On the lunar surface, the solid Moon blocks half the sky, providing $2\pi$ steradian shielding. However, interactions between GCRs and the lunar regolith create a secondary flux of albedo neutrons, which contributes $\sim 10\text{--}15\%$ of the total dose equivalent measured by Chang'e-4.
3. **Annualized Figures Consistency**:
   - $43.4 \times 8760\text{ hrs} = 380,184\ \mu\text{Sv/yr} \approx \mathbf{380\text{ mSv/yr}}$.
   - $0.37 \times 8760\text{ hrs} = 3,241.2\ \mu\text{Sv/yr} \approx \mathbf{3.2\text{ mSv/yr}}$.
   - $57.1 \times 8760\text{ hrs} = 500,196\ \mu\text{Sv/yr} \approx \mathbf{500\text{ mSv/yr}}$.
   - All annualized numbers are derived strictly using the identical $8,760\text{ hours/year}$ multiplier.

### 3.4 Operational Implications for Astronauts & Avionics
- **Human EVA Limits**: A 30-day Artemis surface campaign at $57.1\ \mu\text{Sv/hr}$ imparts:
  $$\text{Dose}_{\text{30d}} = 57.1 \times 24 \times 30 = 41,112\ \mu\text{Sv} \approx \mathbf{41.1\text{ mSv}}$$
  This consumes $\sim 6.9\%$ of NASA's lifetime career radiation limit for astronauts ($600\text{ mSv}$).
- **Avionics & COTS Electronics**: On Earth, terrestrial testbeds (Cinder Lake) have zero heavy-ion GCR flux. Testing autonomous rover navigation software on consumer GPUs/laptops at Cinder Lake does NOT qualify the hardware against Single Event Effects (SEU, SEL) induced by cosmic ray particles. Radiation-hardened electronics or active fault-tolerant triple modular redundancy (TMR) are mandatory.

---

## 4. Final Validation Ledger

| Claim Area | Previous Documented Form | Verified Engineering Form | Epistemic Classification | Status |
|:---|:---|:---|:---:|:---:|
| **Gravity Drawbar Pull** | *"Drawbar pull drops by ~83%"* | Normal load drops by $83.5\%$; net drawbar pull must be modeled via Bekker-Wong terramechanics due to reduced compaction resistance. | `[DERIVED FROM VERIFIED DATA]` | **REMEDIATED & QUALIFIED** |
| **Radiation Multiplier** | *$117.3\times$ Hazard Factor* | Exact $43.4 / 0.37 = 117.3\times$ for CRaTER spacesuit model; $154.3\times$ for Chang'e-4 in-situ surface measurement. | `[VERIFIED SOURCE DATA]` | **VERIFIED & CONFIRMED** |
| **Annualized Radiation** | $3.2\text{ mSv/yr}$ vs $380\text{ mSv/yr}$ ($500\text{ mSv/yr}$) | Mathematically verified across $8,760\text{ hrs/year}$. | `[DERIVED FROM VERIFIED DATA]` | **VERIFIED & CONFIRMED** |

**STAGE C COMPLETE — DELIVERABLE AUTHORIZED.**

