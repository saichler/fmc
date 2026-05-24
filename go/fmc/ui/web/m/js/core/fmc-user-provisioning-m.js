(function() {
    'use strict';

    var USERS_ENDPOINT = '/73/users';
    var DEFAULT_PASSWORD = 'Demo123!';

    async function postUser(user) {
        try {
            await Layer8MAuth.post(Layer8MConfig.resolveEndpoint(USERS_ENDPOINT), user);
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
        if (ok) Layer8MUtils.showSuccess('User account "' + email + '" created');
        else    Layer8MUtils.showError('Member saved but user account creation failed');
    }

    window.FmcUserProvisioningMobile = { createMemberUser: createMemberUser };
})();
