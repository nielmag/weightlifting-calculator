# weightlifting-calculator Specification

## Purpose
Lets a weightlifter enter their Snatch, Clean & Jerk, or competition Total in either kg or lbs and get accurate, unit-converted 1RM estimates, realistic split suggestions, and training percentage tables, with entries preserved across sessions.

## Requirements

### Requirement: Unit conversion
The system SHALL convert any entered weight between kilograms and pounds using the factors 1 kg = 2.20462 lbs, and SHALL display converted results to one decimal place.

#### Scenario: Convert lbs input to kg for calculation
- **WHEN** a user enters a Snatch or Clean & Jerk value with unit "lbs"
- **THEN** the system converts it to kilograms before performing any calculation

#### Scenario: Display a weight in both units
- **WHEN** the system displays a computed weight (Total, Snatch, Clean & Jerk, or an accessory lift)
- **THEN** it shows the value in both kg and lbs simultaneously

### Requirement: Snatch and Clean & Jerk 1RM entry
The system SHALL accept independent Snatch and Clean & Jerk 1RM values, each with its own unit selector (kg or lbs).

#### Scenario: Enter lifts in different units
- **WHEN** a user enters Snatch in kg and Clean & Jerk in lbs
- **THEN** the system correctly computes results using both values converted to a common unit

#### Scenario: Missing or invalid lift values
- **WHEN** a user requests a calculation without valid numeric values for both Snatch and Clean & Jerk
- **THEN** the system SHALL show a validation message and SHALL NOT produce a calculation

### Requirement: Accessory lift derivation
The system SHALL derive estimated 1RMs for Front Squat (120% of Clean & Jerk), Back Squat (130% of Clean & Jerk), Clean Pull (130% of Clean & Jerk), and Snatch Pull (130% of Snatch) whenever Snatch and Clean & Jerk are known.

#### Scenario: Accessory lifts computed from lifts
- **WHEN** a user has entered a valid Snatch and Clean & Jerk and requests a calculation
- **THEN** the system displays Front Squat, Back Squat, Clean Pull, and Snatch Pull 1RM estimates in both kg and lbs

### Requirement: Training percentage tables
For each computed 1RM (Snatch, Clean & Jerk, and each accessory lift), the system SHALL display a percentage table from 60% to 95% in 5% increments, in both kg and lbs.

#### Scenario: Percentage table range
- **WHEN** a 1RM is computed for any lift
- **THEN** the system shows rows for 60%, 65%, 70%, 75%, 80%, 85%, 90%, and 95% of that 1RM

### Requirement: Total-based split suggestions
The system SHALL accept a competition Total (kg) and, from it, generate 3-4 realistic Snatch/Clean & Jerk split suggestions, each of which sums exactly back to the entered Total.

#### Scenario: Entering a Total generates suggestions
- **WHEN** a user enters a numeric value into the Total field
- **THEN** the system displays 3-4 split suggestion options, each showing a distinct Snatch/Clean & Jerk percentage split and the resulting Snatch and Clean & Jerk weights in both kg and lbs

#### Scenario: Suggested splits are realistic
- **WHEN** the system generates split suggestions for a Total
- **THEN** each suggestion's Snatch share of the Total SHALL fall within a realistic competitive range (approximately 43%-46% of Total)

### Requirement: Click-to-fill from a suggestion
The system SHALL let a user select one split suggestion to populate the Snatch and Clean & Jerk fields, which remain editable afterward.

#### Scenario: Selecting a suggestion fills the lift fields
- **WHEN** a user clicks one of the displayed split suggestions
- **THEN** the system populates the Snatch and Clean & Jerk fields with that suggestion's values in kg
- **AND** the user can subsequently edit either field by hand

### Requirement: Bidirectional Total and lift synchronization
The system SHALL keep the Total consistent with the Snatch and Clean & Jerk fields: editing either lift directly recomputes the displayed Total. The Total field SHALL remain directly editable at all times, regardless of whether its current value was typed by the user or derived from Snatch/Clean & Jerk.

#### Scenario: Editing a lift updates the Total
- **WHEN** a user directly edits the Snatch or Clean & Jerk value or unit after lift values are present
- **THEN** the system recomputes and displays the Total as the sum of the two lifts, in both kg and lbs

#### Scenario: Returning to Total entry
- **WHEN** a user types a new value directly into the Total field, even though it currently shows a value derived from Snatch/Clean & Jerk
- **THEN** the system accepts the new value without requiring any unlock step, and re-generates split suggestions from it
- **AND** the existing Snatch and Clean & Jerk field values are left unchanged until the user selects a new suggestion or edits them directly

### Requirement: Cross-session persistence
The system SHALL persist the current Total, Snatch, Clean & Jerk values, their unit selections, and which field is driving the calculation, so that reopening the app restores the last-entered state until the user changes it.

#### Scenario: Values survive a page reload
- **WHEN** a user has entered values and then reloads or reopens the page in the same browser
- **THEN** the previously entered Total, Snatch, Clean & Jerk, and unit selections are restored exactly as they were left

#### Scenario: No prior data
- **WHEN** a user opens the app for the first time with no previously stored data, or storage is unavailable
- **THEN** the system starts with empty input fields and does not raise an error
