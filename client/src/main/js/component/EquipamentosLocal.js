(() => {
    'use strict';

    angular.module('localModulo').component('equipamentosLocal', {
        templateUrl: 'view/component/equipamentos-local.html',
        bindings: {
            local: '=',
            editavel: '<'
        },
        controller: [function () {

            this.adicionarEquipamento = function () {
                this.local.equipamentos.push({});
            };

            this.removerEquipamento = function (equipamentoRemovido) {
                this.local.equipamentos = this.local.equipamentos
                    .filter(equipamento => equipamento.nome !== equipamentoRemovido.nome);
            };
        }],
    });
})();
