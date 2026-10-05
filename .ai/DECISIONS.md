# Decisions

Append-only. Never erase an entry; to change one, set its Status to `Superseded`,
and add a new entry that names it under **Supersedes**.

Entries DEC-20260817-* were promoted on 2026-10-01 from the legacy handoff and from
completed machine-local Cursor plans; their dates are approximate (when the decision
was in effect), and "Agent" records who promoted them.

---

## DEC-20260817-001 — Figma is the source of truth; frontend-only scope

Date: ~2026-08-12 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork) from legacy HANDOFF / Cursor rule
Status: Active

### Context
The Ynex template is being restyled to the Orville Figma while the backend is owned elsewhere.

### Decision
All UI work matches Figma frames pixel-for-pixel; only templates, styles, assets and presentation TS change.

### Reason
Avoid visual drift and protect API contracts.

### Consequences
No API/NgRx/environment/interceptor changes; ask for a node before building a screen.

### Related files
`.ai/RULES.md` §1–2, `.cursor/rules/figma-frontend-design.mdc`

### Supersedes
—

## DEC-20260817-002 — Figma colors are theme defaults; switcher stays

Date: ~2026-08-12 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
Ynex ships a runtime theme switcher with purple/dark defaults.

### Decision
Set Figma tokens (`--primary #26264F`, light header/sidebar, Hanken Grotesk) as defaults; keep the switcher fully working; gold `#BD9759` is never primary/secondary.

### Reason
User wants Figma look by default but theme customization preserved.

### Consequences
No hard-coded `!important` primary overrides; reset returns to Figma defaults.

### Related files
`src/assets/scss/_variables.scss`, `src/assets/scss/switcher/`, `src/app/shared/components/switcher/`

### Supersedes
—

## DEC-20260817-003 — Shared Orville DS in `orville-ds.scss`

Date: ~2026-08-13 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
`ng serve` does not run the Ynex Sass/PostCSS pipeline.

### Decision
Global Orville styles live in `src/assets/scss/orville-ds.scss`, imported from `src/styles.scss`, with `ov-*` class names.

### Reason
Guarantees the DS compiles in dev and gives one reusable vocabulary.

### Consequences
New shared styles go there; page-specific styles stay in component SCSS on theme tokens.

### Related files
`src/styles.scss`, `src/assets/scss/orville-ds.scss`

### Supersedes
—

## DEC-20260817-004 — Keep API data columns; restyle instead of removing

Date: ~2026-08-14 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
Contacts lists were thinned to match Figma; user had backend columns restored.

### Decision
Never drop columns the API returns to match a thinner Figma table.

### Reason
Data visibility matters more than an exact column count.

### Consequences
Restyle tables with Figma chrome while keeping data columns.

### Related files
`src/app/components/contacts/`, `src/app/shared/components/shared-table/`

### Supersedes
—

## DEC-20260817-005 — Reverted: global sticky detail-page layout

Date: ~2026-08-15 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
A global sticky-left-panel + sticky-tabs experiment on all detail pages was tried.

### Decision
Reverted at user request; do not re-apply unless asked.

### Reason
User rejected the behavior.

### Consequences
Detail pages keep the standard `ov-detail-layout` pattern.

### Related files
`src/app/components/portfolio/detail-page-layout/`

### Supersedes
—

## DEC-20260817-006 — Properties grid uses Load more; list keeps paginator

Date: ~2026-08-13 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
Paginator was removed from the grid, then Load more was requested.

### Decision
Grid view = Load more, no paginator; list view = paginator.

### Reason
User preference.

### Consequences
Apply the same pattern to other portfolio grids.

### Related files
`src/app/components/portfolio/properties/`

### Supersedes
—

## DEC-20260817-007 — Static/mock pages where no API exists

Date: ~2026-08-17 (promoted 2026-10-01)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
Reports, Document Center, Download Center have no backend endpoints yet.

### Decision
Build them with static arrays and client-only interactions (e.g. `localStorage` key `orville.reports.bookmarks`); no report generation/download API.

### Reason
Frontend-only scope.

### Consequences
Generate Report drawer and kebabs are visual only until an API exists.

### Related files
`src/app/components/reports/`, `document-center/`, `download-center/`

### Supersedes
—

## DEC-20260901-001 — Row action menus use fixed-position pattern

Date: ~2026-09-03 (promoted 2026-10-01 from a completed Cursor plan)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
In-cell absolute dropdowns were clipped on Events/Promotions/Rules-Guides lists.

