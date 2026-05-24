/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Enums
    // -------------------------------------------------------------------------
    var MEAL_TYPE   = { 0: 'Unknown', 1: 'Breakfast', 2: 'Lunch', 3: 'Dinner', 4: 'Snack' };
    var MEAL_SOURCE = { 0: 'Unknown', 1: 'Photo', 2: 'Text' };
    var AI_STATUS   = { 0: 'Unknown', 1: 'Pending', 2: 'Analyzing', 3: 'Complete', 4: 'Failed' };

    // -------------------------------------------------------------------------
    // Closure state
    // -------------------------------------------------------------------------
    var _container      = null;
    var _selectedType   = 1;   // default: Breakfast
    var _uploadedPath   = '';
    var _uploadedName   = '';
    var _uploadedSize   = 0;

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

    function _todayRange() {
        var d = new Date();
        d.setHours(0, 0, 0, 0);
        var start = Math.floor(d.getTime() / 1000);
        var end   = start + 86400;
        return { start: start, end: end };
    }

    function _formatTime(ts) {
        if (!ts) return '';
        if (typeof ts === 'string') ts = Number(ts);
        var d = new Date(ts * 1000);
        var h = d.getHours(), m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    function _aiStatusBadge(meal) {
        var s = Number(meal.aiStatus) || 0;
        if (s === 2) return '<span class="meal-ai-badge meal-ai-analyzing">&#8635; Analyzing</span>';
        if (s === 3) return '<span class="meal-ai-badge meal-ai-complete">&#10003; Complete</span>';
        if (s === 4) return '<span class="meal-ai-badge meal-ai-failed">&#10005; Failed</span>';
        if (s === 1) return '<span class="meal-ai-badge meal-ai-pending">Pending</span>';
        return '';
    }

    function _macroBar(meal) {
        var pct = MemberUtils.macroPercentages(
            meal.calories, meal.proteinG, meal.carbsG, meal.fatG
        );
        return '<div class="meal-macro-bar" title="Protein ' + pct.protein + '% / Carbs ' + pct.carbs + '% / Fat ' + pct.fat + '%">' +
               '<div class="protein" style="width:' + pct.protein + '%"></div>' +
               '<div class="carbs"   style="width:' + pct.carbs   + '%"></div>' +
               '<div class="fat"      style="width:' + pct.fat    + '%"></div>' +
               '</div>';
    }

    // -------------------------------------------------------------------------
    // AI analysis popup
    // -------------------------------------------------------------------------
    function _showMealDetail(meal) {
        var e = MemberUtils.escapeHtml;
        var name = MEAL_TYPE[Number(meal.mealType)] || 'Meal';
        var cal  = meal.calories ? MemberUtils.formatCalories(meal.calories) : '—';

        var html = '<div style="padding:8px">';
        if (meal.imageStoragePath && typeof Layer8FileUpload !== 'undefined') {
            html += '<div style="text-align:center;margin-bottom:12px">' +
                    '<img src="" id="meal-detail-img" style="max-width:100%;max-height:200px;border-radius:8px" alt="Meal photo">' +
                    '</div>';
        }
        html += '<div style="font-size:2rem;font-weight:700;text-align:center;margin-bottom:4px">' + e(cal) + '</div>';

        if (Number(meal.aiStatus) === 3) {
            html += _macroBar(meal);
            html += '<div style="display:flex;gap:16px;justify-content:center;margin:8px 0;font-size:0.875rem">' +
                    '<span>' + MemberUtils.formatGrams(meal.proteinG, 'protein') + '</span>' +
                    '<span>' + MemberUtils.formatGrams(meal.carbsG,   'carbs')   + '</span>' +
                    '<span>' + MemberUtils.formatGrams(meal.fatG,     'fat')     + '</span>' +
                    '<span>' + MemberUtils.formatGrams(meal.fiberG,   'fiber')   + '</span>' +
                    '</div>';
            if (meal.satietyScore) {
                html += '<div style="margin:8px 0;font-size:0.875rem">Satiety score: <strong>' + e(meal.satietyScore) + ' / 10</strong></div>';
            }
            if (meal.aiFeedback) {
                html += '<p style="font-size:0.875rem;margin:8px 0">' + e(meal.aiFeedback) + '</p>';
            }
            if (meal.aiSuggestions) {
                html += '<p style="font-size:0.875rem;margin:8px 0;font-style:italic">' + e(meal.aiSuggestions) + '</p>';
            }
        } else if (Number(meal.aiStatus) === 4) {
            html += '<p style="color:var(--fmc-error,#e53935)">' + e(meal.aiErrorMessage || 'Analysis failed.') + '</p>';
        } else {
            html += '<p style="color:var(--fmc-muted,#888)">AI analysis ' + (AI_STATUS[Number(meal.aiStatus)] || 'pending') + '.</p>';
        }

        if (meal.description) {
            html += '<hr style="margin:12px 0"><p style="font-size:0.875rem">' + e(meal.description) + '</p>';
        }
        html += '</div>';

        if (typeof Layer8MPopup !== 'undefined') {
            Layer8MPopup.show({ title: name + ' — ' + _formatTime(meal.loggedAt), content: html, size: 'medium' });
            if (meal.imageStoragePath) {
                setTimeout(function () {
                    var img = document.getElementById('meal-detail-img');
                    if (img) Layer8FileUpload.download(meal.imageStoragePath, meal.imageFileName || 'photo');
                }, 100);
            }
        } else {
            var panel = _container.querySelector('.meal-detail-panel');
            if (panel) { panel.innerHTML = html; panel.style.display = 'block'; }
        }
    }

    // -------------------------------------------------------------------------
    // Meal history
    // -------------------------------------------------------------------------
    function _renderHistory(meals) {
        var e = MemberUtils.escapeHtml;
        if (!meals || meals.length === 0) {
            return '<p class="meal-history-empty">No meals logged today.</p>';
        }
        var html = '';
        meals.forEach(function (m) {
            var typeName = MEAL_TYPE[Number(m.mealType)] || 'Meal';
            var thumb = '';
            if (m.imageStoragePath) {
                thumb = '<div class="meal-history-thumb"><span>&#127760;</span></div>';
            }
            var calText = m.calories ? MemberUtils.formatCalories(m.calories) : '';
            html += '<div class="meal-history-item" data-meal-id="' + e(m.mealId) + '">' +
                    thumb +
                    '<div class="meal-history-info">' +
                    '<div class="meal-history-name">' + e(typeName) + '</div>' +
                    '<div class="meal-history-meta">' + _formatTime(m.loggedAt) +
                    (calText ? ' &bull; ' + e(calText) : '') +
                    ' ' + _aiStatusBadge(m) +
                    '</div>' +
                    '</div>' +
                    '</div>';
        });
        return html;
    }

    function _loadHistory() {
        var range = _todayRange();
        var where = 'loggedAt>=' + range.start + ' loggedAt<' + range.end;
        var q = MemberUtils.buildQuery('Meal', where, 50, 0, 'loggedAt', true);
        var url = _prefix() + '/30/Meal' + q;
        MemberUtils.authGet(url).then(function (data) {
            var meals = _items(data);
            var hist  = _container.querySelector('.meal-history-list');
            if (hist) hist.innerHTML = _renderHistory(meals);
            _attachHistoryClicks(meals);
        }).catch(function (err) {
            console.warn('MemberMealLog: failed to load history', err);
        });
    }

    function _attachHistoryClicks(meals) {
        var items = _container.querySelectorAll('.meal-history-item');
        items.forEach(function (el) {
            el.addEventListener('click', function () {
                var id = el.getAttribute('data-meal-id');
                var meal = meals.find(function (m) { return m.mealId === id; });
                if (meal) _showMealDetail(meal);
            });
        });
    }

    // -------------------------------------------------------------------------
    // Photo upload
    // -------------------------------------------------------------------------
    function _handleFileSelected(file) {
        if (!file) return;
        if (typeof Layer8FileUpload === 'undefined') {
            console.warn('MemberMealLog: Layer8FileUpload not available');
            return;
        }
        var area = _container.querySelector('.meal-photo-area');
        if (area) area.innerHTML = '<span>Uploading&#8230;</span>';

        Layer8FileUpload.upload(file, 'meal', '1').then(function (res) {
            _uploadedPath = res.storagePath || '';
            _uploadedName = res.fileName    || file.name;
            _uploadedSize = res.fileSize    || file.size;
            if (area) {
                var reader = new FileReader();
                reader.onload = function (ev) {
                    area.innerHTML = '<img src="' + ev.target.result + '" style="max-width:100%;max-height:150px;border-radius:8px" alt="Preview">' +
                                     '<div style="font-size:0.75rem;margin-top:4px">' + MemberUtils.escapeHtml(_uploadedName) + '</div>';
                };
                reader.readAsDataURL(file);
            }
        }).catch(function (err) {
            _uploadedPath = '';
            if (area) area.innerHTML = '<span style="color:var(--fmc-error,#e53935)">Upload failed — tap to retry</span>';
            console.error('MemberMealLog: upload error', err);
        });
    }

    // -------------------------------------------------------------------------
    // Form submission
    // -------------------------------------------------------------------------
    function _submitMeal() {
        var desc = (_container.querySelector('.meal-description-input') || {}).value || '';
        desc = desc.trim();
        if (!_uploadedPath && !desc) {
            alert('Please add a photo or description before logging.');
            return;
        }
        var memberId = (window.MemberProfile && window.MemberProfile.memberId) ? window.MemberProfile.memberId : '';
        var payload = {
            memberId          : memberId,
            mealType          : _selectedType,
            source            : _uploadedPath ? 1 : 2,
            description       : desc,
            imageStoragePath  : _uploadedPath,
            imageFileName     : _uploadedName,
            imageFileSize     : _uploadedSize,
            loggedAt          : Math.floor(Date.now() / 1000)
        };
        var btn = _container.querySelector('.meal-submit-btn');
        if (btn) { btn.disabled = true; btn.textContent = 'Logging…'; }

        MemberUtils.authPost(_prefix() + '/30/Meal', payload).then(function () {
            _clearForm();
            if (btn) { btn.disabled = false; btn.textContent = 'Log Meal'; }
            _loadHistory();
            if (typeof Layer8DNotification !== 'undefined') {
                Layer8DNotification.success('Meal logged! AI analysis starting.');
            } else if (typeof Layer8MNotification !== 'undefined') {
                Layer8MNotification.success('Meal logged!');
            }
        }).catch(function (err) {
            if (btn) { btn.disabled = false; btn.textContent = 'Log Meal'; }
            console.error('MemberMealLog: submit error', err);
            alert('Failed to log meal. Please try again.');
        });
    }

    function _clearForm() {
        _uploadedPath = '';
        _uploadedName = '';
        _uploadedSize = 0;
        var area = _container.querySelector('.meal-photo-area');
        if (area) area.innerHTML = '<span class="meal-photo-prompt">&#128247; Tap to add a photo</span>';
        var ta = _container.querySelector('.meal-description-input');
        if (ta) ta.value = '';
    }

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    function _renderForm() {
        var typeBtns = Object.keys(MEAL_TYPE).filter(function (k) { return k > 0; }).map(function (k) {
            var active = Number(k) === _selectedType ? ' active' : '';
            return '<button class="meal-type-btn' + active + '" data-type="' + k + '">' + MEAL_TYPE[k] + '</button>';
        }).join('');

        return '<div class="meal-log-form">' +
               '<div class="meal-type-selector">' + typeBtns + '</div>' +
               '<div class="meal-photo-area">' +
               '<span class="meal-photo-prompt">&#128247; Tap to add a photo</span>' +
               '</div>' +
               '<input type="file" class="meal-file-input" accept="image/*" style="display:none">' +
               '<textarea class="meal-description-input" rows="3" placeholder="Or describe your meal…"></textarea>' +
               '<button class="meal-submit-btn">Log Meal</button>' +
               '</div>';
    }

    function _renderShell() {
        return _renderForm() +
               '<div class="meal-history">' +
               '<div class="meal-history-title">Today\'s Meals</div>' +
               '<div class="meal-history-list"><p class="meal-history-empty">Loading&#8230;</p></div>' +
               '</div>' +
               '<div class="meal-detail-panel" style="display:none"></div>';
    }

    // -------------------------------------------------------------------------
    // Event wiring
    // -------------------------------------------------------------------------
    function _wireEvents() {
        // Meal type pills
        _container.querySelectorAll('.meal-type-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                _selectedType = Number(btn.getAttribute('data-type'));
                _container.querySelectorAll('.meal-type-btn').forEach(function (b) {
                    b.classList.toggle('active', b === btn);
                });
            });
        });

        // Photo area click → trigger file input
        var photoArea = _container.querySelector('.meal-photo-area');
        var fileInput = _container.querySelector('.meal-file-input');
        if (photoArea && fileInput) {
            photoArea.addEventListener('click', function () { fileInput.click(); });
            fileInput.addEventListener('change', function () {
                if (fileInput.files && fileInput.files[0]) {
                    _handleFileSelected(fileInput.files[0]);
                }
            });
        }

        // Submit
        var submitBtn = _container.querySelector('.meal-submit-btn');
        if (submitBtn) submitBtn.addEventListener('click', _submitMeal);
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    window.MemberMealLog = {
        init: function (container) {
            _container = container;
            _container.innerHTML = _renderShell();
            _wireEvents();
            _loadHistory();
        },
        refresh: function () {
            if (_container) _loadHistory();
        }
    };

}());
