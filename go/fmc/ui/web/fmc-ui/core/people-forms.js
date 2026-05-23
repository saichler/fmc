(function() {
    'use strict';
    var f = window.Layer8FormFactory;
    var enums = FmcCorePeople.enums;

    FmcCorePeople.forms = {
        FmcMember: f.form('Member', [
            f.section('Personal Information', [
                ...f.text('firstName', 'First Name', true),
                ...f.text('lastName', 'Last Name', true),
                ...f.text('email', 'Email', true),
                ...f.text('phone', 'Phone'),
                ...f.date('dateOfBirth', 'Date of Birth'),
                ...f.select('status', 'Status', enums.MEMBER_STATUS, true)
            ]),
            f.section('Program Details', [
                ...f.reference('coachId', 'Coach', 'FmcCoach'),
                ...f.reference('programId', 'Program', 'FmcProgram'),
                ...f.date('enrollmentDate', 'Enrollment Date'),
                ...f.text('timezone', 'Timezone'),
                ...f.reference('partnerId', 'Partner', 'FmcPartner'),
                ...f.text('referralSource', 'Referral Source')
            ]),
            f.section('Body Metrics', [
                ...f.number('heightCm', 'Height (cm)'),
                ...f.number('startingWeightG', 'Starting Weight (g)'),
                ...f.number('targetWeightG', 'Target Weight (g)'),
                ...f.select('weightUnit', 'Weight Unit', enums.WEIGHT_UNIT),
                ...f.select('heightUnit', 'Height Unit', enums.HEIGHT_UNIT)
            ]),
            f.section('Medical', [
                ...f.textarea('dietaryPrefs', 'Dietary Preferences'),
                ...f.textarea('medicalNotes', 'Medical Notes'),
                ...f.checkbox('onGlp1', 'On GLP-1'),
                ...f.text('glp1Medication', 'GLP-1 Medication')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ]),
        FmcCoach: f.form('Coach', [
            f.section('Personal Information', [
                ...f.text('firstName', 'First Name', true),
                ...f.text('lastName', 'Last Name', true),
                ...f.text('email', 'Email', true),
                ...f.text('phone', 'Phone'),
                ...f.select('status', 'Status', enums.COACH_STATUS, true)
            ]),
            f.section('Professional', [
                ...f.text('certification', 'Certification'),
                ...f.text('specialization', 'Specialization'),
                ...f.textarea('bio', 'Bio'),
                ...f.number('maxClients', 'Max Clients'),
                ...f.number('activeClients', 'Active Clients')
            ]),
            f.section('Image', [
                ...f.file('imageStoragePath', 'Profile Image')
            ]),
            f.section('Audit', [
                ...f.audit()
            ])
        ])
    };
})();
