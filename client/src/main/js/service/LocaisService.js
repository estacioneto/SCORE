(() => {
    'use strict';

    angular.module('localModulo').service('LocaisService', ['$http', '$q', 'Local', 'Reserva', function ($http, $q, Local, Reserva) {

        const API = '/api/locais',
            RESERVA_SUB_API = 'reservas';

        /**
         * Retorna todos os locais.
         *
         * @return {Promise} Promise contendo a lista de locais.
         */
        this.carregarLocais = function () {
            return $http.get(API).then(data => {
                const locais = data.data;
                return { data: locais.map(local => new Local(local)) };
            });
        };

        /**
         * Retorna um local de acordo com o id especificado.
         *
         * @param id Id do local a ser retornado.
         * @return {Promise} Promise contendo o local.
         */
        this.carregarLocal = function (id) {
            return $http.get(`${API}/${id}`).then(retornarLocal);
        };

        this.carregarReservasDoLocal = function (id) {
            return $http.get(`${API}/${id}/${RESERVA_SUB_API}`).then(data => {
                const listaReservas = data.data.map(r => new Reserva(r));
                return {data: listaReservas};
            });
        };

        /**
         * Salva o local especificado, ou editando-o se o mesmo já pertence ao BD ou
         * criando-o caso contrário.
         *
         * @return {Promise} Promise contendo o local salvo.
         */
        this.salvarLocal = function (local) {
            return (local._id) ? editarLocal(local) : criarLocal(local);
        };

        /**
         * Persiste um novo local.
         *
         * @param local Local a ser persistido.
         * @return {Promise} Promise contendo o local criado.
         */
        function criarLocal(local) {
            return $http.post(API, local).then(retornarLocal);
        }

        /**
         * Edita um local já existente.
         *
         * @param local Local a ser editado.
         * @return {Promise} Promise contendo o local editado.
         */
        function editarLocal(local) {
            return $http.put(`${API}/${local._id}`, local).then(retornarLocal);
        }

        /**
         * Deleta um local.
         *
         * @param id Id do local a ser deletado.
         * @return {Promise} Promise contento o local deletado.
         */
        this.excluirLocal = function (id) {
            return $http.delete(`${API}/${id}`).then(retornarLocal);
        };

        /**
         * Retorna o local, como objeto Local, encapsulado pela resposa da requisição, data.
         *
         * @param data Resposta da requisição.
         * @return {{data: (Local|*)}} Objeto contendo o local a ser retornado.
         */
        function retornarLocal(data) {
            const local = data.data;
            return {data: new Local(local)};
        }
    }]);
})();
