(function() {
    'use strict';
    Layer8ModuleConfigFactory.create({
        namespace: 'FmcCoaching',
        modules: {
            'management': {
                label: 'Management', icon: '📋',
                services: [
                    { key: 'programs', label: 'Programs', icon: '📦', endpoint: '/20/Program', model: 'FmcProgram' },
                    { key: 'sessions', label: 'Sessions', icon: '📅', endpoint: '/20/Session', model: 'FmcSession', supportedViews: ['table', 'calendar', 'kanban'] },
                    { key: 'messages', label: 'Messages', icon: '💬', endpoint: '/20/Message', model: 'FmcMessage', supportedViews: ['table', 'timeline'] },
                    { key: 'goals', label: 'Goals', icon: '🎯', endpoint: '/20/Goal', model: 'FmcGoal', supportedViews: ['table', 'kanban'] }
                ]
            }
        },
        submodules: ['FmcCoachingMgmt']
    });
})();
