# Orville UI — Claude Code

**Start with [`AGENTS.md`](./AGENTS.md).** It is the universal entry point for all agents and
defines the shared-memory startup and completion protocol. Project truth lives in the
Git-tracked [`.ai/`](./.ai/) directory, not in Claude account memory or local Claude
memory. Do not keep a separate Claude-only version of project knowledge.

Load order: `CLAUDE.md` → `AGENTS.md` → `.ai/PROJECT.md`, `.ai/RULES.md`,
`.ai/CURRENT_STATE.md`, `.ai/HANDOFF.md`, relevant `.ai/DECISIONS.md` / `.ai/TASKS.md`.

@AGENTS.md

## Claude-specific notes

- Start Claude Code **from this repository root** so this file loads at startup. (Older Claude
  settings live one level up in `../.claude/`, outside the repo.)
- If Claude auto-memory or `/memory` notes conflict with `.ai/`, the repository wins. Promote anything
  durable you learn into `.ai/` instead of private memory.
- Figma MCP: load the design-to-code skill before `get_design_context`; save assets into `src/assets/`.
- The legacy Claude handoff is archived at `.ai/archive/HANDOFF-legacy-2026-08.md` (read-only reference).
