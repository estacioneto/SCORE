(function () {
    "use strict";
    //https://github.com/auth0/auth0-angular

    /**
     * AuthService lida com a lógica de autorização/armazenamento e com questões relacionadas ao auth0 "non view"
     * Também lida com a lógica de usuário(Auth0 profile) porque sua API é fanstástica!
     *
     * @author Estácio Pereira
     */
    angular.module('authModule', []).service('AuthService', ['$http', 'store', '$rootScope', '$q', 'auth', 'Usuario', 'ToastService', 'PERMISSOES', function ($http, store, $rootScope, $q, auth, Usuario, ToastService, PERMISSOES) {
        var self = this;

        /**
         * Autentica o usuário e guarda seu token e user.
         *
         * @param   {String}  accessToken Token de acesso do usuário.
         * @param   {String}  token       O token de identificação do usuário.
         * @param   {Object}  user        O user Auth0.
         * @returns {Promise} Promise retornar user.
         */
        this.authenticate = function (accessToken, token, user) {
            store.set('accessToken', accessToken);
            store.set('idToken', token);
            if (!_.isUndefined(user)) {
                store.set('user', JSON.stringify(user));
                auth.authenticate(user, token);
                return $q.when(user);
            } else {
                return $http.get($rootScope.apiRoot + '/users').then(function (info) {
                    store.set('user', JSON.stringify(info.data));
                    auth.authenticate(info.data, token);
                    return info.data;
                }, function (err) {
                    ToastService.showActionToast({
                        textContent: 'You should login to see your notes!',
                        action: 'OK',
                        hideDelay: 3000
                    });
                });
            }
        };

        /**
         * Verifica se o usuário está autenticado.
         *
         * @returns {Boolean} true se o usuário está autenticado, false caso contrário.
         */
        this.isAuthenticated = function () {
            return auth.isAuthenticated;
        };

        /**
         * Resgata o usuário logado do serviço Auth0
         *
         * @returns {User} O usuário logado.
         */
        this.getUsuarioLogado = function () {
            const usuario = angular.isString(auth.profile) ? JSON.parse(auth.profile) : auth.profile;
            return usuario ? new Usuario(usuario) : null;
        };

        /**
         * Retorna o idToken do usuário logado.
         *
         * @returns {String} token
         */
        this.getIdToken = function () {
            return auth.idToken;
        };

        /**
         * Retorna se o usuário logado tem a permissão especificada. Caso o usuário tenha a
         * permissão de Admin, signifca que o mesmo possui a permissão especificada, pois o
         * Admin pode realizar todas as ações.
         *
         * @param permissao Permissão que será verificada se o usuário logado a possui.
         * @return {boolean} {@code true} caso o usuário tenha a permissão especificada ou
         * seja Admin, {@code false} caso contrário.
         */
        this.userTemPermissao = function (permissao) {
            const permissoesUser = this.getUsuarioLogado().permissoes;

            return (_.includes(permissoesUser, PERMISSOES.ADMIN)
                || _.includes(permissoesUser, permissao));
        };

        /**
         * Remove as propriedades armazenadas do usuário e encerra a sessão.
         */
        this.logout = function () {
            store.remove('idToken');
            store.remove('user');
            auth.signout();
        };
    }]);
})();
