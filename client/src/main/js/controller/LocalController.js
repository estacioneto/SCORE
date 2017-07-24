(() => {
    'use strict';

    angular.module('localModulo').controller('LocalController', ['$state', '$stateParams', 'APP_STATES', 'Local', 'local', function ($state, $stateParams, APP_STATES, Local, local) {

        const self = this;

        this.isAdmin = () => true;

        this.edicao = this.isAdmin();
        this.local = local;

        this.onChangeLocal = function (local) {
            if (podeRedirecionarLocal(local)) {
                $state.go(APP_STATES.LOCAL_ID_INFO.nome, {idLocal: local._id});
            }
        };

        function podeRedirecionarLocal(local) {
            return local && (!self.local || (local._id !== self.local._id));
        }

        this.isModoEdicao = () => this.edicao;

        this.adicionarLocal = function () {
            $state.go(APP_STATES.LOCAL_EDICAO.nome);
        };

        this.editarLocal = function () {
            $state.go(APP_STATES.LOCAL_ID_EDICAO.nome, {idLocal: self.local._id});
        };

        this.deletarLocal = function () {
            // TODO
            console.log('TODO');
        };

    }]);
})();
