# Shared Tasks

Only tasks that could be confirmed as still relevant on 2026-10-01 are listed.
Old Cursor plans were all marked completed and were not imported as active tasks.

## IN PROGRESS

### TASK-20261024-01 — Static Messages & Table Columns Localization to i18n
Owner/last agent: Antigravity
Started: 2026-10-24
Status: Portfolio, Contacts, Leases, Facility (Work Orders, Tickets, Requests, Quotations, Preventive Maintenance), Accounting, Contracts, Bookings, Collection Requests, Community, Broadcasts, Visitors, Reminders, Commissions, Legal, Inspections, and Property Listings modules 100% completed & verified. Proceeding with remaining Facility submodules (Inventory, Purchase Orders, Asset Management).
Files: `src/assets/i18n/en.js`, `src/assets/i18n/ar.js`, `src/app/components/facility/preventive-maintenance/`, `src/app/components/facility/quotations/`
Next step: Audit and convert all static labels, alerts, validation toasts, and table columns in Facility Inventory submodule.

### TASK-20261005-02 — Work Order Detail "Inventory Request" tab
Owner/last agent: Cursor (office PC)
Started: 2026-10-05
Status: Implemented and browser-verified with injected sample data, because the browser session was not logged in. **Uncommitted.**
Files: `src/app/components/facility/work-orders/work-order-detail/work-order-detail.component.{ts,html,scss}`
Next step: user review, then commit. Wire Submit to a backend endpoint when one exists. Confirm the field names for site (`property_name`/`property`/`building_name`) and stock (`qty`/`quantity`/`stock_qty`/`available_qty`).

### TASK-20261001-01 — Commit shared-memory setup
Owner/last agent: Claude (Cowork) → Cursor (adoption verified 2026-10-01)
Started: 2026-10-01
Status: Files written; Cursor rule verified; mobile catalog added under `.ai/reference/`; awaiting user review, `git add`, commit, push
Files: `AGENTS.md`, `.ai/`, `CLAUDE.md`, `HANDOFF.md`, `.cursor/rules/figma-frontend-design.mdc`, `.gitignore`
Next step: user runs the commands in `.ai/HANDOFF.md`

### TASK-20261001-04 — Review uncommitted mobile chrome app changes (30 Sep)
Owner/last agent: Cursor (found 2026-10-01)
Started: 2026-09-30 (earlier Cursor session)
Status: Uncommitted; intent not documented
Files: header, sidebar, content-layout, `mobile-bottom-nav/`, `header-scope.service.ts`, `orville-ds.scss`, `crm.component.scss`, `src/assets/images/mobile-chrome/`
Next step: `git diff`, verify at 390px + desktop with `ng serve`, commit separately (or discard on user instruction)

### TASK-20260925-01 — Mobile Figma design (page `6122:413`)
Owner/last agent: Cursor
Started: 2026-09-25
Status: Ongoing, screen by screen on user request; latest = detail-page Action menus (Property, Unit, Room, Tenant, Landlord done)
Files: Figma only; catalog `.ai/reference/figma-mobile-catalog.md`
Next step: next screenshot/node from the user. Optional: Action button on other Tenant/Landlord tab frames; ask whether `Unit Overview / Mobile` `6275:2556` should show its hidden unit content again

### TASK-20260930-01 — Mobile login redesign (Figma `7341:17681`)
Owner/last agent: Cursor (office PC)
Started: 2026-09-30
Status: Implemented per Cursor plan; SCSS change appears **uncommitted**
Files: `src/app/authentication/login/login.component.scss`
Next step: check `git diff` on that file, verify at 390/360/430px + 820/1280px, then commit

## TODO

### TASK-20261001-02 — Sync local main with origin
Status: `origin/main` (`9253a9b`, 2 commits: settings pages + i18n) is ahead of local `main` (`05fd9b8`); no overlap with local uncommitted files (checked 2026-10-01 by Cursor)
Next step: `git pull` and update `CURRENT_STATE.md` with what came in

