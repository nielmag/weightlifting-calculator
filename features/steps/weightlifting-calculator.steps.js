const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');

const { Given, When, Then } = createBdd();

Given('I am on the weightlifting calculator page', async ({ page }) => {
  page.on('dialog', async (dialog) => {
    page.__lastDialogMessage = dialog.message();
    await dialog.accept();
  });
  await page.goto('/index.html');
});

When('I enter {string} for my Snatch 1RM in {string}', async ({ page }, value, unit) => {
  await page.fill('#snatch', value);
  await page.selectOption('#snatchUnit', unit);
});

When('I enter {string} for my Clean & Jerk 1RM in {string}', async ({ page }, value, unit) => {
  await page.fill('#cnj', value);
  await page.selectOption('#cnjUnit', unit);
});

When('I leave the Snatch 1RM field empty', async ({ page }) => {
  await page.fill('#snatch', '');
});

When('I leave the Clean & Jerk 1RM field empty', async ({ page }) => {
  await page.fill('#cnj', '');
});

When('I click the Calculate button', async ({ page }) => {
  await page.click('button:has-text("Calculate")');
});

Then('I should see the summary table with my 1RMs', async ({ page }) => {
  await expect(page.locator('#summaryTable')).toBeVisible();
});

Then('I should see training percentage tables for all lifts', async ({ page }) => {
  await expect(page.locator('.lift-card')).toHaveCount(6);
});

Then('I should see an error message {string}', async ({ page }, message) => {
  expect(page.__lastDialogMessage).toBe(message);
});

Then('the Front Squat 1RM should be {string} kg', async ({ page }, value) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(value);
});

Then('the Back Squat 1RM should be {string} kg', async ({ page }, value) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(value);
});

Then('the Clean Pull 1RM should be {string} kg', async ({ page }, value) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(value);
});

Then('the Snatch Pull 1RM should be {string} kg', async ({ page }, value) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(value);
});

Then('the Total should be {string} kg', async ({ page }, value) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(value);
});

Then('I should see the Snatch displayed as {string} kg and {string} lbs', async ({ page }, kg, lbs) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(kg);
  expect(summaryText).toContain(lbs);
});

Then('I should see the Clean & Jerk displayed as {string} kg and {string} lbs', async ({ page }, kg, lbs) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(kg);
  expect(summaryText).toContain(lbs);
});

Then('I should see percentage rows for 60%, 65%, 70%, 75%, 80%, 85%, 90%, 95%', async ({ page }) => {
  const firstLiftCard = page.locator('.lift-card').first();
  for (const pct of ['60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%']) {
    await expect(firstLiftCard).toContainText(pct);
  }
});

Then('the 60% row for Snatch should show {string} kg', async ({ page }, kg) => {
  const snatchCard = page.locator('.lift-card').first();
  await expect(snatchCard).toContainText(kg);
});

Then('the 95% row for Snatch should show {string} kg', async ({ page }, kg) => {
  const snatchCard = page.locator('.lift-card').first();
  await expect(snatchCard).toContainText(kg);
});

const LIFT_CARD_INDEX = {
  'Snatch': 0,
  'Clean & Jerk': 1,
  'Front Squat': 2,
  'Back Squat': 3,
  'Clean Pull': 4,
  'Snatch Pull': 5,
};

Then(/^the (\d+)% row for (.+) should show "([^"]+)" kg and "([^"]+)" lbs$/, async ({ page }, percentage, lift, kg, lbs) => {
  const card = page.locator('.lift-card').nth(LIFT_CARD_INDEX[lift]);
  const cardText = await card.textContent();
  expect(cardText).toContain(kg);
  expect(cardText).toContain(lbs);
});

Then('I should see {string} in the summary table', async ({ page }, text) => {
  const summaryText = await page.locator('#summaryTable').textContent();
  expect(summaryText).toContain(text);
});

When('I enter {string} as my Total in kg', async ({ page }, value) => {
  await page.fill('#totalKg', value);
});

Then('I should see {int} split suggestion cards', async ({ page }, count) => {
  await expect(page.locator('.split-card')).toHaveCount(count);
});

Then('each split suggestion should sum back to {string} kg', async ({ page }, total) => {
  const expectedTotal = parseFloat(total);
  const cards = page.locator('.split-card');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const text = await cards.nth(i).textContent();
    const snatchMatch = text.match(/Snatch:\s*([\d.]+)\s*kg/);
    const cnjMatch = text.match(/C&J:\s*([\d.]+)\s*kg/);
    const sum = parseFloat(snatchMatch[1]) + parseFloat(cnjMatch[1]);
    expect(Math.abs(sum - expectedTotal)).toBeLessThan(0.6);
  }
});

When('I click the first split suggestion', async ({ page }) => {
  await page.locator('.split-card').first().click();
});

Then('the Snatch and Clean & Jerk fields should be filled in kg', async ({ page }) => {
  expect(await page.inputValue('#snatchUnit')).toBe('kg');
  expect(await page.inputValue('#cnjUnit')).toBe('kg');
  expect(await page.inputValue('#snatch')).not.toBe('');
  expect(await page.inputValue('#cnj')).not.toBe('');
});

Then('the Total should show {string} kg', async ({ page }, value) => {
  await expect(page.locator('#totalKg')).toHaveValue(value);
});

Then('my Snatch and Clean & Jerk values should still be {string} and {string}', async ({ page }, snatch, cnj) => {
  await expect(page.locator('#snatch')).toHaveValue(snatch);
  await expect(page.locator('#cnj')).toHaveValue(cnj);
});

When('I reload the page', async ({ page }) => {
  await page.reload();
});
