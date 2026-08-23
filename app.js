(function () {
    'use strict';

    var STORAGE_KEY = 'weightlifting-calculator:v2';
    var els = {};

    function cacheEls() {
        els.totalKg = document.getElementById('totalKg');
        els.totalBothUnits = document.getElementById('totalBothUnits');
        els.splitCards = document.getElementById('splitCards');
        els.snatch = document.getElementById('snatch');
        els.snatchUnit = document.getElementById('snatchUnit');
        els.snatchBothUnits = document.getElementById('snatchBothUnits');
        els.cnj = document.getElementById('cnj');
        els.cnjUnit = document.getElementById('cnjUnit');
        els.cnjBothUnits = document.getElementById('cnjBothUnits');
        els.summaryTable = document.getElementById('summaryTable');
        els.results = document.getElementById('results');
    }

    function formatBoth(kg) {
        var b = WLCalc.bothUnits(kg);
        return b.kg.toFixed(1) + ' kg / ' + b.lbs.toFixed(1) + ' lbs';
    }

    function getSnatchKg() {
        var v = parseFloat(els.snatch.value);
        if (isNaN(v)) return null;
        return WLCalc.toKg(v, els.snatchUnit.value);
    }

    function getCnjKg() {
        var v = parseFloat(els.cnj.value);
        if (isNaN(v)) return null;
        return WLCalc.toKg(v, els.cnjUnit.value);
    }

    function updateBothUnitsDisplays() {
        var snatchKg = getSnatchKg();
        var cnjKg = getCnjKg();
        els.snatchBothUnits.textContent = snatchKg === null ? '' : formatBoth(snatchKg);
        els.cnjBothUnits.textContent = cnjKg === null ? '' : formatBoth(cnjKg);

        var totalVal = parseFloat(els.totalKg.value);
        els.totalBothUnits.textContent = isNaN(totalVal) ? '' : formatBoth(totalVal);
    }

    function renderSplitCards(totalKg, selectedId) {
        if (isNaN(totalKg)) {
            els.splitCards.innerHTML = '';
            els.splitCards.classList.add('hidden');
            return;
        }
        var suggestions = WLCalc.generateSplitSuggestions(totalKg);
        var html = '';
        suggestions.forEach(function (s) {
            var selectedClass = s.id === selectedId ? ' selected' : '';
            html += '<button type="button" class="split-card' + selectedClass + '" data-split-id="' + s.id + '">' +
                '<div class="split-label">' + s.label + '</div>' +
                '<div class="split-pct">' + Math.round(s.snatchPercent * 100) + '% Snatch / ' + Math.round(s.cnjPercent * 100) + '% C&J</div>' +
                '<div class="split-line">Snatch: ' + s.snatch.kg.toFixed(1) + ' kg / ' + s.snatch.lbs.toFixed(1) + ' lbs</div>' +
                '<div class="split-line">C&J: ' + s.cnj.kg.toFixed(1) + ' kg / ' + s.cnj.lbs.toFixed(1) + ' lbs</div>' +
                '</button>';
        });
        els.splitCards.innerHTML = html;
        els.splitCards.classList.remove('hidden');

        Array.prototype.forEach.call(els.splitCards.querySelectorAll('.split-card'), function (card) {
            card.addEventListener('click', function () {
                var id = card.getAttribute('data-split-id');
                var suggestion = suggestions.filter(function (s) { return s.id === id; })[0];
                selectSplit(suggestion);
            });
        });
    }

    function selectSplit(suggestion) {
        els.snatch.value = suggestion.snatch.kg;
        els.snatchUnit.value = 'kg';
        els.cnj.value = suggestion.cnj.kg;
        els.cnjUnit.value = 'kg';
        els.totalKg.value = suggestion.snatch.kg + suggestion.cnj.kg;

        updateBothUnitsDisplays();
        renderSplitCards(parseFloat(els.totalKg.value), suggestion.id);
        saveState();
    }

    function onTotalInput() {
        var totalKg = parseFloat(els.totalKg.value);
        updateBothUnitsDisplays();
        renderSplitCards(!isNaN(totalKg) && totalKg > 0 ? totalKg : NaN);
        saveState();
    }

    function onLiftInput() {
        var snatchKg = getSnatchKg();
        var cnjKg = getCnjKg();

        if (snatchKg !== null && cnjKg !== null) {
            var totalKg = WLCalc.calculateTotalKg(snatchKg, cnjKg);
            els.totalKg.value = totalKg.toFixed(1);
            renderSplitCards(NaN);
        }

        updateBothUnitsDisplays();
        saveState();
    }

    function summaryRow(label, kg) {
        return '<tr><td>' + label + '</td><td>' + kg.toFixed(1) + '</td><td>' + WLCalc.kgToLbs(kg).toFixed(1) + '</td></tr>';
    }

    function liftCardHtml(name, maxKg) {
        var maxLbs = WLCalc.kgToLbs(maxKg);
        var rows = WLCalc.generatePercentageTable(maxKg).map(function (r) {
            return '<tr><td>' + r.percentage + '%</td><td>' + r.weight.kg.toFixed(1) + '</td><td>' + r.weight.lbs.toFixed(1) + '</td></tr>';
        }).join('');
        return '<div class="lift-card">' +
            '<h2>' + name + '</h2>' +
            '<div class="max-display">1RM: ' + maxKg.toFixed(1) + ' kg / ' + maxLbs.toFixed(1) + ' lbs</div>' +
            '<table><tr><th>%</th><th>kg</th><th>lbs</th></tr>' + rows + '</table>' +
            '</div>';
    }

    function calculate() {
        var snatchKg = getSnatchKg();
        var cnjKg = getCnjKg();

        if (snatchKg === null || cnjKg === null) {
            alert('Please enter valid numbers for both lifts');
            return;
        }

        var accessoryLifts = WLCalc.calculateAccessoryLifts(snatchKg, cnjKg);
        var byKey = {};
        accessoryLifts.forEach(function (l) { byKey[l.key] = l; });
        var totalKg = WLCalc.calculateTotalKg(snatchKg, cnjKg);

        var allLifts = [
            { label: 'Snatch', maxKg: snatchKg },
            { label: 'Clean & Jerk', maxKg: cnjKg }
        ].concat(accessoryLifts.map(function (l) { return { label: l.label, maxKg: l.oneRepMax.kg }; }));

        var resultsHtml = allLifts.map(function (lift) {
            return liftCardHtml(lift.label, lift.maxKg);
        }).join('');

        els.results.innerHTML = resultsHtml;
        els.results.classList.remove('hidden');

        var summaryHtml = '<h2>Estimated 1RMs</h2>' +
            '<table>' +
            '<tr><th>LIFT</th><th>KG</th><th>LBS</th></tr>' +
            summaryRow('Snatch', snatchKg) +
            summaryRow('Clean & Jerk', cnjKg) +
            '<tr class="total-row"><td>Total</td><td>' + totalKg.toFixed(1) + '</td><td>' + WLCalc.kgToLbs(totalKg).toFixed(1) + '</td></tr>' +
            summaryRow('Front Squat (120% C&J)', byKey.frontSquat.oneRepMax.kg) +
            summaryRow('Back Squat (130% C&J)', byKey.backSquat.oneRepMax.kg) +
            summaryRow('Clean Pull (130% C&J)', byKey.cleanPull.oneRepMax.kg) +
            summaryRow('Snatch Pull (130% Sn)', byKey.snatchPull.oneRepMax.kg) +
            '</table>';

        els.summaryTable.innerHTML = summaryHtml;
        els.summaryTable.classList.remove('hidden');
    }

    function saveState() {
        try {
            if (typeof localStorage === 'undefined') return;
            var state = {
                version: 2,
                totalKg: parseFloat(els.totalKg.value),
                snatch: { value: els.snatch.value, unit: els.snatchUnit.value },
                cnj: { value: els.cnj.value, unit: els.cnjUnit.value },
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            // localStorage unavailable (private browsing, disabled, etc.) - ignore
        }
    }

    function loadState() {
        try {
            if (typeof localStorage === 'undefined') return null;
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var state = JSON.parse(raw);
            if (!state || state.version !== 2) return null;
            return state;
        } catch (e) {
            return null;
        }
    }

    function restoreState() {
        var state = loadState();
        if (!state) return;

        if (state.snatch && state.snatch.value !== undefined && state.snatch.value !== '') {
            els.snatch.value = state.snatch.value;
            els.snatchUnit.value = state.snatch.unit || 'lbs';
        }
        if (state.cnj && state.cnj.value !== undefined && state.cnj.value !== '') {
            els.cnj.value = state.cnj.value;
            els.cnjUnit.value = state.cnj.unit || 'lbs';
        }
        if (state.totalKg !== undefined && !isNaN(state.totalKg)) {
            els.totalKg.value = state.totalKg;
        }

        updateBothUnitsDisplays();

        var totalVal = parseFloat(els.totalKg.value);
        if (!isNaN(totalVal)) renderSplitCards(totalVal, null);

        var snatchKg = getSnatchKg();
        var cnjKg = getCnjKg();
        if (snatchKg !== null && cnjKg !== null) {
            calculate();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        cacheEls();
        els.totalKg.addEventListener('input', onTotalInput);
        els.snatch.addEventListener('input', onLiftInput);
        els.snatchUnit.addEventListener('change', onLiftInput);
        els.cnj.addEventListener('input', onLiftInput);
        els.cnjUnit.addEventListener('change', onLiftInput);

        restoreState();
    });

    window.calculate = calculate;
})();
