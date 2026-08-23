## Why

The user asked for an additional split option: 42% Snatch / 58% Clean & Jerk, extending the C&J-dominant end of the realistic split range so it's covered alongside the existing 43-46% options.

## What Changes

- Add a fifth split suggestion with Snatch at 42% of Total (Clean & Jerk at 58%), labeled "C&J-Heavy", ordered before the existing "C&J-Dominant" (43%) option.
- Split suggestions now number 5 (previously 3-4), spanning 42%-46% Snatch share of Total.

## Capabilities

### Modified Capabilities
- `weightlifting-calculator`: the "Total-based split suggestions" requirement changes — the count and realistic range of generated splits widen to include 42%.

## Impact

- Affected files: `calculator.js` (`SPLIT_RATIOS`), `tests/unit/calculator.test.js`, `tests/weightlifting-calculator.spec.js`, `features/weightlifting-calculator.feature`.
