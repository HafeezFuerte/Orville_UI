# Cross-Agent Changelog

Append-only. Newest entry at the top. Keep entries short; no pasted conversations.

---

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
