(() => {
    'use strict';

    /**
     * Componente responsável pela edição de equipamentos de um local.
     * 
     * @author Estácio Pereira.
     */
    angular.module('localModulo').component('equipamentosLocalEdicao', {
        templateUrl: 'view/component/local/equipamentos-local-edicao.html',
        bindings: {
            local: '='
        },
        controller: [function () {

            /**
             * Adiciona um equipamento vazio ao local.
             */
            this.adicionarEquipamento = function () {
                this.local.addEquipamento({});
            };

            /**
             * Remove um equipamento da lista de equipamentos dado o índice.
             * 
             * @param {Number} indice Índice do equipamento a ser removido.
             */
            this.removerEquipamento = function (indice) {
                this.local.equipamentos.remove(indice);
            };
        }],
    });
})();
