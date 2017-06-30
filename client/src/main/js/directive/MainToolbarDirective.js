(function () {
    'use strict';

    angular.module('toolbarModulo', []).directive('mainToolbar', ['$state', '$rootScope', 'AuthService', 'AuthLockService', 'ToastService', 'SearchService', '$mdSidenav', 'Usuario',
        function ($state, $rootScope, AuthService, AuthLockService, ToastService, SearchService, $mdSidenav, Usuario) {
            return {
                restrict: 'AE',
                templateUrl: './view/mainToolbar.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;

                    /**
                     * Function to toggle the sidebar menu
                     */
                    scope.menuFunction = function () {
                        var sidenav = $mdSidenav('main-sidenav');
                        if (sidenav.isOpen()) {
                            sidenav.close();
                        } else {
                            sidenav.toggle();
                        }
                    };

                    scope.user = AuthService.getLoggedUser();

                    /**
                     * Responsible for the logout logic related to the controller
                     * (states and service calls).
                     */
                    scope.logout = function () {
                        scope.auth.logout();
                        $state.go('app.login');
                    };

                    /**
                     * This function is responsible for, basically, show the Auth0 lock modal.
                     */
                    scope.signIn = function () {
                        scope.lock.show();
                        AuthLockService.inicializarVerificacoes();
                    };

                    /**
                     * Contains the authentication logic related to the controller after the lock.
                     *
                     * @param authResult The result returned from the lock.
                     */
                    function authenticate(authResult) {
                        return scope.lock.getProfile(authResult.idToken, function (err, user) {
                            if (err) {
                                return console.log('Auth error: ' + error);
                            }
                            scope.user = new Usuario(user);
                            AuthService.authenticate(authResult.idToken, scope.user);
                            $state.go('app.home');
                        });
                    }

                    /**
                     * Gets the current state name to show to the user.
                     *
                     * @returns {string} Name shown to the user.
                     */
                    scope.getCurrentStateName = function () {
                        var currentState = $state.current;
                        // if (currentState.name !== 'app.home' && currentState.name !== 'app.login') {
                        //     return scope.getStateName($state.current.name.toUpperCase());
                        // }
                        return 'SCORE';
                    };

                    /**
                     * Simply goes home.
                     */
                    scope.goHome = function () {
                        $state.go(true || scope.auth.isAuthenticated() ? 'app.home' : 'app.login');
                    };

                    /**
                     * Função principal.
                     */
                    (() => {
                        scope.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOCK_CONFIG);
                        scope.lock.on('authenticated', authenticate);
                    })();
                }
            };
        }]);
})();
