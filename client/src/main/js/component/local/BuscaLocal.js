(() => {
    'use strict';

    angular.module('localModulo').component('buscaLocal', {
        templateUrl: 'view/component/local/busca-local.html',
        bindings: {},
        controller: ['$state', function ($state) {

            this.onChangeLocal = function (local) {
                if (local) {
                    $state.go('app.local.id', {idLocal: local._id});
                }
            };
        }]
    });
})();