### TASK-20261001-03 — Promote Codex 30 Sep work if relevant
Status: Codex threads "Connect Figma property design" and "Create 2FA flowchart" (office PC) — outcome unknown
Next step: on the office PC, review those Codex threads; record any durable decision/state in `.ai/`

### Backlog (carried from legacy handoff; still open as far as the repo shows)
- Wire `src/app/components/services/services.routes.ts` (SDN / Process / SDN Bills / Quicktrans) — only if the user asks
- Parking-detail landlord popover (deferred)
- Document/Download Center filter drawer shows property filters (needs real filter fields)
- Reports Generate: no HTML/PDF/XLS/CSV output (needs API — out of frontend scope)
- i18n keys for new raw-English labels (don't block on it unless asked)
- Next Figma screens as the user provides node-ids

## BLOCKED

- Reports generation / downloads — needs backend API (out of scope for this repo's UI work)

## COMPLETED

- **TASK-20261031-01 — Settings: Approvals Workflow Backend Integration**: Discovered backend route `save_update_workflow` in `ConfigurationController.cs` (`POST api/Configuration/save_update_workflow`) conforming to `clsWorkflow` / `clsWorkflow_approvals` JSON schema. Added `saveWorkflow` in `Common_TabsService`. In `WorkflowApprovalsComponent`, updated screen choices (`Leases`, `Workorder`, `Invoices`, `Quotations`, `Expenses`, `Property`), wired `onscreenChange` to fetch saved workflows via `typeId: 22, filterText: selectedScreen`, bound data to Simple Workflow (single approver) and Multiple Workflow (drag & drop reorderable levels), and implemented `onSave` with dynamic `currentUser` credentials, validations, and loading state. Verified clean compilation via `npx ng build --configuration=development` with exit code 0. (Antigravity, 2026-10-31)
- **TASK-20261030-02 — Portfolio: Bulk Import Modal for Properties, Units, and Rooms**: Built standalone reusable `BulkImportModalComponent` supporting dual-mode import: Manual Entry (Quick Add) with required fields, dynamic rows, and counter tracking, plus File Upload (.xlsx, .csv) with client-side spreadsheet parsing and downloadable sample template. Implemented real-time upload progress tracking: `properties to be imported` (total items being uploaded) and `properties imported` (starting at 0, incrementing sequentially as records are saved). Reused the exact save endpoints used by Add pages (`addProperty`, `addUnit`, `addRoom` in `PropertiesService`). Connected Import buttons across `PropertiesListComponent`, `UnitsListComponent`, and `RoomsListComponent` with automatic list refresh. Verified clean compilation via `npx ng build --configuration=development` with exit code 0. (Antigravity, 2026-10-30)
- **TASK-20261030-01 — Settings: Custom Fields (save_extra_field) & Internal Statuses (save_lookup) Endpoints Integration**: Replaced placeholder JSON storage mechanisms in `CustomFieldsComponent` and `InternalStatusesComponent`. Connected Custom Fields to dedicated backend endpoint `POST api/Masters/save_extra_field` using the full `clsExtra_Field` schema with dynamic user/client credentials. Connected Internal Statuses to standard master lookup `POST api/Masters/save_lookup` (`clsLookup` schema with `dependency_id: 0`, description, and class_name) with dynamic `lookupTypeId` discovery from `_getMasters` `typeId: 1`. Updated both components' delete handlers to standard `_getMasters` deletion. Verified clean compilation with `npx ng build --configuration=development` with exit code 0. (Antigravity, 2026-10-30)
- **TASK-20261026-02 — Accounting Module Static Messages & Table Columns Localization to i18n**: Completed comprehensive dynamic localization across all Accounting submodule components (`invoices`, `expenses`, `cheques`, `credit-notes`, `chart-of-accounts`, `reports`). Converted static grid column labels, action dropdown items, pagination metadata, filter drawers, status tabs, KPI summaries, dropzone and validation error alerts, and all Toastr alerts across list, create, and detail views to dynamic `this.translate.instant(...)` and `| translate` bindings. Maintained exact 1:1 key parity between `src/assets/i18n/en.js` and `src/assets/i18n/ar.js`. Verified clean compilation via `npx ng build --configuration=development` with exit code 0. (Antigravity, 2026-10-27)
- **TASK-20261026-01 — Facility Module Static Messages & Table Columns Localization to i18n**: Completed comprehensive dynamic localization across all Facility submodule components (`work-orders`, `tickets`, `requests`). Converted static grid column labels, action dropdown items, pagination metadata, filter drawers, status tabs, dropzone file upload validation messages, KPI subtitles/badges, and all Toastr alerts across list, create, and detail views to dynamic `this.translate.instant(...)` and `| translate` bindings. Maintained key-for-key parity across `src/assets/i18n/en.js` and `src/assets/i18n/ar.js`. Verified clean compilation via `npx ng build --configuration=development` with code 0. (Antigravity, 2026-10-26)
- **TASK-20261022-03 — Contacts Module Static Messages & Table Columns Localization to i18n**: Completed comprehensive dynamic localization across all Contacts submodule components (`all-contacts`, `landlords`, `tenants`, `vendors`, `support-technicians`). Converted static grid column labels (`Vendor Type`, `Auto Assign`), action dropdown links (`View`, `Edit`), pagination metadata, filter/column toolbar buttons, form validation error alerts, duplicate warnings, file attachment alerts, and detail view emergency contact toasts to dynamic `this.translate.instant(...)` and `| translate` bindings. Ensured exact key-for-key parity across `src/assets/i18n/en.js` and `src/assets/i18n/ar.js`. Verified clean compilation via `npx ng build --configuration=development` with code 0. (Antigravity, 2026-10-24)
- **TASK-20261021-01 — Settings: Priority 3 Operational & Policy Configurations (Work Order Settings, Internal Statuses, Custom Fields, Email Templates)**: Connected live CRUD and hybrid persistence via `api/Masters/_getMasters` (`typeId: 2, filterId: 1005` fetch and `typeId: 90, filterId: 1005` save) + scoped `localStorage` cache. Fixed issue where records and updated content were wiped on reload when the backend returned `-200`. In Work Order Settings, added team user fetching and instant cache protection. In Internal Statuses, implemented full CRUD with immediate local persistence. In Custom Fields, implemented full CRUD ("Add New" modal, Edit/Delete row actions) with local persistence. In Email Templates, wired template description update with local persistence. (Antigravity, 2026-10-21/22)
- **TASK-20261015-01 — Settings: Priority 2 Category Master Screens (Maintenance Categories, Quotation Categories, Promotion Categories, Inventory Categories, Asset Categories)**: Connected live CRUD to backend Master lookup tables (`api/Masters/_getMasters` with `typeId: 2, filterId: lookupTypeId` and `api/Masters/save_lookup` with non-null `dependency_id: 0` preventing RFC 9110 errors; delete via `_getMasters` `typeId: -1, filterId: -1`). Cleared all hardcoded static mock fallback arrays so empty database states render clean Figma empty states. (Antigravity, 2026-10-15)
- **TASK-20261014-01 — Settings: Priority 1 Core Master Screens (Property Types, Unit Types, Property Amenities, Room Types, Visiting Slots)**: Connected live CRUD to backend Master APIs (`api/Masters/_getMasters`, `api/Masters/save_lookup`). Handled category type mappings, loading states, and modal action states. (Antigravity, 2026-10-14)
- **TASK-20261013-01 — Portfolio Units List & New Unit UI Fixes**: Commercial tab filtering, column dropdown outside-click dismiss, commercial unit types filtering, commercial beds removal, and landlord autocomplete search. (Antigravity, 2026-10-13)
- Portal-wide Figma HTML/SCSS conversion of most modules (Aug–Sep 2026) — see `CURRENT_STATE.md` and git log
