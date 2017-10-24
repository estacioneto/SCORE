(() => {
    'use strict';

    const app = angular.module('scoreApp');

    /**
     * Decorator do $state. Utilizado para sobrescrever, remover ou adicionar funcionalidades
     * ao Service.
     * https://docs.angularjs.org/guide/decorators
     *
     * @author Estácio Pereira.
     */
    app.config(['$provide', function ($provide) {
        $provide.decorator('$state', ['$delegate', '$transitions', function ($delegate, $transitions) {

            let $isGoingBack = false;

            $delegate.$stateStack = [];

            /**
             * Ao ocorrer uma transição, se não for o primeiro state e se não estiver em uma
             * transição para retorno, o state de origem será guardado.
             *
             * @param {Object} $transition Objeto encapsulador da transição.
             */
            $delegate.$$onTransitionSuccess = function ($transition) {
                const fromState = $transition.$from();
                fromState.$params = $transition.params('from');

                if (fromState.name && !$isGoingBack) {
                    $delegate.$stateStack.push(fromState);
                }
                $isGoingBack = false;
            };

            $transitions.onSuccess({}, $delegate.$$onTransitionSuccess);

            /**
             * Executa ação de voltar. Caso haja state para voltar (pode não haver em caso de refresh),
             * volta para o state e retorna true.
             * Obs.:Caso não haja state para voltar, utiliza os parâmetros passados para executar uma transição padrão.
             *
             * @param {String} defaultStateName          Nome do state padrão.
             * @param {Object} [defaultStateParams = {}] Parâmetros do state padrão.
             *
             * @returns {boolean} true caso tenha sido feita a transição, false caso contrário.
             */
            $delegate.goBack = function (defaultStateName, defaultStateParams = {}) {
                if (!_.isEmpty($delegate.$stateStack)) {
                    const toState = $delegate.$stateStack.pop();
                    $isGoingBack = true;
                    $delegate.go(toState.name, toState.$params);
                    return true;
                } else if (defaultStateName) {
                    $delegate.go(defaultStateName, defaultStateParams);
                    return true;
                } else {
                    return false;
                }
            };

            return $delegate;
        }]);
    }])
})();
