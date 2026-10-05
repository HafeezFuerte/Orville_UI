# Shared Tasks

Only tasks that could be confirmed as still relevant on 2026-10-01 are listed.
Old Cursor plans were all marked completed and were not imported as active tasks.

## IN PROGRESS

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

- Portal-wide Figma HTML/SCSS conversion of most modules (Aug–Sep 2026) — see `CURRENT_STATE.md` and git log
