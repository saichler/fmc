(function() {
    'use strict';
    var factory = window.Layer8EnumFactory;
    window.FmcCoachingMgmt = window.FmcCoachingMgmt || {};

    var PROGRAM_TYPE = factory.simple(['Unspecified', 'Standard', 'Premium', 'GLP-1', 'Maintenance', 'Corporate']);
    var SESSION_TYPE = factory.simple(['Unspecified', 'Initial Consultation', 'Weekly Check-in', 'Bi-weekly Review', 'Ad Hoc', 'Final Review']);
    var SESSION_STATUS = factory.create([
        ['Unspecified', null, ''],
        ['Scheduled', 'scheduled', 'layer8d-status-pending'],
        ['In Progress', 'in_progress', 'layer8d-status-active'],
        ['Completed', 'completed', 'layer8d-status-completed'],
        ['Cancelled', 'cancelled', 'layer8d-status-inactive'],
        ['No Show', 'no_show', 'layer8d-status-inactive']
    ]);
    var GOAL_STATUS = factory.create([
        ['Unspecified', null, ''],
        ['Not Started', 'not_started', 'layer8d-status-pending'],
        ['In Progress', 'in_progress', 'layer8d-status-active'],
        ['Achieved', 'achieved', 'layer8d-status-completed'],
        ['Missed', 'missed', 'layer8d-status-inactive'],
        ['Revised', 'revised', 'layer8d-status-pending']
    ]);
    var SENDER = factory.simple(['Unspecified', 'Coach', 'Member', 'System']);

    var render = {};
    var renderers = Layer8DRenderers;
    render.programType = function(v) { return renderers.renderEnum(v, PROGRAM_TYPE.enum); };
    render.sessionType = function(v) { return renderers.renderEnum(v, SESSION_TYPE.enum); };
    render.sessionStatus = renderers.createStatusRenderer(SESSION_STATUS.enum, SESSION_STATUS.classes);
    render.goalStatus = renderers.createStatusRenderer(GOAL_STATUS.enum, GOAL_STATUS.classes);
    render.sender = function(v) { return renderers.renderEnum(v, SENDER.enum); };

    FmcCoachingMgmt.enums = {
        PROGRAM_TYPE: PROGRAM_TYPE.enum,
        SESSION_TYPE: SESSION_TYPE.enum,
        SESSION_STATUS: SESSION_STATUS.enum,
        SESSION_STATUS_VALUES: SESSION_STATUS.values,
        SESSION_STATUS_CLASSES: SESSION_STATUS.classes,
        GOAL_STATUS: GOAL_STATUS.enum,
        GOAL_STATUS_VALUES: GOAL_STATUS.values,
        GOAL_STATUS_CLASSES: GOAL_STATUS.classes,
        SENDER: SENDER.enum
    };
    FmcCoachingMgmt.render = render;
})();
