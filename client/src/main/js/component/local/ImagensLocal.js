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
            const FIRST_IMAGE_INDEX = 0;

            /**
             * Função de callback passada para o controller do modal de imagem 'full size'.
             * Será chamada ao apertar o botão de excluir imagem presente no modal.
             * @param {String} idImagem Id da imagem que será excluída.
             */
            function excluirImagemCallback(idImagem){
                ModalService.confirmar("Deletar Imagem", "Deseja continuar? Ação não pode ser desfeita.").then(function(){
                    if(!_.isUndefined(idImagem)) {
                        self.removerImagem(idImagem);
                        ToastService.showActionToast('Imagem excluída.');
                    }
                    else ModalService.error("Salve as suas modificações antes de excluir a imagem", "Imagem ainda não foi salva");
                    fecharModal();
                }, function(){

                });
            }

            /**
             * Função de callback passada para o controller do modal de imagem 'full size'.
             * Será chamada ao apertar o botão de favoritar imagem presente no modal.
             * A imagem selecionada como capa trocará de lugar com que está em primeiro.
             * @param {String} idImagem Id da imagem que será definida como capa.
             */
            function definirComoCapaCallback(idImagem) {
                var indiceImagem = _.findIndex(self.local.imagens, {
                    _id: idImagem
                });
                let imgArray = self.local.imagens;
                [imgArray[indiceImagem], imgArray[FIRST_IMAGE_INDEX]] = [imgArray[FIRST_IMAGE_INDEX], imgArray[indiceImagem]];
                
            }

            /**
             * Fecha o modal de visualização de imagem em 'full size'.
             */
            function fecharModal(){
                $mdDialog.hide('close');
            }

            /**
             * Remove uma imagem da lista de imagens do local.
             * @param {String} idImagem Id da imagem que será removida.
             */
            this.removerImagem = function (idImagem) {
                _.remove(self.local.imagens, imagem => (imagem._id || imagem.tempId) === idImagem);
            };

            /**
             * Verifica se o local possui alguma imagem.
             * @returns {Boolean} True se o local possui alguma imagem, False caso contrário.
             */
            this.existemImagens = function(){
                return !_.isEmpty(self.local.imagens);
            };

            /**
             *
             * @param {Event} $event Evento do clique.
             * @param {Object} imagem Imagem a ser exibida.
             * @param {Boolean} editavel Flag que indica se a imagem pode ou não ser excluida.
             * @returns {Promise} Promise do modal.
             */
            this.mostraModalImagem = function ($event, imagem, editavel) {
                return ModalService.verImagem(imagem, $event, editavel, excluirImagemCallback, definirComoCapaCallback);
            }
        }]
    });
})();