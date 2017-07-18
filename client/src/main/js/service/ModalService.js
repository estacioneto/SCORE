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
         * @param mensagem Mensagem a ser mostrada no modal.
         */
        this.confirmar = mensagem => {
            const modal = $mdDialog.confirm({
                title: 'Confirmar',
                textContent: mensagem,
                ok: 'Sim',
                cancel: 'Não'
            });

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
         * @param reserva Horário a ser visualizado.
         * @return Promise do modal.
         */
        this.verReserva = (reserva) => {
            return $mdDialog.show({
                controller: 'DetalhesReservaController as reservaCtrl',
                templateUrl: 'view/detalhesReserva.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                escapeToClose: false,
                locals: {
                    reserva: reserva
                }
            });
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
                resolve
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
         * Cria um modal com infos sobre a aplicação.
         */
        this.aboutModal = function () {
            return $mdPanel.create({
                template: '<about></about>',
                attachTo: angular.element(document.body),
                position: $mdPanel.newPanelPosition().center(),
                hasBackdrop: true,
                clickOutsideToClose: true,
                escapeToClose: true
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
        }]);
}());