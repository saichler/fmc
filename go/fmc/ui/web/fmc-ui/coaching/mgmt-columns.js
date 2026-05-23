(function() {
    'use strict';
    var col = window.Layer8ColumnFactory;
    var enums = FmcCoachingMgmt.enums;
    var render = FmcCoachingMgmt.render;

    FmcCoachingMgmt.columns = {
        FmcProgram: [
            ...col.id('programId'),
            ...col.col('name', 'Name'),
            ...col.col('description', 'Description'),
            ...col.enum('programType', 'Type', null, render.programType),
            ...col.boolean('isActive', 'Active'),
            ...col.number('durationWeeks', 'Duration (wk)'),
            ...col.money('price', 'Price')
        ],
        FmcSession: [
            ...col.id('sessionId'),
            ...col.col('memberId', 'Member'),
            ...col.col('coachId', 'Coach'),
            ...col.enum('sessionType', 'Type', null, render.sessionType),
            ...col.status('status', 'Status', enums.SESSION_STATUS_VALUES, render.sessionStatus),
            ...col.date('scheduledTime', 'Scheduled'),
            ...col.number('durationMin', 'Duration (min)'),
            ...col.col('focusTopic', 'Focus Topic'),
            ...col.number('weekNumber', 'Week #')
        ],
        FmcMessage: [
            ...col.id('messageId'),
            ...col.col('memberId', 'Member'),
            ...col.col('coachId', 'Coach'),
            ...col.enum('sender', 'Sender', null, render.sender),
            ...col.col('content', 'Content'),
            ...col.date('sentAt', 'Sent At'),
            ...col.boolean('isRead', 'Read')
        ],
        FmcGoal: [
            ...col.id('goalId'),
            ...col.col('memberId', 'Member'),
            ...col.col('coachId', 'Coach'),
            ...col.col('title', 'Title'),
            ...col.status('status', 'Status', enums.GOAL_STATUS_VALUES, render.goalStatus),
            ...col.date('startDate', 'Start'),
            ...col.date('targetDate', 'Target'),
            ...col.number('weekNumber', 'Week #')
        ]
    };
    FmcCoachingMgmt.primaryKeys = {
        FmcProgram: 'programId',
        FmcSession: 'sessionId',
        FmcMessage: 'messageId',
        FmcGoal: 'goalId'
    };
})();
