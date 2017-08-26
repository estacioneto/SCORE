(function () {
    'use strict';

    angular.module('toolbarModulo', []).directive('mainToolbar', ['$state', '$rootScope', 'AuthService', 'AuthLockService', 'ToastService', 'SearchService', '$mdSidenav', 'Usuario', 'APP_STATES',
        function ($state, $rootScope, AuthService, AuthLockService, ToastService, SearchService, $mdSidenav, Usuario, APP_STATES) {
            return {
                restrict: 'AE',
                templateUrl: './view/mainToolbar.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;

                    /**
                     * Funcao para alternar a barra de menu lateral
                     * 
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
                     * Responsavel pela logica de logout relacionada ao controller
                     * (chamadas de estados e servicos).
                     * 
                     */
                    scope.logout = function () {
                        scope.auth.logout();
                        $state.go(APP_STATES.LOGIN.nome);
                    };

                    /**
                     * Responsavel, basicamente, por mostrar o Auth0 lock modal
                     * 
                     */
                    scope.signIn = function () {
                        scope.lock.show();
                        AuthLockService.inicializarVerificacoes();
                    };

                    /**
                     * Contem a logica de autenticacao relacionada ao controller apos o lock.
                     *
                     * @param authResult O resultado retornado pelo lock.
                     */
                    function authenticate(authResult) {
                        return scope.lock.getProfile(authResult.idToken, function (err, user) {
                            if (err) {
                                return console.log('Auth error: ' + error);
                            }
                            scope.user = new Usuario(user);
                            AuthService.authenticate(authResult.accessToken, authResult.idToken, scope.user);
                            $state.go(APP_STATES.AGENDA_INFO.nome);
                        });
                    }

                    /**
                     * Resgata o nome do estado atual e mostra ao usuario.
                     *
                     * @returns {string} O nome mostrado ao usuario.
                     */
                    scope.getCurrentStateName = function () {
                        var currentState = $state.current;
                        if (currentState.name !== APP_STATES.AGENDA_INFO.nome && currentState.name !== APP_STATES.LOGIN.nome) {
                            const nomeState = $state.current.nome || $state.current.name;
                            return scope.getNomeState(nomeState.toUpperCase());
                        }
                        return 'SCORE';
                    };

                    scope.getNomeState = nomeState => _.last(nomeState.split('.')).replace(/[^a-zA-Z]/g, '\ ');

                    /**
                     * Vai para home.
                     */
                    scope.goHome = function () {
                        $state.go(true || scope.auth.isAuthenticated() ? APP_STATES.AGENDA_INFO.nome : APP_STATES.LOGIN.nome);
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
