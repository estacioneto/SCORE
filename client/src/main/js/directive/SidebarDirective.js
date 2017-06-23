(function () {
    'use strict';

    var sidebar = angular.module('sidebarModule', []);

    sidebar.directive('sidebarPiton', ['$state', '$rootScope', 'AuthService', '$mdSidenav',
        function ($state, $rootScope, AuthService, $mdSidenav) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebarPiton.html',
                scope : {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;
                    scope.usuario = scope.auth.getLoggedUser();

                    const {user_metadata} = scope.usuario;

                    scope.nomeUsuario = _.first(user_metadata.nome_completo.split(' '));

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
                    }
                }
            };
        }]);
})();
