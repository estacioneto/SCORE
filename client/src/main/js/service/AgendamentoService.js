(() => {
    'use strict';
    angular.module('agendamentoModulo').service('AgendamentoService', ['$http', '$q', 'Reserva', function ($http, $q, Reserva) {

        const self = this;

        let promiseEventosFuturos;

        /**
         * Retorna as reservas de um dado dia.
         */
        this.getReservasDia = data => {
            const mes = data.getMonth() > 9 ? data.getMonth() : '0' + data.getMonth();
            const dia = data.getDate() > 9 ? data.getDate() : '0' + data.getDate();
            const identificadorDia = `${data.getFullYear()}${mes}${dia}`;
            return promiseEventosFuturos.then(data => {
                return preencheHorarios(data[identificadorDia] || []);
            });
        };

        /**
         * Preenche os horarios vazios com um objeto, temporário, apenas para prototipo.
         * @param {*} dia 
         */
        function preencheHorarios(dia) {
            if (dia.length === 4) {
                return dia;
            }
            const horarios = {
                '08': null,
                '10': null,
                '14': null,
                '16': null
            };
            dia.forEach(horario => {
                horarios[horario.hora] = horario;
            });
            Object.keys(horarios).forEach(k => {
                if (!horarios[k]) {
                    dia.push(new Reserva({
                        hora: k
                    }));
                }
            });
            return dia;
        }

        /**
         * Carrega as reservas futuras e deixa em memória. Melhorar isso,
         * verificar como deixar eficiente com o calendário.
         */
        this.loadReservasFuturas = () => {
            return $q.when({
                '20170514': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                }), new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '10'
                })],
                '20170518': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                })],
                '20170520': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                }), new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '10'
                })],
                '20170522': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Vélmer',
                    hora: '08'
                }), new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Estácio Pereira',
                    hora: '10'
                })],
                '20170524': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '14'
                })],
                '20170525': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '10'
                }), new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '14'
                }), new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '16'
                })],
                '20170527': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                })],
                '20170528': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                })],
                '20170529': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '10'
                })],
                '20170601': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                })],
                '20170602': [new Reserva({
                    descricao: 'Evento de teste',
                    autor: 'Eric Breno',
                    hora: '08'
                })]
            });
        };

        (() => {
            promiseEventosFuturos = self.loadReservasFuturas();
        })();
    }]);
})();