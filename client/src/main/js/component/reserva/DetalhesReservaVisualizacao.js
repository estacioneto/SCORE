(() => {
    'use strict';

    /**
     * Componente responsável pelos detalhes da reserva no modal no caso de visualização.
     *
     * @param {Reserva} reserva Reserva com os detalhes a serem mudados.
     */
    angular.module('reservaModulo').component('detalhesReservaVisualizacao', {
        templateUrl: 'view/component/reserva/detalhes-reserva-visualizacao.html',
        bindings: {
            reserva: '='
        },
        controller: [function () {
        }]
    });
})();
