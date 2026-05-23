(function() {
    'use strict';
    var f = window.Layer8FormFactory;
    var enums = FmcBillingFin.enums;

    FmcBillingFin.forms = {
        FmcSubscription: f.form('Subscription', [
            f.section('Subscription Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.select('plan', 'Plan', enums.SUBSCRIPTION_PLAN, true),
                ...f.select('status', 'Status', enums.SUBSCRIPTION_STATUS),
                ...f.date('startDate', 'Start Date'),
                ...f.date('endDate', 'End Date'),
                ...f.date('trialEndDate', 'Trial End'),
                ...f.date('nextBilling', 'Next Billing'),
                ...f.money('price', 'Price')
            ]),
            f.section('Stripe', [
                ...f.text('stripeCustomerId', 'Stripe Customer ID'),
                ...f.text('stripeSubId', 'Stripe Subscription ID'),
                ...f.text('cancelReason', 'Cancel Reason'),
                ...f.date('pausedAt', 'Paused At'),
                ...f.date('resumeAt', 'Resume At')
            ]),
            f.section('Payments', [
                ...f.inlineTable('payments', 'Payments', [
                    { key: 'paymentId', label: 'ID', hidden: true },
                    { key: 'paymentDate', label: 'Date', type: 'date' },
                    { key: 'amount', label: 'Amount', type: 'money' },
                    { key: 'stripeTxnId', label: 'Txn ID', type: 'text' },
                    { key: 'succeeded', label: 'OK', type: 'checkbox' },
                    { key: 'failureReason', label: 'Failure', type: 'text' }
                ])
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcPartner: f.form('Partner', [
            f.section('Partner Details', [
                ...f.text('name', 'Name', true),
                ...f.select('partnerType', 'Type', enums.PARTNER_TYPE),
                ...f.text('contactName', 'Contact Name'),
                ...f.text('contactEmail', 'Contact Email'),
                ...f.text('contactPhone', 'Contact Phone'),
                ...f.checkbox('isActive', 'Active'),
                ...f.text('contractId', 'Contract ID'),
                ...f.date('startDate', 'Start Date'),
                ...f.number('memberCount', 'Member Count'),
                ...f.textarea('notes', 'Notes')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ])
    };
})();
