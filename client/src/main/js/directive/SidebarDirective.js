(() => {
    'use strict';

    angular.module('sidebarModulo', []).directive('sidebar', ['$state', '$rootScope', '$mdSidenav', 'AuthService', 'Usuario',
        function ($state, $rootScope, $mdSidenav, AuthService, Usuario) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebar.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;
                    scope.usuario = new Usuario(scope.auth.getLoggedUser());

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
                     * Alterna a barra lateral.
                     */
                    scope.toggleSidebar = function () {
                        const sidenav = $mdSidenav('main-sidenav');
                        if (sidenav.isOpen()) {
                            sidenav.close();
                        } else {
                            sidenav.toggle();
                        }
                    };
                }
            };
        }]);
})();
