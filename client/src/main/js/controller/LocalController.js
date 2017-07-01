(() => {
    'use strict';

    angular.module('localModulo').controller('LocalController', ['$state', 'local', function ($state, local) {

        const self = this;

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

        this.adicionarLocal = function () {
            console.log('yet');
        };

    }]);
})();
