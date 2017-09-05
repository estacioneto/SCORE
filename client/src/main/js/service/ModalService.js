(function () {
    'use strict';
    var modalModule = angular.module('modalModule', []);

    /**
     * Modal Service encapsula as operações com o painel e com serviços de dialog
     *
     * @author Eric Breno.
     */
    modalModule.service('ModalService', ['$q', '$mdDialog', '$mdPanel', '$rootScope', function ($q, $mdDialog, $mdPanel, $rootScope) {

        var self = this;

        /**
         * Abre um modal de confirmação.
         *
         * @param titulo Titulo a ser exibido no modal.
         * @param mensagem Mensagem a ser mostrada no modal.
         */
        this.confirmar = (titulo, mensagem) => {
            //Sobre multiple: https://github.com/angular/material/issues/8630
            const modal = $mdDialog.confirm()
                .title(titulo)
                .theme($rootScope.theme)
                .textContent(mensagem)
                .multiple(true)
                .ok('Sim')
                .cancel('Não');

            return $mdDialog.show(modal);
        };

        /**
         * Abre um modal Error.
         *
         * @param message A mensagem de erro.
         * @param title O título do modal.
         * @return Promise que avalia como cumprido quando fechado.
         */
        this.error = function (message, title) {
            title = title || "Erro";
            return $mdDialog.show({
                templateUrl: './view/simpleModal.html',
                controller: 'ModalCtrl',
                clickOutsideToClose: false,
                escapeToClose: false,
                attachTo: angular.element(document.body),
                resolve: {
                    message: function () {
                        return message;
                    },
                    title: function () {
                        return title;
                    }
                }
            });
        };

        /**
         * Abre o modal com a visualização de detalhes e edição de reserva.
         *
         * @param {Reserva} reserva Horário a ser visualizado.
         * @param {Local} local Local relacionado a reserva.
         * @return {Promise} Promise do modal.
         */
        this.verReserva = (reserva, local) => {
            return $mdDialog.show({
                controller: 'DetalhesReservaController as reservaCtrl',
                templateUrl: 'view/detalhesReserva.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                locals: {
                    reserva,
                    local
                }
            }).catch(() => {/*ayy lmao*/});
        };


        /**
         * Abre o modal de visualização da imagem em 'full size'
         *
         * @param {Object} imagem Imagem a ser visualizada
         * @param {Event} $event Evendo do clique.
         * @param {Boolean} editavel Identifica se a imagem pode ser excluída ou não.
         * @param {Function} excluirImagemCallback Callback a ser chamado ao apertar o botão de excluir imagem no modal.
         * @param {Function} definirComoCapaCallback Callback a ser chamado ao apertar o botão de favoritar imagem no modal.
         * @param {Boolean} isCapa True caso a imagem sendo visualizada seja a capa do local.
         * @returns {Promise} Promise do modal.
         */
        this.verImagem = function (imagem, $event, editavel, excluirImagemCallback, definirComoCapaCallback, isCapa) {
            const options = {
                templateUrl: 'view/dialog/full-size-image.html',
                controller: 'ImagemController as imagemCtrl',
                targetEvent: $event,
                resolve: {
                    imagem: () => imagem,
                    editavel: () => editavel,
                    excluirImagemCallback : () => excluirImagemCallback,
                    definirComoCapaCallback : () => definirComoCapaCallback,
                    isCapa : () => isCapa
                }
            };
            return self.custom(options);
        };

        /**
         * Abre o modal de visualização para termos do local.
         * 
         * @param {Local} local Local
         * @param {Boolean} editavel identificação se os termos devem ser editáveis.
         * @param {Event} $event Evento do clique.
         * @return {Promise} Promise do modal.
         */
        this.verTermosLocal = function (local, editavel, $event) {
            const options = {
                templateUrl: 'view/dialog/local/termo-de-condicoes-dialog.html',
                controller: 'TermoDeCondicoesDialogController as dialogCtrl',
                targetEvent: $event,
                resolve: {
                    local: () => local,
                    editavel: () => editavel
                }
            };
            return self.custom(options);
        };

        /**
         * Exibe indicador de carregamento.
         *
         * @returns {!MdPanelRef} Instância do Panel do indicador.
         */
        this.exibirIndicadorCarregamento = function () {
            return $mdPanel.create({
                template: '<div layout="row" layout-sm="column" layout-align="space-around" md-theme="{{$root.theme}}"><md-progress-circular class="md-primary" md-mode="indeterminate"></md-progress-circular></div>',
                attachTo: angular.element(document.body),
                position: $mdPanel.newPanelPosition().center(),
                hasBackdrop: true,
            });
        };

        /**
         * Abre um modal personalizado. Recebe um objeto com as propriedades de personalização
         *
         * @param {String}             templateUrl         Url do html do modal.
         * @param {angular.controller} controller          Controller do modal.
         * @param {event}              targetEvent         Evento de clique para exibição do modal a partir do elemento.
         * @param {boolean}            clickOutsideToClose Booleano indicando se deve fechar ao clicar fora do modal. (Valor padrão {@code true})
         * @param {boolean}            escapeToClose       Booleano indicando se deve fechar ao pressionar tecla ESC. (Valor padrão {@code true})
         * @param {boolean}            multiple            Booleano indicando se deve . (Valor padrão {@code true})
         * @param {angular.element}    attachTo            Elemento indicando onde deve o modal deve ser 'attached'. (Valor padrão {@code angular.element(document.body)})
         * @param {Object}             resolve             Objeto contendo 'resolve' do controller do modal. (Valor padrão {@code {} })
         *
         * @return {Promise} Promise do modal.
         */
        this.custom = function ({
                                    templateUrl,
                                    controller,
                                    targetEvent,
                                    clickOutsideToClose = true,
                                    escapeToClose = true,
                                    multiple = true,
                                    attachTo = angular.element(document.body),
                                    resolve = {}
                                }) {
            return $mdDialog.show({
                templateUrl,
                controller,
                clickOutsideToClose,
                escapeToClose,
                targetEvent,
                attachTo,
                parent: angular.element(document.body),
                resolve,
                multiple
            });
        };

        /**
         * Notifica o usuário sobre erro e retorna uma promise rejeitada.
         *
         * @param   {String}  mensagem Mensagem de erro mostrada
         * @param   {*}       err      Erro da promise. (Opcional)
         * @returns {Promise} Promise rejeitada para permitir encadeamento de promises.
         */
        this.notificarErro = function (mensagem, err) {
            this.error(mensagem);
            return $q.reject(err || mensagem);
        };

        /**
         * Confirma a atualização de uma reserva de repetição, mostrando
         * as opções sobre os tipos de repetições disponíveis.
         * 
         * @param {Reserva} reserva Reserva sendo salva.
         * @return {Promise} Promise do modal.
         */
        this.confirmarAtualizacaoRepeticao = function(reserva) {
            return self.custom({
                templateUrl: 'view/dialog/repeticao-reserva.html',
                controller: 'OpcoesRepeticaoController as repeticaoCtrl',
                resolve: {
                    reserva: () => reserva
                }
            });
        };

        /**
         * Exibe o modal de informações dos desenvolvedores.
         *
         * @param   {$event}  $event evento no html.
         * @returns {Promise} Promise do modal.
         */
        this.exibirModalSobreDesenvolvedores = function ($event) {
            const templateUrl = 'view/dialog/sobre-desenvolvedores.html',
                controller = 'SobreDesenvolvedoresController as sobreCtrl',
                targetEvent = $event;
            return this.custom({
                templateUrl,
                controller,
                targetEvent
            });
        };
    }])

    /**
     * Controller modal padrão.
     */
        .controller('ModalCtrl', ["$scope", "message", "title", '$mdDialog', function ($scope, message, title, $mdDialog) {

            $scope.message = message;

            $scope.title = title;

            $scope.ok = function () {
                $mdDialog.hide("close");
            };
        }])
        
        .controller('OpcoesRepeticaoController', ['$scope', '$mdDialog', 'reserva', function($scope, $mdDialog, reserva) {
            
            this.attTodas = () => {
                reserva.atualizarTodas = true;
                $mdDialog.hide();
            };

            this.attEsta = () => {
                $mdDialog.hide();
            };

            this.attFuturas = () => {
                reserva.atualizarFuturas = true;
                $mdDialog.hide();
            };

            $scope.cancelar = function () {
                $mdDialog.cancel();
            };
        }]);
}());