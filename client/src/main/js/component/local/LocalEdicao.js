(() => {
    'use strict';

    angular.module('localModulo').component('localEdicao', {
        templateUrl: 'view/component/local/local-edicao.html',
        bindings: {
            formulario: '=',
            local: '='
        },
        controller: [function () {
        }],
    });
})();
