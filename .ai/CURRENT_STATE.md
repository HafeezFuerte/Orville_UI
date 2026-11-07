# Current Project State

Last updated: 2026-10-01 13:30 (Asia/Dubai)
Updated by: Cursor (office PC) — shared-memory adoption check + landlord mobile Action menu (Figma only).
Previous update: Claude (Cowork mode) — initial shared-memory setup.

Sources: git reflog/commit subjects (12 Aug – 30 Sep 2026), git index, route files,
legacy handoff (Aug 2026), and machine-local Cursor plan summaries (office PC) that were
cross-checked against files present in the repo. Items marked **UNVERIFIED** could not be
confirmed from the repository.

## Current branch

- `main` (tracks `origin/main`). Also `Branch---KarthiFront` (last used ~Aug 2026).
- Last local commit: **2026-09-30 09:40 +04** "Setting page sidebar menu design updated" (`05fd9b8`), pushed.
- Fetched 2026-10-01 ~13:15 +04: `origin/main` is at `9253a9b` ("added translation"; before it `0b7f986`
  "Commit after merging") — **local `main` is 2 commits behind**. Incoming: 101 files (settings pages +
  `src/assets/i18n/en.js` / `ar.js`); **no overlap** with the current uncommitted files, so `git pull` should be clean.
  Not pulled yet (left for the user).

## Current implementation state

Almost every portal module now has Figma-styled frontend pages (HTML/SCSS conversion). Work is
frontend-only; data comes from existing APIs or static mock arrays where no API exists.

## Completed areas

Confirmed by commit history (dates are commit dates):

