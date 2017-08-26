(function () {
    'use strict';

    angular.module('localModulo').controller('ImagemController', ['imagem', 'editavel', 'excluirImagemCallback', 'definirComoCapaCallback', 'isCapa', function (imagem, editavel, excluirImagemCallback, definirComoCapaCallback, isCapa) {
        var self = this;
        this.imagem = imagem;
        this.editavel = editavel;
        this.isCapa = isCapa;

        /**
         * Chama o callback de exclusão de imagens.
         */
        this.excluirImagem = function () {
            excluirImagemCallback(self.imagem._id || self.imagem.tempId);
        };

        /**
         * Chama o callback para definir a imagem como capa do local.
         */
        this.definirComoCapa = function() {
            return definirComoCapaCallback(self.imagem._id || self.imagem.tempId);
        }

    }]);
}());