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
        controller: ['$state', 'APP_STATES', function ($state, APP_STATES) {
            const self = this;
            const INDICE_NOME_STATE = 1;

            /**
             * Objeto contendo os states disponíveis a partir do state atual.
             *
             * @type {{[state]: [{[nome]: [string], [icone]: [string]}]}}
             */
            this.statesDisponiveis = {
                AGENDA: [APP_STATES.LOCAL_INFO],
                LOCAL: [APP_STATES.AGENDA_INFO, APP_STATES.LOCAL_INFO]
            };

            /**
             * Retorna os states disponíveis a partir do state atual.
             *
             * @returns {Array} Lista dos states disponíveis.
             */
            this.getStatesDisponiveis = function () {
                const stateAtual = this.getNomeState($state.current.name);
                return self.statesDisponiveis[stateAtual];
            };

            /**
             * Dado o nome completo do state, retorna o nome que estará no botão de redirecionamento.
             *
             * @param   {string} nomeState Nome completo do state.
             * @returns {string} Último nome do state.
             */
            this.getNomeState = nomeState => _.toUpper(nomeState.split('.')[INDICE_NOME_STATE]);
        }]
    });
})();
