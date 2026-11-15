# TERRALIGN — Authorization Record TERRALIGN-GOV-AUTH-003
## Cinematic Design Overhaul Authorization

**Authorization ID:** `TERRALIGN-GOV-AUTH-003`
**Authorizing Role:** Product Lead (Abhijeet Kumar)
**Authorization Date:** 14 November 2026
**Methodology:** GSD v1.6.0
**Governance:** Ponytail FULL Mode (REUSE → SIMPLIFY → IMPLEMENT)
**Source:** Explicit Product Lead prompt directive received in conversation `c4ac82fa-eb4e-4ebe-97ab-d87d5a97eb80`
**Supersedes:** Supplements `TERRALIGN-GOV-AUTH-002` (MVP scope)
**Status:** **ACTIVE**

---

## Formal Authorization Statement

> "Act as TERRALIGN's senior product design and engineering team: creative technology director, experience designer, Three.js/WebGL architect, interaction designer, accessibility lead, and implementation engineer.
>
> Redesign the existing TERRALIGN application into a premium, cinematic, spatial planetary mission interface."
>
> — Product Lead directive, 14 November 2026

---

## Authorized Scope

This authorization covers a **design overhaul of the existing product** — not a rebuild:

1. **Visual redesign** of all 4 screens (`/`, `/terrain`, `/reality-gap`, `/portfolio`)
2. **Planetary WebGL environment** — a dominant Earth globe on Mission Command
3. **Shared cinematic design language** across all routes
4. **Navigation and shell enhancements** consistent with cinematic direction
5. **Interaction design improvements** (transitions, hover states, telemetry)
6. **Responsive adaptations** at 1440×900, 1280×800, 390×844, 360px
7. **Accessibility** — reduced-motion fallback, WebGL failure fallback, WCAG 2.2 AA maintenance
8. **Before/after screenshot capture** at all required viewports

---

## Strict Prohibitions (Inherited and Extended)

- **DO NOT** rewrite, discard, or rebuild working behavior, scientific calculations, optimizer logic, API contracts, or data provenance
- **DO NOT** modify `src/lib/analogs.ts`, `src/lib/rvm.ts`, `src/lib/dossier.ts`, `src/store/useMissionStore.ts`, `src/app/api/`, or `data/` files
- **DO NOT** add `@react-three/fiber` (React 19 incompatibility confirmed)
- **DO NOT** add GSAP or drei without explicit justification
- **DO NOT** introduce paid APIs or paid runtime services
- **DO NOT** fabricate scientific data, coordinates, team members, or testimonials
- **DO NOT** violate the < 180 kB First Load JS budget (except `/terrain` target ~264 kB)
- **DO NOT** run the Final MVP Acceptance Audit (explicitly deferred)

---

## Governance Reference

| Record | Scope |
|--------|-------|
| `TERRALIGN-GOV-AUTH-001` | Initial Git baseline + Task 3.1.2 (superseded) |
| `TERRALIGN-GOV-AUTH-002` | All MVP Phase 3–4 development tasks (complete) |
| `TERRALIGN-GOV-AUTH-003` | Cinematic Design Overhaul (this record) |

