(() => {
    'use strict';

    angular.module('sidebarModulo').directive('sidebar', ['$state', '$window', '$rootScope', 'AuthService', 'ModalService', 'Usuario',
        function ($state, $window, $rootScope, AuthService, ModalService, Usuario) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebar.html',
                scope: {},
                link: function (scope, element, attrs) {
                    const GIT_URL = 'https://github.com/estacioneto/SCORE';

                    scope.auth = AuthService;
                    scope.usuario = new Usuario(scope.auth.getUsuarioLogado());

                    scope.nomeUsuario = _.first(scope.usuario.nome_completo.split(' '));

                    scope.getNomeEmail = function () {
                        const indiceQuebra = scope.usuario.email.indexOf('@');
                        return scope.usuario.email.substring(PRIMEIRO_INDICE, indiceQuebra);
                    };

                    scope.getDominioEmail = function () {
                        const indiceQuebra = scope.usuario.email.indexOf('@');
                        return scope.usuario.email.substring(indiceQuebra);
                    };

                    /**
                     * Abre o modal de informações dos desenvolvedores.
                     *
                     * @param   {$event}  $event evento no html.
                     * @returns {Promise} Promise do modal.
                     */
                    scope.sobreDesenvolvedores = $event => ModalService.exibirModalSobreDesenvolvedores($event);

                    /**
                     * Abre uma nova aba nas issues do projeto no github.
                     */
                    scope.goIssuesGithub = () => $window.open(`${GIT_URL}/issues`);

                    /**
                     * Abre uma nova aba com o projeto no github.
                     */
                    scope.goGithub = () => $window.open(GIT_URL);
                }
            };
        }]);
})();
