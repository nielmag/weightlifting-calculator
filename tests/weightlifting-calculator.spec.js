const { test, expect } = require('@playwright/test');
const path = require('path');

const PAGE_URL = `file://${path.resolve(__dirname, '../weightlifting-calculator.html')}`;

test.describe('Weightlifting Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
  });

  test.describe('@input - Input handling', () => {
    test('Enter Snatch and Clean & Jerk in kilograms', async ({ page }) => {
      await page.fill('#snatch', '65.8');
      await page.selectOption('#snatchUnit', 'kg');
      await page.fill('#cnj', '89.8');
      await page.selectOption('#cnjUnit', 'kg');
      await page.click('button');

      await expect(page.locator('#summaryTable')).toBeVisible();
      await expect(page.locator('.lift-card')).toHaveCount(6);
    });

    test('Enter Snatch and Clean & Jerk in pounds', async ({ page }) => {
      await page.fill('#snatch', '145');
      await page.selectOption('#snatchUnit', 'lbs');
      await page.fill('#cnj', '198');
      await page.selectOption('#cnjUnit', 'lbs');
      await page.click('button');

      await expect(page.locator('#summaryTable')).toBeVisible();
      await expect(page.locator('.lift-card')).toHaveCount(6);
    });

    test('Mix units for Snatch and Clean & Jerk', async ({ page }) => {
      await page.fill('#snatch', '65.8');
      await page.selectOption('#snatchUnit', 'kg');
      await page.fill('#cnj', '198');
      await page.selectOption('#cnjUnit', 'lbs');
      await page.click('button');

      await expect(page.locator('#summaryTable')).toBeVisible();
    });
  });

  test.describe('@validation - Input validation', () => {
    test('Show error when inputs are empty', async ({ page }) => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('Please enter valid numbers for both lifts');
        await dialog.accept();
      });
      await page.click('button');
    });
  });

  test.describe('@calculations - 1RM calculations', () => {
    const testCases = [
      { snatch: 65.8, cnj: 89.8, frontSquat: 107.8, backSquat: 116.7, cleanPull: 116.7, snatchPull: 85.5 },
      { snatch: 100, cnj: 120, frontSquat: 144.0, backSquat: 156.0, cleanPull: 156.0, snatchPull: 130.0 },
      { snatch: 80, cnj: 100, frontSquat: 120.0, backSquat: 130.0, cleanPull: 130.0, snatchPull: 104.0 },
    ];

    for (const tc of testCases) {
      test(`Calculate 1RMs for Snatch ${tc.snatch}kg, C&J ${tc.cnj}kg`, async ({ page }) => {
        await page.fill('#snatch', tc.snatch.toString());
        await page.fill('#cnj', tc.cnj.toString());
        await page.click('button');

        const summaryText = await page.locator('#summaryTable').textContent();
        expect(summaryText).toContain(tc.frontSquat.toFixed(1));
        expect(summaryText).toContain(tc.backSquat.toFixed(1));
        expect(summaryText).toContain(tc.cleanPull.toFixed(1));
        expect(summaryText).toContain(tc.snatchPull.toFixed(1));
      });
    }

    test('Calculate total from Snatch and Clean & Jerk', async ({ page }) => {
      await page.fill('#snatch', '65.8');
      await page.fill('#cnj', '89.8');
      await page.click('button');

      const summaryText = await page.locator('#summaryTable').textContent();
      expect(summaryText).toContain('155.6');
    });
  });

  test.describe('@conversions - Unit conversions', () => {
    test('Display weights in both kg and lbs', async ({ page }) => {
      await page.fill('#snatch', '100');
      await page.fill('#cnj', '120');
      await page.click('button');

      const summaryText = await page.locator('#summaryTable').textContent();
      expect(summaryText).toContain('100.0');
      expect(summaryText).toContain('220.5');
      expect(summaryText).toContain('120.0');
      expect(summaryText).toContain('264.6');
    });
  });

  test.describe('@percentages - Training percentages', () => {
    test('Display training percentages from 60% to 95%', async ({ page }) => {
      await page.fill('#snatch', '100');
      await page.fill('#cnj', '120');
      await page.click('button');

      const percentages = ['60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%'];
      const firstLiftCard = page.locator('.lift-card').first();
      
      for (const pct of percentages) {
        await expect(firstLiftCard).toContainText(pct);
      }
    });

    test('Verify 60% and 95% for Snatch', async ({ page }) => {
      await page.fill('#snatch', '100');
      await page.fill('#cnj', '120');
      await page.click('button');

      const snatchCard = page.locator('.lift-card').first();
      const cardText = await snatchCard.textContent();
      expect(cardText).toContain('60.0');
      expect(cardText).toContain('95.0');
    });

    const percentageTests = [
      { percentage: 60, lift: 'Snatch', expectedKg: '60.0', expectedLbs: '132.3' },
      { percentage: 75, lift: 'Snatch', expectedKg: '75.0', expectedLbs: '165.3' },
      { percentage: 90, lift: 'Snatch', expectedKg: '90.0', expectedLbs: '198.4' },
    ];

    for (const tc of percentageTests) {
      test(`Verify ${tc.percentage}% for ${tc.lift}`, async ({ page }) => {
        await page.fill('#snatch', '100');
        await page.fill('#cnj', '120');
        await page.click('button');

        const snatchCard = page.locator('.lift-card').first();
        const cardText = await snatchCard.textContent();
        expect(cardText).toContain(tc.expectedKg);
        expect(cardText).toContain(tc.expectedLbs);
      });
    }
  });

  test.describe('@ui - Summary table UI', () => {
    test('Summary table displays all lifts with ratio labels', async ({ page }) => {
      await page.fill('#snatch', '65.8');
      await page.fill('#cnj', '89.8');
      await page.click('button');

      const summaryText = await page.locator('#summaryTable').textContent();
      expect(summaryText).toContain('Front Squat (120% C&J)');
      expect(summaryText).toContain('Back Squat (130% C&J)');
      expect(summaryText).toContain('Clean Pull (130% C&J)');
      expect(summaryText).toContain('Snatch Pull (130% Sn)');
    });
  });
});
