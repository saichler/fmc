/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 *
 * FMC Admin/Coach Dashboard — shared by desktop and mobile.
 * Renders horizontal service cards via Layer8DActionCard.
 */
(function() {
    'use strict';

    function _todayMidnightUnix() {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / 1000);
    }

    function _weekStartUnix() {
        var d = new Date();
        var day = d.getDay();
        var diff = day === 0 ? 6 : day - 1;
        d.setDate(d.getDate() - diff);
        d.setHours(0, 0, 0, 0);
        return Math.floor(d.getTime() / 1000);
    }

    function _navigateToSection(name) {
        if (typeof Layer8MNav !== 'undefined') {
            Layer8MNav.navigateToModule(name);
        } else if (typeof loadSection === 'function') {
            loadSection(name);
            var links = document.querySelectorAll('.nav-link');
            links.forEach(function(link) {
                link.classList.toggle('active', link.getAttribute('data-section') === name);
            });
        }
    }

    var PRIMARY_KPIS = [
        {
            label: 'Active Members',
            endpoint: '/10/Member',
            query: 'select * from FmcMember where status=2',
            target: { section: 'core' },
            severity: 'ok',
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
        },
        {
            label: 'Sessions This Week',
            endpoint: '/20/Session',
            queryFn: function() { return 'select * from FmcSession where scheduledTime>=' + _weekStartUnix(); },
            target: { section: 'coaching' },
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
        },
        {
            label: 'Meals Logged Today',
            endpoint: '/30/Meal',
            queryFn: function() { return 'select * from FmcMeal where loggedAt>=' + _todayMidnightUnix(); },
            target: { section: 'nutrition' },
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'
        },
        {
            label: 'Active Subscriptions',
            endpoint: '/50/Subscript',
            query: 'select * from FmcSubscription where status=2',
            target: { section: 'billing' },
            severity: 'ok',
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>'
        }
    ];

    var SECONDARY_KPIS = [
        {
            label: 'Trial Members',
            endpoint: '/10/Member',
            query: 'select * from FmcMember where status=1',
            target: { section: 'core' },
            severity: 'warning',
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>'
        },
        {
            label: 'Active Coaches',
            endpoint: '/10/Coach',
            query: 'select * from FmcCoach where status=1',
            target: { section: 'core' },
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        },
        {
            label: 'Active Goals',
            endpoint: '/20/Goal',
            query: 'select * from FmcGoal where status=1',
            target: { section: 'coaching' },
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>'
        },
        {
            label: 'Unread Messages',
            endpoint: '/20/Message',
            query: 'select * from FmcMessage where isRead=false',
            target: { section: 'coaching' },
            severity: 'warning',
            iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
        }
    ];

    function _fetchAndRender(container, kpis) {
        if (!container) return;
        var pending = kpis.length;
        var cards = new Array(kpis.length);

        kpis.forEach(function(kpi, idx) {
            var q = kpi.queryFn ? kpi.queryFn() : kpi.query;
            Layer8DPortalDashboard.fetchCount(kpi.endpoint, q, function(total) {
                cards[idx] = {
                    id: 'fmc-kpi-' + idx,
                    label: kpi.label,
                    value: total,
                    iconSvg: kpi.iconSvg,
                    severity: kpi.severity || '',
                    target: kpi.target
                };
                pending--;
                if (pending === 0) {
                    Layer8DActionCard.renderGrid(container, cards, function(target) {
                        _navigateToSection(target.section);
                    });
                }
            });
        });
    }

    function initializeFmcDashboard() {
        var kpiContainer = document.getElementById('fmc-dashboard-kpis');
        var statsContainer = document.getElementById('fmc-dashboard-stats');

        _fetchAndRender(kpiContainer, PRIMARY_KPIS);
        _fetchAndRender(statsContainer, SECONDARY_KPIS);
    }

    window.initializeFmcDashboard = initializeFmcDashboard;
})();
