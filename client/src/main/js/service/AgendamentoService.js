(() => {
    'use strict';
    angular.module('agendamentoModulo').service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const self = this;

        let promiseEventosFuturos;

        /**
         * TODO: a implementar, depende do servidor.
         * Remove uma reserva do dia.
         * @param reserva Reserva a ser excluida.
         */
        this.excluir = (reserva) => {
            const indice = getIndiceReserva(mock, reserva);
            mock.splice(indice, 1);
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
         * @param {*} reservasDia 
         * @param {*} reserva 
         */
        function validarAdicaoReserva(reservasDia, reserva) {
            const inicio = reserva.inicio;
            const fim = reserva.fim;

            for (let i = 0; i < reservasDia.length; i++) {
                const r = reservasDia[i];
                if (reserva.id === r.id) {
                    continue;
                }
                if ((inicio < r.inicio && fim > r.fim)
                    || (inicio > r.inicio && inicio < r.fim)
                    || (fim > r.inicio && fim < r.fim)) {
                    throw { mensagem: "Horário já ocupado."};
                }
            }
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
         */
        this.getReserva = id => {
            let indiceReserva = getIndiceReserva(mock, {id});
            return $q.when(mock[indiceReserva]);
        };

        /**
         * Carrega as reservas futuras e deixa em memória. Melhorar isso,
         * verificar como deixar eficiente com o calendário.
         * 
         * Ideia: fazer o servidor retornar um JSON que segue o padrão:
         * {
         *     'YYYYMMDD' : [ Reservas ]
         * }
         * 
         * a query pro bd pode ser feita de forma simples utilizando o range,
         * já que o identificador desta forma faz com que as datas fiquem
         * odernadas corretamente por espaço de tempo. 
         * Eg: entre dias 12/06/17 e 12/07/17
         *      Selecionar todas datas que tem dia maior que 20171206 e menor que 20170712.
         * 
         * Temos duas opções:
         *  1. Fazer a reserva ter a referencia pra o dia
         *  2. Fazer o dia ter uma lista de reservas
         * 
         * 1- Teriamos que ver como fica para organizar a consultar e retornar isso,
         * vantagem de facilidade para manipulações e atualização.
         * 
         * 2- Teriamos que ver o BD, se for no-sql não será problema, facilita a busca,
         * mas na atualização precisamos deixar apenas atualizar um dos elementos do dia por vez.
         */
        this.loadReservasFuturas = () => {
            return $q.when(mock);
        };

        const mock = [
            new Reserva({
                id: 1,
                titulo: 'Reserva 1',
                inicio: '16:30',
                fim: '16:50',
                dia: '07-07-2017',
                cor: 'red',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Vélmer Oliveira Odon'
            }),
            new Reserva({
                id: 2,
                titulo: 'Reserva 2',
                inicio: '08:30',
                fim: '08:45',
                dia: '06-07-2017',
                cor: 'yellow',
                corTexto: 'black',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Lucas Diniz'
            }),
            new Reserva({
                id: 3,
                titulo: 'Reserva 3',
                inicio: '09:40',
                fim: '10:00',
                dia: '06-07-2017',
                cor: 'skyblue',
                corTexto: 'black',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Eric Breno'
            }),
            new Reserva({
                id: 4,
                titulo: 'Reserva 4',
                inicio: '11:45',
                fim: '12:15',
                dia: '06-07-2017',
                cor: 'darkred',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Estácio Neto'
            }),
            new Reserva({
                id: 5,
                titulo: 'Reserva 5',
                inicio: '14:40',
                fim: '15:05',
                dia: '06-07-2017',
                cor: 'forestgreen',
                corTexto: 'white',
                descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
                autor: 'Alekssandro Assis'
            }),
            new Reserva({
                id: 5,
                titulo: 'Reserva 6',
                inicio: '15:15',
                fim: '16:00',
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