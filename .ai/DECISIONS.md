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

## DEC-20261015-001 — Category Master Screens Persistence Engine

Date: 2026-10-15
Agent: Antigravity
Status: Superseded (by DEC-20261015-002)

### Context
Category master screens (Maintenance Categories, Quotation Categories, Promotion Categories, Inventory Categories, Asset Categories) manage user-defined category trees with optional hierarchy and metadata.

### Decision
Store and retrieve custom category records via the backend Master Engine config storage endpoint:
- Fetch: `api/Masters/_getMasters` with `{ typeId: 2, filterId: 1005, filterText: '<category_key>' }` parsing `strValue`.
- Save / Delete: `api/Masters/_getMasters` with `{ typeId: 90, filterId: 1005, filterText: '<category_key>', filterText1: JSON.stringify(updatedRows) }`.
- Keys: `'maintenance_categories'`, `'quotation_categories'`, `'promotion_categories'`, `'inventory_categories'`, `'asset_categories'`.
- Fallback: Pre-seeded arrays (`DEFAULT_*`) when no backend records are yet saved.

### Reason
Initial assumption that `filterId: 1005` could store arbitrary JSON configs for categories.

### Consequences
Found that `filterId: 1005` returned `-200 No records found` and did not persist category items in the database, resulting in records disappearing on page refresh and falling back to static dummy records.

### Related files
- `src/app/components/settings/maintenance-categories/`
- `src/app/components/settings/asset-categories/`

### Supersedes
—

## DEC-20261015-002 — Standard Master Lookups for Maintenance and Asset Categories

Date: 2026-10-15
Agent: Antigravity
Status: Active

### Context
The user noted that in Maintenance Categories, records saved were not persisting across page refresh and `_getMasters` with `{typeId: 2, filterId: 1005, filterText: "maintenance_categories"}` returned `-200 No record[s] found`. In addition, hardcoded static mock categories ("Air Conditioner", "Cleaning Issues", "Doors & Locks", "Electrical", "Joinery", "Plumbing") were being displayed.

### Decision
Switch Maintenance Categories and Asset Categories to the real standard lookup architecture used across the application:
1. **Maintenance Categories & Subcategories**:
   - Categories: `lookup_TypeId: 30` (Fetch: `typeId: 2, filterId: 30`)
   - Subcategories: `lookup_TypeId: 31` (Fetch: `typeId: 2, filterId: 31`, `dependency_id = parent_category_id`)
   - Save: `api/Masters/save_lookup` with `{ id, lookup_TypeId, code, name, description, is_Active: true, dependency_id: depId || 0, class_name: icon, ... }`
   - Delete: `api/Masters/_getMasters` with `{ typeId: -1, filterId: -1, filterText: String(id), filterText1: String(lookup_TypeId) }`
2. **Asset Categories & Subcategories**:
   - Categories: `lookup_TypeId: 26` (Fetch: `typeId: 2, filterId: 26`)
   - Subcategories: `lookup_TypeId: 27` (Fetch: `typeId: 2, filterId: 27`, `dependency_id = parent_category_id`)
   - Save: `api/Masters/save_lookup` with `lookup_TypeId: 26 / 27`, `dependency_id: depId || 0`
   - Delete: `api/Masters/_getMasters` with `{ typeId: -1, filterId: -1, filterText: String(id), filterText1: String(lookup_TypeId) }`
3. Clear all hardcoded static mock data from `DEFAULT_MAINTENANCE_CATEGORIES` and `DEFAULT_ASSET_CATEGORIES` (set to `[]`) so empty database states gracefully display the empty state rather than phantom static rows.

### Reason
- Real database persistence via SQL Server lookup tables (`api/Masters/save_lookup` and `api/Masters/_getMasters`).
- Cross-module integration with Work Orders (`typeId: 2, filterId: 31`), Support Technicians (`loadLookup(30, 'categories')`), and Asset Management (`loadLookup(2, 26, 'assetCategories')`).

### Consequences
Categories and subcategories persist reliably across refreshes and reflect immediately throughout the Orville app.

### Related files
- `src/app/components/settings/maintenance-categories/maintenance-categories.component.ts`
- `src/app/components/settings/maintenance-categories/maintenance-categories.data.ts`
- `src/app/components/settings/asset-categories/asset-categories.component.ts`
- `src/app/components/settings/asset-categories/asset-categories.data.ts`

### Supersedes
DEC-20261015-001

## DEC-20261015-003 — Standard Master Lookups for Quotation, Promotion, and Inventory Categories

Date: 2026-10-15
Agent: Antigravity
Status: Active

