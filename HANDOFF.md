# Orville UI — Claude Code Handoff

Read this file **before any work**. Then follow `.cursor/rules/figma-frontend-design.mdc` on every UI change.

This repo is an Angular 17 Ynex template restyled to the **Orville property-management Figma**. Work from 12–17 Aug 2026 was **frontend-only, Figma-first, pixel-tight**. Continue the same way. Do not invent a parallel design system.

---

## 1. Who you are working with

- Product owner / frontend driver. Speaks in short `--` bullets. English is informal — interpret intent, do not nitpick wording.
- Typical prompt: a **Figma URL** and/or a **screenshot**, plus “analyze / match Figma / fix pixel to pixel / don’t touch backend”.
- Will send screenshots of the running app vs Figma and expect a visual fix, not a redesign.
- If the result is wrong, they say **“revert last changes”** — revert immediately, do not argue or partially keep the bad change.
- When they say **“globally”**, change the shared DS (`orville-ds.scss`, shared table, toolbar, ng-select, paginator), not one page.
- When they say **“this page only”**, do not spread the change.
- They care about **visible copy, spacing, icons, colors, radii** matching Figma. Data/API correctness is out of scope unless they explicitly ask.
- They want remaining Figma screens implemented the same way with **minimal extra questions**. If the Figma node is missing, **ask for the node-id** before guessing.

---

## 2. Hard rules (never violate)

1. **Figma is source of truth.** Before changing UI, open the frame (`get_design_context`). No “close enough,” no redesign from memory.
2. **Frontend only.** Allowed: `.html`, component `.scss` / Tailwind classes, static assets, **presentation-only TS** (toggles, client-side filters, static mock arrays, localStorage bookmarks).
3. **Forbidden:** API services, auth contracts, NgRx effects that call APIs, `environments`, interceptors, route **data contracts**, backend endpoints, renaming request/response fields or `formControlName`s.
4. If Figma says “Email” but the control is `username`, change **visible label only**. Keep `formControlName="username"` and `loginWithApi`.
5. **Do not delete labels**, helper text, errors, loading, copyright, remember-me, or translation keys just to simplify. Prefer updating wording to Figma.
6. **Do not break the Ynex theme switcher** (`src/app/shared/components/switcher/`, `src/assets/scss/switcher/`, `_variables.scss`). Users must still change Menu/Header/Theme Color. Reset must return to **Figma defaults**, not old Ynex purple/dark.
7. **Do not hard-lock `--primary`** in page SCSS with one-off `!important` hex. Use tokens. Exception: login **left panel navy** is page-specific chrome.
8. **Accent gold `#BD9759` is NOT `--primary` or `--secondary`.** It is logo / active-nav / Misc-dot chrome only.
9. **Download Figma assets into `src/assets/`.** Never commit expiring `https://www.figma.com/api/mcp/asset/...` URLs.
10. Preserve **mobile / tablet / desktop** behavior. Do not collapse two-column desktop layouts.
11. Reuse existing **header + sidebar**. Do not invent parallel chrome.
12. After UI work, re-check the same Figma node (layout, colors, **every text string**, old labels still present, interactions, responsive, no backend files, switcher still works).

---

## 3. Stack and how to run

- **App:** Angular 17 standalone components + some NgModules, Tailwind, SCSS, NgRx, ngx-translate, ng-select, Angular Material, ApexCharts.
- **Root:** `d:\orville-property\Orville_UI`
- **Dev server:** `npm start` → `ng serve` → `http://127.0.0.1:4200/` (also `localhost:4200`).
- **Login:** `/auth/login`. After login, chrome is `ContentLayoutComponent` (header + sidebar).
- **Important:** `ng serve` does **not** run `npm run postcss`. Global Orville DS is compiled because `src/styles.scss` imports `./assets/scss/orville-ds`. Prefer putting shared styles there, not only in the Sass pipeline.
- Windows + PowerShell. Paths work with `d:\orville-property\Orville_UI`.
- New files **must exist on disk** (not only in the editor buffer). If Angular says `Cannot find module`, write/save the files and touch the importer (`dashboard.routes.ts`) so the watcher rebuilds.

