/*
 * © 2025 Sharon Aicler (saichler@gmail.com)
 * Layer 8 Ecosystem — Apache License, Version 2.0
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------
    var SENDER_MEMBER = 1;
    var SENDER_COACH  = 2;
    var SENDER_SYSTEM = 3;
    var POLL_INTERVAL_MS = 10000;
    var SEND_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    var CHAT_ICON = '<span class="member-empty-icon">💬</span>';

    // -------------------------------------------------------------------------
    // Internal state
    // -------------------------------------------------------------------------
    var _container   = null;
    var _messagesEl  = null;
    var _inputEl     = null;
    var _sendBtn     = null;
    var _pollTimer   = null;
    var _lastSentAt  = 0;   // Unix seconds of newest message seen
    var _sending     = false;

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

    function _nowSec() { return Math.floor(Date.now() / 1000); }

    function _dayLabel(timestamp) {
        if (typeof timestamp === 'string') timestamp = Number(timestamp);
        var d = new Date(timestamp * 1000);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    function _timeLabel(timestamp) {
        if (typeof timestamp === 'string') timestamp = Number(timestamp);
        var d = new Date(timestamp * 1000);
        var h = d.getHours(), m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' + m : m) + ' ' + ampm;
    }

    function _sameDay(tsA, tsB) {
        var a = new Date(Number(tsA) * 1000), b = new Date(Number(tsB) * 1000);
        return a.getFullYear() === b.getFullYear() &&
               a.getMonth()    === b.getMonth()    &&
               a.getDate()     === b.getDate();
    }

    // -------------------------------------------------------------------------
    // Rendering
    // -------------------------------------------------------------------------
    function _dateSeparator(timestamp) {
        var el = document.createElement('div');
        el.style.cssText = 'text-align:center;margin:8px 0;';
        el.innerHTML = '<span style="font-size:11px;color:var(--layer8d-text-muted,#718096);background:var(--layer8d-bg-light);padding:2px 10px;border-radius:10px;">' +
                       MemberUtils.escapeHtml(_dayLabel(timestamp)) + '</span>';
        return el;
    }

    function _bubbleEl(msg) {
        var sender = Number(msg.sender) || 0;
        var cls = sender === SENDER_MEMBER ? 'member' : sender === SENDER_COACH ? 'coach' : 'system';
        var alignMap = { member: 'flex-end', coach: 'flex-start', system: 'center' };
        var wrap = document.createElement('div');
        wrap.style.cssText = 'display:flex;flex-direction:column;align-items:' + (alignMap[cls] || 'flex-start') + ';';
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + cls;
        bubble.textContent = msg.content || '';
        wrap.appendChild(bubble);
        var ts = Number(msg.sentAt) || 0;
        if (ts > 0) {
            var time = document.createElement('div');
            time.className = 'chat-time' + (sender === SENDER_MEMBER ? ' member' : '');
            time.textContent = _timeLabel(ts);
            wrap.appendChild(time);
        }
        return wrap;
    }

    function _appendMessages(msgs, prepend) {
        if (!_messagesEl || !msgs.length) return;
        var prevTs = prepend ? 0 : _lastSentAt;
        msgs.forEach(function (msg) {
            var ts = Number(msg.sentAt) || 0;
            if (!prepend && prevTs > 0 && !_sameDay(prevTs, ts)) _messagesEl.appendChild(_dateSeparator(ts));
            else if (prepend && prevTs === 0) _messagesEl.insertBefore(_dateSeparator(ts), _messagesEl.firstChild);
            var el = _bubbleEl(msg);
            if (prepend) _messagesEl.insertBefore(el, _messagesEl.firstChild);
            else _messagesEl.appendChild(el);
            prevTs = ts;
            if (ts > _lastSentAt) _lastSentAt = ts;
        });
    }

    function _scrollToBottom() {
        if (_messagesEl) _messagesEl.scrollTop = _messagesEl.scrollHeight;
    }

    function _showEmpty() {
        _messagesEl.innerHTML = '<div class="member-empty">' + CHAT_ICON + '<p>Send your first message to your coach!</p></div>';
    }

    // -------------------------------------------------------------------------
    // Network
    // -------------------------------------------------------------------------
    function _fetchMessages(sinceTs) {
        var profile = window.MemberProfile || {};
        var memberId = profile.memberId || '';
        if (!memberId) return Promise.resolve([]);
        var where = 'memberId=' + memberId;
        if (sinceTs > 0) where += ' AND sentAt>' + sinceTs;
        var qs = MemberUtils.buildQuery('FmcMessage', where, 100, 0, 'sentAt', false);
        return MemberUtils.authGet(_prefix() + '/20/Message' + qs)
            .then(function (data) { return _items(data); })
            .catch(function () { return []; });
    }

    function _sendMessage(content) {
        var profile = window.MemberProfile || {};
        return MemberUtils.authPost(_prefix() + '/20/Message', {
            memberId: profile.memberId || '',
            coachId:  profile.coachId  || '',
            sender:   SENDER_MEMBER,
            content:  content,
            sentAt:   _nowSec()
        });
    }

    // -------------------------------------------------------------------------
    // Polling
    // -------------------------------------------------------------------------
    function _startPolling() {
        _stopPolling();
        _pollTimer = setInterval(function () {
            _fetchMessages(_lastSentAt).then(function (msgs) {
                if (!msgs.length) return;
                if (_messagesEl.querySelector('.member-empty')) _messagesEl.innerHTML = '';
                _appendMessages(msgs, false);
                _scrollToBottom();
            });
        }, POLL_INTERVAL_MS);
    }

    function _stopPolling() { if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; } }

    // -------------------------------------------------------------------------
    // Send handler
    // -------------------------------------------------------------------------
    function _handleSend() {
        if (_sending || !_inputEl) return;
        var content = _inputEl.value.trim();
        if (!content) return;
        _sending = true;
        _sendBtn.disabled = true;
        if (_messagesEl.querySelector('.member-empty')) _messagesEl.innerHTML = '';
        _appendMessages([{ sender: SENDER_MEMBER, content: content, sentAt: _nowSec() }], false);
        _inputEl.value = '';
        _scrollToBottom();
        _sendMessage(content).then(function (saved) {
            var ts = Number((saved && saved.sentAt) || 0);
            if (ts > _lastSentAt) _lastSentAt = ts;
        }).catch(function () {
            // optimistic bubble stays; treat as sent
        }).then(function () {
            _sending = false;
            _sendBtn.disabled = false;
            _inputEl.focus();
        });
    }

    // -------------------------------------------------------------------------
    // Build UI
    // -------------------------------------------------------------------------
    function _buildUI(container) {
        container.innerHTML =
            '<div class="chat-container">' +
            '<div class="chat-messages"></div>' +
            '<div class="chat-input-bar">' +
            '<input class="chat-input" type="text" placeholder="Message your coach…" />' +
            '<button class="chat-send-btn" aria-label="Send">' + SEND_SVG + '</button>' +
            '</div></div>';
        _messagesEl = container.querySelector('.chat-messages');
        _inputEl    = container.querySelector('.chat-input');
        _sendBtn    = container.querySelector('.chat-send-btn');
        _sendBtn.addEventListener('click', _handleSend);
        _inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _handleSend(); }
        });
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------
    function init(container) {
        _container = container; _lastSentAt = 0; _sending = false;
        _buildUI(container);
        _messagesEl.innerHTML = '<div class="member-loading">Loading messages…</div>';
        _fetchMessages(0).then(function (msgs) {
            _messagesEl.innerHTML = '';
            if (!msgs.length) { _showEmpty(); } else { _appendMessages(msgs, false); _scrollToBottom(); }
            _startPolling();
        });
    }

    function refresh() {
        if (!_container) return;
        _stopPolling(); _lastSentAt = 0;
        _messagesEl.innerHTML = '<div class="member-loading">Loading messages…</div>';
        _fetchMessages(0).then(function (msgs) {
            _messagesEl.innerHTML = '';
            if (!msgs.length) { _showEmpty(); return; }
            _appendMessages(msgs, false); _scrollToBottom();
        }).then(function () { _startPolling(); });
    }

    function destroy() {
        _stopPolling();
        _container = null; _messagesEl = null; _inputEl = null; _sendBtn = null;
    }

    window.MemberChat = { init: init, refresh: refresh, destroy: destroy };

}());
