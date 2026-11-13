# TERRALIGN — PRM-113 Mathematical Audit & Reconciliation Report
## Stage B: Multi-Site Portfolio Optimization & Arithmetic Re-Verification

**Project:** TERRALIGN — *Where Earth Meets Other Worlds*  
**Document ID:** `TERRALIGN-DOC-PRM-113-MATH`  
**Phase:** Phase 2 — Final Remediation & Phase 3 Gate Preparation  
**Stage:** Stage B of PRM-113 Final Remediation  
**Date:** 12 November 2026  
**Roles:** Mathematical Modelling Specialist, Senior Scientific Data Auditor, Aerospace Systems Engineer  
**Governance:** Ponytail FULL (`REUSE → SIMPLIFY → IMPLEMENT`)  
**Workspace:** `C:\NASA SPACE HACKATHON`  

---

## 1. Executive Summary & Audit Scope

This audit independently recalculates every mathematical claim, combinatorial optimization model, coverage percentage, and rounding derivation utilized across Screen 04 and the TERRALIGN requirements verification architecture.

### Key Audit Findings:
1. **The $78.4\%$ vs $78.3\%$ Discrepancy Identified**: The value $78.4\%$ reported in earlier documentation was caused by a **sum-of-rounded-components error** ($36.7\% + 26.7\% + 15.0\% = 78.4\%$). The exact calculation is $23.5 / 30 = \mathbf{78.333...\%}$, which correctly rounds to **$78.3\%$**.
2. **The $63.4\%$ vs $63.3\%$ $k=2$ Discrepancy Identified**: Similarly, the $k=2$ coverage was reported as $63.4\%$ due to summing $36.7\% + 26.7\%$. The exact calculation is $19 / 30 = \mathbf{63.333...\%}$, which correctly rounds to **$63.3\%$**.
3. **The Theoretical Terrestrial Ceiling ($86.7\%$) Confirmed**: Exactly 4 out of 30 criteria ($13.3\%$) are physically impossible to satisfy in natural Earth surface environments. The maximum theoretical ceiling on Earth is $26 / 30 = \mathbf{86.67\% \approx 86.7\%}$.
4. **Research Target ($>90\%$) Formally Gated**: Confirmed that $>90\%$ mission coverage cannot be achieved by any Earth analog field campaign alone and requires laboratory simulation facilities (ARGOS, TVAC, cryo-shrouds).

---

## 2. Independent Recalculation Ledger

The table below presents the rigorous mathematical derivation of every portfolio model:

| Model / Metric | Numerator ($n$) | Denominator ($d$) | Exact Ratio ($n/d$) | Exact Decimal | Exact Percentage | 1-Dec Rounding | Previous Value | Discrepancy & Root Cause |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---|
| **Binary Model ($k=3$)** | $23$ satisfied criteria ($\theta \ge 0.70$) | $30$ criteria | $23 / 30$ | $0.766666...$ | $76.666...\%$ | **$76.7\%$** | $76.7\%$ | **MATCH**. Mathematically correct. |
| **Site A Unique (Cinder Lake)** | $11$ unique criteria | $30$ criteria | $11 / 30$ | $0.366666...$ | $36.666...\%$ | **$36.7\%$** | $36.7\%$ | **MATCH**. Correct rounding. |
| **Site B Unique (Askja)** | $8$ unique criteria | $30$ criteria | $8 / 30$ | $0.266666...$ | $26.666...\%$ | **$26.7\%$** | $26.7\%$ | **MATCH**. Correct rounding. |
| **Site C Binary (Atacama)** | $4$ unique criteria | $30$ criteria | $4 / 30$ | $0.133333...$ | $13.333...\%$ | **$13.3\%$** | $13.3\%$ | **MATCH**. ($11+8+4=23$). |
| **Partial-Credit Model ($k=3$)** | $22(1.0) + 3(0.5) = 23.5$ | $30$ criteria | $47 / 60$ | $0.783333...$ | $78.333...\%$ | **$78.3\%$** | $78.4\%$ | **DISCREPANCY (-0.1%)**: Caused by summing rounded components ($36.7 + 26.7 + 15.0 = 78.4$). Exact value is **$78.3\%$**. |
| **Site C Partial (Atacama)** | $3\text{ full} + 3(0.5) = 4.5$ | $30$ criteria | $9 / 60 = 3 / 20$ | $0.150000$ | $15.000\%$ | **$15.0\%$** | $15.0\%$ | **MATCH**. Exact decimal. |
| **Integer-24 Model ($k=3$)** | $24$ criteria satisfied | $30$ criteria | $24 / 30 = 4 / 5$ | $0.800000$ | $80.000\%$ | **$80.0\%$** | $80.0\%$ | **MATCH**. Exact integer fraction. |
| **Two-Site Portfolio ($k=2$)** | $11 + 8 = 19$ criteria | $30$ criteria | $19 / 30$ | $0.633333...$ | $63.333...\%$ | **$63.3\%$** | $63.4\%$ | **DISCREPANCY (-0.1%)**: Caused by summing rounded components ($36.7 + 26.7 = 63.4$). Exact value is **$63.3\%$**. |
| **Inescapable Earth Gaps** | $4$ physics barriers | $30$ criteria | $4 / 30 = 2 / 15$ | $0.133333...$ | $13.333...\%$ | **$13.3\%$** | $13.3\%$ | **MATCH**. Exact deficit. |
| **Earth Maximum Ceiling** | $30 - 4 = 26$ criteria | $30$ criteria | $26 / 30 = 13 / 15$ | $0.866666...$ | $86.666...\%$ | **$86.7\%$** | $86.7\%$ | **MATCH**. Correct rounding. |

