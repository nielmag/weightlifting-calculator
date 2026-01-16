Feature: Weightlifting Calculator
  As a weightlifter
  I want to calculate my estimated 1RMs and training percentages
  So that I can plan my training effectively

  Background:
    Given I am on the weightlifting calculator page

  @input
  Scenario: Enter Snatch and Clean & Jerk in kilograms
    When I enter "65.8" for my Snatch 1RM in "kg"
    And I enter "89.8" for my Clean & Jerk 1RM in "kg"
    And I click the Calculate button
    Then I should see the summary table with my 1RMs
    And I should see training percentage tables for all lifts

  @input
  Scenario: Enter Snatch and Clean & Jerk in pounds
    When I enter "145" for my Snatch 1RM in "lbs"
    And I enter "198" for my Clean & Jerk 1RM in "lbs"
    And I click the Calculate button
    Then I should see the summary table with my 1RMs
    And I should see training percentage tables for all lifts

  @input
  Scenario: Mix units for Snatch and Clean & Jerk
    When I enter "65.8" for my Snatch 1RM in "kg"
    And I enter "198" for my Clean & Jerk 1RM in "lbs"
    And I click the Calculate button
    Then I should see the summary table with my 1RMs

  @validation
  Scenario: Show error when inputs are empty
    When I leave the Snatch 1RM field empty
    And I leave the Clean & Jerk 1RM field empty
    And I click the Calculate button
    Then I should see an error message "Please enter valid numbers for both lifts"

  @calculations
  Scenario Outline: Calculate estimated 1RMs based on competition lifts
    Given I enter "<snatch>" for my Snatch 1RM in "kg"
    And I enter "<cnj>" for my Clean & Jerk 1RM in "kg"
    When I click the Calculate button
    Then the Front Squat 1RM should be "<front_squat>" kg
    And the Back Squat 1RM should be "<back_squat>" kg
    And the Clean Pull 1RM should be "<clean_pull>" kg
    And the Snatch Pull 1RM should be "<snatch_pull>" kg

    Examples:
      | snatch | cnj  | front_squat | back_squat | clean_pull | snatch_pull |
      | 65.8   | 89.8 | 107.8       | 116.7      | 116.7      | 85.5        |
      | 100    | 120  | 144.0       | 156.0      | 156.0      | 130.0       |
      | 80     | 100  | 120.0       | 130.0      | 130.0      | 104.0       |

  @calculations
  Scenario: Calculate total from Snatch and Clean & Jerk
    Given I enter "65.8" for my Snatch 1RM in "kg"
    And I enter "89.8" for my Clean & Jerk 1RM in "kg"
    When I click the Calculate button
    Then the Total should be "155.6" kg

  @conversions
  Scenario: Display weights in both kg and lbs
    Given I enter "100" for my Snatch 1RM in "kg"
    And I enter "120" for my Clean & Jerk 1RM in "kg"
    When I click the Calculate button
    Then I should see the Snatch displayed as "100.0" kg and "220.5" lbs
    And I should see the Clean & Jerk displayed as "120.0" kg and "264.6" lbs

  @percentages
  Scenario: Display training percentages from 60% to 95%
    Given I enter "100" for my Snatch 1RM in "kg"
    And I enter "120" for my Clean & Jerk 1RM in "kg"
    When I click the Calculate button
    Then I should see percentage rows for 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%
    And the 60% row for Snatch should show "60.0" kg
    And the 95% row for Snatch should show "95.0" kg

  @percentages
  Scenario Outline: Verify training percentage calculations
    Given I enter "100" for my Snatch 1RM in "kg"
    And I enter "120" for my Clean & Jerk 1RM in "kg"
    When I click the Calculate button
    Then the <percentage>% row for <lift> should show "<expected_kg>" kg and "<expected_lbs>" lbs

    Examples:
      | percentage | lift         | expected_kg | expected_lbs |
      | 60         | Snatch       | 60.0        | 132.3        |
      | 75         | Snatch       | 75.0        | 165.3        |
      | 90         | Snatch       | 90.0        | 198.4        |
      | 60         | Clean & Jerk | 72.0        | 158.7        |
      | 80         | Clean & Jerk | 96.0        | 211.6        |
      | 60         | Front Squat  | 86.4        | 190.5        |
      | 80         | Back Squat   | 124.8       | 275.1        |

  @ui
  Scenario: Summary table displays all lifts with ratio labels
    Given I enter "65.8" for my Snatch 1RM in "kg"
    And I enter "89.8" for my Clean & Jerk 1RM in "kg"
    When I click the Calculate button
    Then I should see "Front Squat (120% C&J)" in the summary table
    And I should see "Back Squat (130% C&J)" in the summary table
    And I should see "Clean Pull (130% C&J)" in the summary table
    And I should see "Snatch Pull (130% Sn)" in the summary table
