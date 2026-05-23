(function() {
    'use strict';
    Layer8DModuleFactory.create({
        namespace: 'FmcCore',
        defaultModule: 'people',
        defaultService: 'members',
        sectionSelector: 'people',
        initializerName: 'initializeFmcCore',
        requiredNamespaces: ['FmcCorePeople']
    });
})();
