(() => {
    'use strict';

    angular.module('localModulo').service('LocaisService', ['$http', '$q', 'Local', function ($http, $q, Local) {

        const API = '/api/locais';

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
            return $http.get(`${API}/${id}`).then(data => {
                const local = data.data;
                return {data: new Local(local)};
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
            return $http.post(API, local).then(data => {
                const local = data.data;
                return {data: new Local(local)};
            });
        }

        /**
         * Edita um local já existente.
         *
         * @param local Local a ser editado.
         * @return {Promise} Promise contendo o local editado.
         */
        function editarLocal(local) {
            return $http.put(`${API}/${local._id}`, local).then(data => {
                const local = data.data;
                return {data: new Local(local)};
            });
        }

        /**
         * Deleta um local.
         *
         * @param id Id do local a ser deletado.
         * @return {Promise} Promise contento o local deletado.
         */
        this.excluirLocal = function (id) {
            return $http.delete(`${API}/${id}`).then(data => {
                const local = data.data;
                return {data: new Local(local)};
            });
        };
    }]);
})();
