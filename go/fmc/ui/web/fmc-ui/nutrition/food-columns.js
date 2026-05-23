(function() {
    'use strict';
    var col = window.Layer8ColumnFactory;
    var enums = FmcNutritionFood.enums;
    var render = FmcNutritionFood.render;

    FmcNutritionFood.columns = {
        FmcMeal: [
            ...col.id('mealId'),
            ...col.col('memberId', 'Member'),
            ...col.col('coachId', 'Coach'),
            ...col.enum('mealType', 'Type', null, render.mealType),
            ...col.col('description', 'Description'),
            ...col.date('loggedAt', 'Logged'),
            ...col.number('calories', 'Calories'),
            ...col.number('proteinG', 'Protein (g)'),
            ...col.number('fiberG', 'Fiber (g)'),
            ...col.number('satietyScore', 'Satiety'),
            ...col.status('aiStatus', 'AI Status', enums.AI_STATUS_VALUES, render.aiStatus)
        ],
        FmcRecipe: [
            ...col.id('recipeId'),
            ...col.col('name', 'Name'),
            ...col.enum('category', 'Category', null, render.recipeCategory),
            ...col.number('prepTimeMin', 'Prep (min)'),
            ...col.number('cookTimeMin', 'Cook (min)'),
            ...col.number('servings', 'Servings'),
            ...col.number('calories', 'Calories'),
            ...col.number('proteinG', 'Protein (g)'),
            ...col.boolean('isValidated', 'Validated'),
            ...col.boolean('isPublished', 'Published')
        ]
    };
    FmcNutritionFood.primaryKeys = { FmcMeal: 'mealId', FmcRecipe: 'recipeId' };
})();
