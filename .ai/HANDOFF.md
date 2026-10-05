# Current Agent Handoff

Last updated: 2026-10-05 14:50 (Asia/Dubai)
Agent: Cursor (office PC)
Machine/context if relevant: OFFICE PC
Branch: `main`, 2 commits ahead of `origin/main` (not pushed)

## Latest session (2026-10-05)

- New **Inventory Request** tab on Work Order Detail. It has a list, an "Add Inventory Request" modal form with line
  items, and a local-only Submit. Details are in `CHANGELOG.md` and `TASKS.md` (TASK-20261005-02). It is uncommitted.
- **Settings sidebar rail restored** (`sidebar.component.html` and `orville-ds.scss`, from karthi's commit `ebdca4e4`).
  It had been removed by Omer's `c0ef3599` and lost in merge `e71f250c`. Uncommitted. Verify while logged in, then
  commit separately, e.g. `sidebar: restore settings two-panel rail [Cursor]`.
- A "Parts & Costs" tab was built earlier the same day and then fully reverted at the user's request. Do not re-add it.
- Verified in the browser with injected sample data, because the session was not logged in and the APIs returned nothing.
- Next: user review, then commit:
  `git add src/app/components/facility/work-orders/work-order-detail .ai && git commit -m "work-orders: add Inventory Request tab [Cursor]"`

The sections below are from the 2026-10-01 session and remain valid for their pending items.

## Current task

1. Adopt the Git-tracked shared memory (`AGENTS.md` + `.ai/`) in Cursor — **done**.
2. Mobile Figma: Action menu on Contacts → Landlord details — **done** (Figma only).

## User's latest objective

The repository is the single project brain for Claude Code, Cursor and Codex. Keep mobile Figma
work going, one detail-page Action menu at a time, from the user's screenshots of the live app.

## Work completed (this session)

- Verified the Cursor setup: `.cursor/rules/figma-frontend-design.mdc` is `alwaysApply: true` and starts
  with "read `AGENTS.md`" + the shared-memory protocol; all Figma/frontend rules intact. No change needed.
- Promoted the machine-local Cursor mobile catalog into the repo:
  `.ai/reference/figma-mobile-catalog.md` (828+ lines of node IDs/links; account email removed). The old
  Cursor store file is now a pointer. Registered in `AGENTS.md` (file table) and `.ai/PROJECT.md` §3–4.
- Figma (page `6122:413`): `Btn / Action` on `Landlord Overview / Mobile` `6827:5502` + overlay
  `Landlord Overview / Action Menu / Mobile` `7446:20093` (14 items + Archive, from
  `landlord-detail.component.ts`) + preview `7446:20313`. Earlier the same day/yesterday: Property, Unit,
  Room, Tenant Action menus (see catalog).
- Recorded the uncommitted 30 Sep mobile-chrome app changes in `CURRENT_STATE.md` (they were undocumented).

## Files changed

- New: `.ai/reference/figma-mobile-catalog.md`
- Modified: `AGENTS.md` (one table row), `.ai/PROJECT.md`, `.ai/CURRENT_STATE.md`, `.ai/HANDOFF.md`,
  `.ai/TASKS.md`, `.ai/DECISIONS.md`, `.ai/CHANGELOG.md`
- No application code touched this session.

## Verification performed

- `git status`, `git log -10`, `git fetch`, overlap check incoming vs local (none).
- Landlord Action menu: Figma screenshot of preview `7446:20313` compared with the user's screenshot —
  all 15 labels/icons/order match; Block Landlord red icon box; no canvas overlaps.

## Current status

Everything is in the working tree, **uncommitted**. Nothing pushed.

## Pending work

- User: `git pull`, then commit the memory files; review/commit the 30 Sep mobile-chrome app changes separately.
- Optional Figma follow-ups: add the Action button to the other Tenant/Landlord tab frames; decide whether
  `Unit Overview / Mobile` `6275:2556` should show its hidden unit content again (it currently shows room content).

## Exact next recommended action

```
git pull
git add AGENTS.md CLAUDE.md HANDOFF.md .gitignore .ai .cursor/rules
git commit -m "docs(ai): shared cross-agent memory + mobile Figma catalog [Claude, Cursor]"
git push
```

Then review `git diff` of the app files listed in `CURRENT_STATE.md` → "Work in progress".

## Blockers / warnings

- The mobile catalog had lived only in a Cursor agent store on the office PC; HOME has none of that until
  this commit is pushed.
- Claude Code: start it from the repo root so `CLAUDE.md` loads. `old/` next to the repo has stale copies — ignore.

## Important context for the next agent

- Read `AGENTS.md` first; `.ai/RULES.md` is canonical, the Cursor `.mdc` mirrors it.
- Mobile Figma work: read `.ai/reference/figma-mobile-catalog.md` (rules at the bottom + Action-menu pattern).
- Other people push to `origin/main`; always fetch/pull first.
