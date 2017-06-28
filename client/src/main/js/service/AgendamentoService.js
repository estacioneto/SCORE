(() => {
    'use strict';
    angular.module('agendamentoModulo').service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const self = this;

        let promiseEventosFuturos;

        /**
         * TODO: a implementar, depende do servidor.
         * Remove uma reserva do dia.
         * @param dataReserva Data da reserva.
         * @param reserva Reserva a ser excluida.
         */
        this.excluir = (dataReserva, reserva) => {
            return this.getReservasDia(dataReserva).then(reservasDia => {
                const indice = getIndiceReserva(reservasDia, reserva);
                reservasDia.splice(indice, 1);
                return reserva;
            });
        };

        // TODO: o salvamento vai ser assim? Com um cara daqui, em vez da factory
        // TODO: a implementar, depende do servidor.
        this.salvarReserva = (dataReserva, reserva) => {
            return this.getReservasDia(dataReserva).then(reservasDia => {
                validarAdicaoReserva(reservasDia, reserva);
                return atualizarDia(dataReserva, reserva);
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
                if (r.fim > inicio && r.inicio < inicio
                    || r.inicio < fim && r.fim > fim
                    || r.inicio > inicio && r.fim < fim
                    || r.inicio < inicio && r.fim > fim
                    || r.inicio === inicio || r.fim === fim
                    || r.inicio < inicio && r.fim > inicio) {
                        throw { mensagem: "Horário já ocupado."};
                    }
            }
        }

        /**
         * TODO: esse cara que manda pro server o role, por enquanto atualiza a lista daqui.
         * TODO: a implementar, depende do servidor.
         * @param {*} dataReserva 
         * @param {*} reserva 
         */
        function atualizarDia(dataReserva, reserva) {
            const identificadorDia = getIdentificadorDia(dataReserva);
            if (!mock[identificadorDia]) {
                mock[identificadorDia] = [];
            }
            let reservasDia = mock[identificadorDia];
            let indiceReserva = getIndiceReserva(reservasDia, reserva);
            if (indiceReserva !== -1) {
                // atualizar
                reservasDia.splice(indiceReserva, 1);
                reservasDia.push(reserva);
            } else {
                // criar
                reservasDia.push(reserva);
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
            const identificadorDia = getIdentificadorDia(data)
            return promiseEventosFuturos.then(data => {
                // identificador do dia tem formato: AAAAMMDD
                return data[identificadorDia] || [];
            });
        };

        /**
         * Retorna o identificador de um dado dia, recebendo um Date
         * e retornando o identificador no formato YYYYMMDD
         * @param {*} data Objeto Date do dia.
         * @return {String} Identificador.
         */
        function getIdentificadorDia(data) {
            const mes = data.getMonth() > 9 ? data.getMonth() : '0' + data.getMonth();
            const dia = data.getDate() > 9 ? data.getDate() : '0' + data.getDate();
            const identificadorDia = `${data.getFullYear()}${mes}${dia}`;
            return identificadorDia;
        }

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

        const mock = {
            '20170514': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            }), new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '10:00',
                fim: '11:30'
            })],
            '20170518': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            })],
            '20170520': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            }), new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '10:00',
                fim: '12:00'
            })],
            '20170522': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Vélmer',
                inicio: '08:00',
                fim: '10:00'
            }), new Reserva({
                titulo: 'Evento de teste',
                autor: 'Estácio Pereira',
                inicio: '10:00',
                fim: '12:00'
            })],
            '20170524': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '14:00',
                fim: '16:00'
            })],
            '20170525': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '10:00',
                fim: '12:00'
            }), new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '14:00',
                fim: '16:00'
            }), new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '16:00',
                fim: '18:00'
            })],
            '20170527': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            })],
            '20170528': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            })],
            '20170529': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '10:00',
                fim: '12:00'
            })],
            '20170601': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            })],
            '20170602': [new Reserva({
                titulo: 'Evento de teste',
                autor: 'Eric Breno',
                inicio: '08:00',
                fim: '10:00'
            })]
        };

        (() => {
            promiseEventosFuturos = self.loadReservasFuturas();
        })();
    }]);
})();