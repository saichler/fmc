(function() {
    'use strict';
    var col = window.Layer8ColumnFactory;
    var enums = FmcBillingFin.enums;
    var render = FmcBillingFin.render;

    FmcBillingFin.columns = {
        FmcSubscription: [
            ...col.id('subscriptionId'),
            ...col.col('memberId', 'Member'),
            ...col.enum('plan', 'Plan', null, render.subscriptionPlan),
            ...col.status('status', 'Status', enums.SUBSCRIPTION_STATUS_VALUES, render.subscriptionStatus),
            ...col.date('startDate', 'Start'),
            ...col.date('endDate', 'End'),
            ...col.date('trialEndDate', 'Trial End'),
            ...col.date('nextBilling', 'Next Billing'),
            ...col.money('price', 'Price')
        ],
        FmcPartner: [
            ...col.id('partnerId'),
            ...col.col('name', 'Name'),
            ...col.enum('partnerType', 'Type', null, render.partnerType),
            ...col.col('contactName', 'Contact'),
            ...col.col('contactEmail', 'Email'),
            ...col.boolean('isActive', 'Active'),
            ...col.number('memberCount', 'Members')
        ]
    };
    FmcBillingFin.primaryKeys = { FmcSubscription: 'subscriptionId', FmcPartner: 'partnerId' };
})();
