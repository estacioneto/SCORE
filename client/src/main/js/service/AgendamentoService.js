(() => {
    'use strict';
    angular.module('agendamentoModulo', []).service('AgendamentoService', ['$http', '$q', 'Reserva', 'DataManipuladorService', function ($http, $q, Reserva, DataManipuladorService) {

        const API = '/api/locais',
            RESERVA_SUB_API = 'reservas';

        const self = this;

        let reservas = [];
        let reservasCopy = [];
        let local;

        /**
         * Realiza a consulta de reservas por local.
         * @param {Number} idLocal Local.
         * @return {Promise} Promise contendo um data com a lista de reservas.
         */
        this.carregarReservasDoLocal = (idLocal) => {
            local = idLocal;
            return $http.get(`${API}/${idLocal}/${RESERVA_SUB_API}`).then(data => {
                reservas.splice(0, reservas.length);
                _.concat(reservas, data.data.map(r => new Reserva(r)));
                // reservasCopy = angular.copy(data.data);
                // atualizarRepeticoes();
                repetirReservas(reservas);
                return { data: reservas };
            });
        };

        function repetirReservas(reservas) {
            reservas.forEach(r => {
                if (r.repeticao && r.repeticao.frequencia) {
                    const freq = r.repeticao.frequencia;
                    const dataReserva = r.start.getTime();
                    let diasExtras = r.start.getDate() + freq;
                    let repeticao = new Date(dataReserva);
                    repeticao.setDate(diasExtras);
                    while (repeticao.getTime() < r.fimRepeticao.getTime()) {
                        const reserva = new Reserva(r);
                        reserva.dia = DataManipuladorService.parseData(repeticao);
                        reservas.push(reserva);
                        
                        diasExtras += freq;
                        repeticao = new Date(dataReserva);
                        repeticao.setDate(diasExtras);
                    }
                }
            });
        }

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
            self.carregarReservasDoLocal(local);
            // if (reserva._id)
            //     atualizarReservasClient(reserva);
            // atualizarRepeticoes();    
        };

        function atualizarRepeticoes() {
            reservasCopy.splice(0, reservasCopy.length);
            _.concat(reservasCopy, reservas);
            console.log("antes eu tinha", reservasCopy.length);
            repetirReservas(reservasCopy);
            console.log("dps", reservasCopy.length);
        }

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