(() => {
    'use strict';

    angular.module('reservaModulo').component('cabecalhoReserva', {
        templateUrl: 'view/component/reserva/cabecalho-reserva.html',
        bindings: {
            formulario: '=',
            reserva: '='
        },
        controller: ['$mdDialog', function ($mdDialog) {
            this.fechar = function () {
                $mdDialog.hide('close');
            };
        }]
    });
})();
