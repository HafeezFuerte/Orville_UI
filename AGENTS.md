# ORVILLE SHARED AGENT MEMORY

This repository is the authoritative source of project context.

Do not rely on private Cursor, Claude, Codex, Hermes, or account memory for
cross-agent project continuity. This file is the universal entry point for
every coding agent (Claude Code, Cursor, OpenAI Codex, Hermes, and any future
agent). Codex reads this file natively; Claude Code reaches it through
`CLAUDE.md`; Cursor reaches it through `.cursor/rules/figma-frontend-design.mdc`.

**Project in one line:** Orville UI — the Angular 17 (Ynex template) frontend
for the Orville property-management portal, restyled pixel-for-pixel to the
Orville Figma. Work here is **frontend-only and Figma-first**.

## Source-of-truth hierarchy

When instructions conflict, the higher item wins:

1. Current explicit user instruction (for that turn)
2. `AGENTS.md` (this file)
3. `.ai/RULES.md`
4. `.ai/DECISIONS.md`
5. `.ai/PROJECT.md`
6. `.ai/CURRENT_STATE.md`
7. `.ai/HANDOFF.md`
8. Tool-specific instructions (`CLAUDE.md`, `.cursor/rules/*`, any Codex/Hermes config)
9. Agent private/local memory (Cursor plans/transcripts, Codex sessions/DBs, Claude account or local memory)

If private AI memory conflicts with the repository, **the repository wins**.

## Shared memory files

| File | Purpose | Edit style |
|---|---|---|
| `.ai/PROJECT.md` | Stable project knowledge: stack, structure, routes, Figma, design system | Update when facts change |
| `.ai/RULES.md` | Hard rules (Figma, frontend-only, labels, theme switcher, verification) | Change only on user instruction |
| `.ai/CURRENT_STATE.md` | What the project looks like right now | Overwrite sections to stay current |
| `.ai/HANDOFF.md` | SHORT live handoff from the last agent to the next | Overwrite after every meaningful session |
| `.ai/DECISIONS.md` | Architectural/design decisions | Append-only; supersede, never erase |
| `.ai/TASKS.md` | Shared task state | Move tasks between sections |
| `.ai/CHANGELOG.md` | Cross-agent activity log | Append-only, newest at top |
| `.ai/reference/` | Detailed reference catalogs (e.g. `figma-mobile-catalog.md` — every mobile Figma frame/node built on page `6122:413`) | Update after each related task |
| `.ai/archive/` | Frozen legacy material (e.g. the Aug 2026 handoff) | Read-only reference |

## Mandatory startup procedure

Before making meaningful project changes:

1. Read this `AGENTS.md`.
2. Read `.ai/PROJECT.md`.
3. Read `.ai/RULES.md`.
4. Read `.ai/CURRENT_STATE.md`.
5. Read `.ai/HANDOFF.md`.
6. Read relevant entries in `.ai/DECISIONS.md`.
7. Read `.ai/TASKS.md` when the work relates to an existing task.
8. Inspect `git status`.
9. Inspect recent git history (`git log --oneline -20`) when needed to understand recent work.
10. Run `git fetch` and check whether the branch is behind its remote before starting; other people push to this repository.

## Mandatory completion procedure

After meaningful work:

1. Update `.ai/CURRENT_STATE.md` when current project state changed.
2. Update `.ai/HANDOFF.md`.
3. Update `.ai/TASKS.md`.
4. Append significant decisions to `.ai/DECISIONS.md`.
5. Append a concise entry to `.ai/CHANGELOG.md` (date, agent, task, files, next action).
6. Commit/push only when the user has authorized it. Prefer a commit message
   that names the area and the agent, e.g. `leases: restyle add form to Figma 1382:21828 [Cursor]`.

"Meaningful work" = any change to files in the repo, any decision, or any
finding the next agent would need. Pure Q&A needs no memory update.

## Multi-agent conflict protection

Before updating shared memory:

1. Inspect current `git status`.
2. Re-read the latest `.ai/HANDOFF.md` (another agent or machine may have changed it).
3. Avoid overwriting newer work; edit, don't blindly replace.
4. Preserve unrelated changes.
5. Never reset, revert, or discard another agent's work to make your own task easier.

If a shared-memory merge conflict occurs: preserve both agents' factual
information, reconcile the current state, and do not blindly choose one side.

## Cross-machine and cross-account rules

- The same repository is used on an OFFICE and a HOME computer, possibly from an
  external drive whose letter may differ (`C:`, `D:`, `E:` …). **Use
  repository-relative paths** in shared memory. Absolute paths are allowed only
  when clearly marked *machine-specific*.
- Synchronization is via Git: update `.ai/` → commit → push → pull on the other machine.
- These are **not** expected to sync and must never be required for continuity:
  Claude account memory, Claude local conversations, Cursor plans/transcripts,
  Codex conversations/memory databases, IDE history, local caches.
  Anything important found there must be **promoted into `.ai/`**.

## Safety

Never store secrets, passwords, API keys, access tokens, authentication
cookies, private credentials, or personal confidential information in shared AI
memory. Do not commit auth files, agent session databases, Cursor transcripts,
Codex databases, caches, `node_modules`, or build output. Do not force-add
ignored files.

Do not rewrite historical decisions merely because another agent would have
chosen differently.

Git-tracked project memory is authoritative.
Agent-local memory is supplementary only.

## Quick reminders (details in `.ai/RULES.md`)

- Figma is the source of truth; open the exact frame before UI changes. No node? Ask for it.
- Frontend only: no API services, NgRx effects that call APIs, environments, interceptors, or contract changes.
- Never delete existing labels/errors/loading/translation keys; never drop API table columns.
- Never break the Ynex theme switcher; never set gold `#BD9759` as primary.
- Download Figma assets into `src/assets/`; never commit expiring Figma MCP asset URLs.
- "revert last changes" → revert fully and immediately. "globally" → shared DS. "this page only" → page scope.
