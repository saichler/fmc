(function() {
    'use strict';
    var factory = window.Layer8EnumFactory;
    window.FmcCorePeople = window.FmcCorePeople || {};

    var MEMBER_STATUS = factory.create([
        ['Unspecified', null, ''],
        ['Active', 'active', 'layer8d-status-active'],
        ['On Hold', 'on_hold', 'layer8d-status-pending'],
        ['Completed', 'completed', 'layer8d-status-completed'],
        ['Cancelled', 'cancelled', 'layer8d-status-inactive']
    ]);
    var COACH_STATUS = factory.create([
        ['Unspecified', null, ''],
        ['Active', 'active', 'layer8d-status-active'],
        ['On Leave', 'on_leave', 'layer8d-status-pending'],
        ['Inactive', 'inactive', 'layer8d-status-inactive']
    ]);
    var WEIGHT_UNIT = factory.simple(['Unspecified', 'kg', 'lbs']);
    var HEIGHT_UNIT = factory.simple(['Unspecified', 'cm', 'ft/in']);

    var render = {};
    var renderers = Layer8DRenderers;
    render.memberStatus = renderers.createStatusRenderer(MEMBER_STATUS.enum, MEMBER_STATUS.classes);
    render.coachStatus = renderers.createStatusRenderer(COACH_STATUS.enum, COACH_STATUS.classes);
    render.weightUnit = function(v) { return renderers.renderEnum(v, WEIGHT_UNIT.enum); };
    render.heightUnit = function(v) { return renderers.renderEnum(v, HEIGHT_UNIT.enum); };

    FmcCorePeople.enums = {
        MEMBER_STATUS: MEMBER_STATUS.enum,
        MEMBER_STATUS_VALUES: MEMBER_STATUS.values,
        MEMBER_STATUS_CLASSES: MEMBER_STATUS.classes,
        COACH_STATUS: COACH_STATUS.enum,
        COACH_STATUS_VALUES: COACH_STATUS.values,
        COACH_STATUS_CLASSES: COACH_STATUS.classes,
        WEIGHT_UNIT: WEIGHT_UNIT.enum,
        HEIGHT_UNIT: HEIGHT_UNIT.enum
    };
    FmcCorePeople.render = render;
})();
