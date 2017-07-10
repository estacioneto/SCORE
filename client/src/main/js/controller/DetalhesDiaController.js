(() => {
    'use strict';
    /**
     * Controller responsável pela view de detalhes do dia.
     *
     * Minha sugestão é não utilizar mais esse controller e deixar tôdo o gerenciamento
     * do calendário, independente do tipo de view, em um só controller. {Vélmer}
     */
    angular.module('calendarioModulo').controller('DetalhesDiaController', ['ModalService', '$scope', 'data', 'AgendamentoService', 'Reserva', function (ModalService, $scope, data, AgendamentoService, Reserva) {

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

        this.verReserva = reserva => {
            return ModalService.verReserva(reserva, this.data);
        };

        /**
         * Abre o modal para criação de reserva.
         * @return {Promise} Promise do modal.
         */
        this.criarReserva = () => {
            return ModalService.verReserva(new Reserva(), this.data);
        };

        /**
         * Main
         */
        (() => {
            AgendamentoService.getReservasDia(self.data).then(reservas => {
                self.reservas = reservas;
            });
        })();
    }]);
})();