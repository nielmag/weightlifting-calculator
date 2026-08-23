(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.WLCalc = factory();
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const KG_TO_LBS = 2.20462;
    const LBS_TO_KG = 0.453592;

    // Estimated ratios based on competition lifts
    const ACCESSORY_RATIOS = {
        frontSquat: { base: 'cnj', ratio: 1.20, label: 'Front Squat', note: '120% C&J' },
        backSquat: { base: 'cnj', ratio: 1.30, label: 'Back Squat', note: '130% C&J' },
        cleanPull: { base: 'cnj', ratio: 1.30, label: 'Clean Pull', note: '130% C&J' },
        snatchPull: { base: 'snatch', ratio: 1.30, label: 'Snatch Pull', note: '130% Sn' }
    };

    // Realistic elite/sub-elite Snatch share of Total (Snatch is typically
    // ~76-85% of Clean & Jerk, i.e. Snatch/Total roughly 42%-46%).
    const SPLIT_RATIOS = [
        { id: 'cnj-heavy', label: 'C&J-Heavy', snatchPct: 0.42 },
        { id: 'cnj-dominant', label: 'C&J-Dominant', snatchPct: 0.43 },
        { id: 'balanced-low', label: 'Balanced', snatchPct: 0.44 },
        { id: 'balanced-high', label: 'Balanced (Snatch-lean)', snatchPct: 0.45 },
        { id: 'snatch-dominant', label: 'Snatch-Dominant', snatchPct: 0.46 }
    ];

    function toKg(value, unit) {
        return unit === 'lbs' ? value * LBS_TO_KG : value;
    }

    function kgToLbs(kg) {
        return kg * KG_TO_LBS;
    }

    function bothUnits(kg) {
        return { kg: kg, lbs: kgToLbs(kg) };
    }

    function calculateTotalKg(snatchKg, cnjKg) {
        return snatchKg + cnjKg;
    }

    function calculateAccessoryLifts(snatchKg, cnjKg) {
        return Object.keys(ACCESSORY_RATIOS).map(function (key) {
            const cfg = ACCESSORY_RATIOS[key];
            const baseKg = cfg.base === 'cnj' ? cnjKg : snatchKg;
            const maxKg = baseKg * cfg.ratio;
            return {
                key: key,
                label: cfg.label,
                note: cfg.note,
                basedOn: cfg.base,
                ratio: cfg.ratio,
                oneRepMax: bothUnits(maxKg)
            };
        });
    }

    function generatePercentageTable(maxKg, opts) {
        opts = opts || {};
        const min = opts.min || 60;
        const max = opts.max || 95;
        const step = opts.step || 5;
        const rows = [];
        for (let pct = min; pct <= max; pct += step) {
            rows.push({ percentage: pct, weight: bothUnits(maxKg * (pct / 100)) });
        }
        return rows;
    }

    function generateSplitSuggestions(totalKg) {
        return SPLIT_RATIOS.map(function (r) {
            // Round Snatch to a whole kg, derive C&J so the pair still sums to totalKg exactly.
            const snatchKg = Math.round(totalKg * r.snatchPct);
            const cnjKg = totalKg - snatchKg;
            return {
                id: r.id,
                label: r.label,
                snatchPercent: r.snatchPct,
                cnjPercent: 1 - r.snatchPct,
                snatch: bothUnits(snatchKg),
                cnj: bothUnits(cnjKg)
            };
        });
    }

    return {
        KG_TO_LBS: KG_TO_LBS,
        LBS_TO_KG: LBS_TO_KG,
        ACCESSORY_RATIOS: ACCESSORY_RATIOS,
        SPLIT_RATIOS: SPLIT_RATIOS,
        toKg: toKg,
        kgToLbs: kgToLbs,
        bothUnits: bothUnits,
        calculateTotalKg: calculateTotalKg,
        calculateAccessoryLifts: calculateAccessoryLifts,
        generatePercentageTable: generatePercentageTable,
        generateSplitSuggestions: generateSplitSuggestions
    };
});