- Login + header/sidebar chrome (13 Aug); desktop login `26:80`
- Portfolio: properties/units/rooms/parkings lists, grids, detail pages + tabs, add/edit property/unit/room (13 Aug, 28–29 Aug); 100% dynamic localization (i18n) for grid columns, drawer dropdowns, child tables (units, parkings, notes, attachments, common areas, work orders, inventory, broadcasts, hearings, financials), global paginator (ov-paginator), and toastr alerts completed (22-27 Oct); Bulk Import Modal with dual mode (Manual Entry quick add for required fields + Excel/CSV file upload via xlsx), dynamic progress counters (properties to be imported, properties imported), real-time progress bar, and reuse of save_update_property, save_update_units, and save_update_rooms endpoints completed across Properties, Units, and Rooms (30 Oct); Room bulk import enhanced with cascading Property -> Unit hierarchy with dynamic unit lookup and validation (3 Nov); Rooms import unit dropdown loading fix (code vs id property binding) and 100% bilingual dynamic localization (i18n with 50+ keys) completed for the bulk import modal (4 Nov).
- Contacts: all lists + detail pages (14 Aug, 25 Aug); 100% dynamic localization (i18n) for grid columns, action menus, pagination, form validation alerts, duplicate alerts, emergency contact toasts, detail pages (`tenant-detail`, `landlord-detail`, `vendor-detail`, `support-technician-detail`), and add/edit pages (`add-tenant`, `add-landlord`, `add-vendor`, `add-support-technician`) completed across All Contacts, Landlords, Tenants, Vendors, Support Technicians; filter drawer DOM portaling leak resolved in `ov-modal-portal.service.ts` with `*ngIf="isOpen"` in template and clean CSS keyframe sliding for LTR/RTL (28 Oct); replaced hardcoded clientId and localStorage with dynamic currentUser, and implemented Add User modal across Tenants (roleid 2, 'T'), Landlords (roleid 3, 'L'), and Vendors (roleid 4, 'V') via save_update_users endpoint (29 Oct); Bulk Import Modal extended to Tenants, Landlords, Support Technicians, and Vendors with Import header ghost buttons, manual entry table, Excel templates, and direct wiring to save_update_tenants, save_update_landlords, save_update_technicians, and save_update_vendors (3 Nov).
- Lease management: leases list, create lease, lease detail + all 9 tabs/subgrids, 4 modals, and dual-language Ejari print preview (15 Aug, 21 Aug, 25 Aug, 1 Sep); 100% dynamic localization (i18n) for grid columns, action menus, tabs, KPI cards, filter drawers, form validation alerts, and popup modals completed (26 Oct)
- Bookings (Reservations & Spaces): reservations list, add/edit reservation, reservation detail, spaces list, create/edit space, space detail; 100% dynamic localization (i18n) for grid columns, action menus, weekly schedule, availability options, tabs, search inputs, pagination, filter drawers, validation toasts, attachments child table, and status badges completed across Reservations and Spaces with exact 1:1 key parity between en.js and ar.js (27 Oct)
- Collection Requests: collection requests list, detail page, status segments, search input, filter drawer, invoice information child table, and pagination; 100% dynamic localization (i18n) completed with exact 1:1 key parity between en.js and ar.js (27 Oct)
- Broadcasts: broadcasts list, create/edit broadcast form, broadcast detail (desktop/mobile preview); 100% dynamic bilingual localization (i18n) for grid columns, action dropdown, audience selector, schedule toggle, templates, editor, file upload dropzone, summary panel, and email preview completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Contracts: landlord contracts, vendor contracts (18 Aug); 100% dynamic localization (i18n) for grid columns, action menus, status tabs, search inputs, KPI cards, filter drawers, form validation alerts, schedules, commissions, documents, subgrids, and detail tabs completed across Landlord Contracts and Vendor Contracts with exact 1:1 key parity between en.js and ar.js (27 Oct)
- Facility sub-pages, tickets, requests (21 Aug); purchase orders, visitors (22 Aug); 100% dynamic localization (i18n) for grid columns, action menus, tabs, KPI cards, filter drawers, file dropzone messages, form validation alerts, and popup modals completed across Work Orders, Tickets, and Service Requests (26 Oct)
- Visitors: visitors list (all, check-in, check-out views), create visitor form, visitor detail; 100% dynamic bilingual localization (i18n) for grid columns, action menu, status tags, visitor information, visit details, property & unit, relationships, notes, pass & system metadata, and QR code access caption, and ov-paginator integration completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Reminders: reminders list (list view and calendar view), create/edit reminder form, reminder detail; 100% dynamic bilingual localization (i18n) for grid columns, action menu, priority badges, recurring yes/no, users count, calendar navigation, weekdays, filter drawer, dropzone, form validation alerts, and ov-paginator integration completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Commissions: commissions list, commission detail; 100% dynamic bilingual localization (i18n) for grid columns, status tabs (All, Tenant Commissions, Landlord Commissions), search, filter drawer, allocation sub-tables (Company & Agent), commission details KV rows, and ov-paginator integration completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Legal: litigations list, add/edit litigation, litigation details; 100% dynamic bilingual localization (i18n) for grid columns, status filter tabs, search, filter drawer, blocking toggles, case information cards, escalation options, sub-table tabs (Hearings, Notes, Attachments), and ov-paginator integration completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Inspections: inspections list, add inspection, inspection details, templates, create template, template details; 100% dynamic bilingual localization (i18n) for grid columns, status tabs, search inputs, filter & column buttons, form cards, area/section builder, details cards, and signatures completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Property Listings: all listings (grid view, card badges, pricing, filter drawer), project listings (table columns, status, search), property inquiries (table columns, drawer, search), listing detail (pricing card, overview stats, amenities, location, media strip); 100% dynamic bilingual localization (i18n) completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Facility Quotations: quotations list (table columns, status tabs, filter drawer, ov-paginator integration), create/edit quotation form, request quotation form, quotation details (left panel cards, line items table, notes & attachments sub-tables, Add Line Item modal); 100% dynamic bilingual localization (i18n) completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Facility Preventive Maintenance: preventive maintenance list (table columns, search, column menu, ov-paginator integration, row actions), create/edit PM schedule form (Trigger Details, Work order due with dynamic timeSpan translation, Property Information, Asset, Work order details, Assign To Responsible Person, Technicians, Assign Vendor, Post-PPM Inspection, Add CheckList), PM details (action menu, edit button, left information panel KV rows, status update card, activities, overview and notes tabs, approval/rejection modal); 100% dynamic bilingual localization (i18n) completed with exact 1:1 key parity between en.js and ar.js (28 Oct)
- Settings: company details, brand, watermark, shifts, regional, departments, document templates,
  PDF builder, mandatory docs, attachment types, users & roles, bulk assign, profile verification,
  invoice/receipt profiles + other sub-menus (24–26 Aug); settings sidebar menu (30 Sep)
