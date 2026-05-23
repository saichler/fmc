(function() {
    'use strict';
    var f = window.Layer8FormFactory;
    var enums = FmcCoachingMgmt.enums;

    FmcCoachingMgmt.forms = {
        FmcProgram: f.form('Program', [
            f.section('Program Details', [
                ...f.text('name', 'Name', true),
                ...f.textarea('description', 'Description'),
                ...f.select('programType', 'Type', enums.PROGRAM_TYPE, true),
                ...f.checkbox('isActive', 'Active'),
                ...f.number('durationWeeks', 'Duration (weeks)'),
                ...f.money('price', 'Price')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcSession: f.form('Session', [
            f.section('Session Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.reference('coachId', 'Coach', 'FmcCoach', true),
                ...f.select('sessionType', 'Type', enums.SESSION_TYPE, true),
                ...f.select('status', 'Status', enums.SESSION_STATUS, true),
                ...f.date('scheduledTime', 'Scheduled Time', true),
                ...f.date('startTime', 'Start Time'),
                ...f.date('endTime', 'End Time'),
                ...f.number('durationMin', 'Duration (min)'),
                ...f.text('focusTopic', 'Focus Topic'),
                ...f.number('weekNumber', 'Week #')
            ]),
            f.section('Notes', [
                ...f.textarea('coachNotes', 'Coach Notes'),
                ...f.textarea('memberNotes', 'Member Notes'),
                ...f.textarea('actionItems', 'Action Items')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcMessage: f.form('Message', [
            f.section('Message Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.reference('coachId', 'Coach', 'FmcCoach', true),
                ...f.select('sender', 'Sender', enums.SENDER, true),
                ...f.textarea('content', 'Content', true),
                ...f.date('sentAt', 'Sent At'),
                ...f.checkbox('isRead', 'Read'),
                ...f.date('readAt', 'Read At')
            ]),
            f.section('Attachment', [
                ...f.file('attachmentPath', 'Attachment')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcGoal: f.form('Goal', [
            f.section('Goal Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.reference('coachId', 'Coach', 'FmcCoach', true),
                ...f.reference('sessionId', 'Session', 'FmcSession'),
                ...f.text('title', 'Title', true),
                ...f.textarea('description', 'Description'),
                ...f.select('status', 'Status', enums.GOAL_STATUS, true),
                ...f.date('startDate', 'Start Date'),
                ...f.date('targetDate', 'Target Date'),
                ...f.number('weekNumber', 'Week #')
            ]),
            f.section('Checkpoints', [
                ...f.inlineTable('checkpoints', 'Checkpoints', [
                    { key: 'checkpointId', label: 'ID', hidden: true },
                    { key: 'checkDate', label: 'Check Date', type: 'date' },
                    { key: 'completed', label: 'Completed', type: 'checkbox' },
                    { key: 'notes', label: 'Notes', type: 'text' }
                ])
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ])
    };
})();
