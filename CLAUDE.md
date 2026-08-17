# Orville UI — Claude Code

Before any UI work, read and follow:

1. **[HANDOFF.md](./HANDOFF.md)** — full project context, what is already built, Figma nodes, routes, DS, pitfalls, and how this user works.
2. **[`.cursor/rules/figma-frontend-design.mdc`](./.cursor/rules/figma-frontend-design.mdc)** — hard rules: Figma first, frontend only, keep labels, protect theme switcher.

If those two files conflict with a one-off user message, the **user message for this turn wins**, then HANDOFF, then the Cursor rule.

Do not start implementing a screen without a Figma `node-id` (ask if missing). Do not call APIs or change backend contracts.
