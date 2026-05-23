(function() {
    'use strict';
    Layer8SectionConfigs.register('billing', {
        title: 'Billing',
        subtitle: 'Subscriptions & Partners',
        icon: '💳',
        svgContent: Layer8SvgFactory.generate('finance'),
        initFn: 'initializeFmcBilling',
        modules: [
            {
                key: 'finance',
                label: 'Finance',
                icon: '💰',
                isDefault: true,
                services: [
                    { key: 'subscriptions', label: 'Subscriptions', icon: '💳', isDefault: true },
                    { key: 'partners', label: 'Partners', icon: '🤝' }
                ]
            }
        ]
    });
})();