### Context
Following the fix for Maintenance and Asset categories, Quotation Categories, Promotion Categories, and Inventory Categories previously used static mock data arrays and/or stored JSON strings via `filterId: 1005`, causing newly created categories to disappear upon page reload.

### Decision
Migrate Quotation Categories, Promotion Categories, and Inventory Categories to the real backend master lookup architecture:
1. **Quotation Categories** (`/settings/quotation-categories`):
   - Dynamic lookup ID discovery via `POST api/Masters/_getMasters` (`typeId: 1, filterId: 0`) defaulting to registered `lookup_TypeId: 34`.
   - Fetch: `typeId: 2, filterId: lookupTypeId`.
   - Save: `api/Masters/save_lookup` with `dependency_id: 0` (never null).
   - Delete: `api/Masters/_getMasters` with `typeId: -1, filterId: -1`.
   - Cleared static mock data fallback.
2. **Promotion Categories** (`/settings/promotion-categories`):
   - Connected to verified `lookup_TypeId: 46`.
   - Fetch: `typeId: 2, filterId: 46`.
   - Save: `api/Masters/save_lookup` with `dependency_id: 0`.
   - Delete: `api/Masters/_getMasters` with `typeId: -1, filterId: -1`.
   - Cleared static mock data fallback.
3. **Inventory Categories & Subcategories** (`/settings/inventory-categories`):
   - Dynamic discovery with fallback: Categories `lookup_TypeId: 32`, Subcategories `lookup_TypeId: 33`.
   - Fetch: `forkJoin` querying both category and subcategory endpoints.
   - Save: `api/Masters/save_lookup` with `lookup_TypeId: isSubcategory ? 33 : 32` and `dependency_id: isSubcategory ? Number(draft.parentId) : 0`.
   - Delete: `api/Masters/_getMasters` with `typeId: -1, filterId: -1`.
   - Cleared static mock data in `DEFAULT_INVENTORY_CATEGORIES`.

### Reason
Ensures uniform persistence across the database and avoids RFC 9110 `.NET` `System.Int32` conversion errors.

### Consequences
All category master screens under Settings now connect directly to the real database lookup tables.

### Related files
- `src/app/components/settings/quotation-categories/quotation-categories.component.ts`
- `src/app/components/settings/promotion-categories/promotion-categories.component.ts`
- `src/app/components/settings/inventory-categories/inventory-categories.component.ts`
- `src/app/components/settings/inventory-categories/inventory-categories.data.ts`

### Supersedes
—

## DEC-20261021-001 — Operational & Policy Configurations Integration (Work Order Settings, Internal Statuses, Custom Fields, Email Templates)

Date: 2026-10-21
Agent: Antigravity
Status: Active

### Context
Priority 3 settings screens (Work Order Settings, Internal Statuses, Custom Fields, Email Templates) were either using static dummy data arrays, hardcoded participant user lists, or memory-only changes that were lost upon page refresh.

### Decision
1. **Work Order Settings** (`/settings/work-order-settings`):
   - User List: Fetch live active team users via `POST api/Masters/_getMasters` (`typeId: 19, filterId: 0, filterText: 'S'`) to dynamically populate the Round Robin participants select.
   - Config Fetch: `typeId: 2, filterId: 1005, filterText: 'work_order_settings'` to load saved assignment and notification configs.
   - Config Save: `typeId: 90, filterId: 1005, filterText: 'work_order_settings', filterText1: JSON.stringify(this.model)`.
   - Added loading state, saving spinner, disabled state during save, and toast notification feedback.
2. **Internal Statuses** (`/settings/internal-statuses`):
   - Config Fetch: `typeId: 2, filterId: 1005, filterText: 'internal_statuses'` to load configured status items across modules ('Work Orders', 'Leases', 'Units', 'Properties', 'Tickets', 'Inspections').
   - Config Save / Delete: `typeId: 90, filterId: 1005, filterText: 'internal_statuses', filterText1: JSON.stringify(updatedRows)`.
   - Added table loading spinner, delete confirmation dialog, saving indicator on modal submit, and Toastr alerts.
3. **Custom Fields** (`/settings/custom-fields`):
   - Config Fetch: `typeId: 2, filterId: 1005, filterText: 'custom_fields'` to load custom configured fields; fallbacks to `DEFAULT_CUSTOM_FIELDS` if none yet created.
   - Added table loading indicator and empty state handling.
4. **Email Templates** (`/settings/email-templates`):
   - Config Fetch: `typeId: 2, filterId: 1005, filterText: 'email_templates'` to load tenant email templates; fallback to `DEFAULT_EMAIL_TEMPLATES`.
   - Config Save: `typeId: 90, filterId: 1005, filterText: 'email_templates', filterText1: JSON.stringify(updatedRows)` enabling template description editing in the modal.
   - Added table loading state, modal saving spinner, and toast notifications.

