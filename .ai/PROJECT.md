# Orville UI — Project Knowledge

Stable knowledge about the project. No temporary tasks here (see `TASKS.md`),
no live status (see `CURRENT_STATE.md`).

Last verified against the repository: 2026-10-01 (Claude, Cowork) — paths and
routes checked against the git index and `content.routes.ts` / `dashboard.routes.ts`.
Migrated from the legacy handoff (`.ai/archive/HANDOFF-legacy-2026-08.md`).

---

## 1. Purpose

Orville UI is the web portal frontend for **Orville Real Estate**'s property-management
platform (portfolio, contacts, leases, facility, accounting, community, settings, …).
The repo started from the **Ynex** Angular admin template and is being restyled
screen by screen to the **Orville property-management Figma**. The backend/API already
exists and is owned elsewhere; this repo's ongoing work is **visual/frontend only**.

Remote: `origin` = GitHub `HafeezFuerte/Orville_UI`. Branches: `main` (active),
`Branch---KarthiFront` (older feature branch). Other people push to `main`.

## 2. Technology stack

- Angular 17 — standalone components plus some NgModules; `@angular/material`, `@angular/cdk`
- Tailwind CSS + SCSS (Ynex theme), PostCSS
- NgRx store/effects, ngx-translate, ng-select, ngx-toastr, SweetAlert2, ApexCharts, angular-calendar, `@angular/fire`
- `package.json` name: `Orville`

Scripts:

- `npm start` → `ng serve` → `http://127.0.0.1:4200/` (also `localhost:4200`; the user usually uses `127.0.0.1`)
- `npm run start:mobile` → `ng serve --host 0.0.0.0 --port 4200` (test on a phone over LAN)
- `npm run build`, `npm test`
- `npm run postcss` / `sass` compile the Ynex Sass pipeline — **`ng serve` does not run them**.
  The Orville DS still compiles because `src/styles.scss` imports `./assets/scss/orville-ds`.
  Put shared styles there.

Environment assumptions:

- Developed on Windows + PowerShell. Repo may live on any drive letter; use repo-relative paths.
- Login at `/auth/login`; after login the chrome is `ContentLayoutComponent` (header + sidebar).
- `tsconfig.app.json` lists only `src/main.ts`; compilation follows the import graph — new files
  must be imported from a routed module/route.

## 3. Repository structure (key paths)

```
AGENTS.md, CLAUDE.md, .ai/                    ← shared agent memory (.ai/reference/ = detailed catalogs)
.cursor/rules/figma-frontend-design.mdc       ← Cursor always-on rule (mirrors .ai/RULES.md)
src/styles.scss                               ← orville-ds import, font, --link
src/assets/scss/orville-ds.scss               ← shared Orville Figma design system
src/assets/scss/_variables.scss               ← theme vars, --primary default #26264F
src/assets/scss/switcher/                     ← Ynex theme switcher styles — DO NOT break
src/app/shared/components/switcher/           ← Ynex theme switcher — DO NOT break
src/app/shared/components/sidebar/sidebar.component.ts ← urlNameMap + figmaIconMap
src/app/shared/components/shared-table/       ← list tables (+ app-ov-paginator)
src/app/shared/components/filter-drawer/      ← generic (property) filter drawer
src/app/shared/components/email-subscriptions-drawer/
src/app/shared/routes/content.routes.ts       ← lazy feature routes + settings tree
src/app/components/dashboards/dashboard.routes.ts ← top-level pages + portfolio routes
src/app/authentication/login/
src/app/components/<feature>/                 ← feature modules (see §5)
src/app/components/portfolio/detail-page-layout/ ← shared detail layout (ov-detail-layout)
src/assets/images/<feature>/                  ← exported Figma icons/images
src/assets/pdf-templates/                     ← print-ready A4 HTML documents (see §8)
scratch/                                      ← small helper scripts
```

Feature folders under `src/app/components/`: accounting, activity-logs, archives,
bookings, broadcasts, child-tables, collection-requests, commissions, common, community,
configurations, contacts, contracts, dashboards, document-center, download-center,
email-logs, facility, feedbacks, import-logs, inspections, leases, legal, mobile-stats,
my-profile, notifications, portfolio, property-listings, reminders, reports, services,
settings, tracked-actions, visitors.

## 4. Figma references

| File | fileKey | Use |
|---|---|---|
| property-mangement (web portal) | `qBeLDjf5D3MY9UMTz2maON` | **Primary** source of truth. Active page `Web Portal`; ignore page `version 1` unless asked. Also hosts responsive/mobile canvases. |
| ORVILLE Property Management — Mobile App | `Q0jQMr8fEVW4I3TQx3K2fx` | Native-style mobile app screens (My Day, Dashboard, Auth set). Figma-only work so far. |
| Orville — Lease Invoice A4 | `P3ePfVcUbOROs3sSYaREt7` | A4 document designs used for `src/assets/pdf-templates`. |

- **Mobile (390px) designs** live in `qBeLDjf5D3MY9UMTz2maON` on page **`Responsive - My day, Dashboard & Properties` (`6122:413`)** — never `Page 2`.
  Every mobile frame/overlay/prototype link built so far is catalogued in `.ai/reference/figma-mobile-catalog.md`
  (Figma-only work; the app was not changed for it).
