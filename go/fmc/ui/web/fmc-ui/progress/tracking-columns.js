(function() {
    'use strict';
    var col = window.Layer8ColumnFactory;
    var render = FmcProgressTrack.render;

    FmcProgressTrack.columns = {
        FmcWeightLog: [
            ...col.id('logId'),
            ...col.col('memberId', 'Member'),
            ...col.col('coachId', 'Coach'),
            ...col.date('logDate', 'Date'),
            ...col.number('weightG', 'Weight (g)'),
            ...col.col('notes', 'Notes')
        ],
        FmcHabitLog: [
            ...col.id('logId'),
            ...col.col('memberId', 'Member'),
            ...col.col('coachId', 'Coach'),
            ...col.date('logDate', 'Date'),
            ...col.col('habitName', 'Habit'),
            ...col.enum('category', 'Category', null, render.habitCategory),
            ...col.boolean('completed', 'Completed'),
            ...col.number('streakDays', 'Streak')
        ]
    };
    FmcProgressTrack.primaryKeys = { FmcWeightLog: 'logId', FmcHabitLog: 'logId' };
})();