- Settings Core Master Screens (14 Oct 2026): Property Types (`1`), Amenities (`2`), Unit Types (`3`), Room Types (`15`), Visiting Slots (`28`) directly wired to `api/Masters/save_lookup` and `api/Masters/_getMasters`.
- Settings Category Master Screens (15 Oct 2026): Maintenance Categories (`30` / `31`), Asset Categories (`26` / `27`), Quotation Categories (`34`), Promotion Categories (`46`), Inventory Categories (`32` / `33`) directly wired to `save_lookup` and `_getMasters`, with static dummy fallback data completely removed.
- Settings Priority 3 Operational & Policy Configurations (21-22 Oct, updated 30-31 Oct, 7 Nov 2026): Custom Fields wired directly to dedicated backend endpoint `POST api/Masters/save_extra_field` (`clsExtra_Field` schema with full properties: `sort_order`, `defaultvalue`, `min_length`, `max_length`, `probable_values`, `is_mandatory`, `is_readonly`, `is_visible`, `visibleToTenant`, `visibleToLandlord`, `useForVerification`) with dynamic data types loaded from `_getMasters` `typeId: -8` (`table1`), interactive Submit button with real-time slug auto-fill, and full entity custom fields data integration in `AddPropertyComponent` (loads custom fields via `typeId: -8`, fetches property values via `typeId: 9`, dynamically renders all control types, and persists via `POST api/Masters/save_extra_field_data`); Internal Statuses wired to standard lookup endpoint `POST api/Masters/save_lookup` (`clsLookup` schema) with dynamic `lookupTypeId` discovery; Approvals Workflow wired directly to backend endpoint `POST api/Configuration/save_update_workflow` (`clsWorkflow` / `clsWorkflow_approvals` schema) with per-screen in-memory & localStorage dual-write persistence, backend SP `-200` ("No record[s] found") handling, and seamless screen switching without data loss across Leases, Workorder, Invoices, Quotations, Expenses, and Property; Work Order Settings (live user assignees + hybrid persistence); Email Templates (live fetch + description edit + hybrid persistence). Guaranteed persistence across refresh via dual-write and local cache protection. Client ID and user credentials dynamically read from `currentUser`.
- Email log, activity log, mobile stats, tracked actions (27 Aug)
- Property listing + enquiry pages, sidebar design (29 Aug)
- Table + responsive fixes, detail page changes (2 Sep); accounting modal z-index, expenses receipt icon (3 Sep)
- Dashboard "add widget" design (8 Sep)

Present in the repo and described in completed Cursor plans (office PC):

- `src/assets/pdf-templates/` A4 HTML documents (lease invoice/receipt/contract, cheque notices, PO/PR, inventory issue)
- `/archives` page, `/property-listings/:id` detail, email-subscriptions drawer, portfolio status pills,
  toastr restyle, sidebar "Add-ons"/"More" grouping, list action-menu fix, events/rules-guides detail left panels

Figma-only work (no code), per Cursor plans: mobile-app screens in the Mobile App Figma file
(My Day, Dashboard, Auth set), responsive My Day/Dashboard frames, Lease Overview mobile,
Unit Overview mobile, Property tab add screens, mobile bottom nav, A4 V2 font bump.

## Work in progress

