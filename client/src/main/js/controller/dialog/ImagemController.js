(function () {
    'use strict';

    angular.module('localModulo').controller('ImagemController', ['imagem', 'editavel', '$rootScope', '$mdDialog', function (imagem, editavel, $rootScope, $mdDialog) {
        var self = this;
        this.imagem = imagem;
        this.editavel = editavel;

        this.excluirImagem = function () {
            $rootScope.$broadcast('deleteImageById',{id: self.imagem._id});
        };

    }]);
}());