const test = require('node:test');
const assert = require('node:assert/strict');
const calc = require('../../calculator.js');

test('toKg leaves kg values unchanged', () => {
    assert.equal(calc.toKg(100, 'kg'), 100);
});

test('toKg converts lbs to kg', () => {
    const result = calc.toKg(220.462, 'lbs');
    assert.ok(Math.abs(result - 100) < 1e-3);
});

test('kgToLbs converts kg to lbs', () => {
    const result = calc.kgToLbs(100);
    assert.ok(Math.abs(result - 220.462) < 1e-3);
});

test('bothUnits returns kg and lbs together', () => {
    const result = calc.bothUnits(100);
    assert.equal(result.kg, 100);
    assert.ok(Math.abs(result.lbs - 220.462) < 1e-3);
});

test('calculateTotalKg sums snatch and clean & jerk', () => {
    assert.ok(Math.abs(calc.calculateTotalKg(65.8, 89.8) - 155.6) < 1e-9);
});

test('calculateAccessoryLifts matches known ratios', () => {
    const lifts = calc.calculateAccessoryLifts(65.8, 89.8);
    const byKey = Object.fromEntries(lifts.map((l) => [l.key, l]));

    assert.ok(Math.abs(byKey.frontSquat.oneRepMax.kg - 107.76) < 1e-6);
    assert.ok(Math.abs(byKey.backSquat.oneRepMax.kg - 116.74) < 1e-6);
    assert.ok(Math.abs(byKey.cleanPull.oneRepMax.kg - 116.74) < 1e-6);
    assert.ok(Math.abs(byKey.snatchPull.oneRepMax.kg - 85.54) < 1e-6);
});

test('generatePercentageTable produces 60-95 in 5% steps', () => {
    const rows = calc.generatePercentageTable(100);
    const percentages = rows.map((r) => r.percentage);
    assert.deepEqual(percentages, [60, 65, 70, 75, 80, 85, 90, 95]);
});

test('generatePercentageTable computes correct weight per row', () => {
    const rows = calc.generatePercentageTable(100);
    const row60 = rows.find((r) => r.percentage === 60);
    const row95 = rows.find((r) => r.percentage === 95);
    assert.equal(row60.weight.kg, 60);
    assert.equal(row95.weight.kg, 95);
});

test('generateSplitSuggestions returns 4 realistic options', () => {
    const suggestions = calc.generateSplitSuggestions(152);
    assert.equal(suggestions.length, 4);
    for (const s of suggestions) {
        assert.ok(s.snatchPercent >= 0.43 && s.snatchPercent <= 0.46);
    }
});

test('generateSplitSuggestions splits always sum back to the total', () => {
    for (const total of [100, 152, 152.3, 200.7, 88]) {
        const suggestions = calc.generateSplitSuggestions(total);
        for (const s of suggestions) {
            assert.ok(Math.abs(s.snatch.kg + s.cnj.kg - total) < 1e-6);
        }
    }
});

test('generateSplitSuggestions labels are unique', () => {
    const suggestions = calc.generateSplitSuggestions(152);
    const ids = suggestions.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
});
