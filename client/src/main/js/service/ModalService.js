(function () {
    'use strict';
    var modalModule = angular.module('modalModule', []);

    /**
     * Modal Service encapsula as operações com o painel e com serviços de dialog
     *
     * @author Eric Breno.
     */
    modalModule.service('ModalService', ['$mdDialog', '$mdPanel', '$rootScope', function ($mdDialog, $mdPanel, $rootScope) {

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
             * Abre Note view modal.
             * 
             * @param {Note}   note          A anotação a ser editada ou visualizada.
             * @param {Note}   tempNote      Para estar em view.
             * @param {Array}  availableTags A lista de tags disponíveis para completar campos.
             * @param {$event} $event        Angular $event.
             */
            this.viewNote = function (note, tempNote, $event, availableTags) {
                return $mdDialog.show({
                    controller: 'NoteController as noteCtrl',
                    templateUrl: './view/noteModal.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    clickOutsideToClose: false,
                    bindToController: true,
                    escapeToClose: false,
                    resolve: {
                        _note_: function () {
                            return note;
                        },
                        _tempNote_: function () {
                            return tempNote;
                        },
                        _availableTags_: function () {
                            return availableTags || [];
                        }
                    }
                }).finally(function () {
                    $rootScope.$broadcast('filter');
                });
            };

            this.loadingIndicatorModal = function () {
                return $mdPanel.create({
                    template: '<div layout="row" layout-sm="column" layout-align="space-around" md-theme="{{$root.theme}}"><md-progress-circular class="md-primary" md-mode="indeterminate"></md-progress-circular></div>',
                    attachTo: angular.element(document.body),
                    position: $mdPanel.newPanelPosition().center(),
                    hasBackdrop: true,
                });
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