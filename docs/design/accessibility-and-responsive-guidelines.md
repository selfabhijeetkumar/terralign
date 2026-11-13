# TERRALIGN Accessibility & Responsive Design Guidelines

> **Standard**: WCAG 2.2 Level AA Compliance  
> **Phase**: Phase 2 — Product Design & Architecture  
> **Target Form Factors**: Desktop (Primary), Ultrawide Displays, Tablets, Field Laptops

---

## 1. Accessibility Audit & Compliance Matrix (WCAG 2.2 AA)

TERRALIGN is designed for high-stress aerospace mission planning environments where legibility, visual contrast, and keyboard control are safety-critical.

| Guideline | WCAG Criterion | TERRALIGN Implementation & Audit Result | Status |
|:---|:---:|:---|:---:|
| **Color Contrast (Text)** | 1.4.3 (Contrast Minimum) | All primary text (`#F8FAFC` on `#050811` and `#0A192F`) exceeds $14.8:1$. Secondary text (`#CBD5E1`) achieves $10.5:1$. Muted labels (`#8B9CB5`) achieve $5.4:1$ (exceeding $4.5:1$ requirement). | **PASS** (AAA) |
| **Color Contrast (UI Components)** | 1.4.11 (Non-text Contrast) | Interactive borders, focus rings (`#00D4AA`), and divergence meters achieve $>3.0:1$ against adjacent backgrounds. | **PASS** (AA) |
| **Use of Color** | 1.4.1 (Use of Color) | Color is never used as the sole conveyor of information. All status badges include text labels (`HIGH`, `MODERATE`, `LOW`, `UNCHARACTERIZED`) and distinctive icons. | **PASS** |
| **Keyboard Navigation** | 2.1.1 (Keyboard) | All interactive controls (tabs, site cards, 3D sun angle slider, matrix filters) are fully navigable via `Tab`, `Shift+Tab`, `Enter`, and Arrow keys. | **PASS** |
| **Focus Visible** | 2.4.7 (Focus Visible) | Highly visible glowing focus ring (`2px solid #00D4AA`, offset `2px`) displayed on all focused interactive elements. | **PASS** |
| **Non-Interfering Motion** | 2.3.3 (Animation from Interactions) | Full support for `@media (prefers-reduced-motion: reduce)` — disables camera fly-tos, glowing pulse animations, and transitions. | **PASS** |
| **Labels & Instructions** | 3.3.2 (Labels or Instructions) | All form inputs and sliders feature explicit permanent labels and unit readouts ($^\circ$, $\text{m/s}^2$, $\text{kPa}$). | **PASS** |
| **Target Size** | 2.5.8 (Target Size Minimum) | All clickable targets are at least $44 \times 44\text{ px}$ or provide adequate spacing. | **PASS** |

---

## 2. Responsive Layout Behavior & Breakpoints

TERRALIGN is engineered primarily for desktop workstations, mission control dual-monitor setups, and ruggedized field tablets.

```mermaid
flowchart TD
    Viewport{"Viewport Width (px)"}
    Viewport -->|>= 1536px (2xl)| Ultrawide["Ultrawide Mission Display<br/>Dual synchronized viewports at 2560px with expanded telemetry"]
    Viewport -->|1280px - 1535px (xl)| Desktop["Standard Desktop<br/>Side-by-side synchronized 3D viewports + fixed 20% control sidebar"]
    Viewport -->|1024px - 1279px (lg)| Laptop["Field Laptop<br/>Stacked tabs for 3D views or collapsible sidebars"]
    Viewport -->|768px - 1023px (md)| Tablet["Tablet (Landscape/Portrait)<br/>Single viewport toggle (Earth / Moon tabs), full-width drawer"]
    Viewport -->|< 768px (sm)| Mobile["Mobile Field Viewer<br/>Condensed site summary cards, read-only 2D terrain profiles"]
```

### Layout Adaptation Rules:
1. **Screen 1 (Mission Command)**:
   - On $\ge 1024\text{px}$: Two-column split ($35\%$ command sidebar, $65\%$ map).
   - On $< 1024\text{px}$: Full-width map with collapsible slide-over command drawer and bottom candidate sheet.
2. **Screen 2 (Terrain Studio)**:
   - On $\ge 1280\text{px}$: True side-by-side synchronized viewports ($50/50$ split of the canvas area).
   - On $< 1280\text{px}$: Tabbed dual-view toggle (`[ Earth Analog ]` vs. `[ Lunar Reference ]`) with synchronized camera position preserved in state.
3. **Screen 3 (Reality Gap)**:
   - On $\ge 1280\text{px}$: $3 \times 2$ grid of diagnostic cards.
   - On $768\text{px}\text{--}1279\text{px}$: $2 \times 3$ grid.
   - On $< 768\text{px}$: Single-column vertical scroll.
4. **Screen 4 (Portfolio Optimizer)**:
   - On $\ge 1280\text{px}$: Two-column split ($40\%$ portfolio summary, $60\%$ RVM table).
   - On $< 1280\text{px}$: Stacked layout (portfolio summary on top, horizontally scrollable RVM table below).

