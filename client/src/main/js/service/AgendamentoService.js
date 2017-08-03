(() => {
    'use strict';
    angular.module('agendamentoModulo', []).service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const API = '/api/locais',
            RESERVA_SUB_API = 'reservas';

        const self = this;

        const API_RESERVAS = "/api/reservas";

        let reservas = [];

        /**
         * Realiza a consulta de reservas por local.
         * @param {Number} idLocal Local.
         * @return {Promise} Promise contendo um data com a lista de reservas.
         */
        this.carregarReservasDoLocal = (idLocal) => {
            return $http.get(`${API}/${idLocal}/${RESERVA_SUB_API}`).then(data => {
                reservas = data.data.map(r => new Reserva(r));
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
            const indice = getIndiceReserva(reservas, reserva._id);
            reservas.remove(indice);
        };

        /**
         * Atualiza a lista apenas no client com a reserva criada.
         * @param {Reserva} reserva
         */
        this.salvarReserva = (reserva) => {
            if (reserva._id)
                atualizarReservasClient(reserva);
        };

        /**
         * Atualiza a lista de reservas no client.
         * - Para atualização, a reserva antiga é removida e a atualizada
         * inserida na lista
         * - Para cadastro, a nova reserva é inserida na lista
         * 
         * É necessário fazer isso por ao se clicar em uma reserva, o calendário enviar uma
         * cópia da recuperada da lista para o modal, onde será editada, logo, as 
         * atualizações não refletem na reserva antiga que fica aqui.
         * 
         * @param {Reserva} reserva 
         */
        function atualizarReservasClient(reserva) {
            const indiceReserva = getIndiceReserva(reservas, reserva._id);
            if (indiceReserva !== -1) {
                reservas.splice(indiceReserva, 1, new Reserva(reserva));
            } else {
                reservas.push(reserva);
            }
            return reserva;
        }

        /**
         * Verifica se existe uma reserva na lista, retornando seu índice.
         * 
         * @param {*} lista 
         * @param {*} id 
         */
        function getIndiceReserva(lista, id) {
            return _.findIndex(lista, e => e._id === id);
        }
    }]);
})();