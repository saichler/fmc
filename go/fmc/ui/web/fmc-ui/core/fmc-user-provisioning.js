(function() {
    'use strict';

    var USERS_ENDPOINT = '/73/users';
    var DEFAULT_PASSWORD = '12345678';

    function getHeaders() {
        return Object.assign({ 'Content-Type': 'application/json' },
            typeof getAuthHeaders === 'function' ? getAuthHeaders() : {});
    }

    async function postUser(user) {
        try {
            var resp = await fetch(Layer8DConfig.resolveEndpoint(USERS_ENDPOINT), {
                method: 'POST', headers: getHeaders(), body: JSON.stringify(user)
            });
            if (!resp.ok) {
                console.warn('[FmcUserProvisioning] user creation returned', resp.status, await resp.text());
                return false;
            }
            return true;
        } catch (e) {
            console.warn('[FmcUserProvisioning] user creation failed', e);
            return false;
        }
    }

    async function createMemberUser(member) {
        var email = member.email;
        if (!email) return;
        var userId = member.memberId;
        var roles = {}; roles['member'] = true;
        var ok = await postUser({
            userId: userId,
            fullName: (member.firstName + ' ' + member.lastName).trim(),
            email: email,
            accountStatus: 'ACCOUNT_STATUS_ACTIVE',
            portal: 'member/app.html',
            password: { hash: DEFAULT_PASSWORD },
            roles: roles
        });
        if (ok) Layer8DNotification.success('User account "' + email + '" created');
        else    Layer8DNotification.warning('Member saved but user account creation failed');
    }

    window.FmcUserProvisioning = { createMemberUser: createMemberUser };
})();
