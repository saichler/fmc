(function() {
    'use strict';
    Layer8DModuleFactory.create({
        namespace: 'FmcCore',
        defaultModule: 'people',
        defaultService: 'members',
        sectionSelector: 'people',
        initializerName: 'initializeFmcCore',
        requiredNamespaces: ['FmcCorePeople']
    });

    var origOpenAdd = window.FmcCore && window.FmcCore._openAddModal;
    if (typeof origOpenAdd === 'function') {
        window.FmcCore._openAddModal = function(service) {
            if (service.model === 'FmcMember' && window.FmcUserProvisioning) {
                var formDef = Layer8DServiceRegistry.getFormDef('FmcCore', service.model);
                if (!formDef) { origOpenAdd.call(this, service); return; }
                var svcConfig = {
                    endpoint: Layer8DConfig.resolveEndpoint(service.endpoint),
                    primaryKey: Layer8DServiceRegistry.getPrimaryKey('FmcCore', service.model),
                    modelName: service.model
                };
                Layer8DPopup.show({
                    title: 'Add ' + formDef.title,
                    content: Layer8DForms.generateFormHtml(formDef, {}),
                    size: 'large',
                    showFooter: true,
                    saveButtonText: 'Save',
                    onSave: async function() {
                        var data = Layer8DForms.collectFormData(formDef);
                        var errors = Layer8DForms.validateFormData(formDef, data);
                        if (errors.length > 0) {
                            Layer8DNotification.error('Validation failed', errors.map(function(e) { return e.message; }));
                            return;
                        }
                        try {
                            var result = await Layer8DForms.saveRecord(svcConfig.endpoint, data, false);
                            Layer8DPopup.close();
                            if (window.FmcCore.refreshCurrentTable) window.FmcCore.refreshCurrentTable();
                            var entity = Object.assign({}, data);
                            if (result && result.id) {
                                entity[svcConfig.primaryKey] = result.id;
                            }
                            FmcUserProvisioning.createMemberUser(entity);
                        } catch (err) {
                            Layer8DNotification.error('Error saving', [err.message]);
                        }
                    },
                    onShow: function(body) {
                        Layer8DForms.setFormContext(formDef, svcConfig);
                        setTimeout(function() { Layer8DForms.attachDatePickers(body); }, 50);
                    }
                });
            } else {
                origOpenAdd.call(this, service);
            }
        };
    }
})();
