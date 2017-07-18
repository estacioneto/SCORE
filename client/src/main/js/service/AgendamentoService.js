(() => {
    'use strict';
    angular.module('agendamentoModulo').service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const self = this;

        const API_RESERVAS = "/api/reservas";

        let reservas = [];

        let promiseEventosFuturos;

        /**
         * TODO: a implementar, depende do servidor.
         * Remove uma reserva do dia.
         * 
         * @param reserva Reserva a ser excluida.
         * @return {Promise} Promessa que contém a reserva excluída.
         */
        this.excluir = (reserva) => {
            const indice = getIndiceReserva(reservas, reserva._id);
            reservas.remove(indice);
            return $q.when(reserva);
        };

        // TODO: o salvamento vai ser assim? Com um cara daqui, em vez da factory
        // TODO: a implementar, depende do servidor.
        this.salvarReserva = (reserva) => {
            return this.getReservasDia(reserva.dia).then(reservasDia => {
                self.validarAdicaoReserva(reservasDia, reserva);
                return atualizarReservas(reserva);
            });
        };

        /**
         * Realiza validações para adição de reserva ao dia.
         * -Valida se existe choque de horário.
         * 
         * @param {*} reservasDia 
         * @param {*} reserva 
         */
        this.validarAdicaoReserva = (reservasDia, reserva) => {
            const inicio = reserva.inicio;
            const fim = reserva.fim;

            _.each(reservasDia, reservaDia => {
                if (reserva._id !== reservaDia._id) {
                    if ((inicio < reservaDia.inicio && fim > reservaDia.fim)
                        || (inicio > reservaDia.inicio && inicio < reservaDia.fim)
                        || (fim > reservaDia.inicio && fim < reservaDia.fim)) {
                        throw { mensagem: "Horário já ocupado."};
                    }
                }
            });
        }

        /**
         * TODO: esse cara que manda pro server o role, por enquanto atualiza a lista daqui.
         * TODO: a implementar, depende do servidor.
         * @param {*} reserva
         */
        function atualizarReservas(reserva) {
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
            // return $q.when(mock);
        };

        (() => {
            promiseEventosFuturos = self.loadReservasFuturas();
            promiseEventosFuturos.then(reservasConsulta => {
                reservas = reservasConsulta;
            });
        })();
    }]);
})();