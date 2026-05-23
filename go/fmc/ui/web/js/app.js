/*
© 2025 Sharon Aicler (saichler@gmail.com)
Layer 8 Ecosystem is licensed under the Apache License, Version 2.0.
*/

function getAuthHeaders() {
    const bearerToken = sessionStorage.getItem('bearerToken');
    return {
        'Authorization': bearerToken ? `Bearer ${bearerToken}` : '',
        'Content-Type': 'application/json'
    };
}

async function makeAuthenticatedRequest(url, options = {}) {
    const bearerToken = sessionStorage.getItem('bearerToken');
    if (!bearerToken) {
        showErrorAndLogout('Your session has expired.', 'No authentication token found.');
        return;
    }
    const headers = {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
        ...options.headers
    };
    try {
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            showErrorAndLogout('Unauthorized — session expired.', 'Server returned 401 for: ' + url);
            return;
        }
        return response;
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

function logout() {
    sessionStorage.removeItem('bearerToken');
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('rememberedUser');
    window.location.href = 'l8ui/login/index.html';
}

function showErrorAndLogout(message, detail) {
    sessionStorage.removeItem('bearerToken');
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('rememberedUser');
    if (typeof Layer8DPopup !== 'undefined') {
        Layer8DPopup.show({
            title: 'Session Error',
            content: '<div style="padding:16px;"><p style="margin-bottom:12px;font-size:15px;">' +
                Layer8DUtils.escapeHtml(message) + '</p>' +
                (detail ? '<pre style="background:var(--layer8d-bg-light);padding:12px;border-radius:6px;font-size:12px;white-space:pre-wrap;">' +
                Layer8DUtils.escapeHtml(detail) + '</pre>' : '') + '</div>',
            size: 'medium',
            showFooter: true,
            saveButtonText: 'Go to Login',
            showCancelButton: false,
            onSave: function() { Layer8DPopup.close(); window.location.href = 'l8ui/login/index.html'; }
        });
    } else {
        alert(message + (detail ? '\n\n' + detail : ''));
        window.location.href = 'l8ui/login/index.html';
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (typeof Layer8DConfig !== 'undefined') {
        await Layer8DConfig.load();
    }

    const bearerToken = sessionStorage.getItem('bearerToken');
    if (!bearerToken) {
        window.location.href = 'l8ui/login/index.html';
        return;
    }

    localStorage.setItem('bearerToken', bearerToken);
    window.bearerToken = bearerToken;

    const username = sessionStorage.getItem('currentUser') || 'Admin';
    document.querySelector('.username').textContent = username;

    // FMC does not use ModConfig — skip Layer8DModuleFilter to avoid logout on 404

    loadSection('dashboard');

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const section = this.getAttribute('data-section');
            loadSection(section);
        });
    });
});
