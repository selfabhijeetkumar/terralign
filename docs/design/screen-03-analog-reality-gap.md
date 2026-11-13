# Screen 03 — Analog Reality Gap (ARG) Diagnostic & Simulator Compensation Panel

> **Screen ID**: `47e18fdc2cac4fcbbb0662f6663ee55c`  
> **Stitch HTML**: [`docs/design/stitch/screen-03-analog-reality-gap.html`](file:///c:/NASA SPACE HACKATHON/docs/design/stitch/screen-03-analog-reality-gap.html)  
> **Stitch Screenshot**: [`docs/design/stitch/screen-03-analog-reality-gap.png`](file:///c:/NASA SPACE HACKATHON/docs/design/stitch/screen-03-analog-reality-gap.png)  
> **Resolution**: 2560 × 4308 (Extended Diagnostic Architecture)  
> **Phase**: Phase 2 — Product Design & Architecture

---

## 1. User Goal & Operational Objective
Explains exactly where and why the selected Earth analog environment physically diverges from the destination celestial body. Provides an explainable 6-axis reality gap diagnostic and maps identified physical divergence to proposed aerospace simulation protocols (e.g., vacuum chamber testing, gravity offloading rigs).

---

## 2. Layout Structure & Wireframe Breakdown

```text
+----------------------------------------------------------------------------------------------------+
| TERRALIGN  "Where Earth Meets Other Worlds"      Mission Command  Terrain Studio  [Reality Gap] ... |
+----------------------------------------------------------------------------------------------------+
| ANALOG REALITY GAP (ARG) DIAGNOSTIC                                                                |
| Cinder Lake Crater Field, AZ (Earth) -> Lunar South Pole Shackleton Rim (Moon)                      |
| MISSION: Rover Terramechanics & Mobility            [ ARG = 0.72 (ILLUSTRATIVE) ] (HIGH DIVERGENCE) |
+------------------------------------+----------------------------------+----------------------------+
| [1. GRAVITY DISPARITY]             | [2. ATMOSPHERIC PRESSURE]        | [3. THERMAL BOUNDARY]      |
| Earth: 9.81 m/s² | Moon: 1.62 m/s² | Earth: 86.1 kPa | Moon: ~0 Pa    | Earth: -15°C to +38°C (air)|
| Δg = 8.19 m/s² (83.5% reduction)   | Δp = 86.1 kPa (100% divergence)  | Moon: -233° to -53°C polar |
| [Bar: ================== 83.5% RED]| [Bar: ==================== 100%R]| (+123°C global eq max)     |
| Conf: EXACT | Denom: Earth g       | Conf: HIGH | Denom: Earth p      | [Bar: =============== 75%O]|
| * Caveat: Requires ARGOS offload   | * Caveat: Vacuum chamber test req| Conf: MODERATE | LRO Divin |
+------------------------------------+----------------------------------+----------------------------+
| [4. SOLAR IRRADIANCE]              | [5. RADIATION FLUX]              | [6. REGOLITH COHESION]     |
| Earth: 1000 W/m² | Moon: 1361 W/m² | Earth: <3 mSv/yr | Moon: ~380mSv | Earth: Weathered Cinder    |
| ΔI = 361 W/m² (26.5% increase)     | ΔR = 377 mSv/yr (>100x factor)   | Moon: Jagged Agglutinates  |
| [Bar: ===== 26.5% AMBER]           | [Bar: ==================== 100%R]| [Bar: ============== 70% O]|
| Conf: HIGH | Source: NASA TSI      | Conf: MODERATE | CRaTER inst     | Conf: LOW | Apollo Samples |
| * Caveat: Zero diffuse sky light   | * Caveat: GCR + SPE solar active | * Caveat: Abrasive/adhesiv |
+------------------------------------+----------------------------------+----------------------------+
| PROPOSED EXPERIMENTAL COMPENSATION PROTOCOLS [ENGINEERING PROPOSALS — NOT VALIDATED SIMULATIONS]   |
|                                                                                                    |
| Gap Axis    | Proposed Compensation Protocol     | Test Facility / Rig  | Validation Status        |
| Gravity     | Partial gravity offload harness    | NASA JSC ARGOS       | PARTIAL LOAD ONLY        |
| Pressure    | Thermal-vacuum chamber testing     | NASA Chamber A (TVAC)| VALIDATED (LAB SCALE)    |
| Thermal     | Cryogenic thermal cycling          | Cryo Test Facility   | VALIDATED (COMPONENT)    |
| Irradiance  | High Dynamic Range optical testing | Solar Simulator Rig  | GEOMETRIC MATCH ONLY     |
| Radiation   | Monte Carlo transport modeling     | FLUKA / GEANT4 Sim   | THEORETICAL MODEL ONLY   |
| Regolith    | LHS-1 / JSC-1A simulant testbed    | GRC SLOPE Facility   | MECHANICAL PROXY ONLY    |
+----------------------------------------------------------------------------------------------------+
| PROVENANCE: Model ARG-v3.8 · GSFC Astrobiology Branch · Confidence C=0.88 · [Download ARG Dossier] |
+----------------------------------------------------------------------------------------------------+
```

---

## 3. The 6 Axes of the Analog Reality Gap: Formulation, Denominators & Caveats

$$\text{ARG}(L, B) = \sqrt{\frac{1}{6} \sum_{j=1}^{6} \left( \frac{\Delta P_j}{P_{j,\text{max}}} \right)^2}$$

> [!NOTE]
> **Status: Illustrative Composite Index (`ARG = 0.72`)**. Not an empirically certified flight qualification metric. Serves as a transparent comparative diagnostic framework.

1. **Gravity Disparity ($\Delta g$)**:
   - Values: Earth $9.81\text{ m/s}^2$ vs. Moon $1.62\text{ m/s}^2$ ($\Delta g = 8.19\text{ m/s}^2$).
   - **Explicit Denominator**: Earth surface gravity $g_\oplus = 9.80665\text{ m/s}^2$.
   - Calculation: $\Delta g / g_\oplus = (9.807 - 1.622) / 9.807 = 83.46\% \approx 83.5\%$.
   - Caveat: Physical invariant; offload harnesses (ARGOS) reduce wheel ground reaction force but cannot alter particle flight trajectories.
2. **Atmospheric Pressure Gradient ($\Delta p$)**:
   - Values: Cinder Lake $86.1\text{ kPa}$ (at $2,050\text{ m}$ crater basin, range $80\text{--}86.1\text{ kPa}$) vs. Lunar Exospheric SBE Reference ($10^{-10}\text{ Pa}$ quiet night baseline, up to $10^{-7}\text{ Pa}$ daytime).
   - **Explicit Denominator**: Local Earth ambient barometric pressure $p_\oplus = 86.1\text{ kPa}$.
   - Calculation: $\Delta p / p_\oplus = (86.1\text{ kPa} - 10^{-13}\text{ kPa}) / 86.1\text{ kPa} \approx 100.0\%$.
   - Caveat: Inescapable on Earth surface; eliminates convective motor cooling and aerodynamic dust suspension.
3. **Thermal Boundary Delta ($\Delta T$)**:
   - Values: Cinder Lake air temp span $-15^\circ\text{C}$ to $+38^\circ\text{C}$ ($\Delta T_\oplus = 53^\circ\text{C}$; dark cinder surface skin temp $-20^\circ\text{C}$ to $+55^\circ\text{C}$). Lunar South Pole surface regolith brightness temp spans $-233^\circ\text{C}$ ($40\text{ K}$ in PSRs) to $-53^\circ\text{C}$ ($220\text{ K}$ on sunlit rims), with global equatorial maximum reaching $+123^\circ\text{C}$ ($396\text{ K}$).
   - **Explicit Reference**: Diviner orbital radiometer surface skin brightness temperature vs. terrestrial meteorological air temperature (and dark basalt surface temperature).
   - Calculation: Polar diurnal span is $\sim 180^\circ\text{C}$; global lunar span is $356^\circ\text{C}$ vs. Earth air $53^\circ\text{C}$; normalized expansion factor is $\sim 75\%$.
4. **Solar Irradiance Variance ($\Delta I$)**:
   - Values: Terrestrial peak clear-sky Direct Normal Irradiance $1076\text{ W/m}^2$ (Bird model at $2,050\text{ m}$) and standard sea-level $1000\text{ W/m}^2$ (ASTM G173-03 AM1.5) vs. Lunar unattenuated Top-of-Atmosphere Total Solar Irradiance $1361\text{ W/m}^2$ (SORCE/TSIS-1 at $1\text{ AU}$).
   - **Explicit Denominators & Comparisons**:
     - Direct Normal Beam Gain: $(1361 - 1076) / 1076 = +26.49\% \approx +26.5\%$ over peak mountain clear-sky DNI.
     - Standard Sea-Level AM1.5 Gain: $(1361 - 1000) / 1000 = +36.10\%$ over ASTM G173-03.
     - Polar Grazing Flux: Lunar South Pole horizontal flux is only $35\text{--}70\text{ W/m}^2$ due to low elevation ($1.5^\circ\text{--}3.0^\circ$), but vertical surfaces receive full unscattered $1361\text{ W/m}^2$. Diffuse skylight is $0\text{ W/m}^2$ on Moon vs $100\text{--}200\text{ W/m}^2$ on Earth.
   - Caveat: Lunar lighting lacks diffuse skylight scattering; optical contrast between sunlit regolith and shadow is extreme.
5. **Radiation Flux ($\Delta R$)**:
   - Values: Terrestrial surface background at Flagstaff / Cinder Lake $\sim 3.2\text{ mSv/yr}$ ($0.37\ \mu\text{Sv/hr}$) vs. Unshielded Lunar Surface GCR + SPE $\sim 380\text{ mSv/yr}$ during solar minimum behind $0.22\text{ g/cm}^2$ spacesuit-equivalent shielding (LRO CRaTER, Schwadron et al. 2014, 2018). In-situ far-side surface dose equivalent measured by Chang'e-4 LND is $57.1\ \mu\text{Sv/hr}$ ($\approx 500\text{ mSv/yr}$, Zhang et al. 2020 Science Advances).
   - Ratio: $380 / 3.2 \approx 118.8\times$ (>100x increase in biological dose equivalent).
   - Caveat: Applies strictly to **unshielded/spacesuit surface exposure**. Absorbed dose ($\text{Gy}$) is distinct from dose equivalent ($\text{Sv}$, applying quality factor $Q \approx 4.3$ for heavy GCR ions). Spacesuit and habitat shielding attenuate solar particle events.
6. **Regolith Morphology & Cohesion ($\Delta C$)**:
   - Earth: Subangular to subrounded weathered basalt cinder ($c \approx 0\text{--}2\text{ kPa}$, $\phi \approx 35^\circ\text{--}38^\circ$).
   - Moon: Jagged, unweathered impact glass agglutinates with high mechanical interlocking ($\phi \approx 38^\circ\text{--}50^\circ$) and electrostatic adhesiveness.
   - Caveat: Terrestrial basalt lacks the nanophase iron and electrostatic vacuum adhesion of real lunar regolith. Simulants (LHS-1/JSC-1A) serve as partial mechanical proxies only.

Composite value: $\text{ARG} = 0.72$ (classified in the **High Divergence Zone**).

---

## 4. Simulator Compensation Panel: Guardrails & Transparency
The compensation panel displays proposed engineering protocols for flight qualification testing.
- **Mandatory Guardrail**: The panel is explicitly labeled `ENGINEERING PROPOSALS — NOT VALIDATED SIMULATIONS`.
- **Honesty Demarcation**:
  - Mechanical gravity offload via ARGOS reduces rover wheel ground load to $1/6g$, but does not alter soil particle inertial trajectory during wheel slip.
  - Simulants (JSC-1A, LHS-1) match bulk density and grain size distribution, but lack the electrostatic charge and nano-phase iron ($np\text{Fe}^0$) of pristine lunar vacuum regolith.

---

## 5. Phase 3 Implementation Notes
- **Component**: Next.js Client Component `RealityGapDiagnosticView.tsx`.
- **Visuals**: Animated SVG divergence meters, high-contrast status pills, collapsible compensation matrix.
- **Export**: Generates printable PDF summary using `@react-pdf/renderer` or client-side HTML printable view.

