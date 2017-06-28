let sequenceReserva = 1;
(() => {
    'use-strict';
    /**
     * Factory que representa a entidade de reserva.
     */
    angular.module('agendamentoModulo', []).factory('Reserva', ['$http', '$q', function ($http, $q) {

        function Reserva(data) {
            if (!data) {
                this.id = sequenceReserva++;
                return;
            }
            this.autor = data.autor;
            this.descricao = data.descricao;
            this.inicio = data.inicio;
            this.fim = data.fim;
            this.id = data.id || sequenceReserva++;
            this.titulo = data.titulo;
        };

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
            delete this.autor;
            delete this.descricao;
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
         * Retorna a hora da reserva formatada, no formato 
         * HH:MM-HH-MM
         */
        Reserva.prototype.getHoraFormatada = function() {
            return `${this.inicio}-${this.fim}`;
        };

        Reserva.prototype.constructor = Reserva;

        return Reserva;
    }]);
})();