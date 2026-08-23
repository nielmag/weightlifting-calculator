## 1. Calculation module

- [x] 1.1 Create `calculator.js` as a dependency-free UMD module with `toKg`, `kgToLbs`, `bothUnits`, `calculateTotalKg`, `calculateAccessoryLifts`, `generatePercentageTable`, and `SPLIT_RATIOS`/`generateSplitSuggestions`; verify it loads via both `require()` and as a browser `<script>` global (`window.WLCalc`).
- [x] 1.2 Create `tests/unit/calculator.test.js` using `node:test`/`node:assert` covering unit conversion, accessory-lift ratios, percentage-table range (60-95 step 5), and that every `generateSplitSuggestions` entry sums exactly back to the input total; verify `node --test tests/unit/` passes.

## 2. Static server and Playwright config

- [x] 2.1 Add `scripts/serve.js`, a minimal `node:http`/`node:fs` static file server; verify it serves `index.html` on a local port.
- [x] 2.2 Update `playwright.config.js` to add a `webServer` (running `scripts/serve.js`) and `baseURL`; verify `npx playwright test` can reach the app without a `file://` path.

## 3. App UI and state machine

- [x] 3.1 Rewrite `index.html`: add the Total input, both-units readouts next to Total/Snatch/Clean & Jerk, and a suggestion-card container; keep existing summary-table/lift-card markup; reference `calculator.js` and `app.js` via `<script src>` instead of inline JS; verify the page renders with no console errors.
- [x] 3.2 Create `app.js` implementing the `totalMode: 'input' | 'derived'` state machine from design.md: Total input renders split suggestions live; clicking a suggestion fills Snatch/Clean & Jerk and locks Total; editing Snatch/Clean & Jerk recomputes and displays Total; an "Edit Total instead" control unlocks Total; verify manually in a browser that both flows work end-to-end.
- [x] 3.3 Keep the existing `Calculate` button behavior (accessory lifts + percentage tables) working against `calculator.js`'s data-returning functions; verify existing example values (e.g. Snatch 65.8kg/C&J 89.8kg → Front Squat 107.8kg) still match.
- [x] 3.4 Delete `weightlifting-calculator.html`; verify no remaining references to it in tests, config, or docs.

## 4. Persistence

- [x] 4.1 Implement `localStorage` read/write in `app.js` using the `weightlifting-calculator:v1` schema from design.md, guarded with `try/catch` and a `typeof localStorage` check; verify values round-trip through a save/reload cycle in a browser.
- [x] 4.2 On `DOMContentLoaded`, restore all fields and `totalMode` (including Total's `readonly` state) and auto-run the calculation if Snatch and Clean & Jerk are both present; verify a reload after entering data reproduces the exact prior UI state.

## 5. E2E and BDD tests

- [x] 5.1 Update `tests/weightlifting-calculator.spec.js` to `page.goto('/index.html')` against the new `baseURL`; verify existing test cases pass against the rewritten app.
- [x] 5.2 Add new Playwright cases: N split cards render from a Total; clicking a card fills Snatch/Clean & Jerk and locks Total; editing a lift unlocks/recomputes Total; values survive `page.reload()`; verify all new cases pass.
- [x] 5.3 Add `playwright-bdd` devDependency and remove the unused `@cucumber/cucumber` devDependency from `package.json`; verify `npm install` succeeds.
- [x] 5.4 Wire `playwright-bdd`'s `defineBddConfig` into `playwright.config.js` as a second test project; create `features/steps/weightlifting-calculator.steps.js` with step definitions for existing scenarios; verify `npx bddgen && npx playwright test` runs the generated BDD tests.
- [x] 5.5 Extend `features/weightlifting-calculator.feature` with `@total-suggestions`, `@click-to-fill`, `@bidirectional`, and `@persistence` scenarios, plus matching step definitions; verify they pass.
- [x] 5.6 Update `package.json` scripts (`test`, `test:unit`, `test:e2e`, `test:headed`); verify `npm test` runs unit, BDD, and E2E tests in sequence and passes.

## 6. CI/CD

- [x] 6.1 Add `.github/workflows/ci.yml` with `unit-tests` and `e2e-and-bdd-tests` jobs (the latter depending on the former), uploading the Playwright report as an artifact on failure; verify the workflow is valid YAML and mirrors the local `npm test` steps.
- [x] 6.2 Update `.github/workflows/deploy.yml` to add a `test` job that calls `ci.yml` via `workflow_call`, make `deploy` depend on it, and curate the Pages upload to only `index.html`, `calculator.js`, and `app.js`; verify the workflow file is valid YAML.

## 7. Documentation and archive

- [x] 7.1 Update `DEVELOPMENT-LOG.md` to describe the new Total-entry/split-suggestion/persistence functionality, the new file layout, and the OpenSpec workflow; verify it accurately reflects the final project structure.
- [x] 7.2 Run `openspec validate add-total-based-calculator --strict` and fix any reported issues; verify it passes.
- [x] 7.3 After all above tasks are complete and tests pass, run `openspec archive add-total-based-calculator` to merge the spec delta into `openspec/specs/` and move the change to the archive; verify `openspec list --specs` shows the `weightlifting-calculator` capability.
