(function() {
    'use strict';
    Layer8ModuleConfigFactory.create({
        namespace: 'FmcProgress',
        modules: {
            'tracking': {
                label: 'Tracking', icon: '📊',
                services: [
                    { key: 'weight', label: 'Weight Logs', icon: '⚖️', endpoint: '/40/WeightLog', model: 'FmcWeightLog' },
                    { key: 'habits', label: 'Habit Logs', icon: '✅', endpoint: '/40/HabitLog', model: 'FmcHabitLog' }
                ]
            }
        },
        submodules: ['FmcProgressTrack']
    });
})();
