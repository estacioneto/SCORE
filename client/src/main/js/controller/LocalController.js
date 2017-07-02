(() => {
    'use strict';

    angular.module('localModulo').controller('LocalController', ['$state', '$stateParams', 'Local', 'local', function ($state, $stateParams, Local, local) {

        const self = this;

        this.edicao = $stateParams.edicao;
        this.local = local;

        this.onChangeLocal = function (local) {
            if (podeRedirecionarLocal(local)) {
                $state.go('app.local', {idLocal: local._id});
            }
        };

        function podeRedirecionarLocal (local) {
            return local && (!self.local || (local._id !== self.local._id));
        }

        this.isAdmin = () => true;

        this.isModoEdicao = () => this.edicao;

        this.adicionarLocal = function () {
            // TODO: Fazer uma verificação para não permitir que hajam problemas de perder dados, @author Estácio Pereira.
            this.local = new Local();
            this.edicao = true;
        };

    }]);
})();
