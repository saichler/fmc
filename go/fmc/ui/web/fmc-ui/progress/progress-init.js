(function() {
    'use strict';
    Layer8DModuleFactory.create({
        namespace: 'FmcProgress',
        defaultModule: 'tracking',
        defaultService: 'weight',
        sectionSelector: 'tracking',
        initializerName: 'initializeFmcProgress',
        requiredNamespaces: ['FmcProgressTrack']
    });
})();
