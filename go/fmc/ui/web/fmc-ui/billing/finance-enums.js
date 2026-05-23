(function() {
    'use strict';
    var factory = window.Layer8EnumFactory;
    window.FmcBillingFin = window.FmcBillingFin || {};

    var SUBSCRIPTION_STATUS = factory.create([
        ['Unspecified', null, ''],
        ['Trial', 'trial', 'layer8d-status-pending'],
        ['Active', 'active', 'layer8d-status-active'],
        ['Paused', 'paused', 'layer8d-status-pending'],
        ['Cancelled', 'cancelled', 'layer8d-status-inactive'],
        ['Expired', 'expired', 'layer8d-status-inactive']
    ]);
    var SUBSCRIPTION_PLAN = factory.simple(['Unspecified', 'Monthly', 'Quarterly', 'Annual']);
    var PARTNER_TYPE = factory.simple(['Unspecified', 'Employer', 'Medical', 'Telehealth']);

    var render = {};
    var renderers = Layer8DRenderers;
    render.subscriptionStatus = renderers.createStatusRenderer(SUBSCRIPTION_STATUS.enum, SUBSCRIPTION_STATUS.classes);
    render.subscriptionPlan = function(v) { return renderers.renderEnum(v, SUBSCRIPTION_PLAN.enum); };
    render.partnerType = function(v) { return renderers.renderEnum(v, PARTNER_TYPE.enum); };

    FmcBillingFin.enums = {
        SUBSCRIPTION_STATUS: SUBSCRIPTION_STATUS.enum,
        SUBSCRIPTION_STATUS_VALUES: SUBSCRIPTION_STATUS.values,
        SUBSCRIPTION_STATUS_CLASSES: SUBSCRIPTION_STATUS.classes,
        SUBSCRIPTION_PLAN: SUBSCRIPTION_PLAN.enum,
        PARTNER_TYPE: PARTNER_TYPE.enum
    };
    FmcBillingFin.render = render;
})();
