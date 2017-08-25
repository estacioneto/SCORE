(() => {
    'use strict';

    /**
     * Controller responsável pela view da listagem de auditórios em agenda.
     *
     * @author Estácio Pereira.
     */
    angular.module("calendarioModulo").controller("ListagemAgendaController", ['$state', 'APP_STATES', function ($state, APP_STATES) {

        /**
         * Redireciona para a tela da agenda de local.
         *
         * @param {Local} local Local a ser redirecionado.
         */
        this.onChangeLocal = function (local) {
            $state.go(APP_STATES.AGENDA_ID.nome, {idLocal: local._id});
        };

        console.log($state.current);

    }]);
})();
