(() => {
    'use-strict';
    /**
     * Factory que representa a entidade de reserva.
     */
    angular.module('calendarioModulo', []).factory('Reserva', ['$http', '$q', function ($http, $q) {

        function Reserva(data) {
            this.autor = data.autor;
            this.descricao = data.descricao;
            this.hora = data.hora;
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
            return $q.when({});
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

        Reserva.prototype.constructor = Reserva;

        return Reserva;
    }]);
})();