# Cross-Agent Changelog

Append-only. Newest entry at the top. Keep entries short; no pasted conversations.

---

## 2026-10-05 — Cursor (office PC), settings sidebar rail restored

Task: Restore the settings two-panel sidebar (icon rail + settings panel) that was lost in a git pull.
Cause: commit `c0ef3599` (Omer_Ali_Khan, "worked on masters, brands, watermarks, sidebar…") deleted the
`orville-settings-rail` `<nav>` from `sidebar.component.html` and the two-panel `@media (min-width: 992px)` /
`1280px` rules from `orville-ds.scss`, replacing them with "/* Single panel settings sidebar */". The merge
`e71f250c` kept that deletion.
Fix: `git restore --source=ebdca4e4 --worktree` for both files. Nothing else differed between `ebdca4e4` and
the merge in those files, so this restores exactly karthi's version. The sidebar TS (`railPath`,
`originalMenuItems`, `data-orville-settings`) was intact.

Changed:
- src/app/shared/components/sidebar/sidebar.component.html
- src/assets/scss/orville-ds.scss

Handoff:
- Verify on `/settings/*` while logged in (the menu is empty when logged out), then commit. Tell Omer, so a later
  merge does not drop the rail again.

## 2026-10-05 — Cursor (office PC), Inventory Request tab

Task: Work Order Detail, new "Inventory Request" tab (built from a Facilio screenshot; no Figma node).
Summary: Tabs are now Overview, Messages, Notes, Quotations, Inventory Request, Attachments. The tab has a
request list (`app-shared-table` with search, same layout as Quotations) and an "Add Inventory Request" button.
The button opens a large `ov-modal` form with these fields: Name*, Description, Requested Date (today, read-only),
Required Date, Requested By (read-only), Requested For*, Site* (read-only), Storeroom*, Work Order (read-only),
Workorder Category (read-only), plus a Line Items table (Item/Tool, item, Available Qty, Qty, remove, "+ Add New")
and Cancel / Submit Details. Inventory items and storerooms come from the existing `getCommonGrid`
(`INVENTORY_ITEMS`); storerooms are the distinct inventory locations. Submit adds the request to the list
**locally only**, because there is no inventory-request API. `workOrderDetails.site` was added to the existing mapping.
Follow-up: the popup width was changed from a custom 880px to the project's standard large size (`ov-modal-stack`
`max-width: 640px` + `ov-modal ov-modal--lg`, the same as invoices, expenses, credit notes and the reusable modal).
Project popup widths are 420 (sm), 520 (default forms), 600 (facility line-item popups) and 640 (lg).

Changed:
- src/app/components/facility/work-orders/work-order-detail/work-order-detail.component.{ts,html,scss}

Handoff:
- User review, then commit. Confirm the site and stock field names once logged in with real data.

## 2026-10-05 — Cursor (office PC)

Task: Work Order Detail "Parts & Costs" tab, built and then **reverted at the user's request**.
Summary: A Parts & Costs tab (Inventory Items, Costs, Time Track cards, plus an "+ Add Part" inventory drawer) was
built from user screenshots, then fully reverted with `git checkout` of `work-order-detail.component.{ts,html,scss}`
and removal of `assets/images/work-order-detail/sort.svg`. The Work Order Detail page is back to its committed state.
Do not re-add the tab unless the user asks again.

Changed:
- No net application change. `.ai/CHANGELOG.md` only.

## 2026-10-01 — Cursor (office PC)

Task: Adopt the shared-memory architecture in Cursor; mobile Figma Action menu for Landlord details.
Summary: Verified `AGENTS.md`, all `.ai/` files and the always-applied Cursor rule (already points to
`AGENTS.md`; no rule change). Promoted the machine-local mobile Figma catalog into
`.ai/reference/figma-mobile-catalog.md`. Built the Landlord details Action menu in Figma
(`7446:20093`, preview `7446:20313`). Recorded undocumented uncommitted 30 Sep mobile-chrome app changes.
No application code changed.

Changed:
- .ai/reference/figma-mobile-catalog.md (new)
- AGENTS.md (file table row), .ai/PROJECT.md, CURRENT_STATE.md, HANDOFF.md, TASKS.md, DECISIONS.md, CHANGELOG.md
- Figma `qBeLDjf5D3MY9UMTz2maON` page `6122:413` (Landlord Overview / Mobile + new overlay/preview)

Decision:
- DEC-20261001-002, DEC-20261001-003

Handoff:
- User: `git pull`, commit memory files, then review/commit the mobile-chrome app changes separately.

## 2026-09-25 → 2026-09-30 — Cursor (office PC), Figma mobile work (summary)

Mobile frames for most modules, prototype links, Create FAB overlay, Dashboard redesign, auth screens,
Property/Unit/Room/Tenant Action menus — all Figma only; see `.ai/reference/figma-mobile-catalog.md`.
App-side: mobile chrome (bottom nav, header scope) edited 30 Sep, still uncommitted (TASK-20261001-04).

## 2026-10-01 — Claude (Cowork mode)

Task: Set up Git-tracked cross-agent shared memory.
Summary: Added `AGENTS.md` and `.ai/`; migrated the Aug 2026 handoff; pointed Claude and Cursor
entry files at `AGENTS.md`; archived the legacy handoff. No application code changed.

Changed:
- AGENTS.md (new)
- .ai/PROJECT.md, RULES.md, CURRENT_STATE.md, HANDOFF.md, DECISIONS.md, TASKS.md, CHANGELOG.md (new)
- .ai/archive/HANDOFF-legacy-2026-08.md (new, verbatim legacy copy)
- CLAUDE.md, HANDOFF.md, .cursor/rules/figma-frontend-design.mdc, .gitignore (modified)

Decision:
- DEC-20261001-001

Handoff:
- User to review, commit and push; then `git pull` (local main is behind origin).

## 2026-08-12 → 2026-09-30 — history before shared memory (summary)

Reconstructed from git commit subjects (author: karthi; agents mostly Cursor and Claude, not recorded per commit):
Figma restyle of login, chrome, portfolio, contacts, leases, work orders, broadcasts, assets, insights,
reports, document/download center, contracts, accounting, commissions, collection requests, reminders,
bookings, community, facility, purchase orders, visitors, settings, logs, property listings,
dashboard add-widget, settings sidebar menu. See `git log` for details.
