## Why

Real usage after deploying the Total-suggestions feature surfaced a usability bug: once the Total field becomes `readonly` (either because the user edited Snatch/Clean & Jerk directly, or restored a persisted session in that state), there is no obvious way to enter a *new* Total — the "Edit Total instead" affordance is easy to miss and adds an extra click for something that should just work. The user should always be able to type a new Total directly, regardless of how the current values got there.

## What Changes

- **BREAKING** (behavior, not data): The Total field is never made `readonly`. It is always directly editable.
- Typing into the Total field always (re)generates split suggestions for the new value, regardless of how the current Snatch/Clean & Jerk values were populated.
- Editing Snatch or Clean & Jerk still recomputes and overwrites the Total field's displayed value, but no longer locks it — the user can immediately type over it to start a new Total-based search.
- Remove the "Edit Total instead" control and the `totalMode` state machine; the two flows (Total → suggestions → click-to-fill, and Lift edits → recomputed Total) coexist without a lock.
- Persistence schema drops the no-longer-relevant `totalMode` field.

## Capabilities

### Modified Capabilities
- `weightlifting-calculator`: the "Bidirectional Total and lift synchronization" requirement changes — the Total field is no longer locked/read-only in any state.

## Impact

- Affected files: `app.js` (remove `totalMode`/lock logic), `index.html` (remove the "Edit Total instead" button/link), `tests/weightlifting-calculator.spec.js`, `features/weightlifting-calculator.feature`, `features/steps/weightlifting-calculator.steps.js`.
- No persistence data migration needed beyond the existing version-guard (old `v1` records simply won't match if the schema version is bumped, and the app starts blank — same as the documented "No prior data" scenario).
