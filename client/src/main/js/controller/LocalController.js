(() => {
    'use strict';

    angular.module('localModulo').controller('LocalController', ['$state', '$stateParams', 'Local', 'local', function ($state, $stateParams, Local, local) {

        const self = this;

        this.isAdmin = () => true;

        this.edicao = $stateParams.edicao && this.isAdmin();
        this.local = local;

        this.onChangeLocal = function (local) {
            if (podeRedirecionarLocal(local)) {
                $state.go('app.local.id.info', {idLocal: local._id});
            }
        };

        function podeRedirecionarLocal(local) {
            return local && (!self.local || (local._id !== self.local._id));
        }

        this.isModoEdicao = () => this.edicao;

        this.adicionarLocal = function () {
            $state.go('app.local.edicao');
        };

        this.editarLocal = function () {
            $state.go('app.local.id.edicao', {idLocal: self.local._id});
        };

        this.deletarLocal = function () {
            // TODO
            console.log('TODO');
        };

    }]);
})();
