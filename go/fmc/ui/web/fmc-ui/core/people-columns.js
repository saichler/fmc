(function() {
    'use strict';
    var col = window.Layer8ColumnFactory;
    var enums = FmcCorePeople.enums;
    var render = FmcCorePeople.render;

    FmcCorePeople.columns = {
        FmcMember: [
            ...col.id('memberId'),
            ...col.col('firstName', 'First Name'),
            ...col.col('lastName', 'Last Name'),
            ...col.col('email', 'Email'),
            ...col.col('phone', 'Phone'),
            ...col.status('status', 'Status', enums.MEMBER_STATUS_VALUES, render.memberStatus),
            ...col.col('coachId', 'Coach'),
            ...col.date('enrollmentDate', 'Enrolled'),
            ...col.boolean('onGlp1', 'GLP-1')
        ],
        FmcCoach: [
            ...col.id('coachId'),
            ...col.col('firstName', 'First Name'),
            ...col.col('lastName', 'Last Name'),
            ...col.col('email', 'Email'),
            ...col.col('phone', 'Phone'),
            ...col.status('status', 'Status', enums.COACH_STATUS_VALUES, render.coachStatus),
            ...col.col('certification', 'Certification'),
            ...col.col('specialization', 'Specialization'),
            ...col.number('activeClients', 'Active Clients'),
            ...col.number('maxClients', 'Max Clients')
        ]
    };
    FmcCorePeople.primaryKeys = { FmcMember: 'memberId', FmcCoach: 'coachId' };
})();
