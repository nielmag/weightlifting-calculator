## Context

See proposal.md - Why. The app is a static site (no backend, no build step, no framework) deployed to GitHub Pages. All logic currently lives inline in two near-duplicate HTML files. There is no existing test-tooling separation between pure calculation logic and DOM code, which blocks unit testing.

## Goals / Non-Goals

**Goals:**
- Extract pure calculation logic into a standalone, dependency-free module usable both from a `<script>` tag and from Node's test runner.
- Define a minimal state model for the Total ↔ Snatch/CJ relationship that is easy to reason about and test.
- Keep the app static (no server) and keep the existing accessory-lift/percentage-table behavior working unchanged.

**Non-Goals:**
- No backend/API is implemented. `openapi`-style thinking does not apply here; OpenSpec's `specs/` is the behavior contract instead.
- No support for multiple saved profiles/history — only the single most-recent entry is persisted.
- No build step, bundler, or TypeScript is introduced.

## Decisions

**Split calculation logic into `calculator.js` (pure) and `app.js` (DOM/state/persistence).**
Rationale: `calculator.js` has no `document`/`window` dependency, so it can be `require()`'d directly in a `node:test` unit test with zero DOM shim (no jsdom needed). Alternative considered: keep everything inline and unit-test via a headless browser — rejected because it makes "unit" tests slow and DOM-coupled, duplicating what Playwright already covers.

**Single `totalMode: 'input' | 'derived'` flag drives the Total/Snatch/CJ relationship**, rather than three independently-editable fields with "last write wins" logic.
Rationale: a two-state machine is trivial to unit-test and reason about, and directly matches the two required flows (type-a-total-to-get-suggestions vs. edit-lifts-to-get-a-total). A fully-independent model (all three fields always editable) was considered and rejected: it created an ambiguous case (user edits Total while Snatch/CJ already have values — which wins?) with no clear resolution the user asked for.

**Split suggestions round Snatch to a whole kg and derive C&J as `total - snatch`**, rather than rounding both independently.
Rationale: guarantees each suggestion's Snatch + C&J always sums exactly back to the entered Total (verified by a unit test), avoiding a confusing off-by-a-fraction display.

**Persistence via `localStorage` with a versioned JSON blob (`weightlifting-calculator:v1`)**, restored on `DOMContentLoaded`.
Rationale: simplest mechanism that satisfies "persists across sessions until changed"; no server/account exists to persist to. Versioning the key allows a future schema change to detect and migrate/discard old data without a runtime error.

**Consolidate `index.html` + `weightlifting-calculator.html` into a single `index.html`.**
Rationale: git history shows the duplication already caused two hand-sync commits; GitHub Pages requires `index.html` at the root, so that is the file that survives.

**`playwright-bdd` instead of raw `@cucumber/cucumber`.**
Rationale: executes the existing/extended `.feature` file for real (unlike today, where it's unwired prose) while keeping a single test runner (Playwright) and a single CI step, instead of maintaining two separate test frameworks/configs.

## Risks / Trade-offs

- [Risk] Rounding Snatch to a whole kg in split suggestions could feel arbitrary for lbs-only users. → Mitigation: suggestions always display both kg and lbs; the user can hand-edit after clicking.
- [Risk] `localStorage` is per-browser/per-device, so "persistent across sessions" does not mean cross-device. → Mitigation: acceptable per proposal scope (no account/backend requested); noted here so it isn't mistaken for a bug later.
- [Risk] Moving Playwright off `file://` onto a local `webServer` changes how tests are run locally (`npm test` now starts a server). → Mitigation: `scripts/serve.js` is a ~15-line zero-dependency static server; Playwright's `webServer` option starts/stops it automatically, so `npm test` remains a single command.

## Migration Plan

1. Build and unit-test `calculator.js` in isolation before touching any HTML.
2. Rewrite `index.html`/`app.js` behind the existing `Calculate` button contract so current E2E assertions mostly still apply; update assertions that reference removed inline markup.
3. Delete `weightlifting-calculator.html` only after the Playwright config points at the served `index.html`.
4. Land CI (`ci.yml`) before wiring `deploy.yml` to depend on it, so a red test suite can be observed and fixed without blocking deploys prematurely.
5. No data migration needed (no prior persistence existed).
