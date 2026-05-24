/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    var HABIT_CATEGORY = { 0: 'Unknown', 1: 'Eating', 2: 'Hydration', 3: 'Sleep', 4: 'Movement', 5: 'Mindfulness' };

    var _container = null, _weightLogs = [], _habitLogs = [], _logFormVisible = false;

    function _prefix() { return MemberUtils.getApiPrefix(); }
    function _items(d) { return d ? (Array.isArray(d.list) ? d.list : (Array.isArray(d) ? d : [])) : []; }
    function _unit()   { var p = window.MemberProfile && window.MemberProfile.unitPreference; return p === 'imperial' ? 'lbs' : 'kg'; }
    function _memberId() { return (window.MemberProfile && window.MemberProfile.memberId) || ''; }
    function _pad2(n)  { return n < 10 ? '0' + n : String(n); }
    function _nowUnix(){ return Math.floor(Date.now() / 1000); }
    function _todayIso() { var d = new Date(); return d.getFullYear() + '-' + _pad2(d.getMonth()+1) + '-' + _pad2(d.getDate()); }
    function _isoDay(ts) { if (typeof ts === 'string') ts = Number(ts); var d = new Date(ts*1000); return d.getFullYear() + '-' + _pad2(d.getMonth()+1) + '-' + _pad2(d.getDate()); }
    function _shortDate(ts) { if (typeof ts === 'string') ts = Number(ts); var d = new Date(ts*1000); return _pad2(d.getMonth()+1) + '/' + _pad2(d.getDate()); }
    function _cssVar(v, fb) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || fb; }

    // -----------------------------------------------------------------------
    // Data fetching
    // -----------------------------------------------------------------------
    function _fetchWeightLogs() {
        var qs = MemberUtils.buildQuery('FmcWeightLog', null, 30, 0, 'logDate', false);
        return MemberUtils.authGet(_prefix() + '/40/WeightLog' + qs)
            .then(function(d){ _weightLogs = _items(d); }).catch(function(){ _weightLogs = []; });
    }

    function _fetchHabitLogs() {
        var now = new Date();
        var start = Math.floor(new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000);
        var end   = Math.floor(new Date(now.getFullYear(), now.getMonth()+1, 1).getTime() / 1000);
        var qs = MemberUtils.buildQuery('FmcHabitLog', 'logDate>=' + start + ' logDate<' + end, 500, 0, 'logDate', false);
        return MemberUtils.authGet(_prefix() + '/40/HabitLog' + qs)
            .then(function(d){ _habitLogs = _items(d); }).catch(function(){ _habitLogs = []; });
    }

    // -----------------------------------------------------------------------
    // SVG Line Chart (viewBox 340x180, pad L40 R10 T10 B30)
    // -----------------------------------------------------------------------
    function _buildChart(logs, unit) {
        if (!logs.length) return '<p class="member-empty">No weight entries to chart.</p>';
        var conv   = (unit === 'lbs') ? MemberUtils.gramsToLbs : MemberUtils.gramsToKg;
        var vals   = logs.map(function(l){ return conv(Number(l.weightG) || 0); });
        var minV   = Math.min.apply(null, vals), maxV = Math.max.apply(null, vals);
        var spread = (maxV - minV) || 1, pad = spread * 0.05;
        var lo = minV - pad, hi = maxV + pad;
        var cL = 40, cT = 10, cW = 290, cH = 140; // chart area
        function xOf(i){ return cL + (i / (logs.length - 1 || 1)) * cW; }
        function yOf(v){ return cT + cH - ((v - lo) / (hi - lo)) * cH; }
        var lc = _cssVar('--layer8d-primary', '#0ea5e9'), bc = _cssVar('--layer8d-border', '#e2e8f0');
        // grid
        var g = '';
        for (var gi = 0; gi <= 4; gi++) {
            var gy = (cT + (gi/4)*cH).toFixed(1), gv = (hi - (gi/4)*(hi-lo)).toFixed(1);
            g += '<line x1="'+cL+'" y1="'+gy+'" x2="'+(cL+cW)+'" y2="'+gy+'" stroke="'+bc+'" stroke-width="1"/>';
            g += '<text x="'+(cL-3)+'" y="'+(parseFloat(gy)+4).toFixed(1)+'" text-anchor="end" font-size="9" fill="var(--layer8d-text-muted,#718096)">'+gv+'</text>';
        }
        // x labels
        var lbl = '';
        logs.forEach(function(l, i){ if (i % 5 === 0 || i === logs.length-1)
            lbl += '<text x="'+xOf(i).toFixed(1)+'" y="'+(cT+cH+18)+'" text-anchor="middle" font-size="8" fill="var(--layer8d-text-muted,#718096)">'+MemberUtils.escapeHtml(_shortDate(l.logDate))+'</text>'; });
        var pts  = logs.map(function(l,i){ return xOf(i).toFixed(1)+','+yOf(conv(Number(l.weightG)||0)).toFixed(1); }).join(' ');
        var area = 'M '+xOf(0).toFixed(1)+','+(cT+cH).toFixed(1);
        logs.forEach(function(l,i){ area += ' L '+xOf(i).toFixed(1)+','+yOf(conv(Number(l.weightG)||0)).toFixed(1); });
        area += ' L '+xOf(logs.length-1).toFixed(1)+','+(cT+cH).toFixed(1)+' Z';
        var dots = logs.map(function(l,i){ return '<circle cx="'+xOf(i).toFixed(1)+'" cy="'+yOf(conv(Number(l.weightG)||0)).toFixed(1)+'" r="3" fill="'+lc+'"/>'; }).join('');
        return '<svg viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;">' +
               '<defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="'+lc+'" stop-opacity=".18"/><stop offset="100%" stop-color="'+lc+'" stop-opacity="0"/></linearGradient></defs>' +
               g + '<path d="'+area+'" fill="url(#wg)"/>' +
               '<polyline points="'+pts+'" fill="none" stroke="'+lc+'" stroke-width="2" stroke-linejoin="round"/>' +
               dots + lbl + '</svg>';
    }

    // -----------------------------------------------------------------------
    // Weight chart card
    // -----------------------------------------------------------------------
    function _renderWeightSection(unit) {
        var logs = _weightLogs, cur = logs[logs.length-1], first = logs[0];
        var curHtml = '', changeHtml = '';
        if (cur) {
            curHtml = '<div style="font-size:22px;font-weight:700;color:var(--layer8d-text-dark,#1a202c);margin-bottom:4px;">' + MemberUtils.escapeHtml(MemberUtils.formatWeight(Number(cur.weightG)||0, unit));
            if (cur !== first && first) {
                var chG = (Number(cur.weightG)||0) - (Number(first.weightG)||0);
                var col = chG <= 0 ? 'var(--layer8d-success,#22c55e)' : 'var(--layer8d-error,#ef4444)';
                changeHtml = ' <span style="font-size:13px;color:'+col+';">' + (chG>=0?'+':'') + MemberUtils.escapeHtml(MemberUtils.formatWeight(Math.abs(chG), unit)) + ' total</span>';
            }
            curHtml += changeHtml + '</div>';
        }
        var formHtml = _logFormVisible ? ('<div class="progress-log-form" id="progress-log-form">' +
               '<div style="display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;">' +
               '<div><label style="display:block;font-size:12px;color:var(--layer8d-text-muted,#718096);margin-bottom:4px;">Weight ('+unit+')</label>' +
               '<input type="number" id="mp-w-input" step="0.1" min="0" placeholder="e.g. 72.5" style="width:90px;padding:6px 8px;border:1px solid var(--layer8d-border,#e2e8f0);border-radius:6px;font-size:14px;"></div>' +
               '<div style="flex:1;min-width:130px;"><label style="display:block;font-size:12px;color:var(--layer8d-text-muted,#718096);margin-bottom:4px;">Notes (optional)</label>' +
               '<input type="text" id="mp-n-input" placeholder="Optional notes…" style="width:100%;padding:6px 8px;border:1px solid var(--layer8d-border,#e2e8f0);border-radius:6px;font-size:14px;box-sizing:border-box;"></div>' +
               '<button id="mp-save-btn" style="padding:6px 14px;background:var(--layer8d-primary,#0ea5e9);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">Save</button>' +
               '<button id="mp-cancel-btn" style="padding:6px 10px;background:transparent;color:var(--layer8d-text-medium,#4a5568);border:1px solid var(--layer8d-border,#e2e8f0);border-radius:6px;cursor:pointer;font-size:14px;">Cancel</button>' +
               '</div><div id="mp-form-err" style="color:var(--layer8d-error,#ef4444);font-size:12px;margin-top:4px;display:none;"></div></div>') : '';
        return '<div class="progress-chart-container member-card">' +
               '<div class="member-card-header"><span class="member-card-title">Weight Trend</span>' +
               '<button id="progress-log-weight-btn" style="float:right;padding:4px 12px;background:var(--layer8d-primary,#0ea5e9);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px;">Log Weight</button></div>' +
               '<div style="clear:both;"></div>' + formHtml + curHtml + _buildChart(logs, unit) + '</div>';
    }

    // -----------------------------------------------------------------------
    // Habit calendar card
    // -----------------------------------------------------------------------
    function _buildStreakCount(completedMap) {
        var today = new Date(), streak = 0;
        for (var i = 0; i < 365; i++) {
            var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            var key = d.getFullYear() + '-' + _pad2(d.getMonth()+1) + '-' + _pad2(d.getDate());
            if (completedMap[key]) { streak++; } else if (i > 0) { break; }
        }
        return streak;
    }

    function _buildHabitCalendar(habitName, logs) {
        var now = new Date(), y = now.getFullYear(), m = now.getMonth();
        var days = new Date(y, m+1, 0).getDate(), todayIso = _todayIso();
        var done = {}, firstIso = null;
        logs.forEach(function(l){ var iso = _isoDay(l.logDate); done[iso] = !!l.completed; if (!firstIso || iso < firstIso) firstIso = iso; });
        var streak = _buildStreakCount(done), cells = '';
        for (var d = 1; d <= days; d++) {
            var iso = y + '-' + _pad2(m+1) + '-' + _pad2(d), cls = 'habit-day';
            if (iso > todayIso)                       cls += ' habit-day-future';
            else if (iso === todayIso)                cls += ' habit-day-today' + (done[iso] !== undefined ? (done[iso] ? ' habit-day-done' : ' habit-day-missed') : '');
            else if (done[iso] !== undefined)         cls += done[iso] ? ' habit-day-done' : ' habit-day-missed';
            else if (firstIso && iso < firstIso)      cls += ' habit-day-before';
            else                                      cls += ' habit-day-missed';
            cells += '<div class="'+cls+'">'+d+'</div>';
        }
        return '<div style="margin-bottom:16px;"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">' +
               '<span style="font-weight:600;font-size:14px;">'+MemberUtils.escapeHtml(habitName)+'</span>' +
               '<span style="font-size:12px;color:var(--layer8d-text-muted,#718096);">'+(streak>0?'&#128293; '+streak+'-day streak':'No current streak')+'</span></div>' +
               '<div class="habit-calendar">'+cells+'</div></div>';
    }

    function _renderHabitSection() {
        var byName = {};
        _habitLogs.forEach(function(l){ var n = l.habitName || 'Unknown'; if (!byName[n]) byName[n] = {category: Number(l.category)||0, logs:[]}; byName[n].logs.push(l); });
        var names = Object.keys(byName);
        var title = 'Habit Tracking — ' + new Date().toLocaleDateString('en-US', {month:'long', year:'numeric'});
        if (!names.length) return '<div class="member-card"><div class="member-card-header"><span class="member-card-title">'+MemberUtils.escapeHtml(title)+'</span></div><p class="member-empty">No habits tracked this month.</p></div>';
        var inner = '<div class="member-card-header"><span class="member-card-title">'+MemberUtils.escapeHtml(title)+'</span></div>';
        names.forEach(function(n){ inner += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--layer8d-text-muted,#718096);margin-bottom:4px;">'+MemberUtils.escapeHtml(HABIT_CATEGORY[byName[n].category]||'Unknown')+'</div>' + _buildHabitCalendar(n, byName[n].logs); });
        return '<div class="member-card">'+inner+'</div>';
    }

    // -----------------------------------------------------------------------
    // Render + wire events
    // -----------------------------------------------------------------------
    function _renderAll() {
        if (!_container) return;
        var unit = _unit();
        _container.innerHTML = _renderWeightSection(unit) + _renderHabitSection() +
            (!document.getElementById('mp-habit-styles') ?
             '<style id="mp-habit-styles">.habit-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-top:4px;}.habit-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:11px;background:var(--layer8d-bg-light,#f7fafc);color:var(--layer8d-text-medium,#4a5568);}.habit-day-done{background:#22c55e;color:#fff;}.habit-day-today{outline:2px solid var(--layer8d-primary,#0ea5e9);outline-offset:-2px;}.habit-day-future,.habit-day-before{opacity:.3;}.progress-log-form{background:var(--layer8d-bg-light,#f7fafc);border-radius:8px;padding:12px;margin-bottom:12px;}</style>' : '');

        var logBtn = document.getElementById('progress-log-weight-btn');
        if (logBtn) logBtn.addEventListener('click', function(){ _logFormVisible = !_logFormVisible; _renderAll(); });

        var cancelBtn = document.getElementById('mp-cancel-btn');
        if (cancelBtn) cancelBtn.addEventListener('click', function(){ _logFormVisible = false; _renderAll(); });

        var saveBtn = document.getElementById('mp-save-btn');
        if (saveBtn) saveBtn.addEventListener('click', function() {
            var wi = document.getElementById('mp-w-input'), ni = document.getElementById('mp-n-input'), err = document.getElementById('mp-form-err');
            var val = wi ? parseFloat(wi.value) : NaN;
            if (isNaN(val) || val <= 0) { if (err) { err.textContent = 'Please enter a valid weight.'; err.style.display = 'block'; } return; }
            if (err) err.style.display = 'none';
            saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
            MemberUtils.authPost(_prefix() + '/40/WeightLog', { memberId: _memberId(), logDate: _nowUnix(), weightG: MemberUtils.parseWeight(val, unit), notes: (ni ? ni.value.trim() : '') })
                .then(function(){ _logFormVisible = false; return _fetchWeightLogs(); })
                .then(function(){ _renderAll(); })
                .catch(function(e){ saveBtn.disabled = false; saveBtn.textContent = 'Save'; if (err) { err.textContent = 'Failed: ' + (e && e.message ? e.message : 'error'); err.style.display = 'block'; } });
        });
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------
    function init(container) {
        _container = container; _logFormVisible = false;
        _container.innerHTML = '<div class="member-loading">Loading progress…</div>';
        Promise.all([_fetchWeightLogs(), _fetchHabitLogs()])
            .then(function(){ _renderAll(); })
            .catch(function(){ _container.innerHTML = '<div class="member-empty">Failed to load progress data.</div>'; });
    }

    function refresh() {
        if (!_container) return;
        _logFormVisible = false;
        Promise.all([_fetchWeightLogs(), _fetchHabitLogs()]).then(function(){ _renderAll(); });
    }

    window.MemberProgress = { init: init, refresh: refresh };

}());
