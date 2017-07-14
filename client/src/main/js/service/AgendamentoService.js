(() => {
    'use strict';
    angular.module('agendamentoModulo').service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const self = this;

        let promiseEventosFuturos;

        /**
         * TODO: a implementar, depende do servidor.
         * Remove uma reserva do dia.
         * 
         * @param reserva Reserva a ser excluida.
         * @return {Promise} Promessa que contém a reserva excluída.
         */
        this.excluir = (reserva) => {
            const indice = getIndiceReserva(mock, reserva);
            mock.remove(indice);
            return $q.when(reserva);
        };

        // TODO: o salvamento vai ser assim? Com um cara daqui, em vez da factory
        // TODO: a implementar, depende do servidor.
        this.salvarReserva = (reserva) => {
            return this.getReservasDia(reserva.dia).then(reservasDia => {
                validarAdicaoReserva(reservasDia, reserva);
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
        function validarAdicaoReserva(reservasDia, reserva) {
            const inicio = reserva.inicio;
            const fim = reserva.fim;

            _.each(reservasDia, reservaDia => {
                if (reserva.id !== reservaDia.id) {
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
            let indiceReserva = getIndiceReserva(mock, reserva);

            if (indiceReserva !== -1) {
                // atualizar
                mock.splice(indiceReserva, 1, new Reserva(reserva));
            } else {
                // criar
                mock.push(reserva);
            }

            return reserva;
        }

        /**
         * Verifica se existe uma reserva na lista, retornando seu índice.
         * 
         * @param {*} lista 
         * @param {*} reserva 
         */
        function getIndiceReserva(lista, reserva) {
            for (let i = 0; i < lista.length; i++) {
                const isIgual = lista[i].id === reserva.id;
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
            return promiseEventosFuturos.then(reservas => {
                let reservasDia = [];

                reservas.forEach(function (reserva) {
                    if(reserva.dia === data) {
                        reservasDia.push(reserva);
                    }
                });

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
            let indiceReserva = getIndiceReserva(mock, {id});
            return $q.when(mock[indiceReserva]);
        };

        this.loadReservasFuturas = () => {
            return $q.when(mock);
        };

        const mock = [
            new Reserva({
                titulo: 'Reserva 1',
                inicio: '16:30',
                fim: '17:45',
                dia: '05-07-2017',
                cor: '#a94442',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Vélmer Oliveira Odon'
            }),
            new Reserva({
                titulo: 'Reserva 2',
                inicio: '08:00',
                fim: '08:45',
                dia: '06-07-2017',
                cor: '#f5e79e',
                corTexto: 'black',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Lucas Diniz'
            }),
            new Reserva({
                titulo: 'Reserva 3',
                inicio: '09:00',
                fim: '10:30',
                dia: '06-07-2017',
                cor: 'skyblue',
                corTexto: 'black',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Eric Breno'
            }),
            new Reserva({
                titulo: 'Reserva 4',
                inicio: '11:30',
                fim: '12:15',
                dia: '06-07-2017',
                cor: 'darkred',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Estácio Neto'
            }),
            new Reserva({
                titulo: 'Reserva 5',
                inicio: '14:00',
                fim: '15:45',
                dia: '06-07-2017',
                cor: 'forestgreen',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Alekssandro Assis'
            }),
            new Reserva({
                titulo: 'Reserva 6',
                inicio: '16:00',
                fim: '17:30',
                dia: '06-07-2017',
                cor: 'midnightblue',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Eric Breno'
            })
        ];

        (() => {
            promiseEventosFuturos = self.loadReservasFuturas();
        })();
    }]);
})();