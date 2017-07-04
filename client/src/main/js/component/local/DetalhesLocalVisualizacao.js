(() => {
    'use strict';

    angular.module('localModulo').component('detalhesLocalVisualizacao', {
        templateUrl: 'view/component/local/detalhes-local-visualizacao.html',
        bindings: {
            local: '='
        },
        controller: [function () {
            this.getFuncionamentoFormatado = () => this.local.getFuncionamentoFormatado();
        }],
    });
})();
