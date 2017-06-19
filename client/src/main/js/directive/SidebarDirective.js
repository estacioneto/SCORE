(function () {
    'use strict';

    var sidebar = angular.module('sidebarModule', []);

    sidebar.directive('sidebarPiton', ['$state', '$rootScope', 'AuthService', '$mdSidenav',
        function ($state, $rootScope, AuthService, $mdSidenav) {
            return {
                restrict: 'AE',
                templateUrl: './view/sidebarPiton.html',
                scope : {
                    controller: '='
                },
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;
                    scope.user = scope.auth.getLoggedUser();

                    /**
                     * Simply toggles the sidebar.
                     */
                    scope.toggleSidebar = function () {
                        var sidenav = $mdSidenav('main-sidenav');
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
