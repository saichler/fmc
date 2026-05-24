/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Internal: API prefix (read once from login.json, fall back to '/fmc')
    // -------------------------------------------------------------------------
    var _apiPrefix = null;

    function _loadApiPrefix() {
        if (_apiPrefix !== null) return;
        try {
            var req = new XMLHttpRequest();
            req.open('GET', '/login.json', false); // synchronous one-time read
            req.send(null);
            if (req.status === 200) {
                var cfg = JSON.parse(req.responseText);
                _apiPrefix = (cfg && cfg.app && cfg.app.apiPrefix) ? cfg.app.apiPrefix : '/fmc';
            } else {
                _apiPrefix = '/fmc';
            }
        } catch (e) {
            _apiPrefix = '/fmc';
        }
    }

    // -------------------------------------------------------------------------
    // Auth helpers
    // -------------------------------------------------------------------------
    function getMemberBearerToken() {
        return sessionStorage.getItem('bearerToken') || '';
    }

    function getAuthHeaders() {
        return {
            'Authorization': 'Bearer ' + getMemberBearerToken(),
            'Content-Type': 'application/json'
        };
    }

    function getApiPrefix() {
        _loadApiPrefix();
        return _apiPrefix;
    }

    // -------------------------------------------------------------------------
    // Authenticated fetch wrappers
    // -------------------------------------------------------------------------
    function authGet(url) {
        return fetch(url, {
            method: 'GET',
            headers: getAuthHeaders()
        }).then(function (res) {
            if (!res.ok) return Promise.reject(new Error('GET ' + url + ' failed: ' + res.status));
            return res.json();
        });
    }

    function authPost(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) return Promise.reject(new Error('POST ' + url + ' failed: ' + res.status));
            return res.json();
        });
    }

    function authPut(url, data) {
        return fetch(url, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        }).then(function (res) {
            if (!res.ok) return Promise.reject(new Error('PUT ' + url + ' failed: ' + res.status));
            return res.json();
        });
    }

    // -------------------------------------------------------------------------
    // L8Query builder
    // buildQuery(model, where, limit, page, sort, desc) → '?body=...' string
    // -------------------------------------------------------------------------
    function buildQuery(model, where, limit, page, sort, desc) {
        var q = 'select * from ' + model;
        if (where) q += ' where ' + where;
        if (limit) q += ' limit ' + limit;
        if (page !== undefined && page !== null) q += ' page ' + page;
        if (sort) {
            q += ' sort-by ' + sort;
            if (desc) q += ' descending';
        }
        return '?body=' + encodeURIComponent(JSON.stringify({ text: q }));
    }

    // -------------------------------------------------------------------------
    // Date / time formatting
    // -------------------------------------------------------------------------
    function _pad2(n) {
        return n < 10 ? '0' + n : String(n);
    }

    function formatDate(timestamp) {
        if (!timestamp) return '-';
        if (typeof timestamp === 'string') timestamp = Number(timestamp);
        if (isNaN(timestamp) || timestamp === 0) return '-';
        var d = new Date(timestamp * 1000);
        return _pad2(d.getMonth() + 1) + '/' + _pad2(d.getDate()) + '/' + d.getFullYear();
    }

    function formatDateTime(timestamp) {
        if (!timestamp) return '-';
        if (typeof timestamp === 'string') timestamp = Number(timestamp);
        if (isNaN(timestamp) || timestamp === 0) return '-';
        var d = new Date(timestamp * 1000);
        return _pad2(d.getMonth() + 1) + '/' + _pad2(d.getDate()) + '/' + d.getFullYear() +
               ' ' + _pad2(d.getHours()) + ':' + _pad2(d.getMinutes());
    }

    function formatTimeAgo(timestamp) {
        if (!timestamp) return '-';
        if (typeof timestamp === 'string') timestamp = Number(timestamp);
        if (isNaN(timestamp) || timestamp === 0) return '-';
        var nowSec = Math.floor(Date.now() / 1000);
        var diffSec = nowSec - timestamp;
        if (diffSec < 0) diffSec = 0;
        if (diffSec < 60) return diffSec + 's ago';
        var diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return diffMin + 'm ago';
        var diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return diffH + 'h ago';
        var diffD = Math.floor(diffH / 24);
        if (diffD < 30) return diffD + 'd ago';
        var diffMo = Math.floor(diffD / 30);
        if (diffMo < 12) return diffMo + 'mo ago';
        return Math.floor(diffMo / 12) + 'y ago';
    }

    // -------------------------------------------------------------------------
    // XSS escaping
    // -------------------------------------------------------------------------
    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // -------------------------------------------------------------------------
    // Weight conversion  (backend stores grams)
    // -------------------------------------------------------------------------
    var GRAMS_PER_LB = 453.592;

    function gramsToKg(g) {
        if (!g) return 0;
        return Math.round((g / 1000) * 10) / 10;
    }

    function gramsToLbs(g) {
        if (!g) return 0;
        return Math.round((g / GRAMS_PER_LB) * 10) / 10;
    }

    function kgToGrams(kg) {
        if (!kg) return 0;
        return Math.round(kg * 1000);
    }

    function lbsToGrams(lbs) {
        if (!lbs) return 0;
        return Math.round(lbs * GRAMS_PER_LB);
    }

    /**
     * formatWeight(grams, unit) → "75.0 kg" | "165.3 lbs"
     * unit: 'kg' (default) or 'lbs'
     */
    function formatWeight(grams, unit) {
        if (!grams && grams !== 0) return '-';
        unit = unit || 'kg';
        if (unit === 'lbs') {
            return gramsToLbs(grams).toFixed(1) + ' lbs';
        }
        return gramsToKg(grams).toFixed(1) + ' kg';
    }

    /**
     * parseWeight(value, unit) → grams (integer)
     * value: number or string; unit: 'kg' (default) or 'lbs'
     */
    function parseWeight(value, unit) {
        var n = parseFloat(value);
        if (isNaN(n)) return 0;
        unit = unit || 'kg';
        return unit === 'lbs' ? lbsToGrams(n) : kgToGrams(n);
    }

    // -------------------------------------------------------------------------
    // Height conversion  (backend stores cm)
    // -------------------------------------------------------------------------
    var CM_PER_INCH = 2.54;
    var INCHES_PER_FOOT = 12;

    /**
     * cmToFtIn(cm) → { feet: number, inches: number }
     * inches is rounded to 1 decimal.
     */
    function cmToFtIn(cm) {
        if (!cm) return { feet: 0, inches: 0 };
        var totalInches = cm / CM_PER_INCH;
        var feet = Math.floor(totalInches / INCHES_PER_FOOT);
        var inches = Math.round((totalInches - feet * INCHES_PER_FOOT) * 10) / 10;
        return { feet: feet, inches: inches };
    }

    /**
     * ftInToCm(feet, inches) → cm (rounded to 1 decimal)
     */
    function ftInToCm(feet, inches) {
        feet = parseFloat(feet) || 0;
        inches = parseFloat(inches) || 0;
        return Math.round((feet * INCHES_PER_FOOT + inches) * CM_PER_INCH * 10) / 10;
    }

    /**
     * formatHeight(cm, unit) → "175 cm" | "5'9\""
     * unit: 'cm' (default) or 'imperial'
     */
    function formatHeight(cm, unit) {
        if (!cm && cm !== 0) return '-';
        unit = unit || 'cm';
        if (unit === 'imperial') {
            var fi = cmToFtIn(cm);
            return fi.feet + '\'' + Math.round(fi.inches) + '"';
        }
        return Math.round(cm) + ' cm';
    }

    // -------------------------------------------------------------------------
    // Macro / calorie display helpers
    // -------------------------------------------------------------------------

    /**
     * formatCalories(cal) → "1,234 cal"
     */
    function formatCalories(cal) {
        if (cal === null || cal === undefined) return '-';
        var n = Math.round(Number(cal));
        if (isNaN(n)) return '-';
        return n.toLocaleString() + ' cal';
    }

    /**
     * formatGrams(g, label) → "45g protein"
     * label is optional; if omitted returns "45g"
     */
    function formatGrams(g, label) {
        if (g === null || g === undefined) return '-';
        var n = Math.round(Number(g));
        if (isNaN(n)) return '-';
        return label ? n + 'g ' + label : n + 'g';
    }

    /**
     * macroPercentages(calories, proteinG, carbsG, fatG)
     * Returns { protein, carbs, fat } as integer percentages summing to 100.
     * Uses 4 cal/g for protein and carbs, 9 cal/g for fat.
     */
    function macroPercentages(calories, proteinG, carbsG, fatG) {
        proteinG = Number(proteinG) || 0;
        carbsG   = Number(carbsG)   || 0;
        fatG     = Number(fatG)     || 0;

        var proteinCal = proteinG * 4;
        var carbsCal   = carbsG   * 4;
        var fatCal     = fatG     * 9;
        var total      = proteinCal + carbsCal + fatCal;

        if (total === 0) {
            return { protein: 0, carbs: 0, fat: 0 };
        }

        var protein = Math.round(proteinCal / total * 100);
        var carbs   = Math.round(carbsCal   / total * 100);
        var fat     = Math.round(fatCal     / total * 100);

        // Adjust rounding so percentages sum to exactly 100
        var diff = 100 - (protein + carbs + fat);
        if (diff !== 0) {
            // Apply the adjustment to the largest bucket
            var largest = 'protein';
            if (carbsCal >= proteinCal && carbsCal >= fatCal)   largest = 'carbs';
            else if (fatCal >= proteinCal && fatCal >= carbsCal) largest = 'fat';
            if (largest === 'protein')      protein += diff;
            else if (largest === 'carbs')   carbs   += diff;
            else                            fat     += diff;
        }

        return { protein: protein, carbs: carbs, fat: fat };
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    window.MemberUtils = {
        // Auth
        getMemberBearerToken : getMemberBearerToken,
        getAuthHeaders       : getAuthHeaders,
        getApiPrefix         : getApiPrefix,

        // Fetch wrappers
        authGet  : authGet,
        authPost : authPost,
        authPut  : authPut,

        // Query builder
        buildQuery : buildQuery,

        // Date / time
        formatDate     : formatDate,
        formatDateTime : formatDateTime,
        formatTimeAgo  : formatTimeAgo,

        // Escaping
        escapeHtml : escapeHtml,

        // Weight
        gramsToKg   : gramsToKg,
        gramsToLbs  : gramsToLbs,
        kgToGrams   : kgToGrams,
        lbsToGrams  : lbsToGrams,
        formatWeight : formatWeight,
        parseWeight  : parseWeight,

        // Height
        cmToFtIn    : cmToFtIn,
        ftInToCm    : ftInToCm,
        formatHeight : formatHeight,

        // Macros
        formatCalories    : formatCalories,
        formatGrams       : formatGrams,
        macroPercentages  : macroPercentages
    };

}());
