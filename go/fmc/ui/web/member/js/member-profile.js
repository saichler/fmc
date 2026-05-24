/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    var STATUS_LABELS = { 0: 'Unknown', 1: 'Active', 2: 'On Hold', 3: 'Completed', 4: 'Cancelled' };
    var STATUS_CLASSES = { 1: 'status-active', 2: 'status-hold', 3: 'status-completed', 4: 'status-cancelled' };

    var _container = null;
    var _editMode  = false;

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    function _prefix() { return MemberUtils.getApiPrefix(); }

    function _items(data) {
        if (!data) return [];
        if (Array.isArray(data.list)) return data.list;
        if (Array.isArray(data)) return data;
        return [];
    }

    function _unitLabel(pref) { return pref === 2 ? 'imperial' : 'metric'; }
    function _weightUnit(pref) { return pref === 2 ? 'lbs' : 'kg'; }
    function _heightUnit(pref) { return pref === 2 ? 'imperial' : 'cm'; }

    function _statusBadge(status) {
        var label = STATUS_LABELS[status] || 'Unknown';
        var cls   = STATUS_CLASSES[status] || '';
        return '<span class="status-badge ' + cls + '">' + MemberUtils.escapeHtml(label) + '</span>';
    }

    function _row(label, value) {
        return '<div class="profile-row">' +
               '<span class="profile-label">' + MemberUtils.escapeHtml(label) + '</span>' +
               '<span class="profile-value">' + value + '</span>' +
               '</div>';
    }

    function _showToast(msg, isError) {
        var el = document.createElement('div');
        el.className = 'member-toast' + (isError ? ' member-toast-error' : '');
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 3000);
    }

    // -------------------------------------------------------------------------
    // Fetch profile if not cached
    // -------------------------------------------------------------------------
    function _ensureProfile(cb) {
        if (window.MemberProfile && window.MemberProfile.memberId) {
            cb(null, window.MemberProfile);
            return;
        }
        var url = _prefix() + '/10/Member' +
                  MemberUtils.buildQuery('FmcMember', null, 1, 0, null, false);
        MemberUtils.authGet(url).then(function (data) {
            var list = _items(data);
            if (list.length > 0) {
                window.MemberProfile = list[0];
                cb(null, window.MemberProfile);
            } else {
                cb(new Error('Profile not found'), null);
            }
        }).catch(function (err) { cb(err, null); });
    }

    // -------------------------------------------------------------------------
    // Fetch last weight log
    // -------------------------------------------------------------------------
    function _fetchLastWeight(memberId, cb) {
        var url = _prefix() + '/10/WeightLog' +
                  MemberUtils.buildQuery('FmcWeightLog', 'memberId=' + memberId, 1, 0, 'logDate', true);
        MemberUtils.authGet(url).then(function (data) {
            var list = _items(data);
            cb(list.length > 0 ? list[0] : null);
        }).catch(function () { cb(null); });
    }

    // -------------------------------------------------------------------------
    // View mode
    // -------------------------------------------------------------------------
    function _renderView(member, lastWeight) {
        var pref   = member.unitPreference || 1;
        var wUnit  = _weightUnit(pref);
        var hUnit  = _heightUnit(pref);
        var avatar = MemberUtils.escapeHtml((member.firstName || '?').charAt(0).toUpperCase());

        var currentWeightHtml = lastWeight
            ? MemberUtils.escapeHtml(MemberUtils.formatWeight(lastWeight.weightG, wUnit))
            : 'Not logged yet';

        var glp1Html = member.onGlp1
            ? 'Yes' + (member.glp1Medication ? ' (' + MemberUtils.escapeHtml(member.glp1Medication) + ')' : '')
            : 'No';

        return '<div class="profile-view">' +
            '<div class="profile-avatar">' + avatar + '</div>' +
            '<div class="profile-name">' + MemberUtils.escapeHtml((member.firstName || '') + ' ' + (member.lastName || '')) + '</div>' +
            '<div class="profile-email">' + MemberUtils.escapeHtml(member.email || '') + '</div>' +

            '<div class="profile-section">' +
            '<div class="profile-section-title">Personal Info</div>' +
            _row('Phone',           MemberUtils.escapeHtml(member.phone || '-')) +
            _row('Date of Birth',   MemberUtils.formatDate(member.dateOfBirth)) +
            _row('Height',          MemberUtils.escapeHtml(MemberUtils.formatHeight(member.heightCm, hUnit))) +
            _row('Starting Weight', MemberUtils.escapeHtml(MemberUtils.formatWeight(member.startingWeightG, wUnit))) +
            _row('Target Weight',   MemberUtils.escapeHtml(MemberUtils.formatWeight(member.targetWeightG, wUnit))) +
            _row('Current Weight',  currentWeightHtml) +
            '</div>' +

            '<div class="profile-section">' +
            '<div class="profile-section-title">Preferences</div>' +
            _row('Units',         pref === 2 ? 'Imperial' : 'Metric') +
            _row('Dietary Prefs', MemberUtils.escapeHtml(member.dietaryPrefs || '-')) +
            _row('Timezone',      MemberUtils.escapeHtml(member.timezone || '-')) +
            _row('GLP-1',         glp1Html) +
            '</div>' +

            '<div class="profile-section">' +
            '<div class="profile-section-title">Program</div>' +
            _row('Coach',           MemberUtils.escapeHtml(member.coachId || '-')) +
            _row('Program',         MemberUtils.escapeHtml(member.programId || '-')) +
            _row('Enrolled',        MemberUtils.formatDate(member.enrollmentDate)) +
            _row('Status',          _statusBadge(member.status)) +
            '</div>' +

            '<button class="member-btn member-btn-primary" id="profile-edit-btn">Edit Profile</button>' +
            '</div>';
    }

    // -------------------------------------------------------------------------
    // Edit mode
    // -------------------------------------------------------------------------
    function _renderEdit(member) {
        var pref     = member.unitPreference || 1;
        var wUnit    = _weightUnit(pref);
        var hUnit    = _heightUnit(pref);
        var twDisplay = member.targetWeightG
            ? (wUnit === 'lbs' ? MemberUtils.gramsToLbs(member.targetWeightG) : MemberUtils.gramsToKg(member.targetWeightG))
            : '';
        var hDisplay = member.heightCm
            ? (hUnit === 'imperial' ? '' : Math.round(member.heightCm))
            : '';
        var hFt = '', hIn = '';
        if (hUnit === 'imperial' && member.heightCm) {
            var fi = MemberUtils.cmToFtIn(member.heightCm);
            hFt = fi.feet; hIn = fi.inches;
        }

        return '<div class="profile-edit">' +
            '<div class="profile-section-title">Edit Profile</div>' +
            '<div class="profile-form">' +

            '<div class="form-row"><label>First Name</label>' +
            '<input type="text" id="pf-firstName" value="' + MemberUtils.escapeHtml(member.firstName || '') + '"></div>' +

            '<div class="form-row"><label>Last Name</label>' +
            '<input type="text" id="pf-lastName" value="' + MemberUtils.escapeHtml(member.lastName || '') + '"></div>' +

            '<div class="form-row"><label>Email</label>' +
            '<input type="email" id="pf-email" value="' + MemberUtils.escapeHtml(member.email || '') + '"></div>' +

            '<div class="form-row"><label>Phone</label>' +
            '<input type="tel" id="pf-phone" value="' + MemberUtils.escapeHtml(member.phone || '') + '"></div>' +

            '<div class="form-row"><label>Unit Preference</label>' +
            '<select id="pf-unitPref">' +
            '<option value="1"' + (pref === 1 ? ' selected' : '') + '>Metric</option>' +
            '<option value="2"' + (pref === 2 ? ' selected' : '') + '>Imperial</option>' +
            '</select></div>' +

            (hUnit === 'imperial'
                ? '<div class="form-row"><label>Height</label>' +
                  '<input type="number" id="pf-hFt" value="' + hFt + '" placeholder="ft" style="width:60px"> ft ' +
                  '<input type="number" id="pf-hIn" value="' + hIn + '" placeholder="in" style="width:60px"> in</div>'
                : '<div class="form-row"><label>Height (cm)</label>' +
                  '<input type="number" id="pf-heightCm" value="' + hDisplay + '"></div>') +

            '<div class="form-row"><label>Target Weight (' + wUnit + ')</label>' +
            '<input type="number" id="pf-targetWeight" step="0.1" value="' + twDisplay + '"></div>' +

            '<div class="form-row"><label>Timezone</label>' +
            '<input type="text" id="pf-timezone" value="' + MemberUtils.escapeHtml(member.timezone || '') + '"></div>' +

            '<div class="form-row"><label>Dietary Preferences</label>' +
            '<textarea id="pf-dietaryPrefs" rows="3">' + MemberUtils.escapeHtml(member.dietaryPrefs || '') + '</textarea></div>' +

            '<div class="form-row form-row-checkbox"><label>' +
            '<input type="checkbox" id="pf-onGlp1"' + (member.onGlp1 ? ' checked' : '') + '> On GLP-1 Medication' +
            '</label></div>' +

            '<div class="form-row" id="pf-glp1row"' + (member.onGlp1 ? '' : ' style="display:none"') + '>' +
            '<label>GLP-1 Medication Name</label>' +
            '<input type="text" id="pf-glp1Med" value="' + MemberUtils.escapeHtml(member.glp1Medication || '') + '"></div>' +

            '</div>' +
            '<div class="profile-form-actions">' +
            '<button class="member-btn member-btn-primary" id="profile-save-btn">Save</button>' +
            '<button class="member-btn member-btn-secondary" id="profile-cancel-btn">Cancel</button>' +
            '</div>' +
            '</div>';
    }

    // -------------------------------------------------------------------------
    // Wire edit-mode events
    // -------------------------------------------------------------------------
    function _wireEditEvents() {
        var glp1 = document.getElementById('pf-onGlp1');
        var row  = document.getElementById('pf-glp1row');
        if (glp1 && row) {
            glp1.addEventListener('change', function () {
                row.style.display = glp1.checked ? '' : 'none';
            });
        }

        var cancelBtn = document.getElementById('profile-cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                _editMode = false;
                _render();
            });
        }

        var saveBtn = document.getElementById('profile-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', _save);
        }
    }

    // -------------------------------------------------------------------------
    // Save
    // -------------------------------------------------------------------------
    function _save() {
        var member = window.MemberProfile;
        var pref   = parseInt(document.getElementById('pf-unitPref').value, 10) || 1;
        var wUnit  = _weightUnit(pref);

        var twRaw    = parseFloat(document.getElementById('pf-targetWeight').value) || 0;
        var targetWG = MemberUtils.parseWeight(twRaw, wUnit);

        var heightCm;
        if (pref === 2) {
            var ft = parseFloat(document.getElementById('pf-hFt').value) || 0;
            var ins = parseFloat(document.getElementById('pf-hIn').value) || 0;
            heightCm = MemberUtils.ftInToCm(ft, ins);
        } else {
            heightCm = parseFloat(document.getElementById('pf-heightCm').value) || member.heightCm || 0;
        }

        var payload = {
            memberId:        member.memberId,
            firstName:       document.getElementById('pf-firstName').value,
            lastName:        document.getElementById('pf-lastName').value,
            email:           document.getElementById('pf-email').value,
            phone:           document.getElementById('pf-phone').value,
            heightCm:        heightCm,
            targetWeightG:   targetWG,
            timezone:        document.getElementById('pf-timezone').value,
            dietaryPrefs:    document.getElementById('pf-dietaryPrefs').value,
            unitPreference:  pref,
            onGlp1:          document.getElementById('pf-onGlp1').checked,
            glp1Medication:  document.getElementById('pf-glp1Med') ? document.getElementById('pf-glp1Med').value : ''
        };

        MemberUtils.authPut(_prefix() + '/10/Member', payload).then(function (data) {
            var list = _items(data);
            if (list.length > 0) window.MemberProfile = list[0];
            else Object.assign(window.MemberProfile, payload);
            _editMode = false;
            _render();
            _showToast('Profile saved successfully.');
        }).catch(function (err) {
            _showToast('Save failed: ' + err.message, true);
        });
    }

    // -------------------------------------------------------------------------
    // Render dispatcher
    // -------------------------------------------------------------------------
    function _render() {
        if (!_container) return;
        _ensureProfile(function (err, member) {
            if (err || !member) {
                _container.innerHTML = '<div class="member-empty">Unable to load profile.</div>';
                return;
            }
            if (_editMode) {
                _container.innerHTML = _renderEdit(member);
                _wireEditEvents();
            } else {
                _fetchLastWeight(member.memberId, function (lastWeight) {
                    _container.innerHTML = _renderView(member, lastWeight);
                    var editBtn = document.getElementById('profile-edit-btn');
                    if (editBtn) {
                        editBtn.addEventListener('click', function () {
                            _editMode = true;
                            _render();
                        });
                    }
                });
            }
        });
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    window.MemberProfileTab = {
        init: function (container) {
            _container = container;
            _editMode  = false;
            _render();
        },
        refresh: function () {
            window.MemberProfile = null;
            _editMode = false;
            _render();
        }
    };

}());
