(() => {
    'use strict';

    angular.module('localModulo').controller('LocalEdicaoController', ['Local', 'local', function (Local, local) {

        const self = this;
        this.local = local || new Local();

        this.salvarLocal = function () {
            // TODO
            alert('Funcionalidade não implementada!')
        };

        this.limparCampos = function () {
            // TODO
            alert('Funcionalidade não implementada!')
        };

    }]);
})();
