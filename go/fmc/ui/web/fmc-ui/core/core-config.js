(function() {
    'use strict';
    Layer8ModuleConfigFactory.create({
        namespace: 'FmcCore',
        modules: {
            'people': {
                label: 'People', icon: '👤',
                services: [
                    { key: 'members', label: 'Members', icon: '👤', endpoint: '/10/Member', model: 'FmcMember' },
                    { key: 'coaches', label: 'Coaches', icon: '🏋️', endpoint: '/10/Coach', model: 'FmcCoach' }
                ]
            }
        },
        submodules: ['FmcCorePeople']
    });
})();
