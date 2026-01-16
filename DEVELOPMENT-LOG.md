# Weightlifting Calculator - Development Log

## Steps Taken

1. **Created HTML calculator** (`weightlifting-calculator.html`)
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

## Project Structure

```
C:\Users\nielm\weightlifting-calculator\
├── weightlifting-calculator.html
├── package.json
├── playwright.config.js
├── features/
│   └── weightlifting-calculator.feature
└── tests/
    └── weightlifting-calculator.spec.js
```

## Commands

- **Run app**: `start weightlifting-calculator.html`
- **Run tests**: `npm test`
- **URL**: `file:///C:/Users/nielm/weightlifting-calculator/weightlifting-calculator.html`
