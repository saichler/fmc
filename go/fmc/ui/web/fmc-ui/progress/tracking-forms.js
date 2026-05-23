(function() {
    'use strict';
    var f = window.Layer8FormFactory;
    var enums = FmcProgressTrack.enums;

    FmcProgressTrack.forms = {
        FmcWeightLog: f.form('Weight Log', [
            f.section('Log Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.reference('coachId', 'Coach', 'FmcCoach'),
                ...f.date('logDate', 'Date'),
                ...f.number('weightG', 'Weight (g)', true),
                ...f.textarea('notes', 'Notes')
            ]),
            f.section('Image', [
                ...f.file('imageStoragePath', 'Photo')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcHabitLog: f.form('Habit Log', [
            f.section('Habit Details', [
                ...f.reference('memberId', 'Member', 'FmcMember', true),
                ...f.reference('coachId', 'Coach', 'FmcCoach'),
                ...f.date('logDate', 'Date'),
                ...f.text('habitName', 'Habit Name', true),
                ...f.select('category', 'Category', enums.HABIT_CATEGORY),
                ...f.checkbox('completed', 'Completed'),
                ...f.textarea('notes', 'Notes'),
                ...f.number('streakDays', 'Streak Days')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ])
    };
})();
