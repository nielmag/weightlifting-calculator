## MODIFIED Requirements

### Requirement: Bidirectional Total and lift synchronization
The system SHALL keep the Total consistent with the Snatch and Clean & Jerk fields: editing either lift directly recomputes the displayed Total. The Total field SHALL remain directly editable at all times, regardless of whether its current value was typed by the user or derived from Snatch/Clean & Jerk.

#### Scenario: Editing a lift updates the Total
- **WHEN** a user directly edits the Snatch or Clean & Jerk value or unit after lift values are present
- **THEN** the system recomputes and displays the Total as the sum of the two lifts, in both kg and lbs

#### Scenario: Returning to Total entry
- **WHEN** a user types a new value directly into the Total field, even though it currently shows a value derived from Snatch/Clean & Jerk
- **THEN** the system accepts the new value without requiring any unlock step, and re-generates split suggestions from it
- **AND** the existing Snatch and Clean & Jerk field values are left unchanged until the user selects a new suggestion or edits them directly
