## Context

See proposal.md - Why. A simple data addition to the existing `SPLIT_RATIOS` table in `calculator.js`; no architectural change.

## Goals / Non-Goals

**Goals:**
- Add a 42%/58% split option without disturbing the existing 4 options or the split-generation logic.

**Non-Goals:**
- No change to the split-generation algorithm, rounding behavior, or UI layout beyond accommodating a 5th card.

## Decisions

**Insert the new option at the front of `SPLIT_RATIOS`** (lowest Snatch share first), with `id: 'cnj-heavy'`, `label: 'C&J-Heavy'`, `snatchPct: 0.42`.
Rationale: keeps the array's existing ordering convention (ascending Snatch share) so cards render from most C&J-dominant to most Snatch-dominant, consistent with how "C&J-Dominant" (43%) through "Snatch-Dominant" (46%) are already ordered.

## Risks / Trade-offs

- [Risk] Any test or UI assumption hard-coding "4 split cards" needs updating to 5. → Mitigation: covered directly in tasks.md.
