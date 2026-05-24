/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Tab definitions
    // -------------------------------------------------------------------------
    var TABS = [
        {
            key: 'home',
            label: 'Home',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>'
        },
        {
            key: 'log',
            label: 'Log',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l3-3 4 4 4-4 4 4"/><path d="M3 6h2M3 16h18M3 21h18"/><line x1="8" y1="21" x2="8" y2="16"/><line x1="16" y1="21" x2="16" y2="16"/></svg>'
        },
        {
            key: 'chat',
            label: 'Chat',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
        },
        {
            key: 'progress',
            label: 'Progress',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>'
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
        }
    ];

    // Module map: tab key -> global initializer
    var TAB_MODULES = {
        home     : function (el) { if (window.MemberDashboard) MemberDashboard.init(el); },
        log      : function (el) { if (window.MemberMealLog)   MemberMealLog.init(el);   },
        chat     : function (el) { if (window.MemberChat)      MemberChat.init(el);      },
        progress : function (el) { if (window.MemberProgress)  MemberProgress.init(el);  },
        profile  : function (el) { if (window.MemberProfileTab)MemberProfileTab.init(el);  }
    };

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    var _currentTab = null;
    var _onboarding = {
        step  : 0,
        data  : {}
    };

    // -------------------------------------------------------------------------
    // Auth guard
    // -------------------------------------------------------------------------
    function _checkAuth() {
        if (!sessionStorage.getItem('bearerToken')) {
            window.location.href = '../l8ui/login/index.html';
            return false;
        }
        return true;
    }

    // -------------------------------------------------------------------------
    // Config loader
    // -------------------------------------------------------------------------
    function _loadConfig() {
        return fetch('/login.json')
            .then(function (res) { return res.ok ? res.json() : {}; })
            .then(function (cfg) { window.MemberAppConfig = cfg; })
            .catch(function () { window.MemberAppConfig = {}; });
    }

    // -------------------------------------------------------------------------
    // Shell render
    // -------------------------------------------------------------------------
    function _buildShell() {
        document.body.innerHTML =
            '<div class="member-app">' +
                '<header class="member-header">' +
                    '<span class="member-header-logo">&#127868;</span>' +
                    '<span class="member-header-title">FitMate Coach</span>' +
                '</header>' +
                '<main class="member-content"></main>' +
                '<nav class="member-tab-bar">' + _buildTabBar() + '</nav>' +
            '</div>';
    }

    function _buildTabBar() {
        return TABS.map(function (t) {
            return '<button class="member-tab" data-tab="' + t.key + '">' +
                       '<span class="member-tab-icon">' + t.icon + '</span>' +
                       '<span class="member-tab-label">' + t.label + '</span>' +
                   '</button>';
        }).join('');
    }

    // -------------------------------------------------------------------------
    // Tab navigation
    // -------------------------------------------------------------------------
    function _attachTabEvents() {
        var tabbar = document.querySelector('.member-tab-bar');
        if (!tabbar) return;
        tabbar.addEventListener('click', function (e) {
            var btn = e.target.closest('.member-tab');
            if (!btn) return;
            _switchTab(btn.dataset.tab);
        });
    }

    function _switchTab(key) {
        if (key === _currentTab) return;

        // Tear down Chat polling if leaving that tab
        if (_currentTab === 'chat' && window.MemberChat && MemberChat.destroy) {
            MemberChat.destroy();
        }

        _currentTab = key;

        // Update active class
        document.querySelectorAll('.member-tab').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.tab === key);
        });

        // Load tab content
        var content = document.querySelector('.member-content');
        if (content) {
            content.innerHTML = '';
            var initFn = TAB_MODULES[key];
            if (initFn) initFn(content);
        }
    }

    // -------------------------------------------------------------------------
    // First-login onboarding check
    // -------------------------------------------------------------------------
    function _checkOnboarding() {
        var userId = sessionStorage.getItem('userId') || sessionStorage.getItem('username') || '';
        if (!userId) return;

        var prefix = MemberUtils.getApiPrefix();
        var qs = MemberUtils.buildQuery('FmcMember', 'userId=' + userId, 1, 0);
        MemberUtils.authGet(prefix + '/10/Member' + qs)
            .then(function (resp) {
                var list = (resp && resp.list) ? resp.list : [];
                if (list.length > 0) {
                    window.MemberProfile = list[0];
                } else {
                    _showOnboarding();
                }
            })
            .catch(function () {
                // Network failure — skip onboarding silently
            });
    }

    // -------------------------------------------------------------------------
    // Onboarding wizard
    // -------------------------------------------------------------------------
    var ONBOARDING_STEPS = [
        { id: 'welcome',     title: 'Welcome'       },
        { id: 'personal',    title: 'Personal Info'  },
        { id: 'metrics',     title: 'Body Metrics'   },
        { id: 'preferences', title: 'Preferences'    },
        { id: 'complete',    title: 'All Set!'       }
    ];

    function _showOnboarding() {
        _onboarding.step = 0;
        _onboarding.data = {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || ''
        };

        var overlay = document.createElement('div');
        overlay.className = 'onboarding-overlay';
        overlay.id = 'onboarding-overlay';
        overlay.innerHTML = _renderOnboardingStep(0);
        document.body.appendChild(overlay);
        _attachOnboardingEvents(overlay);
    }

    function _renderOnboardingStep(step) {
        var progress = Math.round((step / (ONBOARDING_STEPS.length - 1)) * 100);
        var d = _onboarding.data;

        var body = '';
        if (step === 0) {
            body = '<div class="ob-welcome">' +
                       '<div class="ob-hero">&#127868;</div>' +
                       '<h2>Welcome to FitMate Coach!</h2>' +
                       '<p>Your personalised nutrition coaching platform. ' +
                       'We\'ll match you with a dedicated coach and build a plan ' +
                       'tailored to your goals.</p>' +
                       '<button class="ob-btn-primary" id="ob-next">Get Started</button>' +
                   '</div>';
        } else if (step === 1) {
            body = '<div class="ob-form">' +
                       '<div class="ob-field"><label>First Name</label>' +
                           '<input type="text" id="ob-firstName" value="' + (d.firstName || '') + '" placeholder="Jane"></div>' +
                       '<div class="ob-field"><label>Last Name</label>' +
                           '<input type="text" id="ob-lastName" value="' + (d.lastName || '') + '" placeholder="Smith"></div>' +
                       '<div class="ob-field"><label>Email</label>' +
                           '<input type="email" id="ob-email" value="' + (d.email || '') + '" placeholder="jane@example.com"></div>' +
                       '<div class="ob-field"><label>Phone</label>' +
                           '<input type="tel" id="ob-phone" value="' + (d.phone || '') + '" placeholder="+1 555 000 0000"></div>' +
                       '<div class="ob-field"><label>Date of Birth</label>' +
                           '<input type="date" id="ob-dateOfBirth" value="' + (d.dateOfBirth || '') + '"></div>' +
                   '</div>';
        } else if (step === 2) {
            var unitSel = function (val) {
                return '<select id="ob-unitPref">' +
                           '<option value="metric"' + (val !== 'imperial' ? ' selected' : '') + '>Metric (kg / cm)</option>' +
                           '<option value="imperial"' + (val === 'imperial' ? ' selected' : '') + '>Imperial (lbs / ft)</option>' +
                       '</select>';
            };
            body = '<div class="ob-form">' +
                       '<div class="ob-field"><label>Unit Preference</label>' + unitSel(d.unitPreference) + '</div>' +
                       '<div class="ob-field"><label>Height (cm)</label>' +
                           '<input type="number" id="ob-heightCm" value="' + (d.heightCm || '') + '" placeholder="175" min="50" max="300"></div>' +
                       '<div class="ob-field"><label>Current Weight (kg)</label>' +
                           '<input type="number" id="ob-startingWeightKg" value="' + (d.startingWeightKg || '') + '" placeholder="75" min="20" max="400" step="0.1"></div>' +
                       '<div class="ob-field"><label>Target Weight (kg)</label>' +
                           '<input type="number" id="ob-targetWeightKg" value="' + (d.targetWeightKg || '') + '" placeholder="70" min="20" max="400" step="0.1"></div>' +
                   '</div>';
        } else if (step === 3) {
            body = '<div class="ob-form">' +
                       '<div class="ob-field"><label>Dietary Preferences</label>' +
                           '<textarea id="ob-dietaryPrefs" rows="3" placeholder="Any dietary restrictions or preferences?">' +
                               (d.dietaryPrefs || '') + '</textarea></div>' +
                       '<div class="ob-field ob-check-row">' +
                           '<input type="checkbox" id="ob-onGlp1"' + (d.onGlp1 ? ' checked' : '') + '>' +
                           '<label for="ob-onGlp1">Are you on GLP-1 medication?</label></div>' +
                       '<div class="ob-field" id="ob-glp1-field" style="' + (d.onGlp1 ? '' : 'display:none') + '">' +
                           '<label>GLP-1 Medication Name</label>' +
                           '<input type="text" id="ob-glp1Medication" value="' + (d.glp1Medication || '') + '" placeholder="e.g. Ozempic"></div>' +
                   '</div>';
        } else if (step === 4) {
            body = '<div class="ob-welcome">' +
                       '<div class="ob-hero">&#127775;</div>' +
                       '<h2>You\'re all set!</h2>' +
                       '<p>Your profile is ready. Your coach will review your details ' +
                       'and reach out soon. Let\'s begin your journey!</p>' +
                       '<button class="ob-btn-primary" id="ob-finish">Start Your Journey</button>' +
                   '</div>';
        }

        var backBtn = step > 0 && step < 4
            ? '<button class="ob-btn-secondary" id="ob-back">Back</button>'
            : '';
        var nextBtn = step > 0 && step < 4
            ? '<button class="ob-btn-primary" id="ob-next">Next</button>'
            : '';

        return '<div class="ob-card">' +
                   '<div class="ob-progress-bar"><div class="ob-progress-fill" style="width:' + progress + '%"></div></div>' +
                   '<p class="ob-step-label">Step ' + (step + 1) + ' of ' + ONBOARDING_STEPS.length + ' — ' + ONBOARDING_STEPS[step].title + '</p>' +
                   body +
                   (backBtn || nextBtn
                       ? '<div class="ob-nav">' + backBtn + nextBtn + '</div>'
                       : '') +
               '</div>';
    }

    function _collectOnboardingStep(step) {
        var d = _onboarding.data;
        var get = function (id) {
            var el = document.getElementById(id);
            return el ? el.value.trim() : '';
        };

        if (step === 1) {
            d.firstName    = get('ob-firstName');
            d.lastName     = get('ob-lastName');
            d.email        = get('ob-email');
            d.phone        = get('ob-phone');
            d.dateOfBirth  = get('ob-dateOfBirth');
        } else if (step === 2) {
            d.unitPreference    = get('ob-unitPref');
            d.heightCm          = parseFloat(get('ob-heightCm')) || 0;
            var swKg = parseFloat(get('ob-startingWeightKg')) || 0;
            var twKg = parseFloat(get('ob-targetWeightKg')) || 0;
            d.startingWeightG   = MemberUtils.kgToGrams(swKg);
            d.targetWeightG     = MemberUtils.kgToGrams(twKg);
            d.startingWeightKg  = swKg;
            d.targetWeightKg    = twKg;
        } else if (step === 3) {
            d.dietaryPrefs  = get('ob-dietaryPrefs');
            var glp1El = document.getElementById('ob-onGlp1');
            d.onGlp1 = glp1El ? glp1El.checked : false;
            d.glp1Medication = d.onGlp1 ? get('ob-glp1Medication') : '';
        }
    }

    function _attachOnboardingEvents(overlay) {
        overlay.addEventListener('click', function (e) {
            if (e.target.id === 'ob-next') {
                _collectOnboardingStep(_onboarding.step);
                _onboarding.step++;
                overlay.innerHTML = _renderOnboardingStep(_onboarding.step);
                _attachGlp1Toggle(overlay);
            } else if (e.target.id === 'ob-back') {
                _collectOnboardingStep(_onboarding.step);
                _onboarding.step--;
                overlay.innerHTML = _renderOnboardingStep(_onboarding.step);
                _attachGlp1Toggle(overlay);
            } else if (e.target.id === 'ob-finish') {
                _submitOnboarding(overlay);
            }
        });
        _attachGlp1Toggle(overlay);
    }

    function _attachGlp1Toggle(overlay) {
        var cb = overlay.querySelector('#ob-onGlp1');
        if (!cb) return;
        cb.addEventListener('change', function () {
            var field = overlay.querySelector('#ob-glp1-field');
            if (field) field.style.display = cb.checked ? '' : 'none';
        });
    }

    function _submitOnboarding(overlay) {
        var userId = sessionStorage.getItem('userId') || sessionStorage.getItem('username') || '';
        var d = _onboarding.data;
        var payload = {
            userId          : userId,
            firstName       : d.firstName       || '',
            lastName        : d.lastName        || '',
            email           : d.email           || '',
            phone           : d.phone           || '',
            dateOfBirth     : d.dateOfBirth     || '',
            heightCm        : d.heightCm        || 0,
            startingWeightG : d.startingWeightG || 0,
            targetWeightG   : d.targetWeightG   || 0,
            unitPreference  : d.unitPreference   || 'metric',
            dietaryPrefs    : d.dietaryPrefs     || '',
            onGlp1          : d.onGlp1           || false,
            glp1Medication  : d.glp1Medication   || '',
            timezone        : d.timezone         || ''
        };

        var prefix = MemberUtils.getApiPrefix();
        MemberUtils.authPost(prefix + '/10/Member', payload)
            .then(function (resp) {
                window.MemberProfile = resp;
                overlay.remove();
                _switchTab('home');
            })
            .catch(function (err) {
                console.error('Onboarding POST failed:', err);
                var msg = overlay.querySelector('.ob-error');
                if (!msg) {
                    msg = document.createElement('p');
                    msg.className = 'ob-error';
                    overlay.querySelector('.ob-card').appendChild(msg);
                }
                msg.textContent = 'Could not save your profile. Please try again.';
            });
    }

    // -------------------------------------------------------------------------
    // Bootstrap
    // -------------------------------------------------------------------------
    function _init() {
        if (!_checkAuth()) return;

        _loadConfig().then(function () {
            _buildShell();
            _attachTabEvents();
            _switchTab('home');
            _checkOnboarding();
        });
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    window.MemberApp = {
        switchTab : _switchTab,
        logout    : function () {
            sessionStorage.clear();
            window.location.href = '../l8ui/login/index.html';
        }
    };

    document.addEventListener('DOMContentLoaded', _init);

}());