- URL `node-id=3386-152154` → MCP `nodeId` `3386:152154` (hyphen → colon).
- Workflow: load the Figma design-to-code skill → `get_design_context` on the exact frame →
  adapt the React/Tailwind reference into Angular + `ov-*` + existing components. MCP code is a
  reference, not paste-ready.
- Screenshot but no node → search the Figma file for the matching frame name before coding.
- Copy Figma text verbatim, including oddities (e.g. Misc report cards badge "Rental").

### Known nodes

| Screen | Node | Route |
|---|---|---|
| Login (desktop) | `26:80` | `/auth/login` |
| Login (mobile < 768px) | `7341:17681` | `/auth/login` |
| Insights / Dashboard | `424:4105` | `/insights` |
| Reports catalog | `3386:152154` (content `3386:154633`) | `/reports` |
| Generate Report drawer | `3389:155258` | overlay on `/reports` |
| Document Center | `3667:93499` (tabs `3667:93532`, rows `5012:94474`) | `/documents` |
| Download Center | no named frame — use user screenshot + Document Center chrome | `/downloads` |
| Add Property header/body | `2104:79975` / `2104:80027` | `/add-property` |
| Landlord detail | `1467:55482` | `/contacts/landlords/:id` |
| Email subscriptions drawer | `1727:155289` / `1467:58437` | landlord/tenant detail |
| Add/Edit Lease | `1382:21828` | `/leases/create` |
| Unit Overview desktop / mobile | `1637:100351` / `6275:2556` | `/units/:id` |
| Archives | no Figma node (built from screenshot) | `/archives` |

## 5. Routing and navigation

Sidebar menus come from the **backend API**. The frontend maps names → paths in
`sidebar.component.ts`:

- `urlNameMap` — exact `menuName` → route (add every label variant the API may send,
  e.g. `Documents` and `Document Center`)
- `figmaIconMap` — lowercase title → `./assets/images/nav/*.svg`
- Main menu groups "Add-ons" and "More" are presentation-only mapping on top of the API menu.

Adding a new page: standalone component under `src/app/components/<feature>/` → register in
`dashboard.routes.ts` (top-level) or the feature `*.routes.ts` → `urlNameMap` + `figmaIconMap`
→ icons into `src/assets/images/<feature>/`.

`dashboard.routes.ts` (top level): `dashboard/crm` (My Day), `insights`, `reports`, `documents(/:id)`,
`downloads(/:id)`, `archives`, `email-logs`, `activity-logs`, `imports(/:id)`, `import-logs(/:id)`,
`notifications`, `my-notifications`, `mobile-stats`, `feedbacks`, `tracked-actions`, `profile`,
`my-profile`, `properties(/:code)`, `units(/:id)`, `rooms(/:id)`, `parkings`, `add-property`,
`edit-property/:code`, `add-unit`, `edit-unit/:id`, `add-room`, `edit-room/:id`.

`content.routes.ts` lazy-loads: accounting, bookings (+ spaces), broadcasts, collection-requests,
commissions, community (events, promotions, rules-guides), contacts, landlord-contracts,
vendor-contracts, facility, inspections, leases, legal, property-listings, reminders, visitors,
and a large `settings/*` tree (company details, brand, watermark, shifts, regional, departments,
document template, PDF builder, mandatory documents, attachment types, users/roles, bulk assign,
profile verification, invoice/receipt profiles, `servicehub/*`, …; unbuilt ones use
`settings-placeholder`).

`src/app/components/services/services.routes.ts` (SDN, process, SDN bills, quicktrans) exists but
is **not** referenced by `content.routes.ts` (verified 2026-10-01).

## 6. Theme tokens (Figma defaults)

Defaults only — the switcher can still retint.

| Token | Hex | CSS |
|---|---|---|
| Primary brand | `#26264F` | `--primary` / `--primary-rgb` (`38 38 79`) |
| Main background | `#F8F8FB` | `--body-bg` / `--default-background` |
| Primary text | `#252536` | `--default-text-color` |
| Secondary text | `#6B6B7D` | `--text-muted` |
| Border | `#E4E4EC` | `--default-border` |
| Success / Error / Info / Warning | `#27865B` / `#C94A4A` / `#3E6FA8` / `#D08A28` | `--success` / `--danger` / `--info` / `--warning` |
| Link text | `#2563EB` | `--link` / `--link-hover` (`37 99 235` / `29 78 216`) — not primary, not info |
| Accent gold | `#BD9759` | logo / active nav / Misc dots only |

- Typeface **Hanken Grotesk** 400/500/600/700 → `--default-font-family` / `font-hanken`.
- Default chrome: light sidebar `data-menu-styles="light"`, light header `data-header-styles="light"`.
- Page-specific (non-theme) colors: Reports Financial dot `#2563EB`, Rental dot `#14B8A6`,
  Misc dot `#BD9759`, Generate Report selected radio `#1E5AF9`.
