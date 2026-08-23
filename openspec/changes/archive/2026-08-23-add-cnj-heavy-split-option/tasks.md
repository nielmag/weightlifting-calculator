## 1. Add the split option

- [x] 1.1 Add `{ id: 'cnj-heavy', label: 'C&J-Heavy', snatchPct: 0.42 }` to the front of `SPLIT_RATIOS` in `calculator.js`; verify `generateSplitSuggestions` now returns 5 entries in ascending Snatch-share order.

## 2. Update tests

- [x] 2.1 Update `tests/unit/calculator.test.js`: bump the expected suggestion count to 5 and widen the realistic-range assertion to 0.42-0.46; verify `npm run test:unit` passes.
- [x] 2.2 Update `tests/weightlifting-calculator.spec.js` and `features/weightlifting-calculator.feature` (and any step text with a hard-coded count) to expect 5 split cards; verify `npm test` passes.

## 3. Verify and archive

- [x] 3.1 Manually verify in a browser: entering a Total shows 5 split cards including a 42%/58% "C&J-Heavy" option that sums back to the Total.
- [x] 3.2 Run `npm test` and confirm all pass.
- [x] 3.3 Run `openspec validate add-cnj-heavy-split-option --strict`, then `openspec archive add-cnj-heavy-split-option --yes`.
