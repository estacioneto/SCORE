(() => {
    'use strict';

    /**
     * Cabecalho do modal de detalhes da reserva.
     *
     * @param {form}    formulario Formulário do modal.
     * @param {Reserva} reserva    Reserva referenciada.
     */
    angular.module('reservaModulo').component('cabecalhoReserva', {
        templateUrl: 'view/component/reserva/cabecalho-reserva.html',
        bindings: {
            formulario: '=',
            reserva: '=',
            edicao: '='
        },
        controller: ['$mdDialog', function ($mdDialog) {

            /**
             * Função responsável por fechar o modal.
             */
            this.fechar = function () {
                $mdDialog.hide('close');
            };
        }]
    });
})();
