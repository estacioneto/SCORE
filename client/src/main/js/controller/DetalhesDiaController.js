(() => {
    'use strict';
    /**
     * Controller responsável pela view de detalhes do dia.
     */
    angular.module('calendarioModulo').controller('DetalhesDiaController', ['ModalService', '$scope', 'data', 'Reserva', function (ModalService, $scope, data, Reserva) {

        /**
         * Data selecionada para visualização.
         */
        this.data = data;

        /**
         * Horários do dia.
         * 
         * IMPORTANTE: seguir formato { hora: { evento } }
         * carregar do servidor.
         */
        this.horarios = {};

        this.verReserva = ModalService.verReserva;

        /**
         * Main
         */
        (() => {
            this.horarios['08:00'] = new Reserva({
                descricao: 'Evento de teste',
                autor: 'Eric Breno',
                hora: '08:00'
            });
            this.horarios['10:00'] = new Reserva({
                descricao: 'Evento de teste evento de teste evento de teste evento de teste evento de teste evento de teste evento de teste evento de teste evento de teste ',
                autor: 'Eric Breno',
                hora: '10:00'
            });
            this.horarios['14:00'] = new Reserva({
                descricao: 'Evento de teste',
                autor: 'Eric Breno',
                hora: '14:00'
            });
            this.horarios['16:00'] = new Reserva({
                hora: '16:00'
            });
        })();
    }]);
})();