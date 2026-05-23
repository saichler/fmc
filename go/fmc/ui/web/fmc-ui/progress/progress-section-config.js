(function() {
    'use strict';
    Layer8SectionConfigs.register('progress', {
        title: 'Progress',
        subtitle: 'Weight & Habit Tracking',
        icon: '📈',
        svgContent: Layer8SvgFactory.generate('analytics'),
        initFn: 'initializeFmcProgress',
        modules: [
            {
                key: 'tracking',
                label: 'Tracking',
                icon: '📊',
                isDefault: true,
                services: [
                    { key: 'weight', label: 'Weight Logs', icon: '⚖️', isDefault: true },
                    { key: 'habits', label: 'Habit Logs', icon: '✅' }
                ]
            }
        ]
    });
})();