- **Work Order Detail: "Inventory Request" tab (2026-10-05, Cursor, uncommitted).** Built from a Facilio screenshot.
  It has a request list, an "Add Inventory Request" modal form (with line items) and a local-only Submit, since there
  is no API. Inventory and storerooms are read through the existing `getCommonGrid` (`INVENTORY_ITEMS`). An earlier
  "Parts & Costs" tab attempt the same day was fully reverted at the user's request.
  Files: `work-order-detail.component.{ts,html,scss}`.
- **Mobile login (< 768px) to Figma `7341:17681`** — `src/app/authentication/login/login.component.scss`
  is newer on disk (30 Sep ~10:06 +04) than the git index → **very likely uncommitted**. A Cursor plan
  marks it done and verified. **UNVERIFIED:** commit/visual state.
- Codex sessions on 30 Sep titled "Connect Figma property design" and "Create 2FA flowchart" happened after
  the last commit. **UNVERIFIED:** whether they changed files or produced deliverables.
- **Uncommitted app changes found by `git status` on 2026-10-01** (file times 30 Sep 10:59–11:18 +04, i.e. an
  earlier Cursor session on the office PC; not described in any handoff — **UNVERIFIED** intent/visual state):
  - Modified: `src/app/shared/components/header/*`, `src/app/shared/components/sidebar/*`,
    `src/app/shared/layouts/content-layout/*`, `src/assets/scss/orville-ds.scss`,
    `src/app/components/dashboards/crm/crm.component.scss`, `src/app/authentication/login/login.component.scss`
  - New: `src/app/shared/components/mobile-bottom-nav/`, `src/app/shared/services/header-scope.service.ts`,
    `src/assets/images/mobile-chrome/`
  - Looks like the mobile chrome (bottom nav + header scope) implementation. Review with `git diff`, verify
    in the browser at 390px and desktop, then commit separately from the memory files.
- Also uncommitted: the shared-memory files (`AGENTS.md`, `.ai/`, `CLAUDE.md`, `HANDOFF.md`, Cursor rule, `.gitignore`).

## Mobile Figma design work (Figma only — no app code)

- All on Figma page `6122:413`; catalogued in `.ai/reference/figma-mobile-catalog.md`.
- Sep 25 – Oct 1 (Cursor): mobile frames for most portal modules, prototype links, Create FAB overlay,
  Dashboard redesign, Login / Forgot Password / Email Sent / New Password, and Action-menu overlays for
  Property, Unit, Room, Tenant and Landlord details.

## Known issues

- Document/Download Center filter drawer still shows property filters (known mismatch).
- Reports: Generate drawer is UI only (no file output); card kebab is visual only.
- Parking-detail landlord popover deferred.
- Many new labels are raw English through `translate` (no i18n keys).
- `services.routes.ts` (SDN, process, SDN bills, quicktrans) is not wired into `content.routes.ts`.
- Leftover `.git/.MERGE_MSG.swp` (vim swap from a past merge) — harmless, may trigger an editor warning.

## Important recently changed areas

- `src/app/shared/components/sidebar/` (settings menu, 30 Sep)
- `src/app/authentication/login/login.component.scss` (mobile, uncommitted)
- `src/app/components/dashboards/` (add widget, 8 Sep)
- `src/app/components/community/` (rules-guides add/detail, Sep)

## Environment/build status

- Dev: `npm start` → `http://127.0.0.1:4200/`. Build status as of 2026-10-01: **UNVERIFIED** (not run during memory setup).

## Immediate priorities

1. `git pull` to catch up with `origin/main` (2 commits, no overlap with local changes).
2. Commit the shared-memory files (`AGENTS.md`, `.ai/` incl. `.ai/reference/`, `CLAUDE.md`, Cursor rule, `HANDOFF.md`, `.gitignore`).
3. Review and commit (or discard) the uncommitted mobile chrome + mobile-login app changes (listed above) as a separate commit.
4. Next Figma screen as directed by the user (see `TASKS.md`).