---

## 4. Figma

- **File:** [property-mangement](https://www.figma.com/design/qBeLDjf5D3MY9UMTz2maON/property-mangement)  
- **fileKey:** `qBeLDjf5D3MY9UMTz2maON`
- **Active page:** `Web Portal`. Older page `version 1` exists — do not use it unless asked.
- URL pattern: `node-id=3386-152154` → MCP `nodeId` `3386:152154` (hyphen → colon).
- Workflow: load Figma design-to-code skill → `get_design_context` on the **exact frame** → adapt React/Tailwind output into Angular + `ov-*` + existing components. The MCP code is a **reference**, not paste-ready.
- If the user pastes a screenshot and no node, search the Figma file for the matching frame name before coding.
- Copy Figma text **verbatim**, including oddities (e.g. Misc report cards still badge **“Rental”** because Figma does).

### Known nodes

| Screen | Node | App route |
|---|---|---|
| Login | `26:80` | `/auth/login` |
| Insights / Dashboard | `424:4105` | `/insights` |
| Reports catalog | `3386:152154` (content `3386:154633`) | `/reports` |
| Generate Report filter drawer | `3389:155258` | overlay on `/reports` |
| Document Center | `3667:93499` (tabs `3667:93532`, rows `5012:94474`) | `/documents` |
| Download Center | **no named frame** — match user screenshot + Document Center list chrome | `/downloads` |
| Add Property header/body | `2104:79975` / `2104:80027` | `/add-property` |
| Landlord detail (example) | `1467:55482` | `/contacts/landlords/:id` |
| Work Orders kanban | see plan `wo_kanban_figma_*` | `/facility/work-orders` |

---

## 5. Theme tokens (Figma defaults)

Set as **defaults**; switcher can still retint.

| Token | Hex | CSS |
|---|---|---|
| Primary brand | `#26264F` | `--primary` / `--primary-rgb` (`38 38 79`) |
| Main background | `#F8F8FB` | `--body-bg` / `--default-background` |
| Primary text | `#252536` | `--default-text-color` |
| Secondary text | `#6B6B7D` | `--text-muted` |
| Border | `#E4E4EC` | `--default-border` |
| Success | `#27865B` | `--success` |
| Error | `#C94A4A` | `--danger` / error |
| Information | `#3E6FA8` | `--info` |
| Warning | `#D08A28` | `--warning` |
| **Link text** | `#2563EB` | `--link` / `--link-hover` (`37 99 235` / `29 78 216`) — **not** `--primary`, **not** `--info` |
| Accent gold | `#BD9759` | logo / active nav / Misc dots only |

- **Typeface:** Hanken Grotesk 400/500/600/700 → `--default-font-family` / `font-hanken`. Global in `src/styles.scss`. Do not revert chrome to Inter or Montserrat.
- **Default chrome:** light white sidebar `data-menu-styles="light"`, light white header `data-header-styles="light"`.
- Dark mode must keep dropdown/text visible (already patched once — do not regress).
- Login left panel may stay navy `#26264F` as page chrome.

Page-specific category colors that are **not** theme primary:

- Reports Financial dot `#2563EB`
- Reports Rental dot `#14B8A6`
- Reports Misc dot `#BD9759`
- Selected radio in Generate Report `#1E5AF9` (from Figma SVG `radio-on.svg`)

---

## 6. Design system — reuse these, don’t reinvent

**Global DS:** `src/assets/scss/orville-ds.scss` (imported from `src/styles.scss`).

Common classes (use these names):

- Page: `ov-page-title`, `ov-page-sub`, `page-header`
- Buttons: `ov-btn`, `ov-btn-primary`, `ov-btn-ghost`, `ov-btn-toolbar`, `ov-icon-btn`, `ov-icon-btn--primary|--danger|--bare`
- Search: `ov-search`, `ov-search__icon`, `ov-search__input`, `ov-input`, `ov-label`
- Toolbar: `ov-toolbar`, `ov-toolbar__btns`
- Tabs/pills: `ov-seg`, `ov-seg__btn`, `ov-seg--solid`
- KPI: `ov-kpi-row`, `ov-kpi`, `ov-kpi__badge`, `ov-kpi__val`, `ov-kpi__sub`
- Table: `ov-table` via `app-shared-table`
- Links: `ov-link` (uses `--link`)
- Status: `ov-status`, `ov-status--success|--warning`, `ov-outline-chip`, `ov-outline-chip--warning|--danger|--muted`
- Action kebab icon: `.ov-action-ico` + `src/assets/images/common/dots-vertical.svg`
- Add/edit forms: `ov-add-form`, `ov-add-header`, `ov-add-body`, `ov-fields`

**Shared components to reuse:**

| Component | Path | Use |
|---|---|---|
| `app-shared-table` | `src/app/shared/components/shared-table/` | Lists. Pass `columns` with `useTemplate: true` + `#colTemplate`. Column labels go through `translate` pipe — English strings still display as themselves if no i18n key. |
| `app-ov-paginator` | used inside shared-table | Figma pagination |
| `app-filter-drawer` | `src/app/shared/components/filter-drawer/` | Generic **property-list** filters (tags, area, landlord…). Visual chrome only unless the page is properties. **Do not reuse its fields** for Reports Generate — that drawer is custom (`.orville-gen`). |
| Header / sidebar | `src/app/shared/components/` | Already Figma-styled |

**List-page template pattern** (copy from broadcasts / work-orders / document-center):

```
page-header (title + subtitle + optional primary CTA)
white card (rounded-2xl, border-defaultborder)
  Lists header row + optional ov-seg tabs
  ov-toolbar: ov-search + Filter + Column/Type
  app-shared-table + colTemplate chips/links
app-filter-drawer
```

**New static catalog/drawer pages** (Reports) use BEM under a page prefix (`.orville-reports`, `.orville-gen`) in the **component SCSS**, still using theme tokens.

**Icons:** export SVGs into feature folders:

- `src/assets/images/nav/` — sidebar
- `src/assets/images/auth/` — login
- `src/assets/images/work-orders/`, `work-order-detail/`
- `src/assets/images/insights/`, `myday/`, `reports/`, `common/`
- Prefer existing `search.svg`, `filter.svg`, `columns.svg`, `dots-vertical.svg` over new copies.

**Selects:** ng-select styled globally to Figma (chevron, border, 6px radius). Don’t restyle one dropdown differently unless Figma for that screen is unique.

---

## 7. Routing and navigation

Sidebar menus come from the **backend**. Frontend maps names → paths in `src/app/shared/components/sidebar/sidebar.component.ts`:

- `urlNameMap` — exact `menuName` → route
- `figmaIconMap` — lowercase title → `./assets/images/nav/*.svg`

When adding a **new page**:

1. Add the route (usually `src/app/components/dashboards/dashboard.routes.ts` for top-level pages, or the feature `*.routes.ts`).
2. Add `urlNameMap` entries for every label the API might send (`Documents` and `Document Center`, `Download` / `Downloads` / `Download Center`).
3. Add `figmaIconMap` entries.
4. Use a **standalone** component like Insights/Reports.
5. Spread routes are loaded via `src/app/shared/routes/content.routes.ts` → `...dashboardRoutingModule.routes`.

### Live routes (app)

| Path | Component | Notes |
|---|---|---|
| `/auth/login` | LoginComponent | Figma login |
| `/dashboard/crm` | CrmComponent | My Day |
| `/insights` | MyInsightsComponent | Static/presentation charts |
| `/reports` | ReportsComponent | Static catalog + generate drawer |
| `/documents` | DocumentCenterComponent | Static table |
| `/downloads` | DownloadCenterComponent | Static table |
| `/properties` | PropertiesListComponent | List + grid |
| `/properties/:code` | PropertyDetailComponent | |
| `/add-property`, `/edit-property/:code` | AddPropertyComponent | |
| `/units`, `/units/:id`, `/add-unit`, `/edit-unit/:id` | | |
| `/rooms`, `/rooms/:id`, `/add-room`, `/edit-room/:id` | | |
| `/parkings` | ParkingsListComponent | |
| `/contacts/all-contacts` | | |
| `/contacts/tenants`, `.../add-tenant`, `.../edit-tenant/:id`, `.../:id` | | |
| `/contacts/landlords` (same add/edit/detail pattern) | | |
| `/contacts/vendors` | | |
| `/contacts/support-technicians` | | |
| `/broadcasts`, `/broadcasts/create`, `/broadcasts/:id` | | |
| `/facility/work-orders`, `.../create`, `.../edit/:id`, `.../:id` | | |
| `/facility/assets` (same create/edit/detail) | | |
| `/leases`, `/leases/create`, `/leases/:id` | | |

`services.routes.ts` (sdn, process, sdn-bills, quicktrans) exists but is **not** wired in `content.routes.ts` unless added later.

---

## 8. What is already done (do not redo unless asked)

Work spanned ~12–17 Aug 2026. Summary by area:

### Foundation
- Cursor rule `.cursor/rules/figma-frontend-design.mdc` (`alwaysApply: true`).
- Default theme primary `#26264F`; light header + light sidebar; Hanken Grotesk global.
- Link token `#2563EB` via `--link` + `.ov-link`.
- Global form fields, tables, pagination, Filter/Column toolbar buttons in `orville-ds`.
- ng-select / native select chevron + Figma dropdown chrome (project-wide, then extra pass on Add Property).
- Figma nav icons in `src/assets/images/nav/`.
- Sidebar submenu typography: **main menu 14px**, **submenu 12px**, same size within a level; gold/active treatment without setting gold as primary.
- Dark-mode header dropdown text visibility + theme icons.

### Auth
- Login split layout (`26:80`): left navy + city illustration, right form. Visible **Email** label, control still `username`. Kept errors, spinner, remember-me, copyright, Help | Privacy.

### Chrome / My Day / Insights
- Header + sidebar pixel pass vs Figma (logo without extra icon circle; collapse; search; theme; profile).
- My Day (`/dashboard/crm`) restyled to Figma.
- Insights (`/insights`) restyled to `424:4105`: section cards, donuts, legends, contact tabs, occupancy rings, happiness meter, work-order cards, priority bars, ticket sources, units published, property highlights. **Do not change mock chart series data** unless asked — only chrome/copy/colors. Insights gap-audit plan was completed.

### Portfolio
- Properties list + **4-column grid** (title 1-line clamp; grid uses Load more, not pagination — user asked to remove paginator on grid then bring Load more back).
- Units / Rooms / Parkings lists + grid views.
- Property / Unit / Room detail pages + **tab menus** (search, filter, column, pagination).
- Property detail **Actions** dropdown uses Figma icons under `src/assets/images/property-detail/action/`.
- Add Property layout (`ov-add-form` two-column 768+20+400) + Figma dropdowns.
- Landlord contact **popover** on **Unit + Room detail** (click name → details → View navigates to landlord). Parking popover was **deferred** (“next we can fix parking”).
- A global sticky-left-panel + sticky-tabs experiment on all detail pages was **reverted** on request. Do not re-apply unless asked.

### Contacts
- All Contacts, Tenants, Landlords, Vendors, Support Technicians lists restyled.
- Detail pages restyled (landlord `1467:55482` and follow-ups; vendor work-order/quotation/users/technicians tabs).
- **Do not drop backend table columns** to match a thinner Figma table — user made us **restore contact list backend columns** and only restyle. Vendor list: Figma look, keep data columns.
- Filter drawer FOUC: drawer must be `*ngIf` closed (not a hidden fixed panel) so it does not flash on route change.

### Facility / leases / broadcasts
- Work orders list + board/kanban Figma pass; create/detail restyle.
- Assets list/create/detail restyle.
- Leases list/create/detail restyle.
- Broadcasts list/create/detail restyle.

### Reports (static)
- `/reports` — title **Rental Reports**, tabs All/Financial/Rental/Misc, search, 18 cards in 3 sections, count = visible cards.
- Generate Report opens custom right drawer **414px** (Figma `3389:155258`): `{title} Report`, X (plus rotated -45°), Start/End date, format radios HTML (default)/PDF/XLS/CSV, Property Type Filter, footer Clear | Close. Escape / backdrop / X close. Clear resets fields. **No report API / no file download.**
- Bookmark toggle is **client-only** (`localStorage` key `orville.reports.bookmarks`), icons `bookmark.svg` / `bookmark-off.svg`.
- Kebab on cards is **visual only**.

### Documents (static)
- `/documents` Document Center — tabs All/Unit/Room/Property/Tenant/Lease/Item/WorkOrder, search by Document ID, Filter + Column, static 10 rows, Pending chip, No Expiry Date chip.
- `/downloads` Download Center — search by report name, Filter + Type (All/Excel/PDF), static jobs, trash action is **client-side row remove** only. Status lives on the detail page, not the list.
- Both reuse `app-shared-table` + generic `app-filter-drawer` (property fields — known mismatch; don’t swap to APIs).
- These files live in `src/app/components/document-center/` (list + detail) and `src/app/components/download-center/` (list + detail). If routes 404 or `Cannot find module`, confirm the component files exist **on disk** and rebuild.

---

## 9. How to implement the next Figma page (checklist)

1. Get the Figma URL / node. If missing, ask.
2. `get_design_context` on that node. Screenshot for layout.
3. Find the closest existing page (broadcasts list, document-center, reports, a detail page) and **clone chrome**, don’t start from Ynex demo pages.
4. Frontend only. Static mock arrays are OK when there is no API (Reports/Documents pattern).
5. If it is a **new route**:
   - standalone component under `src/app/components/<feature>/`
   - register in `dashboard.routes.ts` or feature routes
   - `urlNameMap` + `figmaIconMap`
   - download icons into `src/assets/images/<feature>/`
6. Match Figma strings exactly. Keep old error/loading if Figma omitted them.
7. Responsive: stack toolbars and date rows on small screens; keep desktop grid.
8. Dark mode: use tokens; `:host-context(.dark)` only where a local white card would break.
9. Verify against Figma. Then stop. Don’t drive-by refactor.

### Presentation TS that is allowed
- `*ngIf` drawers, tabs, search filters, column visibility, pagination indexes
- Static `documents[]` / `jobs[]` / `reports[]`
- `localStorage` bookmarks
- Password eye toggle, date placeholders over native `<input type="date">`

### Presentation TS that is NOT allowed
- New HTTP calls, new NgRx effects, changing payload field names, new environment URLs

---

## 10. Known remaining / likely next work

User is moving remaining Figma screens to Claude Code. Treat this as the backlog unless they paste a specific node:

**Not fully Figma-built as first-class app pages (sidebar icons exist, routes may not):**
- Accounting, Commissions, Collection Request
- Property Listings, Reminders
- Bookings, Community, Guests
- Legal, Inspections, Contracts
- Settings
- SDN / Process / SDN Bills / Quicktrans (`services.routes.ts` not mounted in `content.routes.ts`)
- Configurations

**Partial / follow-ups:**
- Parking detail landlord popover (deferred)
- Sticky detail-page layout (reverted — don’t revive)
- Reports kebab menu (visual only)
- Reports Generate: filter UI only — no HTML/PDF/XLS/CSV output
- Document/Download Filter drawer still shows **property** filters
- Download Center has **no Figma frame** — use the user’s screenshot + Document Center chrome
- Insights: keep mock series; only restyle if they send a new Insights node
- i18n: many new labels are raw English through `translate` — don’t delete keys; don’t block on missing translations unless asked
- `tsconfig.app.json` only lists `src/main.ts`; compilation follows the import graph. New files must be imported from a routed module.

**Quality bar the user will screenshot-check:**
- Pixel spacing, 6–8px radii, `#E4E4EC` borders, 14px body / 12px meta, 16px card titles
- Filter + Column toolbar buttons look like Figma globally
- Tables + paginator look like Figma globally
- No filter-drawer flash on navigation
- Light header/sidebar by default after theme reset

---

## 11. Pitfalls (already burned)

- **Filter drawer FOUC:** always `*ngIf="isOpen"` so a closed drawer is not in the DOM.
- **Eager import in `dashboard.routes.ts`:** a missing Document/Download component file breaks the **entire** `content-routes` lazy chunk (Insights, Properties, Reports all fail). After adding files, confirm `ng serve` rebuilds (`Application bundle generation complete`).
- **Don’t use `app-filter-drawer` fields for Generate Report.** Custom `.orville-gen` panel, 414px, footer Clear | Close (not Apply Filters).
- **Don’t set gold as primary.** Switcher must still retint navy.
- **Don’t strip table columns** that the API still returns, even if Figma shows fewer — restyle, keep data (contacts lesson).
- **Grid vs list pagination:** properties grid = Load more, no paginator; list view keeps paginator.
- **Login illustration** is `login-illustration.jpg` (downloaded as png then renamed).
- MCP asset URLs expire in ~7 days — always save under `src/assets/`.
- `content.routes.ts` has a leftover `RouterModule.forRoot(admin)` NgModule — don’t “clean it up” unless asked; easy to break routing.
- User often works at `127.0.0.1:4200` not localhost.

---

## 12. User communication style — how to reply

- Lead with what you did and where to click (`Open /reports`, etc.).
- Don’t dump MCP React code. Don’t lecture about Angular.
- If you need a Figma node, ask once, clearly.
- After a visual fix, mention the Figma node you matched.
- If they send two screenshots, image 1 / image 2 map to closed vs open states (e.g. select vs dropdown panel).
- Prefer small, page-scoped diffs. Global DS only when they say global.

---

## 13. Key file map

```
.cursor/rules/figma-frontend-design.mdc     ← always-on Figma rules
HANDOFF.md                                  ← this file
src/styles.scss                             ← orville-ds import, font, --link
src/assets/scss/orville-ds.scss             ← shared Figma DS
src/assets/scss/_variables.scss             ← --primary default #26264F
src/assets/scss/switcher/                   ← DO NOT break
src/app/shared/components/switcher/         ← DO NOT break
src/app/shared/components/sidebar/sidebar.component.ts  ← urlNameMap + figmaIconMap
src/app/shared/components/shared-table/     ← lists
src/app/shared/components/filter-drawer/    ← generic filters
src/app/shared/routes/content.routes.ts
src/app/components/dashboards/dashboard.routes.ts
src/app/authentication/login/
src/app/components/dashboards/crm/          ← My Day
src/app/components/dashboards/my-insights/  ← Insights
src/app/components/reports/                 ← Reports + generate drawer
src/app/components/document-center/        ← list + detail
src/app/components/download-center/        ← list + detail
src/app/components/portfolio/               ← properties/units/rooms/parkings
src/app/components/contacts/
src/app/components/facility/
src/app/components/leases/
src/app/components/broadcasts/
src/assets/images/nav|auth|reports|insights|work-orders|common|...
```

---

## 14. First message to send Claude if context is empty

Paste this plus a Figma URL:

> Continue Orville UI Figma implementation. Read `HANDOFF.md` and `.cursor/rules/figma-frontend-design.mdc`. Frontend only. Match Figma pixel-for-pixel. Reuse `ov-*` and existing list/detail chrome. Do not touch APIs, NgRx effects, environments, or the theme switcher. Download assets into `src/assets/`. Here is the Figma node: \<url\>.
