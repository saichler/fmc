(function() {
    'use strict';
    Layer8DModuleFactory.create({
        namespace: 'FmcNutrition',
        defaultModule: 'food',
        defaultService: 'meals',
        sectionSelector: 'food',
        initializerName: 'initializeFmcNutrition',
        requiredNamespaces: ['FmcNutritionFood']
    });
})();
