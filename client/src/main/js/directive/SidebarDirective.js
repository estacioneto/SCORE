(() => {
    'use strict';

    angular.module('sidebarModulo', []).directive('sidebar', ['$state', '$rootScope', '$mdSidenav', 'AuthService', 'Usuario',
        function ($state, $rootScope, $mdSidenav, AuthService, Usuario) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebar.html',
                scope : {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;
                    scope.usuario = scope.auth.getLoggedUser();
                    const usuario = new Usuario(scope.usuario);

                    scope.nomeUsuario = _.first(usuario.nome_completo.split(' '));

                    /**
                     * Simply toggles the sidebar.
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