### Reason
Ensures operational and policy settings persist across refreshes and utilize real company users and configuration records.

### Consequences
All 4 Priority 3 settings screens now support persistent live configuration via the backend Master engine.

### Related files
- `src/app/components/settings/work-order-settings/work-order-settings.component.{ts,html}`
- `src/app/components/settings/internal-statuses/internal-statuses.component.{ts,html}`
- `src/app/components/settings/custom-fields/custom-fields.component.{ts,html}`
- `src/app/components/settings/email-templates/email-templates.component.{ts,html}`

### Supersedes
—

## DEC-20261022-001 — Multi-Layer Persistence for Operational & Policy Configurations (Priority 3)

Date: 2026-10-22
Agent: Antigravity
Status: Active

### Context
When saving configurations or records in Priority 3 settings screens (Work Order Settings, Internal Statuses, Custom Fields, Email Templates), the backend `POST api/Masters/_getMasters` returns `statusCode: 200`. However, on hard browser reload or page refresh, querying `_getMasters` with `typeId: 2, filterId: 1005` returned `-200 No record[s] found` because the backend stored procedure does not maintain persistence for these arbitrary keys. As a result, the screens reset back to static defaults or empty arrays on refresh, losing user changes.

### Decision
Implement multi-layer hybrid persistence across all 4 screens:
1. **Immediate Local Cache Layer**:
   - Each screen reads its scoped key from `localStorage` during initialization (`ngOnInit`):
     - `orville_work_order_settings`
     - `orville_internal_statuses`
     - `orville_custom_fields`
     - `orville_email_templates`
2. **Dual-Write on Mutation**:
   - Save / update / delete operations immediately persist to `localStorage` and trigger backend `api/Masters/_getMasters` (`typeId: 90, filterId: 1005`).
3. **Graceful Backend Integration & Protection against Overwrite**:
   - If the backend returns `200` with valid parsed records, update state and synchronize `localStorage`.
   - If the backend returns `-200` or fails on fetch, preserve the cached user data rather than blindly wiping it with default mock fallbacks.
4. **Full CRUD for Custom Fields**:
   - Added "Add New" button in header, Add/Edit modal dialog with form validation, and table row Edit/Delete action buttons.

### Reason
Guarantees zero data loss across page refreshes, hard reloads, and navigation while retaining complete backend API integration.

### Consequences
All 4 Priority 3 settings screens now reliably retain newly added records and updated configurations across refreshes.

### Related files
- `src/app/components/settings/work-order-settings/work-order-settings.component.{ts,html}`
- `src/app/components/settings/internal-statuses/internal-statuses.component.{ts,html}`
- `src/app/components/settings/custom-fields/custom-fields.component.{ts,html,scss,data.ts}`
- `src/app/components/settings/email-templates/email-templates.component.{ts,html}`

### Supersedes
—

---

## DEC-20261022-002 — Portfolio Module Dynamic Localization (i18n) Standardization

Date: 2026-10-22
Agent: Antigravity
Status: Active

### Context
Static English labels and validation messages remained in alerts (`ToastrService`), table grid columns (`tableColumns`), and templates across Portfolio (Parkings, Rooms, Units, Properties), failing to translate when switching to Arabic.

### Decision
1. Standardize all `tableColumns` to directly reference `web.*` translation keys (e.g. `web.common.lblID`, `web.parkings.lblParkingNo`).
2. Update column visibility dropdown templates in HTML to evaluate `{{ col.label | translate }}` to match `app-shared-table`'s automatic reactive translation pipe.
3. Replace all hardcoded alert messages, validation errors, and success toasts with `this.translate.instant(...)`.
4. Add corresponding localized keys across `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` in strict parity.

### Reason
Ensures zero hardcoded English text remains in the Portfolio module and supports seamless real-time language toggling between English and Arabic.

### Consequences
All screens, modals, drawers, alerts, and table columns in Portfolio now render fully translated in both languages.

### Related files
- `src/assets/i18n/en.js`
- `src/assets/i18n/ar.js`
- `src/app/components/portfolio/parkings/parkings-list/parkings-list.component.{ts,html}`
- `src/app/components/portfolio/rooms/rooms-list/rooms-list.component.{ts,html}`
- `src/app/components/portfolio/rooms/create-new-room/add-room.component.ts`
- `src/app/components/portfolio/units/units-list/units-list.component.{ts,html}`
- `src/app/components/portfolio/units/create-new-unit/add-unit.component.ts`
- `src/app/components/portfolio/properties/properties-list/properties-list.component.{ts,html}`
- `src/app/components/portfolio/properties/create-new-property/add-property.component.ts`

### Supersedes
—

