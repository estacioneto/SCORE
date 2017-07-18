(() => {
    'use strict';
    angular.module('agendamentoModulo').service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const self = this;

        const API_RESERVAS = "/api/reservas";

        let reservas = [];

        let promiseEventosFuturos;

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
         * @param {Reserva} reserva 
         */
        function atualizarReservasClient(reserva) {
            let indiceReserva = getIndiceReserva(reservas, reserva._id);
            if (indiceReserva !== -1) {
                // atualizar
                reservas.splice(indiceReserva, 1, new Reserva(reserva));
            } else {
                // criar
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
            for (let i = 0; i < lista.length; i++) {
                const isIgual = lista[i]._id === id;
                if (isIgual) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Retorna as reservas de um dado dia.
         * 
         */
        this.getReservasDia = data => {
            return promiseEventosFuturos.then(reservasRes => {
                let reservasDia = reservasRes.filter(r => r.dia === data);
                return reservasDia;
            });
        };

        /**
         * Retorna a promise com a reserva do id especificado.
         *
         * @param {String} id Id da reserva a ser retornada.
         * @return {Promise} Promessa contendo a reserva.
         */
        this.getReserva = id => {
            let indiceReserva = getIndiceReserva(reservas, id);
            return $q.when(reservas[indiceReserva]);
        };

        this.loadReservasFuturas = () => {
            // Assim não perdemos a referência
            if (promiseEventosFuturos) {
                return promiseEventosFuturos;
            }
            return $http.get(API_RESERVAS).then(data => {
                const listaReservas = data.data.map(r => new Reserva(r));
                return listaReservas;
            });
        };

        (() => {
            promiseEventosFuturos = self.loadReservasFuturas();
            promiseEventosFuturos.then(reservasConsulta => {
                reservas = reservasConsulta;
            });
        })();
    }]);
})();