(function() {
    'use strict';
    Layer8SectionConfigs.register('core', {
        title: 'Core',
        subtitle: 'Members & Coaches',
        icon: '👥',
        svgContent: Layer8SvgFactory.generate('people'),
        initFn: 'initializeFmcCore',
        modules: [
            {
                key: 'people',
                label: 'People',
                icon: '👤',
                isDefault: true,
                services: [
                    { key: 'members', label: 'Members', icon: '👤', isDefault: true },
                    { key: 'coaches', label: 'Coaches', icon: '🏋️' }
                ]
            }
        ]
    });
})();
