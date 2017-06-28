(() => {
    'use strict';

    /**
     * Factory de Local.
     *
     * @author Estácio Pereira.
     */
    angular.module('localModulo', []).factory('Local', [function () {

        /**
         * Construtor do local.
         *
         * @param {Object} local Objeto contendo informações do local.
         * @constructor
         */
        function Local(local) {
            Object.assign(this, local);
        }

        Local.prototype.constructor = Local;

        return Local;
    }]);
})();
