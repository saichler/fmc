/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------
    var SESSION_TYPE   = { 0: 'Unknown', 1: 'Video Call', 2: 'Phone Call', 3: 'Text' };
    var SESSION_STATUS = { 0: 'Unknown', 1: 'Scheduled', 2: 'Confirmed', 3: 'In Progress', 4: 'Completed', 5: 'Cancelled', 6: 'No Show' };

    // -------------------------------------------------------------------------
    // Internal state
    // -------------------------------------------------------------------------
    var _container = null;

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    function _todayMidnightUnix() {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / 1000);
    }

    function _greetingWord() {
        var h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    }

    function _todayLabel() {
        var d = new Date();
        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function _prefix() {
        return MemberUtils.getApiPrefix();
    }

    function _items(data) {
        if (!data) return [];
        if (Array.isArray(data.list)) return data.list;
        if (Array.isArray(data)) return data;
        return [];
    }

    // -------------------------------------------------------------------------
    // Rendering helpers
    // -------------------------------------------------------------------------
    function _card(title, bodyHtml) {
        return '<div class="member-card">' +
               '<div class="member-card-header"><span class="member-card-title">' + MemberUtils.escapeHtml(title) + '</span></div>' +
               bodyHtml +
               '</div>';
    }

    function _statBox(label, value) {
        return '<div class="member-stat-box">' +
               '<div class="member-stat-value">' + value + '</div>' +
               '<div class="member-stat-label">' + MemberUtils.escapeHtml(label) + '</div>' +
               '</div>';
    }

    function _empty(msg) {
        return '<p class="member-empty">' + MemberUtils.escapeHtml(msg) + '</p>';
    }

    // -------------------------------------------------------------------------
    // Fetch helpers — each returns a rendered HTML string via Promise
    // -------------------------------------------------------------------------
    function loadMemberProfile() {
        var userId = sessionStorage.getItem('userId') || '';
        var qs = MemberUtils.buildQuery('FmcMember', 'userId=' + userId, 1, 0, null, false);
        return MemberUtils.authGet(_prefix() + '/10/Member' + qs).then(function (data) {
            var list = _items(data);
            if (list.length > 0) {
                window.MemberProfile = list[0];
            }
        });
    }

    function _renderWelcome() {
        var profile = window.MemberProfile;
        var firstName = (profile && profile.firstName) ? MemberUtils.escapeHtml(profile.firstName) : 'there';
        return _card('Welcome', '<div class="member-card-value">' + _greetingWord() + ', ' + firstName + '!</div>' +
               '<div class="member-stat-label">' + MemberUtils.escapeHtml(_todayLabel()) + '</div>');
    }

    function loadTodaysMeals() {
        var todayStart = _todayMidnightUnix();
        var qs = MemberUtils.buildQuery('FmcMeal', 'loggedAt>=' + todayStart, 200, 0, null, false);
        return MemberUtils.authGet(_prefix() + '/30/Meal' + qs).then(function (data) {
            var meals = _items(data);
            var totalCal = meals.reduce(function (sum, m) { return sum + (Number(m.calories) || 0); }, 0);
            var body = '<div class="member-stats-row">' +
                       _statBox('Meals Logged', meals.length) +
                       _statBox('Total Calories', MemberUtils.formatCalories(totalCal)) +
                       '</div>';
            if (meals.length === 0) body = _empty('No meals logged today yet.');
            return _card("Today's Meals", body);
        }).catch(function () {
            return _card("Today's Meals", _empty('Unable to load meal data.'));
        });
    }

    function loadActiveGoals() {
        var qs = MemberUtils.buildQuery('FmcGoal', 'status=1', 50, 0, null, false);
        return MemberUtils.authGet(_prefix() + '/20/Goal' + qs).then(function (data) {
            var goals = _items(data);
            if (goals.length === 0) {
                return _card('Active Goals', _empty('No active goals. Add a goal to get started!'));
            }
            var listHtml = '<div class="member-stats-row">' + _statBox('Active Goals', goals.length) + '</div><ul style="margin:8px 0 0 16px;padding:0;">';
            goals.slice(0, 5).forEach(function (g) {
                listHtml += '<li style="margin-bottom:4px;">' + MemberUtils.escapeHtml(g.title || g.goalTitle || '—') + '</li>';
            });
            if (goals.length > 5) listHtml += '<li style="color:var(--layer8d-text-muted,#718096);">+' + (goals.length - 5) + ' more…</li>';
            listHtml += '</ul>';
            return _card('Active Goals', listHtml);
        }).catch(function () {
            return _card('Active Goals', _empty('Unable to load goals.'));
        });
    }

    function loadNextSession() {
        // Fetch scheduled (1) and confirmed (2) sessions sorted by scheduledTime asc, take first
        var qs = MemberUtils.buildQuery('FmcSession', 'status=1', 1, 0, 'scheduledTime', false);
        var qsConfirmed = MemberUtils.buildQuery('FmcSession', 'status=2', 1, 0, 'scheduledTime', false);

        return Promise.all([
            MemberUtils.authGet(_prefix() + '/20/Session' + qs).catch(function () { return null; }),
            MemberUtils.authGet(_prefix() + '/20/Session' + qsConfirmed).catch(function () { return null; })
        ]).then(function (results) {
            var candidates = [];
            results.forEach(function (data) { if (data) candidates = candidates.concat(_items(data)); });
            candidates.sort(function (a, b) { return Number(a.scheduledTime || 0) - Number(b.scheduledTime || 0); });
            var next = candidates[0];
            if (!next) return _card('Next Session', _empty('No upcoming sessions scheduled.'));
            var typeLabel  = SESSION_TYPE[next.sessionType] || 'Session';
            var statusLabel = SESSION_STATUS[next.status] || '';
            var body = '<div class="member-stats-row">' +
                       _statBox('Date & Time', MemberUtils.formatDateTime(next.scheduledTime)) +
                       _statBox('Type', MemberUtils.escapeHtml(typeLabel)) +
                       _statBox('Status', MemberUtils.escapeHtml(statusLabel)) +
                       '</div>';
            return _card('Next Session', body);
        });
    }

    function loadWeightTrend() {
        var qs = MemberUtils.buildQuery('FmcWeightLog', null, 7, 0, 'logDate', true);
        return MemberUtils.authGet(_prefix() + '/40/WeightLog' + qs).then(function (data) {
            var logs = _items(data);
            if (logs.length === 0) return _card('Weight Trend', _empty('No weight entries yet.'));

            // Sorted descending: logs[0] is most recent, logs[last] is oldest
            var latest  = logs[0];
            var oldest  = logs[logs.length - 1];
            var latestG = Number(latest.weightGrams || 0);
            var oldestG = Number(oldest.weightGrams || 0);
            var changeG = latestG - oldestG;
            var changeLabel = (changeG >= 0 ? '+' : '') + MemberUtils.formatWeight(Math.abs(changeG));
            var changeColor = changeG <= 0 ? 'var(--layer8d-success,#22c55e)' : 'var(--layer8d-error,#ef4444)';

            var body = '<div class="member-stats-row">' +
                       _statBox('Current Weight', MemberUtils.formatWeight(latestG)) +
                       '<div class="member-stat-box">' +
                       '<div class="member-stat-value" style="color:' + changeColor + ';">' + MemberUtils.escapeHtml(changeLabel) + '</div>' +
                       '<div class="member-stat-label">7-day change</div>' +
                       '</div>' +
                       _statBox('As Of', MemberUtils.formatDate(latest.logDate)) +
                       '</div>';
            return _card('Weight Trend', body);
        }).catch(function () {
            return _card('Weight Trend', _empty('Unable to load weight data.'));
        });
    }

    // -------------------------------------------------------------------------
    // Render into container
    // -------------------------------------------------------------------------
    function _render(htmlParts) {
        if (!_container) return;
        _container.innerHTML = htmlParts.join('');
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    function init(container) {
        _container = container;
        _container.innerHTML = '<div class="member-loading">Loading dashboard…</div>';

        loadMemberProfile().then(function () {
            var welcomeHtml = _renderWelcome();
            return Promise.all([
                loadTodaysMeals(),
                loadActiveGoals(),
                loadNextSession(),
                loadWeightTrend()
            ]).then(function (parts) {
                _render([welcomeHtml].concat(parts));
            });
        }).catch(function () {
            _container.innerHTML = '<div class="member-empty">Failed to load dashboard. Please refresh.</div>';
        });
    }

    function refresh() {
        if (_container) init(_container);
    }

    window.MemberDashboard = {
        init    : init,
        refresh : refresh
    };

}());
