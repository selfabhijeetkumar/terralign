# 04 — Earth, Moon, and Mars: Comparative Planetary Physics & Environmental Boundaries

> **Module**: TERRALIGN Research Series · Document 04  
> **Challenge**: Discovery and Characterization of New Terrestrial Analogs for Lunar and Martian Exploration  
> **Status**: Verified Planetary Physics Reference  
> **Authoritative Baselines**: NASA Planetary Fact Sheets, COSPAR Planetary Protection, Apollo/Artemis Geotechnical Reports

---

## 1. Master Comparative Planetary Table

| Planetary Property | Earth (Reference) | Moon (Luna) | Mars | Critical Engineering / Scientific Impact |
|:---|:---:|:---:|:---:|:---|
| **Mean Radius ($R$)** | $6,371\text{ km}$ | $1,737.4\text{ km}$ ($0.273\ R_\oplus$) | $3,389.5\text{ km}$ ($0.532\ R_\oplus$) | Horizon distance, surface curvature, line-of-sight communications range. |
| **Surface Gravity ($g$)** | $9.807\text{ m/s}^2$ ($1.0g$) | $1.62\text{ m/s}^2$ ($0.166g$) | $3.72\text{ m/s}^2$ ($0.379g$) | Structural mass requirements, rover traction, suspension dynamics, regolith ejection speeds. |
| **Surface Atmospheric Pressure** | $101.325\text{ kPa}$ ($1.0\text{ bar}$) | Hard Vacuum ($<10^{-10}\text{ Pa}$) | $0.61\text{--}1.15\text{ kPa}$ ($6.1\text{--}11.5\text{ mbar}$) | Thermal convection vs radiation only; space suit pressure delta ($\Delta P$); aerodynamic deceleration. |
| **Atmospheric Composition** | $78\%\ \text{N}_2, 21\%\ \text{O}_2, 0.9\%\ \text{Ar}$ | None (trace He, Ne, H in exosphere) | $95.3\%\ \text{CO}_2, 2.6\%\ \text{N}_2, 1.9\%\ \text{Ar}$ | Gas breathing systems, ISRU $\text{O}_2$ extraction (MOXIE), wind dynamic pressure ($q = \frac{1}{2}\rho v^2$). |
| **Diurnal Cycle (Day Length)** | $24\text{ hours}$ | $29.53\text{ Earth days}$ ($708.7\text{ hrs}$) | $24\text{ hours } 39\text{ min } 35\text{ sec}$ | Solar array storage sizing; thermal cycling fatigue; circadian rhythm drift. |
| **Surface Temperature Range** | $-89^\circ\text{C to }+58^\circ\text{C}$ | $-246^\circ\text{C to }+121^\circ\text{C}$ (PSR vs Equator) | $-143^\circ\text{C to }+35^\circ\text{C}$ | Cryogenic embrittlement, seal failure, thermal expansion stress on joints. |
| **Surface Solar Irradiance** | $\sim 1000\text{ W/m}^2$ (sea level) | $\sim 1361\text{ W/m}^2$ (unattenuated) | $\sim 590\text{ W/m}^2$ (mean TOA) | Photovoltaic generation efficiency, thermal balance, lighting contrast. |
| **Magnetic Field & Shielding** | Global dipole ($30\text{--}60\ \mu\text{T}$) | Negligible crustal fields only ($<100\text{ nT}$) | Weak localized crustal remanence ($<1.5\ \mu\text{T}$) | Solar Particle Events (SPE), Galactic Cosmic Rays (GCR), avionics latch-up risk. |
| **Surface Radiation Dose** | $\sim 2.4\text{ mSv/year}$ (ambient) | $60\text{--}100\text{ mSv/year}$ ($0.2\text{--}0.4\text{ mSv/day}$) | $200\text{--}300\text{ mSv/year}$ ($0.6\text{--}0.8\text{ mSv/day}$) | Habitat shielding mass requirement (water, regolith berms), mission crew exposure limits. |
| **Regolith Particle Morphology** | Smooth / rounded by water & wind | Hyper-jagged, sub-micron glass shards | Fine oxidized iron dust, angular-to-subrounded | Mechanical seal erosion, spacesuit fabric abrasion, electrostatic cling, toxic inhalation. |
| **Active Surface Fluid Dynamics** | Liquid $\text{H}_2\text{O}$ rainfall, rivers, oceans | None; cryogenic volatile cold traps only | Sublimation of $\text{CO}_2$ ice; rare transient brines | Absence of fluvial modification preserves billions-of-years-old impact craters. |

