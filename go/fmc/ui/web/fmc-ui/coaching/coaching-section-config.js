(function() {
    'use strict';
    Layer8SectionConfigs.register('coaching', {
        title: 'Coaching',
        subtitle: 'Programs, Sessions, Messages & Goals',
        icon: '🎯',
        svgContent: Layer8SvgFactory.generate('planning'),
        initFn: 'initializeFmcCoaching',
        modules: [
            {
                key: 'management',
                label: 'Management',
                icon: '📋',
                isDefault: true,
                services: [
                    { key: 'programs', label: 'Programs', icon: '📦', isDefault: true },
                    { key: 'sessions', label: 'Sessions', icon: '📅' },
                    { key: 'messages', label: 'Messages', icon: '💬' },
                    { key: 'goals', label: 'Goals', icon: '🎯' }
                ]
            }
        ]
    });
})();