---

## 3. Discrepancy Analysis: The Sum-of-Rounded-Components Error

In software engineering and data visualization, summing rounded numbers frequently leads to display anomalies:

$$\text{Incorrect (Sum of Rounded)}: \quad 36.7\% + 26.7\% + 15.0\% = 78.4\%$$
$$\text{Correct (Rounded Sum)}: \quad \text{Round}\left( \frac{11 + 8 + 4.5}{30} \times 100 \right) = \text{Round}(78.3333\%) = \mathbf{78.3\%}$$

Similarly for the two-site campaign ($k=2$):
$$\text{Incorrect (Sum of Rounded)}: \quad 36.7\% + 26.7\% = 63.4\%$$
$$\text{Correct (Rounded Sum)}: \quad \text{Round}\left( \frac{11 + 8}{30} \times 100 \right) = \text{Round}(63.3333\%) = \mathbf{63.3\%}$$

### Remediation Directive:
- **Canonical Value for $k=3$ Partial-Credit Model**: **$78.3\%$** (or explicitly display $78.33\%$).
- **Canonical Value for $k=2$ Campaign**: **$63.3\%$** (or explicitly display $63.33\%$).
- The application store and UI components in Phase 3 must compute totals directly from floating-point ratios before formatting to 1 decimal place.

---

## 4. The 30 Evaluation Criteria & The 4 Inescapable Physics Gaps

The 30 TERRALIGN evaluation criteria synthesize NASA SP-2016-6105, NASA-STD-3001, and Artemis CONOPS requirements into 5 functional clusters:

```
+--------------------------------------------------------------------------------------------------+
| 30-PARAMETER REQUIREMENTS VERIFICATION MATRIX (RVM) BREAKDOWN                                    |
|                                                                                                  |
| 1. Terramechanics & Mobility (8 Criteria)       ──► 8 Satisfied on Earth                         |
| 2. Geochemistry & Sample Science (8 Criteria)   ──► 8 Satisfied on Earth                         |
| 3. Optical, Solar & Shadow Dynamics (6 Criteria)──► 5 Satisfied; 1 Inescapable Vacuum Optical Gap |
| 4. Operational & EVA Architecture (4 Criteria)  ──► 3 Satisfied; 1 Inescapable 1/6g Dynamics Gap  |
| 5. Environmental Extremes & Hazards (4 Criteria)──► 2 Inescapable Physics Barriers (Rad & Cryo)  |
|                                                                                                  |
| TOTAL SATISFIED: 26 / 30 (86.7%)  |  INESCAPABLE EARTH GAPS: 4 / 30 (13.3%)                      |
+--------------------------------------------------------------------------------------------------+
```

### The 4 Inescapable Earth Gaps Detailed:
1. **Hard-Vacuum Surface Regolith Adhesion ($10^{-10}\text{ Pa}$)**:
   - *Requirement*: Surface adhesion and absence of lubricating gas layers causing electrostatic clinging and cold welding.
   - *Physical Barrier*: Earth atmospheric gas pressure ($86.1\text{ kPa}$ at Cinder Lake) forms ubiquitous oxide and moisture films. Cannot be duplicated outdoors.
2. **Long-Duration $1/6\text{ g}$ Rover Slip & Regolith Dynamics**:
   - *Requirement*: Rover dynamic wheel slip, dust roostertails, and suspension rebound under $1.62\text{ m/s}^2$.
   - *Physical Barrier*: Terrestrial gravity is $9.81\text{ m/s}^2$. Cranes (ARGOS) relieve chassis weight but cannot alter the acceleration of kicked-up dust or internal rover mass momentum.
