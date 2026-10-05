# Orville UI — Hard Rules

Canonical rule set for every agent. Consolidated on 2026-10-01 from:

- **[H]** legacy `HANDOFF.md` §1, §2, §9, §12 (now `.ai/archive/HANDOFF-legacy-2026-08.md`)
- **[C]** `.cursor/rules/figma-frontend-design.mdc` §0–§8
- **[M]** legacy `CLAUDE.md`
- **[N]** new in the shared-memory setup (2026-10-01)

`.cursor/rules/figma-frontend-design.mdc` keeps a mirror of §1–§8 so Cursor enforces
them automatically. If the two ever differ, **this file wins** — fix the mirror.
Rules change only on explicit user instruction (record it in `DECISIONS.md`).

---

## 1. Figma first — no visual drift [H][C][M]

1. Figma is the source of truth for layout, spacing, typography, colors, radii, shadows, icons and copy.
2. Before changing any UI, open the matching frame (`get_design_context` on the exact node) in
   file `qBeLDjf5D3MY9UMTz2maON` (or the file the user names).
3. No "close enough", no invented spacing, no alternate chrome, no redesign from memory or screenshot
   when the frame is available.
4. Do not start implementing a screen without a Figma `node-id`; if it is missing or ambiguous, ask once.
   Exception: the user explicitly says there is no frame (e.g. Download Center, Archives) — then match
   their screenshot using existing Orville chrome.
5. Copy Figma text verbatim.

## 2. Frontend only — never touch backend [H][C][M]

- **Allowed:** `.html`, component `.scss` / Tailwind classes, static assets, presentation-only TS
  (`*ngIf` drawers, tabs, client-side search/filters, column visibility, pagination indexes,
  static mock arrays, `localStorage` bookmarks, password eye toggle, date placeholders).
- **Forbidden:** API services, auth/API contracts, NgRx effects that call APIs, `environments`,
  interceptors, route data contracts, backend endpoints, new HTTP calls, renaming
  request/response fields or `formControlName`s, new environment URLs.
- If Figma says "Email" but the control is `username`, change the visible label/placeholder only;
  keep `formControlName="username"` and `loginWithApi`.

## 3. Preserve labels, content and data [H][C]

- Never delete existing labels, helper text, links, errors, loading states, copyright, remember-me,
  button copy, or translation keys just to simplify. Prefer updating wording to Figma.
- Keep behavior Figma omits (error alert, loading, copyright…) unless the user explicitly asks to remove it.
- Do not delete unused translation keys or sibling auth screens unless asked.
- **Do not drop table columns the API still returns** to match a thinner Figma table — restyle, keep data.
- Don't change mock chart series data (e.g. Insights) unless asked — chrome/copy/colors only.

## 4. Protect the theme switcher and theme color [H][C]

- Do not rewrite or break the Ynex switcher: `src/app/shared/components/switcher/`,
  `src/assets/scss/switcher/`, `src/assets/scss/_variables.scss` and global theme plumbing.
- Do not hard-lock `--primary` / theme colors in page or component SCSS with one-off `!important` hex.
  Use tokens. Exception: page-specific non-theme chrome fixed in Figma (e.g. login left-panel navy).
- Figma defaults (see `PROJECT.md` §6) are the theme defaults; reset must return to them,
  not the old Ynex purple/dark. Users must still be able to change Menu / Header / Theme Color.
- Accent gold `#BD9759` is never `--primary` or `--secondary`.
- Do not remove theme presets or disable the switcher.

## 5. Assets [H][C]

- Download Figma assets into `src/assets/` (feature subfolder). Never commit expiring
  `https://www.figma.com/api/mcp/asset/...` URLs.
- Reuse existing icons before adding copies.

## 6. Responsive and chrome [H][C]

- Preserve mobile / tablet / desktop behavior; don't strip breakpoints or collapse desktop two-column layouts.
- Keep header/sidebar responsive patterns (toggle, overlay, hidden-on-mobile).
- Reuse the existing header + sidebar; never invent parallel chrome.
- New pages/sections/components follow the Figma DS and are fully responsive.
- Light and dark: use tokens (`--default-text-color`, `--text-muted`, `--default-border`, `--body-bg`,
  `--dark-bg`, `--light`, `--link`); never raw `#fff`/`#000`/gray-100 for chrome. Cards
  `bg-white dark:bg-bodybg`; keep `dark:bg-bodybg` on dropdowns. `:host-context(.dark)` only where a
  local white card would break.

## 7. Scope and refactoring safety [H][N]

- "this page only" → do not spread the change. "globally" → change the shared DS
  (`orville-ds.scss`, shared table, toolbar, ng-select, paginator), not one page.
- "revert last changes" → revert immediately and completely; don't argue or partially keep it.
- No drive-by refactors. Don't "clean up" `RouterModule.forRoot(admin)` in `content.routes.ts`.
- Don't re-apply reverted experiments (e.g. global sticky-left-panel/sticky-tabs on detail pages) unless asked.
- Before changing a **shared** component or `orville-ds.scss` [N]: list the pages that use it,
  confirm the user asked for a global change, and spot-check at least two consuming pages afterwards.
- Do not modify application behavior during memory/documentation tasks [N].

## 8. Delivery checklist — mandatory before saying "done" [H][C]

Re-open the same Figma node and verify:

1. Layout matches (panels, header, sidebar, logo, content width/alignment).
2. Colors, radii, shadows, buttons match; theme defaults from Figma; switcher not broken.
3. Every Figma text string is present and correct.
4. Previous app labels/behaviors Figma did not replace are still present.
5. Interactive UI still works (toggles, links, submit, errors/loading).
6. Mobile, tablet and desktop layouts work.
7. No backend/service/environment files were modified.
8. Theme switcher still works; no hard-coded overrides of global theme colors.
9. `ng serve` rebuilt without errors [H].

## 9. Shared-memory rules [N]

- Follow the startup/completion procedure in `AGENTS.md`.
- Never store secrets, tokens, credentials, cookies or personal confidential data in `.ai/` or any tracked file.
- Repository-relative paths only; mark any absolute path as machine-specific.
- Private agent memory (Cursor plans/transcripts, Codex sessions/DBs, Claude account/local memory)
  is supplementary; promote anything durable into `.ai/`.
- Don't commit or push without user authorization.

## 10. Communication with the user [H]

- Lead with what you did and where to click; mention the Figma node matched.
- Don't dump MCP React code; don't lecture about Angular.
- Ask for a missing node once, clearly. Minimal extra questions otherwise.
