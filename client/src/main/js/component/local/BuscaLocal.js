(() => {
    'use strict';

    angular.module('localModulo').component('buscaLocal', {
        templateUrl: 'view/component/local/busca-local.html',
        bindings: {},
        controller: ['$state', 'APP_STATES', function ($state, APP_STATES) {

            this.onChangeLocal = function (local) {
                if (local) {
                    $state.go(APP_STATES.LOCAL_ID.nome, {idLocal: local._id});
                }
            };
        }]
    });
})();
