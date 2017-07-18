(function () {
    'use strict';

    /**
     * Controller do Modal/Dialog do Termo de Condições do Local.
     *
     * @author Estácio Pereira
     */
    angular.module('localModulo').controller('TermoDeCondicoesDialogController', ['local', 'editavel', '$mdDialog', function (local, editavel, $mdDialog) {
        this.local = local;
        this.editavel = editavel;

        this.concluir = function () {
            $mdDialog.hide('concluir');
        };
    }]);
}());