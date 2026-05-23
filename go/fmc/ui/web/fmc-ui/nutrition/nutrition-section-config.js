(function() {
    'use strict';
    Layer8SectionConfigs.register('nutrition', {
        title: 'Nutrition',
        subtitle: 'Meals & Recipes',
        icon: '🍽️',
        svgContent: Layer8SvgFactory.generate('inventory'),
        initFn: 'initializeFmcNutrition',
        modules: [
            {
                key: 'food',
                label: 'Food',
                icon: '🥗',
                isDefault: true,
                services: [
                    { key: 'meals', label: 'Meals', icon: '🍽️', isDefault: true },
                    { key: 'recipes', label: 'Recipes', icon: '📖' }
                ]
            }
        ]
    });
})();
