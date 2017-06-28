(function () {
    'use strict';

    /**
     * Factory de Usuário. Monta o objeto que encapsula propriedades do Auth0 e funções necessárias.
     */
    angular.module('userModule', []).factory('Usuario', [function () {

        const METADADOS = ['nome_completo', 'numero_telefone'];

        /**
         * Construtor da factory. Dado um usuário, monta o objeto.
         *
         * @param {String} user Usuario to become an Usuario object.
         * @constructor
         */
        function Usuario(user) {
            Object.assign(this, user);
            this.organizarMetadados();
        }

        /**
         * Define getters e setters dos metadados do usuário.
         */
        Usuario.prototype.organizarMetadados = function () {
            _.each(METADADOS, prop => {
                this.__defineGetter__(prop, () => this.user_metadata[prop]);
            });
        };

        Usuario.prototype.constructor = Usuario;

        return Usuario;
    }]);
}());