- Quality bar the user checks: 6–8px radii, `#E4E4EC` borders, 14px body / 12px meta,
  16px card titles; sidebar main menu 14px, submenu 12px.

## 7. Design system (reuse, don't reinvent)

Global DS: `src/assets/scss/orville-ds.scss`.

- Page: `ov-page-title`, `ov-page-sub`, `page-header`
- Buttons: `ov-btn`, `ov-btn-primary`, `ov-btn-ghost`, `ov-btn-toolbar`, `ov-icon-btn`, `ov-icon-btn--primary|--danger|--bare`
- Search/fields: `ov-search`, `ov-search__icon`, `ov-search__input`, `ov-input`, `ov-label`
- Toolbar: `ov-toolbar`, `ov-toolbar__btns`
- Tabs/pills: `ov-seg`, `ov-seg__btn`, `ov-seg--solid`
- KPI: `ov-kpi-row`, `ov-kpi`, `ov-kpi__badge`, `ov-kpi__val`, `ov-kpi__sub`
- Table: `ov-table` via `app-shared-table` (columns with `useTemplate: true` + `#colTemplate`; labels go through `translate`)
- Links: `ov-link`
- Status: `ov-status`, `ov-status--success|--warning`, `ov-outline-chip(--warning|--danger|--muted)`; shared portfolio status pills in `orville-ds.scss`
- Action kebab: `.ov-action-ico` + `src/assets/images/common/dots-vertical.svg`; row action menus use the fixed-position menu pattern from tickets/visitors (not in-cell absolute dropdowns)
- Add/edit forms: `ov-add-form` (two-column 768 + 20 + 400), `ov-add-header`, `ov-add-body`, `ov-fields`
- Detail pages: `ov-detail-layout` with one sticky identity card + nested info panels (ticket/listing pattern)
- Drawers: right-side slide-in with backdrop, footer `Clear | Close` (filter-drawer chrome)
- Toasts: ngx-toastr restyled to soft tinted Orville surfaces (CSS only)
- ng-select styled globally (chevron, border, 6px radius)

Shared components: `app-shared-table`, `app-ov-paginator`, `app-filter-drawer` (property filters —
do not reuse its fields for Reports Generate, which is the custom `.orville-gen` 414px drawer),
email-subscriptions drawer, header/sidebar.

List-page template (clone from broadcasts / work-orders / document-center):

```
page-header (title + subtitle + optional primary CTA)
white card (rounded-2xl, border-defaultborder)
  list header row + optional ov-seg tabs
  ov-toolbar: ov-search + Filter + Column/Type
  app-shared-table + colTemplate chips/links
app-filter-drawer (*ngIf when open)
```

Static catalog/drawer pages use BEM under a page prefix (`.orville-reports`, `.orville-gen`) in
component SCSS, still on theme tokens. Icons go to feature folders under `src/assets/images/`
(`nav`, `auth`, `common`, `reports`, `insights`, `myday`, `work-orders`, `work-order-detail`,
`property-detail`, `unit-detail`, `ticket-detail`, `settings`, …); prefer existing `search.svg`,
`filter.svg`, `columns.svg`, `dots-vertical.svg`.

## 8. PDF / print templates

`src/assets/pdf-templates/` holds print-ready A4 HTML documents matching the Lease Invoice A4 Figma:
shared `_shared/doc-a4.css` + `doc-a4.js`, and `cheque-bounce-notice`, `cheque-hold`,
`cheque-replacement`, `cheque-return`, `inventory-issue`, `lease-contract`, `lease-invoice`,
`lease-receipt`, `purchase-order`, `purchase-request` (each `index.html`).

## 9. Integrations

- Backend REST API (consumed via existing services/NgRx — not to be changed from this repo's UI work)
- Firebase (`@angular/fire`) dependency present
- Figma via MCP (design reference only; assets must be downloaded into `src/assets/`)

## 10. Working with the product owner

- Speaks in short `--` bullets, informal English — interpret intent, don't nitpick wording.
- Typical prompt: Figma URL and/or screenshot + "analyze / match Figma / fix pixel to pixel / don't touch backend".
- Two screenshots usually = closed vs open state (image 1 / image 2).
- Replies: lead with what changed and where to click (e.g. "Open /reports"), mention the Figma node
  matched, don't dump MCP React code, don't lecture. Ask for a missing node once, clearly.
- Prefers small page-scoped diffs; global DS only when they say "globally".

## 11. Known pitfalls (already burned)

- Filter drawer FOUC: render with `*ngIf="isOpen"` so a closed drawer is not in the DOM.
- An eager import of a missing component file in `dashboard.routes.ts` breaks the whole
  `content-routes` lazy chunk. After adding files, confirm `ng serve` prints
  "Application bundle generation complete". Files must exist on disk; touch the importer if the watcher misses them.
- `content.routes.ts` has a leftover `RouterModule.forRoot(admin)` NgModule — don't "clean it up" unless asked.
- Properties grid uses **Load more** (no paginator); list view keeps the paginator.
- Login illustration is `login-illustration.jpg`.
- Figma MCP asset URLs expire (~7 days) — always save files under `src/assets/`.
- Dark mode: header dropdown text visibility was patched once — don't regress.
