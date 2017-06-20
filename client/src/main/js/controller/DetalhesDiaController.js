(() => {
    'use strict';
    /**
     * Controller responsável pela view de detalhes do dia.
     */
    angular.module('calendarioModulo').controller('DetalhesDiaController', ['ModalService', '$scope', 'data', 'AgendamentoService', function (ModalService, $scope, data, AgendamentoService) {

        const self = this;

        /**
         * Data selecionada para visualização.
         */
        this.data = data;

        /**
         * Horários do dia.
         * 
         * carregar do servidor.
         */
        this.reservas = [];

        this.verReserva = ModalService.verReserva;

        /**
         * Main
         */
        (() => {
            AgendamentoService.getReservasDia(self.data).then(reservas => {
                reservas.forEach(reserva => {
                    self.reservas.push(reserva);
                });
            });
        })();
    }]);
})();