(() => {
    'use strict';
    angular.module('agendamentoModulo', []).service('AgendamentoService', ['$http', '$q', 'Reserva', 'DataManipuladorService', function ($http, $q, Reserva, DataManipuladorService) {

        const API = '/api/locais',
            RESERVA_SUB_API = 'reservas';

        const self = this;

        const reservas = [];
        let idLocalBackup;

        /**
         * Realiza a consulta de reservas por local.
         * @param {Number} idLocal Local.
         * @return {Promise} Promise contendo um data com a lista de reservas.
         */
        this.carregarReservasDoLocal = (idLocal) => {
            idLocalBackup = idLocal;
            return $http.get(`${API}/${idLocal}/${RESERVA_SUB_API}`).then(data => {
                reservas.splice(0, reservas.length);
                _.each(data.data, r => reservas.push(new Reserva(r)));
                return { data: reservas };
            });
        };

        /**
         * Remove uma reserva da lista do client.
         * 
         * @param reserva Reserva a ser excluida.
         * @return {Promise} Promessa que contém a reserva excluída.
         */
        this.excluir = (reserva) => {
            self.carregarReservasDoLocal(idLocalBackup);
        };

        /**
         * Atualiza a lista apenas no client com a reserva criada.
         * @param {Reserva} reserva
         */
        this.salvarReserva = (reserva) => {
            self.carregarReservasDoLocal(idLocalBackup);
        };
    }]);
})();