## Context

See proposal.md - Why. The original design (see the archived `add-total-based-calculator` change) used a `totalMode: 'input' | 'derived'` flag to make the Total field `readonly` whenever it reflected Snatch+Clean & Jerk, with an "Edit Total instead" control to unlock it. That lock is the reported friction.

## Goals / Non-Goals

**Goals:**
- Total field is always directly editable, no unlock step.
- Keep both existing flows working: Total → suggestions → click-to-fill, and Lift edits → recomputed Total.

**Non-Goals:**
- No change to the split-ratio math, persistence mechanism (still `localStorage`), or accessory-lift/percentage-table behavior.

## Decisions

**Drop the `totalMode` state machine entirely** rather than keeping it and just changing whether `readonly` gets applied.
Rationale: the mode flag's only purpose was gating the `readonly` attribute and showing/hiding the "Edit Total instead" button. With no lock, there's nothing left for it to gate — the Total input handler can simply always regenerate suggestions on input, and the lift input handler can simply always overwrite the Total field's value (a plain `.value` assignment doesn't fire an `input` event, so it can't loop back into the Total handler). Keeping the flag around unused would be dead state.

**Bump the persistence schema to `weightlifting-calculator:v2`** and drop the `totalMode` key.
Rationale: `totalMode` is meaningless now; simplest to bump the version so any old `v1` record (which the loader already guards on `version !== N`) is treated as absent, falling back to the existing documented "No prior data" scenario rather than trying to interpret a stale field.

## Risks / Trade-offs

- [Risk] Users with an existing `v1` localStorage record lose their previously saved values on first load after this update (version guard treats it as absent). → Mitigation: acceptable one-time reset; the app has only been live briefly, and starting blank is a safe, already-specified fallback (no error, no stale/incorrect data shown).
