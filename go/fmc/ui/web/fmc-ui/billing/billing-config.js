(function() {
    'use strict';
    Layer8ModuleConfigFactory.create({
        namespace: 'FmcBilling',
        modules: {
            'finance': {
                label: 'Finance', icon: '💰',
                services: [
                    { key: 'subscriptions', label: 'Subscriptions', icon: '💳', endpoint: '/50/Subscript', model: 'FmcSubscription' },
                    { key: 'partners', label: 'Partners', icon: '🤝', endpoint: '/50/Partner', model: 'FmcPartner' }
                ]
            }
        },
        submodules: ['FmcBillingFin']
    });
})();
