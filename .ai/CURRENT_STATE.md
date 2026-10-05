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
- Portfolio: properties/units/rooms/parkings lists, grids, detail pages + tabs, add/edit property/unit/room (13 Aug, 28–29 Aug)
- Contacts: all lists + detail pages (14 Aug, 25 Aug)
- Lease management, work orders, broadcasts, assets add/edit/detail (15 Aug, 21 Aug, 25 Aug, 1 Sep)
- Insights + charts (15 Aug); Reports (17 Aug); Document & Download Center + details (17 Aug)
- Contracts, accounting, commissions (18 Aug); collection requests, reminders, bookings (19 Aug)
- Community (events, promotions, rules/guides) incl. detail pages (21 Aug, 3 Sep, 5 Sep)
- Facility sub-pages, tickets, requests (21 Aug); purchase orders, visitors (22 Aug)
- Settings: company details, brand, watermark, shifts, regional, departments, document templates,
  PDF builder, mandatory docs, attachment types, users & roles, bulk assign, profile verification,
  invoice/receipt profiles + other sub-menus (24–26 Aug); settings sidebar menu (30 Sep)
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
