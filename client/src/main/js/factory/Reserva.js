let sequenceReserva = 1;
(() => {
    'use strict';
    /**
     * Factory que representa a entidade de reserva.
     */
    angular.module('agendamentoModulo', []).factory('Reserva', ['$http', '$q', function ($http, $q) {

        function Reserva(data) {
            if (!data) {
                this.id = sequenceReserva++;
                return;
            }
            this.id = data.id || sequenceReserva++;
            this.author = data.author;
            this.title = data.title;
            this.description = data.description;
            this.start = data.start._d;
            this.end = data.end._d;
        }

        /**
         * Recupera a reserva original do servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.carregar = function () {
            return $q.when({});
        };

        /**
         * Persiste a reserva.
         * @return Promise da requisição.
         */
        Reserva.prototype.salvar = function () {
            return $q.when(this);
        };

        /**
         * Exclui a reserva do servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.excluir = function () {
            delete this.author;
            delete this.description;
            return this.salvar();
        };

        /**
         * Atualiza a requisição no servidor.
         * @return Promise da requisição.
         */
        Reserva.prototype.atualizar = function () {
            return $q.when({});
        };

        /**
         * Retorna o horário de início e término da reserva formatada, no formato
         * HH:MM-HH-MM
         */
        Reserva.prototype.getHoraFormatada = function() {
            return `${getHorario(this.start)}-${getHorario(this.end)}`;
        };

        /**
         * Retorna a hora da data especificada no formato HH:MM.
         *
         * @param data Data a ter o horário retornado
         * @returns {string} Horário formatado.
         */
        function getHorario(data) {
            let horario = '';

            horario += `${(data.getHours() + 3)}:`;
            horario += `${data.getMinutes()}`;

            return horario;
        }

        Reserva.prototype.constructor = Reserva;

        return Reserva;
    }]);
})();