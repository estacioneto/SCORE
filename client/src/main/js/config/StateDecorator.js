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
        $provide.decorator('$state', ['$transitions', '$delegate', function ($transitions, $delegate) {

            const $stateStack = [];
            let $isGoingBack = false;

            /**
             * Ao ocorrer uma transição, se não for o primeiro state e se não estiver em uma
             * transição para retorno, o state de origem será guardado.
             */
            $transitions.onSuccess({}, function ($transition) {
                const fromState = $transition.$from();
                if (fromState.name && !$isGoingBack) {
                    $stateStack.push(fromState);
                }
                $isGoingBack = false;
            });

            /**
             * Executa ação de voltar. Caso haja state para voltar (pode não haver em caso de refresh),
             * volta para o state e retorna true.
             *
             * @returns {boolean} true caso tenha sido feita a transição, false caso contrário.
             */
            $delegate.goBack = function () {
                if (!_.isEmpty($stateStack)) {
                    const toState = $stateStack.pop();
                    $isGoingBack = true;
                    $delegate.go(toState.name, toState.params);
                    return true;
                }
                return false;
            };

            return $delegate;
        }]);
    }])
})();
