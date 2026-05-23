(function() {
    'use strict';
    var factory = window.Layer8EnumFactory;
    window.FmcNutritionFood = window.FmcNutritionFood || {};

    var MEAL_TYPE = factory.simple(['Unspecified', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout']);
    var AI_STATUS = factory.create([
        ['Unspecified', null, ''],
        ['Pending', 'pending', 'layer8d-status-pending'],
        ['Completed', 'completed', 'layer8d-status-completed'],
        ['Failed', 'failed', 'layer8d-status-inactive'],
        ['Skipped', 'skipped', 'layer8d-status-pending']
    ]);
    var RECIPE_CATEGORY = factory.simple(['Unspecified', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Smoothie', 'Soup', 'Salad']);

    var render = {};
    var renderers = Layer8DRenderers;
    render.mealType = function(v) { return renderers.renderEnum(v, MEAL_TYPE.enum); };
    render.aiStatus = renderers.createStatusRenderer(AI_STATUS.enum, AI_STATUS.classes);
    render.recipeCategory = function(v) { return renderers.renderEnum(v, RECIPE_CATEGORY.enum); };

    FmcNutritionFood.enums = {
        MEAL_TYPE: MEAL_TYPE.enum,
        AI_STATUS: AI_STATUS.enum,
        AI_STATUS_VALUES: AI_STATUS.values,
        AI_STATUS_CLASSES: AI_STATUS.classes,
        RECIPE_CATEGORY: RECIPE_CATEGORY.enum
    };
    FmcNutritionFood.render = render;
})();
