(function() {
    'use strict';
    var ref = window.Layer8RefFactory;

    var FmcReferenceData = {
        ...ref.person('FmcMember', 'memberId', 'lastName', 'firstName'),
        ...ref.person('FmcCoach', 'coachId', 'lastName', 'firstName'),
        ...ref.simple('FmcProgram', 'programId', 'name', 'Program'),
        ...ref.idOnly('FmcSession', 'sessionId'),
        ...ref.simple('FmcGoal', 'goalId', 'title', 'Goal'),
        ...ref.simple('FmcRecipe', 'recipeId', 'name', 'Recipe'),
        ...ref.simple('FmcPartner', 'partnerId', 'name', 'Partner')
    };

    Layer8MReferenceRegistry.register(FmcReferenceData);
})();