3. **Unshielded Galactic Cosmic Ray (GCR) & Solar Particle Flux**:
   - *Requirement*: Radiation environment of $43.4\ \mu\text{Sv/hr}$ ($380\text{ mSv/yr}$) unshielded heavy-ion flux ($^{56}\text{Fe}$).
   - *Physical Barrier*: Earth magnetosphere and atmospheric column ($1033\text{ g/cm}^2$) attenuate GCRs to $0.37\ \mu\text{Sv/hr}$ ($3.2\text{ mSv/yr}$).
4. **Sub-$40\text{ K}$ Cryogenic Equilibrium in PSR Cold Traps**:
   - *Requirement*: Surface skin temperatures of $27\text{ K to }40\text{ K}$ ($-246^\circ\text{C}$ to $-233^\circ\text{C}$).
   - *Physical Barrier*: Coldest natural temperature ever recorded on Earth is $-89.2^\circ\text{C}$ ($184.0\text{ K}$, Vostok Station, Antarctica).

---

## 5. Algorithmic Optimization & The $(1 - 1/e)$ Bound

The portfolio optimizer formulation:
$$\max_{\mathcal{S} \subseteq \mathcal{L}, |\mathcal{S}| \le k} \frac{\left| \bigcup_{L \in \mathcal{S}} \{r_j \in R : C_{Lj} \ge \theta\} \right|}{|R|}$$

### 5.1 Submodularity & Approximation Guarantee
- The objective function $f(\mathcal{S})$ measures the cardinality of covered requirements.
- By set algebra, for any candidate pools $\mathcal{A} \subseteq \mathcal{B} \subseteq \mathcal{L}$ and candidate site $L \notin \mathcal{B}$:
  $$f(\mathcal{A} \cup \{L\}) - f(\mathcal{A}) \ge f(\mathcal{B} \cup \{L\}) - f(\mathcal{B})$$
- This proves that $f(\mathcal{S})$ is **strictly submodular and monotone non-decreasing**.
- By the classical theorem of **Nemhauser, Wolsey, and Fisher (1978)**, the greedy sequential selection algorithm:
  $$\mathcal{S}_{i} = \mathcal{S}_{i-1} \cup \arg\max_{L \in \mathcal{L} \setminus \mathcal{S}_{i-1}} \Big( f(\mathcal{S}_{i-1} \cup \{L\}) - f(\mathcal{S}_{i-1}) \Big)$$
  is proven to achieve a solution satisfying:
  $$f(\mathcal{S}_{\text{greedy}}) \ge \left( 1 - \frac{1}{e} \right) f(\mathcal{S}_{\text{optimal}}) \approx 0.6321 \cdot f(\mathcal{S}_{\text{optimal}})$$

### 5.2 Global Optimum via Exhaustive Enumeration
In TERRALIGN, the pool of flagship analog candidates is $|\mathcal{L}| = 7$.
- For $k = 2$: Total possible combinations is $\binom{7}{2} = \frac{7 \times 6}{2} = 21$ pairs.
- For $k = 3$: Total possible combinations is $\binom{7}{3} = \frac{7 \times 6 \times 5}{6} = 35$ triplets.

**Key Technical Finding**: Because evaluating 35 combinations requires $<1000$ basic bitwise operations, the Phase 3 TypeScript client engine (`portfolioOptimizer.ts`) will evaluate **all 35 combinations in $<2\text{ milliseconds}$**. It will return the **true global mathematical optimum**, rendering the $(1 - 1/e)$ greedy bound an analytical floor rather than an operational ceiling!

---

## 6. Audit Sign-Off & Required Updates

1. **Update Canonical Percentages**:
   - Change $k=3$ Partial-Credit from $78.4\%$ to **$78.3\%$** ($78.33\%$).
   - Change $k=2$ Campaign from $63.4\%$ to **$63.3\%$** ($63.33\%$).
   - Maintain Binary Model at **$76.7\%$** ($23/30$).
   - Maintain Integer-24 Model at **$80.0\%$** ($24/30$).
   - Maintain Maximum Terrestrial Ceiling at **$86.7\%$** ($26/30$).
   - Maintain Inescapable Deficit at **$13.3\%$** ($4/30$).
2. **Gate $>90\%$ Target**: Must remain explicitly tagged `[UNVALIDATED HYPOTHESIS — ENGINEERING RESEARCH TARGET]`.

