(() => {
    'use strict';

    angular.module('localModulo').component('termoDeCondicoesLocal', {
        templateUrl: 'view/component/local/termo-de-condicoes-local.html',
        bindings: {
            local: '=',
            editavel: '<'
        },
        controller: ['ModalService', function (ModalService) {
            this.mostrarTermoDeCondicoes = function ($event) {
                const options = {
                    templateUrl: 'view/dialog/local/termo-de-condicoes-dialog.html',
                    controller: 'TermoDeCondicoesDialogController as dialogCtrl',
                    targetEvent: $event,
                    resolve: {
                        local: () => this.local,
                        editavel: () => this.editavel
                    }
                };

                return ModalService.custom(options);
            };
        }],
    });
})();