### Decision
Use the tickets/visitors fixed-position action-menu pattern for list row menus.

### Reason
Avoids clipping/overlap inside scrollable tables.

### Consequences
New lists should copy that pattern.

### Related files
`src/app/components/facility/tickets/tickets-list/`, `src/app/components/community/*/`

### Supersedes
—

## DEC-20260909-001 — Property list Name column is plain text

Date: ~2026-09-09 (promoted 2026-10-01 from a completed Cursor plan)
Agent: promoted by Claude (Cowork)
Status: Active

### Context
Property name and ID both linked to detail.

### Decision
Name is plain text; navigation via ID link and Action → View.

### Reason
User request.

### Consequences
—

### Related files
`src/app/components/portfolio/properties/properties-list/properties-list.component.html`

### Supersedes
—

## DEC-20261001-001 — Git-tracked shared agent memory

Date: 2026-10-01
Agent: Claude (Cowork mode)
Status: Active

### Context
Project context was split across a stale Claude-only `HANDOFF.md`, a Cursor rule, and machine-local Cursor plans, Codex sessions and Claude memory that do not travel between OFFICE and HOME or between accounts. Codex had no project instructions at all.

### Decision
`AGENTS.md` + `.ai/` in the repo are the authoritative shared memory with this hierarchy: user instruction > AGENTS.md > RULES > DECISIONS > PROJECT > CURRENT_STATE > HANDOFF > tool-specific files > private agent memory. `CLAUDE.md` and the Cursor rule point to `AGENTS.md`. Legacy handoff archived in `.ai/archive/`.

### Reason
Continuity must survive changing agent, account, IDE or computer; Git is the only shared channel.

### Consequences
Every agent updates HANDOFF/TASKS/CHANGELOG (and CURRENT_STATE/DECISIONS when relevant) after meaningful work, then the user commits and pushes.

### Related files
`AGENTS.md`, `.ai/*`, `CLAUDE.md`, `HANDOFF.md`, `.cursor/rules/figma-frontend-design.mdc`

### Supersedes
The old `CLAUDE.md` priority order "user message > HANDOFF > Cursor rule".

## DEC-20261001-002 — Mobile Figma catalog lives in the repo (`.ai/reference/`)

Date: 2026-10-01
Agent: Cursor (office PC)
Status: Active

### Context
The node-level catalog of all mobile Figma work (page `6122:413`) existed only in a machine-local Cursor agent store, under an earlier user instruction to keep those rules out of project `.cursor/rules`.

### Decision
Move it to `.ai/reference/figma-mobile-catalog.md` (account email removed) and leave a pointer in the old store. Its mobile-only rules (exact content fidelity, page `6122:413` only, find frames by name, delivery format) stay inside the catalog — still not mirrored into `.cursor/rules`.

### Reason
User instruction (2026-10-01): the repository is the project brain; no Cursor-specific source of truth.

### Consequences
Every agent updates the catalog after mobile Figma work. `AGENTS.md` lists `.ai/reference/`.

### Related files
`.ai/reference/figma-mobile-catalog.md`, `AGENTS.md`, `.ai/PROJECT.md`

### Supersedes
The Sep 2026 "agent store only" storage location for mobile Figma notes (content kept).

## DEC-20261001-003 — Mobile detail-page Action menu pattern (Figma)

Date: 2026-09-30 → 2026-10-01
Agent: Cursor
Status: Active

### Context
The user asked for the desktop "Action ⌄" dropdown on mobile detail pages (Property, Unit, Room, Tenant, Landlord), from screenshots of the live app.

### Decision
Action button at the right of the back-crumb row (existing Edit/View Activity buttons kept); full-screen overlay with backdrop + `.ov-action-menu`-styled card; items/icons from the app's detail component; NAVIGATE to full-screen frames, SWAP to modal frames, BACK where no screen exists; widen the menu rather than wrap labels; always add a static preview frame.

### Reason
Matches the app (`.ov-action-menu` in `orville-ds.scss`) and keeps every label visible on 390px.

### Consequences
Future detail pages (vendors, support technicians, …) reuse this; details in the catalog's "Mobile Action-menu pattern" section.

### Related files
`.ai/reference/figma-mobile-catalog.md`, `src/assets/scss/orville-ds.scss` (`.ov-action-menu`), `src/assets/images/action-menu/`

### Supersedes
—
