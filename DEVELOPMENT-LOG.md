# Weightlifting Calculator - Development Log

## Steps Taken

1. **Created HTML calculator** (`weightlifting-calculator.html`, later consolidated into `index.html`)
   - Input fields for Snatch and Clean & Jerk 1RM (kg/lbs)
   - Calculates estimated 1RMs for Front Squat, Back Squat, Clean Pull, Snatch Pull
   - Displays training percentages from 60% to 95%

2. **Ratios Used**
   - Front Squat: 120% of Clean & Jerk
   - Back Squat: 130% of Clean & Jerk
   - Clean Pull: 130% of Clean & Jerk
   - Snatch Pull: 130% of Snatch

3. **Added Summary Table** - Shows all 1RMs at top of page with Total

4. **Created Gherkin Feature Files** (`features/weightlifting-calculator.feature`)

5. **Created Playwright Automated Tests** (`tests/weightlifting-calculator.spec.js`)

6. **Added Total-based split suggestions, persistence, and a full test/CI pipeline** (this change, tracked as an OpenSpec change: `openspec/changes/add-total-based-calculator/`, now archived into `openspec/specs/weightlifting-calculator/spec.md`)
   - Extracted all calculation logic into a dependency-free `calculator.js` module (usable both as a browser `<script>` and via Node's `require()`), and moved DOM/state/persistence logic into `app.js`
   - Added a Total (kg) field: entering a value generates 4 realistic Snatch/Clean & Jerk split suggestions (~43-46% Snatch share of Total), each shown in both kg and lbs
   - Clicking a suggestion fills the Snatch/Clean & Jerk fields and locks the Total field; editing Snatch/Clean & Jerk directly recomputes the Total live
   - All entered values (Total, Snatch, Clean & Jerk, units, and which field is driving the calculation) persist across browser sessions via `localStorage`
   - Consolidated `index.html` and `weightlifting-calculator.html` into a single canonical `index.html`
   - Added unit tests (`tests/unit/calculator.test.js`, via Node's built-in `node:test`) and wired up real BDD execution of the `.feature` file via `playwright-bdd` (replacing the previously-unused `@cucumber/cucumber` dependency)
   - Added a CI workflow (`.github/workflows/ci.yml`) running unit, E2E, and BDD tests, and gated the Pages deploy workflow on it

## Project Structure

```
C:\Users\nielm\weightlifting-calculator\
├── index.html
├── calculator.js
├── app.js
├── scripts/
│   └── serve.js
├── package.json
├── playwright.config.js
├── openspec/
│   ├── config.yaml
│   ├── specs/
│   │   └── weightlifting-calculator/spec.md
│   └── changes/
├── features/
│   ├── weightlifting-calculator.feature
│   └── steps/
│       └── weightlifting-calculator.steps.js
├── tests/
│   ├── unit/
│   │   └── calculator.test.js
│   └── weightlifting-calculator.spec.js
└── .github/workflows/
    ├── ci.yml
    └── deploy.yml
```

## Commands

- **Run app**: `node scripts/serve.js` then open `http://localhost:4173`
- **Run all tests**: `npm test` (unit tests, then Playwright E2E + BDD)
- **Run unit tests only**: `npm run test:unit`
- **Run E2E/BDD tests only**: `npm run test:e2e`
- **OpenSpec workflow**: change proposals live in `openspec/changes/`; see `openspec/specs/weightlifting-calculator/spec.md` for the current behavior contract
