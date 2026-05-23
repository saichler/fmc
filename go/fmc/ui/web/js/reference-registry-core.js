(function() {
    'use strict';
    var ref = window.Layer8RefFactory;
    Layer8DReferenceRegistry.register({
        ...ref.person('FmcMember', 'memberId', 'lastName', 'firstName'),
        ...ref.person('FmcCoach', 'coachId', 'lastName', 'firstName')
    });
})();