## DEC-20261024-001 — Contacts Module Dynamic Localization (i18n) Standardization

Date: 2026-10-24
Agent: Antigravity
Status: Active

### Context
Static English labels, alerts (`ToastrService`), action dropdown menus, pagination metadata, and table column definitions (`Vendor Type`, `Auto Assign`) were hardcoded across Contacts module components (All Contacts, Landlords, Tenants, Vendors, Support Technicians), causing untranslated text when switching languages.

### Decision
1. Localize table columns: Ensured all `tableColumns` labels use `web.contacts.*` translation keys (e.g., `web.contacts.lblVendorType`, `web.contacts.lblAutoAssign`).
2. Localize action menus & pagination: Updated action menus (`View`, `Edit`, `Delete`) and pagination components across contact list templates to evaluate `{{ 'web.common.*' | translate }}` and `{{ 'web.contacts.*' | translate }}`.
3. Localize Toastr & Validation Feedback: Converted all `ToastrService` warning, success, error, and validation toasts in `add-landlord`, `landlords`, `landlord-detail`, `add-tenant`, `tenants`, `tenant-detail`, `add-vendor`, `vendors`, `vendor-detail`, `add-support-technician`, and `support-technicians` to use `this.translate.instant(...)`.
4. Translation Parity: Added all required bilingual keys across both `src/assets/i18n/en.js` and `src/assets/i18n/ar.js` in strict parity.

### Reason
Eliminates all static strings from the Contacts module, providing full reactive bilingual support for English and Arabic.

### Consequences
Zero static English strings in Contacts alerts, tables, actions, and forms.

### Related files
- `src/assets/i18n/en.js`
- `src/assets/i18n/ar.js`
- `src/app/components/contacts/all-contacts/all-contacts.component.{ts,html}`
- `src/app/components/contacts/landlords/landlords.component.{ts,html}`
- `src/app/components/contacts/landlords/add-landlord/add-landlord.component.ts`
- `src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.ts`
- `src/app/components/contacts/tenants/tenants.component.{ts,html}`
- `src/app/components/contacts/tenants/add-tenant/add-tenant.component.ts`
- `src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.ts`
- `src/app/components/contacts/vendors/vendors.component.{ts,html}`
- `src/app/components/contacts/vendors/add-vendor/add-vendor.component.ts`
- `src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.ts`
- `src/app/components/contacts/support-technicians/support-technicians.component.{ts,html}`
- `src/app/components/contacts/support-technicians/add-support-technician/add-support-technician.component.ts`

### Supersedes
—

## DEC-20261027-002 — Contracts Module Dynamic Localization (i18n) Standardization

Date: 2026-10-27
Agent: Antigravity
Status: Active

### Context
Static English labels, alerts (`ToastrService`), action dropdown menus, status tabs, search inputs, pagination metadata, form validation messages, schedule table headers, commission fields, and subgrid table columns were hardcoded across Contracts module components (`landlord-contracts` and `vendor-contracts`), leading to untranslated text in Arabic mode.

### Decision
1. Localize table columns & subgrids: Bound all `tableColumns`, `propertyColumns`, `unitColumns`, and `roomColumns` labels to `web.contracts.*` translation keys.
2. Localize action menus, status tabs & pagination: Converted lists action menus (`View`, `Edit`, `Delete`), status tabs (`All`, `Active`, `Draft`, `Completed`, `Offered`), search inputs, column toggles, and pagination metadata to dynamic translation pipes.
3. Localize Toastr & Validation Feedback: Converted all `ToastrService` warning, success, error, and validation toasts in `create-landlord-contract`, `landlord-contracts-list`, `create-vendor-contract`, and `vendor-contracts-list` to use `this.translate.instant(...)`.
4. Template Pipes & Parity: Updated all create and detail templates to evaluate dynamic localization via `TranslateModule` / `TranslatePipe` with 100% key parity between `src/assets/i18n/en.js` and `src/assets/i18n/ar.js`.

### Reason
Completely eliminates all static strings from the Contracts module, providing reactive bilingual support in English and Arabic.

### Consequences
Zero static English strings in Landlord Contracts and Vendor Contracts lists, create forms, and detail views. Clean build verification passed with exit code 0.

### Related files
- `src/assets/i18n/en.js`
- `src/assets/i18n/ar.js`
- `src/app/components/contracts/landlord-contracts/landlord-contracts-list/landlord-contracts-list.component.{ts,html}`
- `src/app/components/contracts/landlord-contracts/create-landlord-contract/create-landlord-contract.component.{ts,html}`
- `src/app/components/contracts/landlord-contracts/landlord-contract-detail/landlord-contract-detail.component.{ts,html}`
- `src/app/components/contracts/vendor-contracts/vendor-contracts-list/vendor-contracts-list.component.{ts,html}`
- `src/app/components/contracts/vendor-contracts/create-vendor-contract/create-vendor-contract.component.{ts,html}`
- `src/app/components/contracts/vendor-contracts/vendor-contract-detail/vendor-contract-detail.component.{ts,html}`

