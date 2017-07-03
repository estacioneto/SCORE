(() => {
    'use strict';

    angular.module('localModulo').controller('LocalEdicaoController', ['Local', 'local', function (Local, local) {

        const self = this;
        this.local = local || new Local();

        this.salvarLocal = function () {
            // TODO
            console.log('TODO');
        };

        this.limparCampos = function () {
            // TODO
            console.log('TODO');
        };

    }]);
})();