---

## 2. Geotechnical & Terramechanical Comparison

Understanding rover locomotion requires modeling the **Bekker-Wong Soil Mechanics Parameters**:

$$p = \left( \frac{k_c}{b} + k_\phi \right) z^n$$

Where $p$ is sinkage pressure, $b$ is wheel width, $z$ is wheel sinkage depth, $k_c$ and $k_\phi$ are cohesive and frictional moduli, and $n$ is soil deformation exponent.

| Geotechnical Metric | Earth Standard Soil | Lunar Regolith (Apollo 11/15 Core Data) | Martian Soil (Viking, MER, MSL Data) | Analog Testing Reality Gap |
|:---|:---:|:---:|:---:|:---|
| **Bulk Density ($\rho$)** | $1.6\text{--}2.0\text{ g/cm}^3$ | $1.50\text{ g/cm}^3$ (top $15\text{ cm}$), rising to $1.90\text{ g/cm}^3$ at depth | $1.1\text{--}1.6\text{ g/cm}^3$ (drift sand) to $1.9\text{ g/cm}^3$ (duricrust) | Earth gravity compacts analog cinder beds faster than lunar/Martian regolith. |
| **Cohesion ($c$)** | $5\text{--}50\text{ kPa}$ (cohesive) | $0.1\text{--}1.0\text{ kPa}$ (extremely weak) | $0.1\text{--}2.0\text{ kPa}$ (weak, cemented locally) | Cohesion on Earth is dominated by moisture; extraterrestrial cohesion is van der Waals force. |
| **Internal Friction Angle ($\phi$)** | $25^\circ\text{--}35^\circ$ | $35^\circ\text{--}48^\circ$ (high due to interlocking jagged shapes) | $30^\circ\text{--}38^\circ$ (basaltic silt and sand) | High friction angle in low-cohesion soil leads to sudden rover wheel slip and trenching. |
| **Bearing Capacity** | High ($>100\text{ kPa}$) | Low surface ($10\text{--}30\text{ kPa}$), high subsurface ($>100\text{ kPa}$) | Variable ($20\text{--}150\text{ kPa}$) | Weak upper layer causes initial sinkage; sudden hard layer causes high drawbar spikes. |

---

## 3. Optical & Photometric Boundary Differences

1. **Lunar South Pole (Artemis Landing Sites)**:
   - Sun hovers $1^\circ\text{--}3^\circ$ above the local horizon throughout the lunar day.
   - Casts kilometers-long pitch-black shadows into Permanently Shadowed Regions (PSRs).
   - Zero atmosphere means **no diffuse ambient light**: objects in shadow are completely invisible to standard cameras unless illuminated by earthshine or vehicle headlamps.
   - High dynamic range ($>120\text{ dB}$) optical sensors are mandatory.
2. **Martian Atmospheric Scattering**:
   - Atmospheric dust particles with mean radius $r \approx 1.5\ \mu\text{m}$ produce dominant forward Mie scattering.
   - Results in characteristic "salmon pink" sky at noon and localized "blue sunsets" due to wavelength-dependent forward diffraction.
   - Terrestrial skies, by contrast, are governed by Rayleigh scattering ($I \propto \lambda^{-4}$), yielding bright blue skies and broad diffuse sky illumination.