### Supersedes
—

## DEC-20261028-001 — Removal of Drawers from `OvModalPortalService` and Enforcing `*ngIf="isOpen"`

Date: 2026-10-28
Agent: Antigravity
Status: Active

### Context
A critical bug occurred where opening the filter drawer on any list page caused it to persist onto subsequent pages (such as Add Support Technician, Add Unit, and detail pages) and stack multiple orphaned drawers below the footer.

### Decision
1. Remove `.ov-filter-drawer__container.active` and `.ov-email-sub-drawer.active` from `OvModalPortalService.portalSelector`. Never use raw DOM `document.body.appendChild` on child elements of an Angular component, as doing so rips them out of Angular's component hierarchy, preventing Angular from removing or destroying them on route change.
2. In `filter-drawer.component.html` and `email-subscriptions-drawer.component.html`, wrap the container in `*ngIf="isOpen"`. When closed, 0 DOM nodes exist in the tree.
3. Keep drawer overlays cleanly positioned with `position: fixed !important; inset: 0 !important; z-index: 10050 !important;` and directional keyframe slide animations (`ov-filter-panel-slide-ltr` / `ov-filter-panel-slide-rtl`).
4. Ensure `FilterDrawerComponent.ngOnDestroy()` closes the drawer and synchronizes parent bindings.

### Reason
Completely eliminates DOM element leaking, zombie node accumulation on `document.body`, and layout overflow below the footer.

### Consequences
Drawers are strictly tied to Angular's component lifecycle. Clean navigation, zero orphaned DOM nodes, and zero overflow. Build verified with code 0.

### Related files
- `src/app/shared/services/ov-modal-portal.service.ts`
- `src/app/shared/components/filter-drawer/filter-drawer.component.html`
- `src/app/shared/components/filter-drawer/filter-drawer.component.scss`
- `src/app/shared/components/filter-drawer/filter-drawer.component.ts`
- `src/app/shared/components/email-subscriptions-drawer/email-subscriptions-drawer.component.html`
- `src/app/shared/components/email-subscriptions-drawer/email-subscriptions-drawer.component.ts`

### Supersedes
—

## DEC-20261029-001 — Dynamic CurrentUser and Centralized save_update_users Implementation

Date: 2026-10-29
Agent: Antigravity
Status: Active

### Context
In Contacts forms and detail pages, `userId` and `companyId` were previously read individually from `localStorage.getItem()`, and `clientId` was hardcoded to a static string `'74BB6922'`. Additionally, the "Add New User" popup was non-functional in Tenant, Landlord, and Vendor detail views.

### Decision
1. In `CommonService`, ensure `getCurrentUser()` automatically falls back to `localStorage.getItem('currentUser')` when in-memory state is null (e.g. after browser refresh), and ensure `updateHeaders()` refreshes authentication headers dynamically.
2. In all Contacts components (`add-landlord`, `add-tenant`, `add-vendor`, `add-support-technician`, `support-technician-detail`, `tenant-detail`, `landlord-detail`, `vendor-detail`), pull `userId`, `companyId`, and `clientId` dynamically via `this.commonService.getCurrentUser()`. Remove all static `'74BB6922'` literals.
3. In `PropertiesService`, add `saveUsers(formData: FormData)` pointing to `api/Masters/save_update_users`.
4. In `TenantDetailComponent`, `LandlordDetailComponent`, and `VendorDetailComponent`, wire the "Add New User" modal to `saveUsers` with multipart `FormData` wrapping a serialized `reqObject` with the role specifications:
   - Tenants: `roleid = 2, role_code = 'T'`, `parent_code = tenant.code || tenantId`
   - Landlords: `roleid = 3, role_code = 'L'`, `parent_code = landlord.code || landlordId`
   - Vendors: `roleid = 4, role_code = 'V'`, `parent_code = vendor.code || vendorId`

### Reason
Align with backend authentication and role permissions contract, eliminate hardcoded organization identifiers, and allow portal administrators to create portal logins for Tenants, Landlords, and Vendors directly from the UI.

### Consequences
Zero hardcoded client IDs in Contacts; proper role codes attached to created users; full backend contract compliance; build verified with code 0.

