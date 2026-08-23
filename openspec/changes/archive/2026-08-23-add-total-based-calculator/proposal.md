## Why

Today the calculator only works in one direction: a lifter must already know both their Snatch and Clean & Jerk 1RMs before it can compute anything. There's no way to start from a target competition Total (e.g. "I want to total 152kg") and see realistic Snatch/C&J splits to aim for. The app also has no persistence — every page reload discards whatever was entered, forcing re-entry every session. This change adds Total-driven entry with realistic split suggestions, bidirectional sync between Total and the individual lifts, and cross-session persistence, while keeping all existing one-rep-max and percentage-table functionality intact.

## What Changes

- Add a new Total input (kg) above the existing Snatch/C&J inputs.
- Entering a Total generates 3-4 realistic Snatch/C&J split suggestions (e.g. ~43/57, ~44/56, ~45/55, ~46/54), each shown in both kg and lbs.
- Clicking a suggestion fills the Snatch and Clean & Jerk fields with that split (still hand-editable afterward).
- Editing Snatch and/or Clean & Jerk directly recomputes and displays the Total live, in both kg and lbs.
- All three fields (Total, Snatch, Clean & Jerk) and their unit selections persist across browser sessions via localStorage, restoring on next visit until changed.
- Existing accessory-lift (Front Squat, Back Squat, Clean Pull, Snatch Pull) and 60-95% percentage-table calculations are unchanged in behavior.
- **BREAKING**: The calculation logic and HTML structure are refactored (inline `<script>` extracted into `calculator.js` + `app.js`; `weightlifting-calculator.html` is removed in favor of a single canonical `index.html`). No user-facing capability is removed, but the file layout changes.

## Capabilities

### New Capabilities
- `weightlifting-calculator`: Snatch/C&J-based 1RM and training-percentage calculation, Total-based split suggestions, bidirectional Total/lift sync, unit conversion (kg/lbs), and cross-session persistence of entered values.

### Modified Capabilities
(none — this is the first spec-driven change for this project; there are no existing `openspec/specs/` entries yet)

## Impact

- Affected files: `index.html` (rewritten), `weightlifting-calculator.html` (removed), new `calculator.js` and `app.js`, `tests/weightlifting-calculator.spec.js` (retargeted), new `tests/unit/calculator.test.js`, `features/weightlifting-calculator.feature` (extended) and new `features/steps/*.steps.js`, `playwright.config.js`, `package.json`, `.github/workflows/ci.yml` (new), `.github/workflows/deploy.yml` (updated).
- No backend/server is introduced; the app remains a static site deployed to GitHub Pages.
- New dependency: `playwright-bdd` (dev). Removed dependency: `@cucumber/cucumber` (was unused).
