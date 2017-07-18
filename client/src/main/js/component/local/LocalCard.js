(() => {
    'use strict';

    /**
     * Componente do card de local.
     *
     * @param {Local} local Local a ser exibido.
     *
     * @author Estácio Pereira
     */
    angular.module('localModulo').component('localCard', {
        templateUrl: 'view/component/local/local-card.html',
        bindings: {
            local: '='
        },
        controller: [function () {
        }],
    });
})();