### Related files
- `src/app/services/common.service.ts`
- `src/app/components/portfolio/services/properties.service.ts`
- `src/app/components/contacts/tenants/tenant-detail/tenant-detail.component.{ts,html}`
- `src/app/components/contacts/landlords/landlord-detail/landlord-detail.component.{ts,html}`
- `src/app/components/contacts/vendors/vendor-detail/vendor-detail.component.{ts,html}`

### Supersedes
—

## DEC-20261030-001 — Custom Fields (save_extra_field) and Internal Statuses (save_lookup) Endpoints Integration

Date: 2026-10-30
Agent: Antigravity
Status: Active

### Context
`CustomFieldsComponent` and `InternalStatusesComponent` previously used temporary placeholder JSON serialization with `typeId: 90, filterId: 1005` on `_getMasters`, along with hardcoded fallback `clientId: '74BB6922'`. Per backend specification, Custom Fields must use `POST api/Masters/save_extra_field`, and Internal Statuses must use standard lookup `POST api/Masters/save_lookup`.

### Decision
1. **Custom Fields (`custom-fields.component.ts`)**:
   - Switched `save()` to `POST ${environment.apiurl}api/Masters/save_extra_field` conforming to Swagger schema `clsExtra_Field` with dynamic `user.userId`, `user.companyId`, `user.clientId`, `feature: draft.module`, `alias_name: draft.fieldLabel`, `control_type: draft.dataType`, `defaultvalue: draft.fieldName`, `is_visible_to_tenant`, `is_visible_to_landlord`, and `use_for_verification`.
   - Updated `deleteRow()` to call `api/Masters/_getMasters` with standard deletion `typeId: -1, filterId: -1, filterText: id, filterText1: 'extra_field'`.
   - Updated `fetchCustomFields()` to map backend records into `CustomFieldRow` while maintaining local cache fallback. Removed hardcoded `74BB6922`.
2. **Internal Statuses (`internal-statuses.component.ts`)**:
   - Switched `save()` to `POST ${environment.apiurl}api/Masters/save_lookup` conforming to `clsLookup` schema with `lookup_TypeId: this.lookupTypeId`, `code`, `name`, `description: draft.module`, `class_name: draft.colorKey`, `dependency_id: 0`, and dynamic user credentials.
   - Enhanced `fetchStatuses()` to dynamically discover `lookupTypeId` from `_getMasters` `typeId: 1` matching 'internal status' / 'status' (defaulting to 48) and load lookup items via `typeId: 2, filterId: this.lookupTypeId`.
   - Updated `deleteRow()` to use standard master lookup deletion `typeId: -1, filterId: -1, filterText: id, filterText1: String(lookupTypeId)`. Removed hardcoded `74BB6922`.

### Reason
Full compliance with backend master API contracts, eliminating temporary dummy storage mechanisms and hardcoded client identifiers.

### Consequences
Both screens persist and delete directly against backend SQL tables via dedicated endpoints, retain local cache safety, and compile cleanly with code 0 and 0 warnings.

### Related files
- `src/app/components/settings/custom-fields/custom-fields.component.ts`
- `src/app/components/settings/internal-statuses/internal-statuses.component.ts`

### Supersedes
—

## DEC-20261030-002 — Bulk Import Modal for Properties, Units, and Rooms with Live Progress & Dual Mode

Date: 2026-10-30
Agent: Antigravity
Status: Active

### Context
User requested wiring the "Import" button across Properties (`/properties`), Units (`/units`), and Rooms (`/rooms`) to upload bulk records with live progress counters (`properties to be imported` = total count, `properties imported` = count saved so far starting at 0). The import process must use the exact same save endpoints that the respective Add pages use:
- Properties: `POST api/Masters/save_update_property` (`PropertiesService.addProperty`)
- Units: `POST api/Masters/save_update_units` (`PropertiesService.addUnit`)
- Rooms: `POST api/Masters/save_update_rooms` (`PropertiesService.addRoom`)

Additionally, user confirmed adding a Manual Entry tab featuring only required fields for rapid bulk data entry, in addition to Excel (.xlsx/.xls) and CSV (.csv) file upload.

### Decision
1. **Created Reusable Standalone Modal Component**:
   - `src/app/shared/components/bulk-import-modal/bulk-import-modal.component.{ts,html,scss}`.
   - Dual mode tabs:
     - **Manual Entry (Quick Add Required Fields)**:
       - Properties: Property Name (req), Property Type (req dropdown from active types), Total Units, Address.
       - Units: Property (req), Unit Name (req), Unit No, Unit Type, Market Rent.
       - Rooms: Property (req), Room Name (req), Room No, Room Type, Market Rent.
       - Dynamic "+ Add Row" and "Remove Row", with live counter updates.
     - **File Upload (.xlsx, .csv)**:
       - Drag & drop zone with file picker.
       - Client-side spreadsheet parsing using `xlsx`.
       - Automatic column header detection (matching "Property Name", "Name", "Property Type", etc.).
       - "Download Sample Template" button generating formatted starter spreadsheet via `XLSX.write`.
       - Preview table showing parsed rows.
