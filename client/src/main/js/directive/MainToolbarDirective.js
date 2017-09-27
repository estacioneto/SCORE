(function () {
    'use strict';

    angular.module('toolbarModulo', []).directive('mainToolbar', ['$state', '$rootScope', 'AuthService', 'AuthLockService', 'ToastService', 'Usuario', 'APP_STATES', 'SidebarService',
        function ($state, $rootScope, AuthService, AuthLockService, ToastService, Usuario, APP_STATES, SidebarService) {
            return {
                restrict: 'AE',
                templateUrl: './view/mainToolbar.html',
                scope: {},
                link: function (scope, element, attrs) {
                    scope.auth = AuthService;

                    /**
                     * Funcao para alternar a barra de menu lateral
                     */
                    scope.toggleBarraLateral = () => SidebarService.toggle();

                    scope.usuario = AuthService.getUsuarioLogado();

                    /**
                     * Responsavel pela logica de logout relacionada ao controller
                     * (chamadas de estados e servicos).
                     *
                     */
                    scope.sair = function () {
                        scope.auth.logout();
                        $state.go(APP_STATES.LOGIN.nome);
                    };

                    /**
                     * Responsavel, basicamente, por mostrar o Auth0 lock modal
                     */
                    scope.entrar = function () {
                        scope.lock.show();
                        AuthLockService.inicializarVerificacoes();
                    };

                    /**
                     * Contem a logica de autenticacao relacionada ao controller apos o lock.
                     *
                     * @param authResult O resultado retornado pelo lock.
                     */
                    scope.autenticar = function (authResult) {
                        return scope.lock.getProfile(authResult.idToken, function (err, usuario) {
                            if (err) {
                                return console.log(`Erro em autenticação: ${err}`);
                            }
                            scope.usuario = new Usuario(usuario);
                            AuthService.authenticate(authResult.accessToken, authResult.idToken, scope.usuario);
                            $state.go(APP_STATES.AGENDA_INFO.nome);
                        });
                    };

                    /**
                     * Resgata o nome do estado atual e mostra ao usuario.
                     *
                     * @returns {string} O nome mostrado ao usuario.
                     */
                    scope.getNomeDoEstadoAtual = function () {
                        const estadoAtual = $state.current;
                        if (estadoAtual.name !== APP_STATES.AGENDA_INFO.nome && estadoAtual.name !== APP_STATES.LOGIN.nome) {
                            const nomeState = $state.current.nome || $state.current.name;
                            return scope.getNomeState(nomeState.toUpperCase());
                        }
                        return 'SCORE';
                    };

                    scope.getNomeState = nomeState => _.last(nomeState.split('.')).replace(/[^a-zA-Z]/g, '');

                    /**
                     * Redireciona para tela inicial do aplicativo, caso o usuário não esteja logado, redireciona para
                     * a tela de login.
                     */
                    scope.irParaInicio = function () {
                        $state.go(scope.auth.isAuthenticated() ? APP_STATES.AGENDA_INFO.nome : APP_STATES.LOGIN.nome);
                    };

                    /**
                     * Função principal.
                     */
                    scope.init = function () {
                        scope.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, LOCK_CONFIG);
                        scope.lock.on('authenticated', scope.autenticar);
                    };

                    scope.init();
                }
            };
        }]);
})();
