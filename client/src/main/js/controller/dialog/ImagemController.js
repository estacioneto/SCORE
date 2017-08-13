(function () {
    'use strict';

    angular.module('localModulo').controller('ImagemController', ['imagem', 'editavel', 'excluirImagemCallback', '$rootScope', '$mdDialog', function (imagem, editavel, excluirImagemCallback, $mdDialog) {
        var self = this;
        this.imagem = imagem;
        this.editavel = editavel;

        /**
         * Função que chama o callback de exclusão de imagens.
         */
        this.excluirImagem = function () {
            excluirImagemCallback(self.imagem._id);
        };

    }]);
}());