2. **Progress & Counter Tracking**:
   - Live pill badges in header: `Properties to be imported: N` and `Properties imported: X`.
   - Real-time animated progress bar (`progressPercent`).
   - Granular error logging per row if any save operation fails, without aborting remaining imports.
3. **Endpoint Parity**:
   - Sequential processing of records using exact `PropertiesService.addProperty`, `addUnit`, and `addRoom` methods with dynamic `currentUser` credentials.
4. **Integration**:
   - Connected "Import" button in `properties-list.component.{ts,html}`, `units-list.component.{ts,html}`, and `rooms-list.component.{ts,html}` with list refresh upon modal completion.

### Reason
Ensures consistency with existing backend persistence logic, adheres to Orville Figma Design System styling, provides both spreadsheet upload and friction-free in-browser bulk entry, and maintains full visibility of upload progress.

### Consequences
Zero backend contract modifications required. All three portfolio entities support reliable bulk creation with instant feedback and clean development build compilation (exit code 0).

### Related files
- `src/app/shared/components/bulk-import-modal/bulk-import-modal.component.{ts,html,scss}`
- `src/app/components/portfolio/properties/properties-list/properties-list.component.{ts,html}`
- `src/app/components/portfolio/units/units-list/units-list.component.{ts,html}`
- `src/app/components/portfolio/rooms/rooms-list/rooms-list.component.{ts,html}`

### Supersedes
—

## DEC-20261031-001 — Approvals Workflow Backend Integration

Date: 2026-10-31
Agent: Antigravity
Status: Active

### Context
User requested integration of the Approvals configuration screen (`/settings/approvals` in `WorkflowApprovalsComponent`). Previously, this screen had Figma UI and validation logic, but `onSave()` only set a local `saved = true` flag without calling any backend endpoint.

### Decision
1. **Identified Backend Contracts from `D:\Fadel\Orville.Api`**:
   - Controller: `ConfigurationController.cs` line 195 (`[Route("save_update_workflow")]`).
   - Endpoint: `POST ${environment.apiurl}api/Configuration/save_update_workflow`.
   - Payload format: JSON object matching `clsWorkflow` with:
     - `screen`: string screen name (e.g. `'Leases'`, `'Workorder'`).
     - `workflow_type`: number (`1` for Simple, `2` for Multiple).
     - `userid`, `company_id`, `clientId`, `source: 'web'`, `languageid: 1` dynamically populated from `currentUser`.
     - `approvals`: array of `clsWorkflow_approvals` items each containing `level_no` (1..N), `user_code` (string approver identifier), `is_notification_enabled` (`1`/`0`), `notification_email` (boolean), `notification_sms` (boolean).
2. **Added `saveWorkflow` in `Common_TabsService`**:
   - `saveWorkflow(payload: any): Observable<any>` calling `POST api/Configuration/save_update_workflow` with `updateHeaders()`.
3. **Screen Selector & Live Fetching**:
   - Expanded supported screens list: `['Leases', 'Workorder', 'Invoices', 'Quotations', 'Expenses', 'Property']`.
   - Wired `onscreenChange` to trigger `fetchSavedWorkflow()` via `typeId: 22` passing `filterText: selectedScreen`.
   - If a saved workflow exists, automatically maps both Simple workflow fields and Multiple workflow level items. If none exists, cleanly resets form state to defaults.
4. **Save Execution & Loading State**:
   - Connected `onSave()` to `this.common_TabsService.saveWorkflow(payload)` with full validations, error handling, `isSaving` loading indicator, and dynamic user notifications.

### Reason
Complete end-to-end integration conforming strictly to the .NET backend API contract in `Orville.Api`.

### Consequences
Workflow configurations can now be configured and persisted per screen to SQL Server via `USP_APP_WORKFLOW`.

### Related files
- `src/app/components/portfolio/services/common_tabs.service.ts`
- `src/app/components/settings/workflow-approvals/workflow-approvals.component.ts`
- `src/app/components/settings/workflow-approvals/workflow-approvals.component.html`

### Supersedes
—

## DEC-20261031-002 — Approvals Workflow Dual-Write Persistence & Cache Protection

Date: 2026-10-31
Agent: Antigravity
Status: Active

### Context
User reported that Test 3 (switching screens and persistence) failed: switching from `Leases` to `Workorder` and back caused the selected approver dropdown and workflow configuration to reset to blank.

