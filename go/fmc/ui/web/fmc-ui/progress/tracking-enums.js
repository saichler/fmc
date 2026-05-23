(function() {
    'use strict';
    var factory = window.Layer8EnumFactory;
    window.FmcProgressTrack = window.FmcProgressTrack || {};

    var HABIT_CATEGORY = factory.simple(['Unspecified', 'Eating', 'Hydration', 'Sleep', 'Movement', 'Mindfulness']);

    var render = {};
    var renderers = Layer8DRenderers;
    render.habitCategory = function(v) { return renderers.renderEnum(v, HABIT_CATEGORY.enum); };

    FmcProgressTrack.enums = {
        HABIT_CATEGORY: HABIT_CATEGORY.enum
    };
    FmcProgressTrack.render = render;
})();
