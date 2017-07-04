(() => {
    'use strict';

    angular.module('localModulo').component('equipamentosLocalEdicao', {
        templateUrl: 'view/component/local/equipamentos-local-edicao.html',
        bindings: {
            local: '='
        },
        controller: [function () {

            this.adicionarEquipamento = function () {
                this.local.addEquipamento({});
            };

            this.removerEquipamento = function (equipamentoRemovido) {
                this.local.equipamentos = this.local.equipamentos
                    .filter(equipamento => equipamento.nome !== equipamentoRemovido.nome);
            };
        }],
    });
})();
