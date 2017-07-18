(function () {
    'use strict';

    /**
     * Controller do Modal/Dialog do Termo de Condições do Local. Os parâmetros informados devem ser injetados.
     *
     * @param {Local}   local    Local a ter Termo exibido.
     * @param {Boolean} editavel Booleano indicando se o Termo pode ser editado.
     *
     * @author Estácio Pereira
     */
    angular.module('localModulo').controller('TermoDeCondicoesDialogController', ['local', 'editavel', '$mdDialog', function (local, editavel, $mdDialog) {
        this.local = local;
        this.editavel = editavel;

        /**
         * Fecha o dialog.
         */
        this.concluir = function () {
            $mdDialog.hide('concluir');
        };
    }]);
}());