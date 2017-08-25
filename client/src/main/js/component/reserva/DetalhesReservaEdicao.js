(() => {
    'use strict';

    /**
     * Componente responsável pelos detalhes da reserva no modal no caso de edição.
     *
     * @param {Reserva} reserva Reserva com os detalhes a serem mudados.
     */
    angular.module('reservaModulo').component('detalhesReservaEdicao', {
        templateUrl: 'view/component/reserva/detalhes-reserva-edicao.html',
        bindings: {
            reserva: '='
        },
        controller: ['TIPOS_RESERVA', function (TIPOS_RESERVA) {

            this.tiposReserva = TIPOS_RESERVA;

            /**
             * Verifica se a reserva está em criação.
             *
             * @returns {Boolean} true se estiver em criação, false caso contrário.
             */
            this.isCriacao = () => !this.reserva._id;

            /**
             * Abre o modal com a visualização dos termos do o local relacionado à reserva.
             *
             * @param  {Event}   $event Evento do clique.
             * @return {Promise} Promise do modal.
             */
            this.verTermos = ($event) => ModalService.verTermosLocal(local, false, $event);

        }]
    });
})();
