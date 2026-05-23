(function() {
    'use strict';
    Layer8DModuleFactory.create({
        namespace: 'FmcBilling',
        defaultModule: 'finance',
        defaultService: 'subscriptions',
        sectionSelector: 'finance',
        initializerName: 'initializeFmcBilling',
        requiredNamespaces: ['FmcBillingFin']
    });
})();
