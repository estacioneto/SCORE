(() => {
    'use strict';

    angular.module('localModulo').component('detalhesLocalEdicao', {
        templateUrl: 'view/component/local/detalhes-local-edicao.html',
        bindings: {
            formulario: '=',
            local: '='
        },
        controller: [function () {
        }],
    });
})();
