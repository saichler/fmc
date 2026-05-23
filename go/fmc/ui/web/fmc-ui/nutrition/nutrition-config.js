(function() {
    'use strict';
    Layer8ModuleConfigFactory.create({
        namespace: 'FmcNutrition',
        modules: {
            'food': {
                label: 'Food', icon: '🥗',
                services: [
                    { key: 'meals', label: 'Meals', icon: '🍽️', endpoint: '/30/Meal', model: 'FmcMeal' },
                    { key: 'recipes', label: 'Recipes', icon: '📖', endpoint: '/30/Recipe', model: 'FmcRecipe' }
                ]
            }
        },
        submodules: ['FmcNutritionFood']
    });
})();
