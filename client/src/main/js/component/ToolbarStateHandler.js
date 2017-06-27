(() => {
    'use strict';

    /**
     * Componente responsável por lidar com lógica de redirecionamento de states presentes na toolbar.
     *
     * @author Estácio Pereira.
     */
    angular.module('toolbarModulo').component('toolbarStateHandler', {
        templateUrl: 'view/component/toolbar-state-handler.html',
        bindings: {},
        controller: ['$state', function ($state) {
            const self = this;

            /**
             * Objeto contendo os states disponíveis a partir do state atual.
             *
             * @type {{[state]: [{[nome]: [string], [icone]: [string]}]}}
             */
            this.statesDisponiveis = {
                'app.home': []
            };

            /**
             * Retorna os states disponíveis a partir do state atual.
             *
             * @returns {Array} Lista dos states disponíveis.
             */
            this.getStatesDisponiveis = function () {
                const stateAtual = $state.current.name;
                return self.statesDisponiveis[stateAtual];
            };

            /**
             * Dado o nome completo do state, retorna o nome que estará no botão de redirecionamento.
             *
             * @param   {string} nomeState Nome completo do state.
             * @returns {string} Último nome do state.
             */
            this.getNomeState = function (nomeState) {
                return _.last(nomeState.split('.'));
            }
        }]
    });
})();
