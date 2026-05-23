(function() {
    'use strict';

    window.LAYER8M_NAV_CONFIG = {
        modules: [
            { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', hasSubModules: false },
            { key: 'core', label: 'Members & Coaches', icon: 'hcm', hasSubModules: true },
            { key: 'coaching', label: 'Coaching', icon: 'projects', hasSubModules: true },
            { key: 'nutrition', label: 'Nutrition', icon: 'scm', hasSubModules: true },
            { key: 'progress', label: 'Progress', icon: 'bi', hasSubModules: true },
            { key: 'billing', label: 'Billing', icon: 'financial', hasSubModules: true },
            { key: 'system', label: 'System', icon: 'system', hasSubModules: true }
        ],

        core: {
            subModules: [
                { key: 'people', label: 'People', icon: 'hcm' }
            ],
            services: {
                'people': [
                    { key: 'members', label: 'Members', icon: 'hcm', endpoint: '/10/Member', model: 'FmcMember', idField: 'memberId' },
                    { key: 'coaches', label: 'Coaches', icon: 'hcm', endpoint: '/10/Coach', model: 'FmcCoach', idField: 'coachId' }
                ]
            }
        },

        coaching: {
            subModules: [
                { key: 'management', label: 'Management', icon: 'projects' }
            ],
            services: {
                'management': [
                    { key: 'programs', label: 'Programs', icon: 'projects', endpoint: '/20/Program', model: 'FmcProgram', idField: 'programId' },
                    { key: 'sessions', label: 'Sessions', icon: 'projects', endpoint: '/20/Session', model: 'FmcSession', idField: 'sessionId', supportedViews: ['table', 'calendar'] },
                    { key: 'goals', label: 'Goals', icon: 'projects', endpoint: '/20/Goal', model: 'FmcGoal', idField: 'goalId' },
                    { key: 'messages', label: 'Messages', icon: 'documents', endpoint: '/20/Message', model: 'FmcMessage', idField: 'messageId', readOnly: true }
                ]
            }
        },

        nutrition: {
            subModules: [
                { key: 'food', label: 'Food', icon: 'scm' }
            ],
            services: {
                'food': [
                    { key: 'meals', label: 'Meals', icon: 'scm', endpoint: '/30/Meal', model: 'FmcMeal', idField: 'mealId' },
                    { key: 'recipes', label: 'Recipes', icon: 'scm', endpoint: '/30/Recipe', model: 'FmcRecipe', idField: 'recipeId' }
                ]
            }
        },

        progress: {
            subModules: [
                { key: 'tracking', label: 'Tracking', icon: 'bi' }
            ],
            services: {
                'tracking': [
                    { key: 'weight', label: 'Weight Logs', icon: 'bi', endpoint: '/40/WeightLog', model: 'FmcWeightLog', idField: 'logId', supportedViews: ['table', 'chart'] },
                    { key: 'habits', label: 'Habit Logs', icon: 'bi', endpoint: '/40/HabitLog', model: 'FmcHabitLog', idField: 'logId' }
                ]
            }
        },

        billing: {
            subModules: [
                { key: 'finance', label: 'Finance', icon: 'financial' }
            ],
            services: {
                'finance': [
                    { key: 'subscriptions', label: 'Subscriptions', icon: 'financial', endpoint: '/50/Subscript', model: 'FmcSubscription', idField: 'subscriptionId' },
                    { key: 'partners', label: 'Partners', icon: 'financial', endpoint: '/50/Partner', model: 'FmcPartner', idField: 'partnerId' }
                ]
            }
        },

        icons: {},
        getIcon(key) { return this.icons[key] || ''; }
    };
})();
