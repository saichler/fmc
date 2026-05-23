(function() {
    'use strict';
    var ref = window.Layer8RefFactory;
    Layer8DReferenceRegistry.register({
        ...ref.simple('FmcProgram', 'programId', 'name', 'Program'),
        ...ref.idOnly('FmcSession', 'sessionId'),
        ...ref.simple('FmcGoal', 'goalId', 'title', 'Goal')
    });
})();
