(function() {
    'use strict';
    var f = window.Layer8FormFactory;
    var enums = FmcNutritionFood.enums;

    FmcNutritionFood.forms = {
        FmcMeal: f.form('Meal', [
            f.section('Meal Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.reference('coachId', 'Coach', 'FmcCoach'),
                ...f.select('mealType', 'Type', enums.MEAL_TYPE, true),
                ...f.textarea('description', 'Description', true),
                ...f.date('loggedAt', 'Logged At')
            ]),
            f.section('Nutrition', [
                ...f.number('calories', 'Calories'),
                ...f.number('proteinG', 'Protein (g)'),
                ...f.number('fiberG', 'Fiber (g)'),
                ...f.number('carbsG', 'Carbs (g)'),
                ...f.number('fatG', 'Fat (g)'),
                ...f.number('satietyScore', 'Satiety Score (1-10)')
            ]),
            f.section('AI Analysis', [
                ...f.select('aiStatus', 'AI Status', enums.AI_STATUS),
                ...f.textarea('aiFeedback', 'AI Feedback'),
                ...f.textarea('aiSuggestions', 'AI Suggestions'),
                ...f.number('confidencePct', 'Confidence (%)'),
                ...f.text('aiError', 'AI Error')
            ]),
            f.section('Image', [
                ...f.file('imageStoragePath', 'Meal Photo')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcRecipe: f.form('Recipe', [
            f.section('Recipe Details', [
                ...f.text('name', 'Name', true),
                ...f.textarea('description', 'Description'),
                ...f.select('category', 'Category', enums.RECIPE_CATEGORY),
                ...f.number('prepTimeMin', 'Prep Time (min)'),
                ...f.number('cookTimeMin', 'Cook Time (min)'),
                ...f.number('servings', 'Servings')
            ]),
            f.section('Nutrition', [
                ...f.number('calories', 'Calories'),
                ...f.number('proteinG', 'Protein (g)'),
                ...f.number('fiberG', 'Fiber (g)'),
                ...f.number('carbsG', 'Carbs (g)'),
                ...f.number('fatG', 'Fat (g)')
            ]),
            f.section('Publishing', [
                ...f.text('contributedBy', 'Contributed By'),
                ...f.checkbox('isValidated', 'Validated'),
                ...f.checkbox('isPublished', 'Published')
            ]),
            f.section('Ingredients', [
                ...f.inlineTable('ingredients', 'Ingredients', [
                    { key: 'ingredientId', label: 'ID', hidden: true },
                    { key: 'name', label: 'Name', type: 'text' },
                    { key: 'quantity', label: 'Qty', type: 'text' },
                    { key: 'unit', label: 'Unit', type: 'text' },
                    { key: 'calories', label: 'Cal', type: 'number' },
                    { key: 'proteinG', label: 'Protein', type: 'number' }
                ])
            ]),
            f.section('Steps', [
                ...f.inlineTable('steps', 'Steps', [
                    { key: 'stepId', label: 'ID', hidden: true },
                    { key: 'stepNumber', label: '#', type: 'number' },
                    { key: 'instruction', label: 'Instruction', type: 'text' },
                    { key: 'durationMin', label: 'Duration', type: 'number' }
                ])
            ]),
            f.section('Image', [
                ...f.file('imageStoragePath', 'Recipe Image')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ])
    };
})();
