(() => {
    'use strict';

    /**
     * Componente que mostra as imagens do local bem como a opção de realizar upload.
     *
     * @param {Local}   local    Local relacionado.
     * @param {Boolean} editavel Boolean indicando se deve ou não permitir edição das imagens.
     * @author Estácio Pereira.
     */
    angular.module('localModulo').component('imagensLocal', {
        templateUrl: 'view/component/local/imagens-local.html',
        bindings: {
            local: '=',
            editavel: '<'
        },
        controller: ['ModalService', 'ToastService', '$scope', '$mdDialog', function (ModalService, ToastService, $scope, $mdDialog) {
            var self = this;


            $scope.$on('deleteImageById', function (event, response) {

                ModalService.confirmar("Deletar Imagem", "Deseja continuar? Ação não pode ser desfeita.").then(function(){
                    self.excluirImagem(response.id);
                    ToastService.showActionToast('Imagem excluída.');
                    fecharModal();
                }, function(){

                });

            });

            function fecharModal(){
                $mdDialog.hide('close');
            }

            this.excluirImagem = function (id) {
                _.remove(self.local.imagens, {
                    _id: id
                });
            };

            this.existemImagens = () => {
                return !_.isEmpty(self.local.imagens);
            };

            this.mostraModalImagem = function ($event, imagem, editavel) {
                ModalService.verImagem(imagem, $event, editavel);
            }
        }]
    });
})();