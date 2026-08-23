## MODIFIED Requirements

### Requirement: Total-based split suggestions
The system SHALL accept a competition Total (kg) and, from it, generate 3-5 realistic Snatch/Clean & Jerk split suggestions, each of which sums exactly back to the entered Total.

#### Scenario: Entering a Total generates suggestions
- **WHEN** a user enters a numeric value into the Total field
- **THEN** the system displays 3-5 split suggestion options, each showing a distinct Snatch/Clean & Jerk percentage split and the resulting Snatch and Clean & Jerk weights in both kg and lbs

#### Scenario: Suggested splits are realistic
- **WHEN** the system generates split suggestions for a Total
- **THEN** each suggestion's Snatch share of the Total SHALL fall within a realistic competitive range (approximately 42%-46% of Total)
