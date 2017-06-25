(() => {
    'use strict';

    angular.module('sidebarModule', []).directive('sidebar', ['$state', '$rootScope', '$mdSidenav', 'AuthService', 'LocaisService',
        function ($state, $rootScope, $mdSidenav, AuthService, LocaisService) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebar.html',
                scope : {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;
                    scope.usuario = scope.auth.getLoggedUser();
                    scope.locais = [];
                    scope.predios = [];

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
                    };

                    function carregarLocais() {
                        return LocaisService.carregarLocais().then(info => {
                            scope.locais.clear();
                            scope.locais.pushAll(info.data);

                            scope.predios = _.uniqBy(scope.locais, 'predio').map(local => local.predio);
                        });
                    }

                    (() => {
                        carregarLocais();
                    })();
                }
            };
        }]);
})();
