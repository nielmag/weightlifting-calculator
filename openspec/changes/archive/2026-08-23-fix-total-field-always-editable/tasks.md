## 1. Remove the Total-field lock

- [x] 1.1 In `app.js`, remove `totalMode`, `setMode`, `onEditTotalClick`, and the `els.editTotalBtn` reference; simplify `onTotalInput` to always regenerate split suggestions and `onLiftInput` to always overwrite the Total field's value without setting `readonly`; verify manually that the Total field never gets a `readonly` attribute.
- [x] 1.2 In `index.html`, remove the `#editTotalBtn` button and its now-unused `.edit-total-link`/`input:read-only` CSS; verify the page still renders correctly with no console errors.
- [x] 1.3 Bump the persistence schema key to `weightlifting-calculator:v2` and drop the `totalMode` field from the saved/restored state shape in `app.js`; verify save/restore round-trips correctly and an old `v1` record is treated as absent (blank start, no error).

## 2. Update tests

- [x] 2.1 Update `tests/weightlifting-calculator.spec.js`: remove the readonly assertions from the `@click-to-fill` and `@bidirectional` tests, and replace the "Edit Total instead" test with one asserting a new Total can be typed directly (with lift values still visible) after lifts derived a Total; verify `npm run test:e2e` passes.
- [x] 2.2 Update `features/weightlifting-calculator.feature` and `features/steps/weightlifting-calculator.steps.js` to match (remove read-only/editable steps and the "Edit Total instead" scenario, add a scenario that types a new Total after lifts were set and confirms new suggestions render); verify `npx bddgen && npx playwright test` passes.

## 3. Verify and archive

- [x] 3.1 Manually verify in a browser: enter lifts → Total shows derived value and is NOT readonly → type a new Total directly → new split suggestions appear → existing lift values unchanged until a suggestion is clicked.
- [x] 3.2 Run `npm test` (unit + e2e + bdd) and confirm all pass.
- [x] 3.3 Run `openspec validate fix-total-field-always-editable --strict` and fix any issues; then run `openspec archive fix-total-field-always-editable --yes` to merge the spec delta.