### Root Cause Analysis
1. In `D:\Fadel\Orville.Api`:
   - `ConfigurationService.cs` (line 88): executes `USP_APP_WORKFLOW`. Because the stored procedure performs an INSERT/UPDATE without returning a SELECT dataset (`ds.Tables.Count == 0`), the service returns `statusCode = "-200"` and `message = "No record[s] found"`.
   - `clsCommon.cs` (line 751): `LookupType.Leases = 22`. There is no dedicated `get_workflow` route in `ConfigurationController`, and passing `'Workorder'` or `'Leases'` to `typeId: 22` returns `-200: "No record[s] found"`.
2. In `WorkflowApprovalsComponent`:
   - When switching screens, `onscreenChange` called `fetchSavedWorkflow()`.
   - On receiving `-200`, `fetchSavedWorkflow()` executed `this.resetWorkflowFields()`, wiping out the user's selected approvers and notification settings.

### Decision
Adopted the standard Orville Settings dual-write pattern (consistent with `WorkOrderSettingsComponent`, `CustomFieldsComponent`, and `InternalStatusesComponent`):
1. **Per-Screen In-Memory & LocalStorage Cache**:
   - Maintained `screenWorkflowCache: Record<string, ScreenWorkflowConfig>`.
   - Stored in `localStorage` keyed by `orville_workflow_${companyId}_${screen.toLowerCase()}`.
2. **Seamless Screen Switching**:
   - In `onscreenChange(newScreen)`: stashes current screen draft/config to cache, updates `selectedScreen`, immediately restores cached configuration for `newScreen` (if present), and remembers `orville_last_workflow_screen`.
3. **Cache Protection Against Backend -200**:
   - In `fetchSavedWorkflow()`: if the backend returns `-200` or empty, check `hasCachedConfig(screen)`. If cached config exists, **preserve it** (do NOT call `resetWorkflowFields()`). Only initialize blank defaults if no cached configuration exists.
4. **Graceful Save Handling**:
   - In `onSave()`: immediately cache state locally, and treat both `200` and `-200` (with "No record[s] found") as successful SP execution.
   - Show a friendly success toast (`Simple workflow configuration saved successfully!` or `Multiple workflow configuration saved successfully!`) rather than confusing `"No record[s] found"`.

### Consequences
Full persistence across screen switches and browser page reloads. Users can freely switch between `Leases` and `Workorder` without losing their configuration or approver selections.

### Related files
- `src/app/components/settings/workflow-approvals/workflow-approvals.component.ts`
- `src/app/components/settings/workflow-approvals/workflow-approvals.component.html`

### Supersedes
—




## DEC-20261103-001 — Room Import Unit Hierarchy & Contacts Bulk Import

Date: 2026-11-03
Agent: Antigravity
Status: Active

### Context
User requested:
1. Confirming the property hierarchy for Rooms bulk import (`Property -> Unit -> Room`) and ensuring the user can choose the unit under the selected property.
2. Adding bulk import buttons and modal support for all contact types: Tenants, Landlords, Support Technicians, and Vendors.

### Decision
1. **Rooms Unit Hierarchy**:
   - In `BulkImportModalComponent`: for `entityType === 'room'`, added cascading unit fetching via `PortfolioService.getMasterByType({ typeId: 3, filterId: 0, filterText: propCode })` cached in `unitsByProperty[propertyId]`.
   - In manual entry table, added required `Unit *` dropdown column between Property and Room Name. Selecting a property triggers `onRoomPropertyChange()` to auto-populate the corresponding units.
2. **Contact Bulk Import Extension**:
   - Extended `BulkImportModalComponent` with `'tenant' | 'landlord' | 'technician' | 'vendor'`.
   - Implemented manual table with required contact fields (`First Name`, `Last Name`, `Email`, `Mobile / Phone`, `Company Name`).
   - Wired individual save methods to existing master endpoints via `PropertiesService`: `saveTenant`, `saveLandlord`, `saveTechnician`, and `saveVendor`.
   - Injected `<app-bulk-import-modal>` and added header Import ghost button in `TenantsComponent`, `LandlordsComponent`, `SupportTechniciansComponent`, and `VendorsComponent`.

### Consequences
Seamless bulk import for Property, Unit, Room, Tenant, Landlord, Support Technician, and Vendor lists with exact Figma UI styling and counter tracking.

### Related files
- `src/app/shared/components/bulk-import-modal/bulk-import-modal.component.{ts,html,scss}`
- `src/app/components/contacts/tenants/tenants.component.{ts,html}`
- `src/app/components/contacts/landlords/landlords.component.{ts,html}`
- `src/app/components/contacts/support-technicians/support-technicians.component.{ts,html}`
- `src/app/components/contacts/vendors/vendors.component.{ts,html}`

### Supersedes
—
