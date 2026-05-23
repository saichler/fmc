(function() {
    'use strict';
    Layer8DModuleFactory.create({
        namespace: 'FmcCoaching',
        defaultModule: 'management',
        defaultService: 'programs',
        sectionSelector: 'management',
        initializerName: 'initializeFmcCoaching',
        requiredNamespaces: ['FmcCoachingMgmt']
    });
})();
